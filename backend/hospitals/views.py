from django.utils import timezone
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import HospitalProfile, HospitalVerification
from .serializers import (
    HospitalProfileSerializer, HospitalProfileUpdateSerializer,
    HospitalVerificationSerializer, HospitalVerificationReviewSerializer
)


def get_hospital_profile(user):
    try:
        return user.hospital_profile
    except HospitalProfile.DoesNotExist:
        return None


class HospitalProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_hospital_profile(request.user)
        if not profile:
            return Response({'error': 'Hospital profile not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(HospitalProfileSerializer(profile).data)

    def put(self, request):
        profile = get_hospital_profile(request.user)
        if not profile:
            return Response({'error': 'Hospital profile not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = HospitalProfileUpdateSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(HospitalProfileSerializer(profile).data)


class HospitalVerificationSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = get_hospital_profile(request.user)
        if not profile:
            return Response({'error': 'Hospital profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        verification, _ = HospitalVerification.objects.get_or_create(hospital=profile)
        
        if verification.status != 'pending':
            return Response(
                {'error': f'Verification already {verification.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        credentials = request.data.get('credentials_text', '')
        if not credentials:
            return Response(
                {'error': 'Credentials text is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        verification.credentials_text = credentials
        verification.save()
        
        return Response(HospitalVerificationSerializer(verification).data)


class HospitalVerificationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_hospital_profile(request.user)
        if not profile:
            return Response({'error': 'Hospital profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        verification, _ = HospitalVerification.objects.get_or_create(hospital=profile)
        return Response(HospitalVerificationSerializer(verification).data)


# Verifier views
class PendingHospitalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'verifier':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        pending = HospitalVerification.objects.filter(status='pending').select_related('hospital')
        return Response(HospitalVerificationSerializer(pending, many=True).data)


class HospitalVerificationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        if request.user.role != 'verifier':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            verification = HospitalVerification.objects.select_related('hospital').get(pk=pk)
        except HospitalVerification.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(HospitalVerificationSerializer(verification).data)

    def put(self, request, pk):
        if request.user.role != 'verifier':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            verification = HospitalVerification.objects.get(pk=pk)
        except HospitalVerification.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = HospitalVerificationReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        action = serializer.validated_data['action']
        reason = serializer.validated_data.get('reason', '')
        
        verification.status = 'approved' if action == 'approve' else 'rejected'
        verification.reviewed_by = request.user
        verification.reviewed_at = timezone.now()
        verification.reason = reason
        verification.save()
        
        # Update hospital verification status
        hospital = verification.hospital
        hospital.is_verified = (action == 'approve')
        hospital.save()
        
        return Response(HospitalVerificationSerializer(verification).data)
