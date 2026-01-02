from django.urls import path
from .views import (
    OperatorListCreateAPIView,
    OperatorDeleteAPIView,
    MeAPIView
)

urlpatterns = [
    path("operators/", OperatorListCreateAPIView.as_view()),
    path("operators/<int:pk>/delete/", OperatorDeleteAPIView.as_view()),
    path("me/", MeAPIView.as_view()),
]
