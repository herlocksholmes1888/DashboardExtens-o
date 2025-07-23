from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet
from .serializers import UserSerializers, MedicineSerializers
from .models import Medicine

# This is the equivalent of saying 
# class CreateUserView extends CreativeAPIView
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers 
    permission_classes = [AllowAny]

# Creating views with ModelViewSet already turn the view into pretty much an usable API
# All you need to do is add it to urls.py
class MedicineManagementView(ModelViewSet):
    serializer_class = MedicineSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Medicine.objects.filter(nurse=self.request.user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(nurse=self.request.user)
        else:
            print(serializer.errors)