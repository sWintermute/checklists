from __future__ import unicode_literals

import hashlib
from collections import defaultdict

from django.contrib.admin.utils import reverse_field_path
from django.db.models import signals
from django.utils.module_loading import autodiscover_modules
from django.utils.six import text_type

from .cache import get_cache
from .exceptions import AlreadyRegistered


class CacheRegistry:
    def __init__(self):
        self._registry = {}
        self._related_registry = defaultdict(list)

    def register(self, serializer, model=None, relations_to_track=None):
        """Store the serializer and model on registry to that the cache can be
        cleaned whenever an object is changed or deleted.
        After the serializer is registered we must connect the signals that
        clear the instance cache.
        can be used as a decorator

        relations_to_track will allow you to designate further signals to trigger cache
        clearing. relations_to_track uses the django queryset relation__field method for resolving.
        """
        if relations_to_track is None:
            relations_to_track = []
        if model is None:
            model = serializer.Meta.model

        if model not in self._registry:
            self._registry[model] = []

        if serializer in self._registry[model]:
            raise AlreadyRegistered("Serializer {} is already registered"
                                    .format(model.__name__))

        self._registry[model].append(serializer)
        self.connect_signals(model)

        for relation_str in relations_to_track:
            related_model, lookup = reverse_field_path(model, relation_str)
            self._related_registry[related_model].append(lookup)
            self.connect_related_signals(related_model)

        return serializer

    def connect_signals(self, model):
        signals.post_save.connect(self.clear_instance, sender=model)
        signals.pre_delete.connect(self.clear_instance, sender=model)

    def connect_related_signals(self, related_model):
        signals.post_save.connect(self.clear_related_instance, sender=related_model)
        signals.pre_delete.connect(self.clear_related_instance, sender=related_model)

    def get(self, model):
        return self._registry.get(model, [])

    def get_related(self, model):
        return self._related_registry.get(model, "")

    def get_all_cache_keys(self, instance):
        """Get all possibles cache keys for given instance"""
        keys = []
        serializers = self.get(instance.__class__)
        for serializer in serializers:
            keys.append(self.get_cache_key(instance, serializer))
        return keys

    @staticmethod
    def get_cache_key(instance, serializer):
        """Get cache key of instance"""
        return hashlib.sha256(".".join(text_type(o) for o in (
            instance.id,
            instance.Meta.app_label,
            instance.Meta.object_name,
            serializer.__name__
        )).encode('utf-8')).hexdigest()

    def clear_instance(self, instance, **kwargs):
        """Calls cache cleaner for current instance"""
        keys = self.get_all_cache_keys(instance)
        get_cache().delete_many(keys)

    def clear_related_instance(self, instance, **kwargs):
        """Calls cache cleaner for instance based on relation in registy"""
        relations = cache_registry.get_related(self)
        if cache_registry.get_related(self):
            # Model has been registered as a relation
            objects = self.objects.all().values_list(relations).distinct()
            for obj in objects:
                self.clear_instance(obj)

    def autodiscover(self):
        autodiscover_modules('serializers')


cache_registry = CacheRegistry()
