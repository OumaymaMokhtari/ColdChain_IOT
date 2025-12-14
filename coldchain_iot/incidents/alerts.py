import os
import requests
from django.core.mail import send_mail
from django.conf import settings

def send_email_alert(incident):
    subject = "ALERTE TEMPÉRATURE - Cold Chain"
    message = f"""
Un incident a été détecté !

Capteur : {incident.sensor.name}
Température : {incident.temperature} °C
Statut : {incident.status}

Veuillez intervenir rapidement.
"""
    send_mail(
        subject,
        message,
        os.getenv("EMAIL_HOST_USER"),
        ["technicien@email.com"],  # plus tard → techniciens dynamiques
        fail_silently=False
    )



def send_telegram_alert(message: str):
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"

    payload = {
        "chat_id": settings.TELEGRAM_CHAT_ID,
        "text": message
    }

    response = requests.post(url, json=payload)
    return response.status_code
