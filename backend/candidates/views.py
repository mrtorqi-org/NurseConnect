from django.utils import timezone
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CandidateProfile, Qualification, Experience, Specialization, LicenseInfo, VerificationRequest
from .serializers import (
    CandidateProfileSerializer, CandidateProfileUpdateSerializer,
    QualificationSerializer, ExperienceSerializer, SpecializationSerializer,
    LicenseInfoSerializer, VerificationRequestSerializer
)


def get_candidate_profile(user):
    try:
        return user.candidate_profile
    except CandidateProfile.DoesNotExist:
        return None


class CandidateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_candidate_profile(request.user)
        if not profile:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(CandidateProfileSerializer(profile).data)

    def put(self, request):
        profile = get_candidate_profile(request.user)
        if not profile:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CandidateProfileUpdateSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(CandidateProfileSerializer(profile).data)


# Qualification CRUD
class QualificationListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QualificationSerializer

    def get_queryset(self):
        return Qualification.objects.filter(candidate__user=self.request.user)

    def perform_create(self, serializer):
        profile = get_candidate_profile(self.request.user)
        serializer.save(candidate=profile)


class QualificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QualificationSerializer

    def get_queryset(self):
        return Qualification.objects.filter(candidate__user=self.request.user)


# Experience CRUD
class ExperienceListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ExperienceSerializer

    def get_queryset(self):
        return Experience.objects.filter(candidate__user=self.request.user)

    def perform_create(self, serializer):
        profile = get_candidate_profile(self.request.user)
        serializer.save(candidate=profile)


class ExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ExperienceSerializer

    def get_queryset(self):
        return Experience.objects.filter(candidate__user=self.request.user)


# Specialization CRUD
class SpecializationListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SpecializationSerializer

    def get_queryset(self):
        return Specialization.objects.filter(candidate__user=self.request.user)

    def perform_create(self, serializer):
        profile = get_candidate_profile(self.request.user)
        serializer.save(candidate=profile)


class SpecializationDetailView(generics.RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SpecializationSerializer

    def get_queryset(self):
        return Specialization.objects.filter(candidate__user=self.request.user)


# License CRUD
class LicenseListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LicenseInfoSerializer

    def get_queryset(self):
        return LicenseInfo.objects.filter(candidate__user=self.request.user)

    def perform_create(self, serializer):
        profile = get_candidate_profile(self.request.user)
        serializer.save(candidate=profile)


class LicenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LicenseInfoSerializer

    def get_queryset(self):
        return LicenseInfo.objects.filter(candidate__user=self.request.user)


# Verification
class VerificationSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = get_candidate_profile(request.user)
        if not profile:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        verification, _ = VerificationRequest.objects.get_or_create(candidate=profile)
        
        if verification.digilocker_status == 'not_submitted':
            verification.digilocker_status = 'pending'
        if verification.knmc_status == 'not_submitted':
            verification.knmc_status = 'pending'
        
        if verification.submitted_at is None:
            verification.submitted_at = timezone.now()
        
        verification.save()
        return Response(VerificationRequestSerializer(verification).data)


class MockDigiLockerView(APIView):
    """Mock DigiLocker verification - instantly verifies for prototype"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = get_candidate_profile(request.user)
        if not profile:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        verification, _ = VerificationRequest.objects.get_or_create(candidate=profile)
        verification.digilocker_status = 'verified'
        verification.digilocker_verified_at = timezone.now()
        
        if verification.knmc_status == 'verified':
            verification.verified_at = timezone.now()
        
        verification.save()
        return Response(VerificationRequestSerializer(verification).data)


class MockKNMCView(APIView):
    """Mock KNMC verification - instantly verifies for prototype"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = get_candidate_profile(request.user)
        if not profile:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        verification, _ = VerificationRequest.objects.get_or_create(candidate=profile)
        verification.knmc_status = 'verified'
        verification.knmc_verified_at = timezone.now()
        
        if verification.digilocker_status == 'verified':
            verification.verified_at = timezone.now()
        
        verification.save()
        return Response(VerificationRequestSerializer(verification).data)


class VerificationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_candidate_profile(request.user)
        if not profile:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        verification, _ = VerificationRequest.objects.get_or_create(candidate=profile)
        return Response(VerificationRequestSerializer(verification).data)


# Candidate pool view (for admin matching)
class CandidatePoolView(APIView):
    """List all verified candidates - for admin matching"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        candidates = CandidateProfile.objects.filter(
            verification__digilocker_status='verified',
            verification__knmc_status='verified'
        )
        return Response(CandidateProfileSerializer(candidates, many=True).data)
