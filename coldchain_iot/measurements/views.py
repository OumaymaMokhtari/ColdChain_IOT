from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail

import requests

from .models import Measurement
from .serializers import MeasurementSerializer, MeasurementReadSerializer
from sensors.models import Sensor
from incidents.models import Incident


def send_telegram_alert(message):
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_CHAT_ID:
        return

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": settings.TELEGRAM_CHAT_ID,
        "text": message
    }
    requests.post(url, data=payload, timeout=5)


class MeasurementCreateAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        api_key = request.headers.get("X-API-KEY")
        if api_key != settings.ESP_API_KEY:
            raise PermissionDenied("Invalid ESP API Key")

        serializer = MeasurementSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        measurement = serializer.save()
        sensor = measurement.sensor
        temp = measurement.temperature

        if temp < 2 or temp > 8:
            incident = Incident.objects.filter(
                sensor=sensor,
                status__in=["ACTIVE", "IN_PROGRESS"]
            ).first()

            if not incident:
                Incident.objects.create(
                    sensor=sensor,
                    temperature=temp,
                    status="ACTIVE",
                    description="Température hors plage 2–8 °C",
                    created_at=timezone.now()
                )

                send_mail(
                    subject="🚨 ALERTE COLD CHAIN – Température critique",
                    message=(
                        f"Un incident de chaîne du froid a été détecté.\n\n"
                        f"Capteur : {sensor.name}\n"
                        f"Localisation : {sensor.location}\n"
                        f"Température détectée : {temp} °C\n"
                        f"Plage autorisée : 2–8 °C\n\n"
                        f"Merci d'intervenir rapidement."
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.EMAIL_HOST_USER],
                    fail_silently=False,
                )

                send_telegram_alert(
                    f"🚨 ALERTE COLD CHAIN\n\n"
                    f"Capteur : {sensor.name}\n"
                    f"Localisation : {sensor.location}\n"
                    f"Température : {temp} °C\n"
                    f"Hors plage 2–8 °C"
                )

        return Response(
            {"message": "Measurement saved"},
            status=status.HTTP_201_CREATED
        )


class MeasurementListAPIView(ListAPIView):
    serializer_class = MeasurementReadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Measurement.objects.all().order_by("-created_at")
