from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer
import logging

# Set up a logger
logger = logging.getLogger(__name__)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        try:
            # Debug incoming request
            logger.info(f"Login attempt received: {request.data}")
            
            serializer = self.get_serializer(data=request.data)
            
            try:
                serializer.is_valid(raise_exception=True)
            except Exception as e:
                logger.error(f"Serializer validation error: {str(e)}")
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"General error in login: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def signup(request):
    data = request.data
    logger.info(f"Signup attempt received: {data}")
    
    try:
        # Check if email already exists
        if User.objects.filter(email=data['email']).exists():
            logger.warning(f"Email already exists: {data['email']}")
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check if username already exists
        if User.objects.filter(username=data['username']).exists():
            logger.warning(f"Username already exists: {data['username']}")
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Create the user
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        user.save()
        logger.info(f"User registered successfully: {user.username}")
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error in signup: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)