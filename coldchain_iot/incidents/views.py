from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Incident, IncidentHistory
from .serializers import IncidentSerializer


class IncidentListAPIView(ListAPIView):
    queryset = Incident.objects.all().order_by("-created_at")
    serializer_class = IncidentSerializer
    permission_classes = [IsAuthenticated]

class IncidentDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        incident = get_object_or_404(Incident, pk=pk)

        if incident.resolved_at:
            duration = int(
                (incident.resolved_at - incident.created_at).total_seconds() / 60
            )
        else:
            duration = int(
                (timezone.now() - incident.created_at).total_seconds() / 60
            )

        data = {
            "id": incident.id,
            "start_date": incident.created_at,
            "end_date": incident.resolved_at,
            "duration": duration,
            "alert_count": incident.attempt_count,
            "max_temperature": incident.temperature,
            "status": incident.status,

            "show_operators": incident.status in ["ACTIVE", "IN_PROGRESS"],

            "comments": [
                {
                    "id": h.id,
                    "operator": h.technician.username if h.technician else "—",
                    "ack": h.action in ["ACCEPTED", "RESOLVED"],
                    "comment": h.comment,
                    "date": h.created_at
                }
                for h in IncidentHistory.objects.filter(
                    incident=incident
                ).order_by("created_at")
            ]
        }

        return Response(data)

class AcceptIncidentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        incident = get_object_or_404(Incident, pk=pk)

        incident.status = "IN_PROGRESS"
        incident.assigned_to = request.user
        incident.save()

        IncidentHistory.objects.create(
            incident=incident,
            technician=request.user,
            action="ACCEPTED",
            comment="Incident accepté par le technicien"
        )

        return Response({"message": "Incident accepté"})


class RefuseIncidentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        incident = get_object_or_404(Incident, pk=pk)

        incident.attempt_count += 1
        incident.save()

        IncidentHistory.objects.create(
            incident=incident,
            technician=request.user,
            action="REFUSED",
            comment=f"Refus tentative {incident.attempt_count}"
        )

        return Response({"message": "Incident refusé"})


class ResolveIncidentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        incident = get_object_or_404(Incident, pk=pk)

        incident.status = "RESOLVED"
        incident.resolved_at = timezone.now()
        incident.save()

        IncidentHistory.objects.create(
            incident=incident,
            technician=request.user,
            action="RESOLVED",
            comment="Incident résolu"
        )

        return Response({"message": "Incident résolu"})


class AddIncidentCommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        incident = get_object_or_404(Incident, pk=pk)
        comment = request.data.get("comment")

        if not comment:
            return Response({"error": "Commentaire requis"}, status=400)

        IncidentHistory.objects.create(
            incident=incident,
            technician=request.user,
            action="COMMENT",
            comment=comment
        )

        return Response({"message": "Commentaire ajouté"})
class ArchiveIncidentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        incident = get_object_or_404(Incident, pk=pk)

        incident.status = "ARCHIVED"
        incident.archived_at = timezone.now()
        incident.save()

        IncidentHistory.objects.create(
            incident=incident,
            technician=request.user,
            action="ARCHIVED",
            comment="Incident archivé"
        )

        return Response({"message": "Incident archivé"})
class IncidentHistoryListAPIView(ListAPIView):
    serializer_class = IncidentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Incident.objects.filter(
            status__in=["RESOLVED", "ARCHIVED"]
        ).order_by("-created_at")
