from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.HospitalProfileView.as_view(), name='hospital-profile'),
    path('verification/submit/', views.HospitalVerificationSubmitView.as_view(), name='hospital-verification-submit'),
    path('verification/status/', views.HospitalVerificationStatusView.as_view(), name='hospital-verification-status'),
    path('verifier/pending/', views.PendingHospitalsView.as_view(), name='pending-hospitals'),
    path('verifier/<int:pk>/', views.HospitalVerificationDetailView.as_view(), name='hospital-verification-detail'),
]
