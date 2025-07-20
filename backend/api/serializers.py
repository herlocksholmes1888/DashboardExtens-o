from django.contrib.auth.models import User
from rest_framework import serializers

# This is the equivalent of saying 
# class UserSerializers extends ModelSerializer
class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        # This line prevents the password from being shown as an API response
        extra_kwargs = {'password': { 'write-only': True }}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    