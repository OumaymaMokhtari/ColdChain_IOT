from django.urls import path
from .views import (
    IncidentListAPIView,
    IncidentDetailAPIView,
    AcceptIncidentAPIView,
    RefuseIncidentAPIView,
    ResolveIncidentAPIView,
    AddIncidentCommentAPIView,
    ArchiveIncidentAPIView,
    IncidentHistoryListAPIView,
)

urlpatterns = [
    # LISTE
    path("", IncidentListAPIView.as_view(), name="incident-list"),
    path("<int:pk>/", IncidentDetailAPIView.as_view(), name="incident-detail"),
    
    # ACTIONS
    path("accept/<int:pk>/", AcceptIncidentAPIView.as_view(), name="incident-accept"),
    path("refuse/<int:pk>/", RefuseIncidentAPIView.as_view(), name="incident-refuse"),
    path("resolve/<int:pk>/", ResolveIncidentAPIView.as_view(), name="incident-resolve"),
    path("comment/<int:pk>/", AddIncidentCommentAPIView.as_view(), name="incident-comment"),
    path("archive/<int:pk>/", ArchiveIncidentAPIView.as_view()),
    path("history/", IncidentHistoryListAPIView.as_view()),



]
