from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Incident
from .alerts import send_email_alert, send_telegram_alert

@receiver(post_save, sender=Incident)
def incident_created(sender, instance, created, **kwargs):
    if created and instance.status == "ACTIVE":
        send_email_alert(instance)
        send_telegram_alert(instance)
