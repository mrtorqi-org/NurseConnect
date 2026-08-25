from rest_framework import serializers
from .models import HospitalProfile, HospitalVerification
from accounts.validators import validate_indian_phone


class HospitalProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = HospitalProfile
        fields = [
            'id', 'user_username', 'user_email', 'hospital_name',
            'registration_number', 'address', 'city', 'state',
            'phone', 'website', 'description', 'logo',
            'is_verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at', 'updated_at']


class HospitalProfileUpdateSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(required=False, allow_blank=True, validators=[validate_indian_phone])

    class Meta:
        model = HospitalProfile
        fields = [
            'hospital_name', 'registration_number', 'address',
            'city', 'state', 'phone', 'website', 'description'
        ]


class HospitalVerificationSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.hospital_name', read_only=True)

    class Meta:
        model = HospitalVerification
        fields = [
            'id', 'hospital', 'hospital_name', 'credentials_text',
            'submitted_at', 'status', 'reviewed_at', 'reason'
        ]
        read_only_fields = ['id', 'submitted_at', 'status', 'reviewed_at', 'reason']


class HospitalVerificationReviewSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    reason = serializers.CharField(required=False, allow_blank=True, default='')
