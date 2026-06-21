from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .serializers import RegisterSerializer, CustomUserSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens for immediate login on registration
        refresh = RefreshToken.for_user(user)
        user_serializer = CustomUserSerializer(user)
        
        return Response({
            "user": user_serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class GoogleLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

        # IMPORTANT: Replace with your actual Google Client ID
        GOOGLE_CLIENT_ID = "360005341854-hepue66ejq738m8rj2jt4jn6jvuv7k9u.apps.googleusercontent.com"
        
        try:
            # If GOOGLE_CLIENT_ID is a placeholder, we temporarily skip audience verification for dev.
            # In production, YOU MUST provide the real client ID.
            if GOOGLE_CLIENT_ID == "YOUR_GOOGLE_CLIENT_ID_HERE":
                idinfo = id_token.verify_oauth2_token(token, google_requests.Request())
            else:
                idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
            
            email = idinfo.get('email')
            if not email:
                return Response({"error": "Token payload missing email"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Find or create user
            user, created = User.objects.get_or_create(email=email, defaults={
                'username': email.split('@')[0] + "_" + idinfo.get('sub', '')[:5], # Unique username
                'role': 'customer'
            })
            
            if created:
                # Set an unusable password for OAuth users
                user.set_unusable_password()
                user.save()
            
            refresh = RefreshToken.for_user(user)
            user_serializer = CustomUserSerializer(user)
            
            return Response({
                "user": user_serializer.data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            # Invalid token
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ContactMailView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        from_email = request.data.get('from', '')
        subject = request.data.get('subject', '')
        body = request.data.get('body', '')

        if not from_email or not subject or not body:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Build the final message content
        # We append the sender's email to the body so you know who to reply to!
        full_message = f"Message from: {from_email}\n\n{body}"

        try:
            send_mail(
                subject=f"[Country Side Cafe] {subject}",
                message=full_message,
                from_email=None,  # Uses DEFAULT_FROM_EMAIL or EMAIL_HOST_USER
                recipient_list=['rajankumawat123@gmail.com'],  # Destination email
                fail_silently=False,
            )
            return Response({"message": "Email sent successfully!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
