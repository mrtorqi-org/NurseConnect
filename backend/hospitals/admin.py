from django.contrib import admin
from .models import HospitalProfile, HospitalVerification

@admin.register(HospitalProfile)
class HospitalProfileAdmin(admin.ModelAdmin):
    list_display = ['hospital_name', 'user', 'city', 'is_verified', 'created_at']
    search_fields = ['hospital_name', 'user__username']

@admin.register(HospitalVerification)
class HospitalVerificationAdmin(admin.ModelAdmin):
    list_display = ['hospital', 'status', 'submitted_at', 'reviewed_at']
    list_filter = ['status']
