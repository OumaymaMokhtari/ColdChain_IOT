from django.db import models
from sensors.models import Sensor
from django.contrib.auth.models import User


class Incident(models.Model):

    STATUS_CHOICES = [
        ("ACTIVE", "Actif"),
        ("IN_PROGRESS", "En cours"),
        ("ESCALATED", "Escaladé"),
        ("RESOLVED", "Résolu"),
        ("ARCHIVED", "Archivé"), 
    ]

    sensor = models.ForeignKey(
        Sensor,
        on_delete=models.CASCADE,
        related_name="incidents"
    )

    temperature = models.FloatField()
    description = models.CharField(max_length=255)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    assigned_technician = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="assigned_incidents"
    )

    attempt_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    archived_at = models.DateTimeField(  
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Incident #{self.id} - {self.sensor.name} - {self.status}"


class IncidentHistory(models.Model):

    ACTION_CHOICES = [
        ("CREATED", "Incident créé"),
        ("NOTIFIED", "Technicien notifié"),
        ("ACCEPTED", "Intervention acceptée"),
        ("REFUSED", "Intervention refusée"),
        ("ESCALATED", "Incident escaladé"),
        ("RESOLVED", "Incident résolu"),
        ("ARCHIVED", "Incident archivé"),  
        ("COMMENT", "Commentaire ajouté"), 
    ]

    incident = models.ForeignKey(
        Incident,
        on_delete=models.CASCADE,
        related_name="history"
    )

    technician = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES
    )

    comment = models.CharField(
        max_length=255,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} - Incident #{self.incident.id}"
