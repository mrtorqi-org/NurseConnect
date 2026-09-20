from django.utils import timezone
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from candidates.models import CandidateProfile
from .models import RecruitmentRequirement, Shortlist, ShortlistedCandidate
from .serializers import (
    RecruitmentRequirementSerializer, ShortlistSerializer,
    CreateShortlistSerializer, CandidateMatchSerializer
)


class RequirementListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentRequirementSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == "hospital":
            return RecruitmentRequirement.objects.filter(hospital=user)
        elif user.role == "admin":
            return RecruitmentRequirement.objects.all()
        return RecruitmentRequirement.objects.none()

    def perform_create(self, serializer):
        serializer.save(hospital=self.request.user)


class RequirementDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentRequirementSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ("hospital", "admin"):
            return RecruitmentRequirement.objects.all()
        return RecruitmentRequirement.objects.none()


class ApproveRequirementView(APIView):
    """Admin approves a requirement and triggers automated shortlisting."""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != "admin":
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        try:
            requirement = RecruitmentRequirement.objects.get(pk=pk)
        except RecruitmentRequirement.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        if requirement.status not in ('pending', 'processing'):
            return Response({"error": "Requirement cannot be approved in current state"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if shortlist already exists
        existing_shortlist = Shortlist.objects.filter(requirement=requirement).first()
        if existing_shortlist:
            return Response({"error": "Shortlist already exists for this requirement"}, status=status.HTTP_400_BAD_REQUEST)

        # Approve the requirement
        requirement.status = 'approved'
        requirement.save()

        # Trigger automated shortlisting
        auto_shortlist_result = _automated_shortlisting(requirement, request.user)

        return Response({
            "message": "Requirement approved and auto-shortlisting completed",
            "shortlist_id": auto_shortlist_result["shortlist_id"],
            "candidates_shortlisted": auto_shortlist_result["candidates_shortlisted"],
            "requirements_met": auto_shortlist_result["requirements_met"],
        }, status=status.HTTP_200_OK)


def _automated_shortlisting(requirement, created_by):
    """
    Automatically match verified candidates to a requirement and create a shortlist.
    Only candidates with both DigiLocker and KNMC verification are considered.
    """
    # Get all verified candidates (both DigiLocker AND KNMC must be verified)
    candidates = CandidateProfile.objects.filter(
        verification__digilocker_status="verified",
        verification__knmc_status="verified",
    ).select_related("verification").prefetch_related(
        "qualifications", "experiences", "specializations", "licenses"
    )

    # Qualification level mapping
    QUAL_LEVELS = {"PHD": 5, "MSC": 4, "BSC": 3, "POST_BASIC": 3, "DIPLOMA": 2, "GNM": 1, "ANY": 0}

    matching_candidates = []
    requirements_met = {
        "qualification": True,
        "experience": True,
        "specialization": True,
        "license": True,
    }

    for candidate in candidates:
        # Check qualification
        if requirement.min_qualification != "ANY":
            req_level = QUAL_LEVELS.get(requirement.min_qualification, 0)
            best_level = max((q.degree_level for q in candidate.qualifications.all()), default=0)
            if best_level < req_level:
                requirements_met["qualification"] = False
                continue

        # Check experience
        total_exp = sum(e.years_of_experience for e in candidate.experiences.all())
        if total_exp < requirement.min_experience:
            requirements_met["experience"] = False
            continue

        # Check specialization
        if requirement.specialization != "ANY":
            spec_names = list(candidate.specializations.values_list("name", flat=True))
            if requirement.specialization not in spec_names:
                requirements_met["specialization"] = False
                continue

        # Check license
        if requirement.license_required and not candidate.licenses.exists():
            requirements_met["license"] = False
            continue

        matching_candidates.append(candidate)

    # Create a new Shortlist
    shortlist = Shortlist.objects.create(
        requirement=requirement,
        created_by=created_by,
        notes=f"Auto-generated shortlist: {len(matching_candidates)} verified candidates matched",
    )

    # Add all matching verified candidates to the shortlist
    for candidate in matching_candidates:
        ShortlistedCandidate.objects.create(shortlist=shortlist, candidate=candidate)

    # Update requirement status to shortlisted
    requirement.status = "shortlisted"
    requirement.processed_at = timezone.now()
    requirement.save()

    return {
        "shortlist_id": shortlist.id,
        "candidates_shortlisted": len(matching_candidates),
        "requirements_met": requirements_met,
    }


class RequirementMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        if request.user.role != "admin":
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        try:
            requirement = RecruitmentRequirement.objects.get(pk=pk)
        except RecruitmentRequirement.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        candidates = CandidateProfile.objects.filter(
            verification__digilocker_status="verified",
            verification__knmc_status="verified",
        ).select_related("verification").prefetch_related(
            "qualifications", "experiences", "specializations", "licenses"
        )

        QUAL_LEVELS = {"PHD": 5, "MSC": 4, "BSC": 3, "POST_BASIC": 3, "DIPLOMA": 2, "GNM": 1, "ANY": 0}
        matching = []
        for candidate in candidates:
            if requirement.min_qualification != "ANY":
                req_level = QUAL_LEVELS.get(requirement.min_qualification, 0)
                best_level = max((q.degree_level for q in candidate.qualifications.all()), default=0)
                if best_level < req_level:
                    continue
            total_exp = sum(e.years_of_experience for e in candidate.experiences.all())
            if total_exp < requirement.min_experience:
                continue
            if requirement.specialization != "ANY":
                spec_names = list(candidate.specializations.values_list("name", flat=True))
                if requirement.specialization not in spec_names:
                    continue
            if requirement.license_required and not candidate.licenses.exists():
                continue
            matching.append(candidate)

        serializer = CandidateMatchSerializer(matching, many=True, context={"requirement": requirement})
        return Response({
            "requirement": RecruitmentRequirementSerializer(requirement).data,
            "matches": serializer.data,
            "total_matches": len(matching),
            "required": requirement.quantity,
        })


class CreateShortlistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "admin":
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        serializer = CreateShortlistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        requirement_id = serializer.validated_data["requirement_id"]
        candidate_ids = serializer.validated_data["candidate_ids"]
        notes = serializer.validated_data.get("notes", "")

        try:
            requirement = RecruitmentRequirement.objects.get(pk=requirement_id)
        except RecruitmentRequirement.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        shortlist = Shortlist.objects.create(requirement=requirement, created_by=request.user, notes=notes)
        for cid in candidate_ids:
            try:
                candidate = CandidateProfile.objects.get(pk=cid)
                ShortlistedCandidate.objects.create(shortlist=shortlist, candidate=candidate)
            except CandidateProfile.DoesNotExist:
                continue

        requirement.status = "shortlisted"
        requirement.processed_at = timezone.now()
        requirement.save()
        return Response(ShortlistSerializer(shortlist).data, status=status.HTTP_201_CREATED)


class ShortlistDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShortlistSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return Shortlist.objects.all()
        elif user.role == "hospital":
            return Shortlist.objects.filter(requirement__hospital=user)
        return Shortlist.objects.none()


class SendShortlistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != "admin":
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        try:
            shortlist = Shortlist.objects.get(pk=pk)
        except Shortlist.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        shortlist.is_sent = True
        shortlist.sent_at = timezone.now()
        shortlist.save()
        return Response(ShortlistSerializer(shortlist).data)


class HospitalShortlistsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "hospital":
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        shortlists = Shortlist.objects.filter(
            requirement__hospital=request.user, is_sent=True
        ).select_related("requirement")
        return Response(ShortlistSerializer(shortlists, many=True).data)


class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        return Response({
            "total_candidates": User.objects.filter(role="candidate").count(),
            "verified_candidates": CandidateProfile.objects.filter(
                verification__digilocker_status="verified",
                verification__knmc_status="verified"
            ).count(),
            "total_hospitals": User.objects.filter(role="hospital").count(),
            "verified_hospitals": User.objects.filter(hospital_profile__is_verified=True).count(),
            "total_requirements": RecruitmentRequirement.objects.count(),
            "pending_requirements": RecruitmentRequirement.objects.filter(status="pending").count(),
            "processing_requirements": RecruitmentRequirement.objects.filter(status="processing").count(),
            "approved_requirements": RecruitmentRequirement.objects.filter(status="approved").count(),
            "shortlisted_requirements": RecruitmentRequirement.objects.filter(status="shortlisted").count(),
        })
