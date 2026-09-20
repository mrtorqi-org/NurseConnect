from rest_framework import serializers
from .models import CandidateProfile, Qualification, Experience, Specialization, LicenseInfo, VerificationRequest, CandidateDocument
from accounts.validators import validate_indian_phone


class QualificationSerializer(serializers.ModelSerializer):
    degree_display = serializers.CharField(source='get_degree_display', read_only=True)

    class Meta:
        model = Qualification
        fields = ['id', 'degree', 'degree_display', 'institution', 'year_of_completion', 'grade']
        read_only_fields = ['id']


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'hospital_name', 'designation', 'years_of_experience', 'specialization_name', 'start_date', 'end_date']
        read_only_fields = ['id']


class SpecializationSerializer(serializers.ModelSerializer):
    name_display = serializers.CharField(source='get_name_display', read_only=True)

    class Meta:
        model = Specialization
        fields = ['id', 'name', 'name_display']
        read_only_fields = ['id']


class LicenseInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LicenseInfo
        fields = ['id', 'license_number', 'issuing_body', 'expiry_date']
        read_only_fields = ['id']


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

    def validate_document_type(self, value):
        if self.instance:
            if self.instance.document_type != value:
                raise serializers.ValidationError("Cannot change document type after creation.")
        return value


class VerificationRequestSerializer(serializers.ModelSerializer):
    overall_status = serializers.CharField(read_only=True)
    is_fully_verified = serializers.BooleanField(read_only=True)

    class Meta:
        model = VerificationRequest
        fields = [
            'id', 'digilocker_status', 'knmc_status',
            'submitted_at', 'verified_at',
            'digilocker_verified_at', 'knmc_verified_at',
            'overall_status', 'is_fully_verified'
        ]
        read_only_fields = ['id', 'submitted_at', 'verified_at', 'digilocker_verified_at', 'knmc_verified_at']


class CandidateProfileSerializer(serializers.ModelSerializer):
    qualifications = QualificationSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    specializations = SpecializationSerializer(many=True, read_only=True)
    licenses = LicenseInfoSerializer(many=True, read_only=True)
    verification = VerificationRequestSerializer(read_only=True)
    documents = CandidateDocumentSerializer(many=True, read_only=True)
    profile_completeness = serializers.IntegerField(read_only=True)
    full_name = serializers.SerializerMethodField()
    email = serializers.CharField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = CandidateProfile
        fields = [
            'id', 'username', 'email', 'full_name', 'phone', 'address',
            'date_of_birth', 'photo', 'bio', 'availability',
            'qualifications', 'experiences', 'specializations', 'licenses',
            'verification', 'documents', 'profile_completeness',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_full_name(self, obj):
        return obj.user.get_full_name()


class CandidateProfileUpdateSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(required=False, allow_blank=True, validators=[validate_indian_phone])

    class Meta:
        model = CandidateProfile
        fields = ['phone', 'address', 'date_of_birth', 'bio', 'availability']
