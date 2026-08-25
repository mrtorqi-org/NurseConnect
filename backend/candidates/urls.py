from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.CandidateProfileView.as_view(), name='candidate-profile'),
    path('qualifications/', views.QualificationListCreateView.as_view(), name='qualification-list'),
    path('qualifications/<int:pk>/', views.QualificationDetailView.as_view(), name='qualification-detail'),
    path('experiences/', views.ExperienceListCreateView.as_view(), name='experience-list'),
    path('experiences/<int:pk>/', views.ExperienceDetailView.as_view(), name='experience-detail'),
    path('specializations/', views.SpecializationListCreateView.as_view(), name='specialization-list'),
    path('specializations/<int:pk>/', views.SpecializationDetailView.as_view(), name='specialization-detail'),
    path('licenses/', views.LicenseListCreateView.as_view(), name='license-list'),
    path('licenses/<int:pk>/', views.LicenseDetailView.as_view(), name='license-detail'),
    path('verification/submit/', views.VerificationSubmitView.as_view(), name='verification-submit'),
    path('verification/digilocker/', views.MockDigiLockerView.as_view(), name='mock-digilocker'),
    path('verification/knmc/', views.MockKNMCView.as_view(), name='mock-knmc'),
    path('verification/status/', views.VerificationStatusView.as_view(), name='verification-status'),
    path('pool/', views.CandidatePoolView.as_view(), name='candidate-pool'),
]
