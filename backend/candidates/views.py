from django.utils import timezone
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import CandidateProfile, Qualification, Experience, Specialization, LicenseInfo, VerificationRequest, CandidateDocument
from .serializers import (
    CandidateProfileSerializer, CandidateProfileUpdateSerializer,
    QualificationSerializer, ExperienceSerializer, SpecializationSerializer,
    LicenseInfoSerializer, VerificationRequestSerializer,
    CandidateDocumentSerializer
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


# Document upload views
class DocumentUploadView(APIView):
    """Upload a document for the candidate's profile"""
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        document_type = request.data.get('document_type')
        if document_type not in dict(CandidateDocument.DOCUMENT_TYPE_CHOICES):
            return Response(
                {'error': 'Invalid document type'},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile = get_candidate_profile(request.user)
        if not profile:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if a document of this type already exists
        existing, created = CandidateDocument.objects.get_or_create(
            candidate=profile,
            document_type=document_type,
            defaults={
                'document': request.data.get('document'),
                'title': request.data.get('title', '')
            }
        )

        if not created:
            # Update existing document
            if request.data.get('document'):
                existing.document = request.data.get('document')
                if request.data.get('title'):
                    existing.title = request.data.get('title')
                existing.save()
            return Response(
                CandidateDocumentSerializer(existing, context={'request': request}).data,
                status=status.HTTP_200_OK
            )

        return Response(
            CandidateDocumentSerializer(existing, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class DocumentListView(APIView):
    """List all documents for the requesting candidate"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_candidate_profile(request.user)
        if not profile:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        documents = CandidateDocument.objects.filter(candidate=profile)
        return Response(
            CandidateDocumentSerializer(documents, many=True, context={'request': request}).data
        )


class DocumentDownloadView(APIView):
    """Download/view a document with permission checks"""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        from recruitment.models import ShortlistedCandidate
        
        document = get_object_or_404(CandidateDocument, pk=pk)
        candidate = document.candidate

        # Candidates can view their own documents
        if request.user == candidate.user:
            pass
        # Admins can view all documents
        elif request.user.role == 'admin':
            pass
        # Hospitals can view only if the candidate is in their shortlist
        elif request.user.role == 'hospital':
            is_in_shortlist = ShortlistedCandidate.objects.filter(
                candidate=candidate,
                shortlist__requirement__hospital=request.user,
                shortlist__is_sent=True
            ).exists()
            if not is_in_shortlist:
                return Response(
                    {'error': 'You can only view documents of candidates in your shortlists'},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            return Response(
                {'error': 'Unauthorized'},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(CandidateDocumentSerializer(document, context={'request': request}).data)


class CandidateDocumentsForShortlistView(APIView):
    """Get all documents for a candidate - for hospitals viewing shortlisted candidates"""
    permission_classes = [IsAuthenticated]

    def get(self, request, candidate_id):
        from recruitment.models import ShortlistedCandidate
        
        if request.user.role not in ('hospital', 'admin'):
            return Response(
                {'error': 'Unauthorized'},
                status=status.HTTP_403_FORBIDDEN
            )

        candidate = get_object_or_404(CandidateProfile, pk=candidate_id)

        # Hospitals need to check shortlist access
        if request.user.role == 'hospital':
            is_in_shortlist = ShortlistedCandidate.objects.filter(
                candidate=candidate,
                shortlist__requirement__hospital=request.user,
                shortlist__is_sent=True
            ).exists()
            if not is_in_shortlist:
                return Response(
                    {'error': 'You can only view documents of candidates in your shortlists'},
                    status=status.HTTP_403_FORBIDDEN
                )

        documents = CandidateDocument.objects.filter(candidate=candidate)
        return Response(
            CandidateDocumentSerializer(documents, many=True, context={'request': request}).data
        )
