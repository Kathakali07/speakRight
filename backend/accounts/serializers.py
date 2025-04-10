from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import logging

# Set up a logger
logger = logging.getLogger(__name__)

class EmailTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        # Debug incoming data
        logger.info(f"Validating with attrs: {attrs}")
        
        email = attrs.get("email")
        password = attrs.get("password")
        
        # Extra debug
        logger.info(f"Email: {email}, Password length: {len(password) if password else 0}")
        
        if not email or not password:
            logger.error("Email or password missing")
            raise serializers.ValidationError({"detail": "Both email and password are required"})
        
        try:
            user = User.objects.get(email=email)
            logger.info(f"Found user: {user.username}")
        except User.DoesNotExist:
            logger.error(f"No user found with email: {email}")
            raise serializers.ValidationError({"detail": "No user found with this email address"})
        
        # Use Django's built-in authentication
        user = authenticate(username=user.username, password=password)
        if not user:
            logger.error("Authentication failed")
            raise serializers.ValidationError({"detail": "Invalid credentials"})
        
        logger.info(f"User authenticated successfully: {user.username}")
        
        # Get the token
        refresh = RefreshToken.for_user(user)
        
        # Return all required data
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username
        }
        
        logger.info("Token generated successfully")
        return data