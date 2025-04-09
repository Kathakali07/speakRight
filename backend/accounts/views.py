from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def signup_api(request):
    data = request.data
    try:
        if User.objects.filter(username=data['username']).exists():
            return Response({'message': 'Username already exists'}, status=400)

        hashed_password = make_password(data['password'])

        User.objects.create(
            username=data['username'],
            email=data['email'],
            password=hashed_password
        )

        return Response({'message': 'User registered successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def signin_api(request):
    data = request.data
    try:
        user = User.objects.filter(username=data['username']).first()
        if user and check_password(data['password'], user.password):
            return Response({'message': 'Login successful'})
        else:
            return Response({'message': 'Invalid credentials'}, status=401)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
