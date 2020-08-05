from rest_framework import serializers


class AddressResultSerializer(serializers.Serializer):
    state = serializers.BooleanField(label="state")

    class Meta:
        fields = (
            'state',
        )


class AddressSerializer(serializers.Serializer):
    address = serializers.CharField(label="address", max_length=250)

    class Meta:
        fields = (
            'address',
        )
