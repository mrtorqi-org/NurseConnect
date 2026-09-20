from django.contrib import admin
from .models import CandidateProfile, Qualification, Experience, Specialization, LicenseInfo, VerificationRequest, CandidateDocument

@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'availability', 'created_at']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']

@admin.register(Qualification)
class QualificationAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'degree', 'institution', 'year_of_completion']

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'hospital_name', 'designation', 'years_of_experience']

@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'name']

@admin.register(LicenseInfo)
class LicenseInfoAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'license_number', 'issuing_body']

@admin.register(VerificationRequest)
class VerificationRequestAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'digilocker_status', 'knmc_status', 'submitted_at']

@admin.register(CandidateDocument)
class CandidateDocumentAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'document_type', 'title', 'uploaded_at']
    list_filter = ['document_type', 'uploaded_at']
    search_fields = ['candidate__user__username', 'title']
    readonly_fields = ['candidate', 'document_type', 'uploaded_at']
