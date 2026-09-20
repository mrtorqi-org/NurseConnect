from rest_framework import serializers
from .models import RecruitmentRequirement, Shortlist, ShortlistedCandidate
from candidates.serializers import CandidateProfileSerializer
from candidates.models import CandidateDocument


class CandidateDocumentSerializer(serializers.ModelSerializer):
    document_type_display = serializers.CharField(source='get_document_type_display', read_only=True)
    document_url = serializers.SerializerMethodField()

    class Meta:
        model = CandidateDocument
        fields = ['id', 'document_type', 'document_type_display', 'document', 'document_url', 'title', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

    def get_document_url(self, obj):
        request = self.context.get('request')
        if obj.document and hasattr(obj.document, 'url'):
            url = obj.document.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None


class CandidateProfileSerializerWithDocs(CandidateProfileSerializer):
    """Extended profile serializer that includes documents for shortlist views"""
    documents = CandidateDocumentSerializer(many=True, read_only=True)

    class Meta(CandidateProfileSerializer.Meta):
        fields = CandidateProfileSerializer.Meta.fields + ['documents']


class RecruitmentRequirementSerializer(serializers.ModelSerializer):
    hospital_name = serializers.SerializerMethodField()
    qualification_display = serializers.CharField(source='get_min_qualification_display', read_only=True)
    specialization_display = serializers.CharField(source='get_specialization_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = RecruitmentRequirement
        fields = [
            'id', 'hospital', 'hospital_name', 'title', 'position_type',
            'quantity', 'min_qualification', 'qualification_display',
            'min_experience', 'specialization', 'specialization_display',
            'license_required', 'additional_criteria', 'status',
            'status_display', 'created_at', 'processed_at'
        ]
        read_only_fields = ['id', 'hospital', 'status', 'created_at', 'processed_at']

    def get_hospital_name(self, obj):
        try:
            return obj.hospital.hospital_profile.hospital_name
        except Exception:
            return obj.hospital.username


class ShortlistedCandidateSerializer(serializers.ModelSerializer):
    candidate_detail = CandidateProfileSerializerWithDocs(source='candidate', read_only=True)

    class Meta:
        model = ShortlistedCandidate
        fields = ['id', 'candidate', 'candidate_detail', 'added_at']
        read_only_fields = ['id', 'added_at']


class ShortlistSerializer(serializers.ModelSerializer):
    candidates = ShortlistedCandidateSerializer(many=True, read_only=True)
    requirement_title = serializers.CharField(source='requirement.title', read_only=True)
    requirement_quantity = serializers.IntegerField(source='requirement.quantity', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    candidate_count = serializers.SerializerMethodField()

    class Meta:
        model = Shortlist
        fields = [
            'id', 'requirement', 'requirement_title', 'requirement_quantity',
            'created_by', 'created_by_name', 'notes',
            'created_at', 'sent_at', 'is_sent',
            'candidates', 'candidate_count'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'sent_at', 'is_sent']

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() or obj.created_by.username
        return None

    def get_candidate_count(self, obj):
        return obj.candidates.count()


class CreateShortlistSerializer(serializers.Serializer):
    requirement_id = serializers.IntegerField()
    candidate_ids = serializers.ListField(child=serializers.IntegerField(), min_length=1)
    notes = serializers.CharField(required=False, allow_blank=True, default='')


class CandidateMatchSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    qualifications = serializers.SerializerMethodField()
    total_experience = serializers.SerializerMethodField()
    specializations = serializers.SerializerMethodField()
    is_verified = serializers.SerializerMethodField()
    match_details = serializers.SerializerMethodField()

    class Meta:
        model = __import__('candidates.models', fromlist=['CandidateProfile']).CandidateProfile
        fields = [
            'id', 'full_name', 'qualifications', 'total_experience',
            'specializations', 'is_verified', 'match_details'
        ]

    def get_full_name(self, obj):
        return obj.user.get_full_name()

    def get_qualifications(self, obj):
        return [
            {'degree': q.get_degree_display(), 'institution': q.institution, 'year': q.year_of_completion}
            for q in obj.qualifications.all()
        ]

    def get_total_experience(self, obj):
        return sum(e.years_of_experience for e in obj.experiences.all())

    def get_specializations(self, obj):
        return [s.get_name_display() for s in obj.specializations.all()]

    def get_is_verified(self, obj):
        try:
            return obj.verification.is_fully_verified
        except Exception:
            return False

    def get_match_details(self, obj):
        requirement = self.context.get('requirement')
        if not requirement:
            return {}
        
        details = {}
        
        # Qualification match
        if requirement.min_qualification != 'ANY':
            quals = list(obj.qualifications.all())
            levels = {'PHD': 5, 'MSC': 4, 'BSC': 3, 'POST_BASIC': 3, 'DIPLOMA': 2, 'GNM': 1}
            req_level = levels.get(requirement.min_qualification, 0)
            best_level = max((q.degree_level for q in quals), default=0)
            details['qualification_match'] = best_level >= req_level
        else:
            details['qualification_match'] = True

        # Experience match
        total_exp = sum(e.years_of_experience for e in obj.experiences.all())
        details['experience_match'] = total_exp >= requirement.min_experience
        details['total_experience'] = total_exp

        # Specialization match
        if requirement.specialization != 'ANY':
            specs = list(obj.specializations.values_list('name', flat=True))
            details['specialization_match'] = requirement.specialization in specs
        else:
            details['specialization_match'] = True

        # License match
        if requirement.license_required:
            details['license_match'] = obj.licenses.exists()
        else:
            details['license_match'] = True

        details['all_match'] = all([
            details['qualification_match'],
            details['experience_match'],
            details['specialization_match'],
            details['license_match']
        ])

        return details
