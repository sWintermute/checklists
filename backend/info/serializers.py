from rest_framework import serializers


class AddressResultSerializer(serializers.Serializer):
    states = serializers.ListField(label="states",
                                   allow_empty=True,
                                   child=serializers.CharField(max_length=400))
    # state = serializers.BooleanField(label="state")

    class Meta:
        fields = (
            'states',
        )


class AddressSerializer(serializers.Serializer):
    address = serializers.CharField(label="address", max_length=250)

    class Meta:
        fields = (
            'address',
        )
