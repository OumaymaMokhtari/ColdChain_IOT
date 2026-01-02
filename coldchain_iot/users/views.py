from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.generics import DestroyAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from .serializers import OperatorSerializer


class OperatorListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        operators = User.objects.filter(is_staff=False, is_superuser=False)
        serializer = OperatorSerializer(operators, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OperatorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Opérateur créé avec succès"},
            status=status.HTTP_201_CREATED
        )


class OperatorDeleteAPIView(DestroyAPIView):
    queryset = User.objects.filter(is_staff=False, is_superuser=False)
    permission_classes = [IsAuthenticated, IsAdminUser]


class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "isAdmin": user.is_superuser
        })
