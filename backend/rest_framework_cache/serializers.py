from rest_framework import serializers

from .cache import get_cache
from .registry import CacheRegistry
from .settings import api_settings


class CachedSerializerMixin(serializers.ModelSerializer):
    _cache_timeout = api_settings.DEFAULT_CACHE_TIMEOUT

    def _get_cache_key(self, instance):
        return CacheRegistry.get_cache_key(instance, self.__class__)

    def to_representation(self, instance):
        """
        Checks if the representation of instance is cached and adds to cache
        if is not.
        """
        key = self._get_cache_key(instance)
        cache = get_cache()
        cached = cache.get(key)
        if cached is not None:
            return cached

        result = super(CachedSerializerMixin, self).to_representation(instance)
        cache.set(key, result, self._cache_timeout)
        return result
