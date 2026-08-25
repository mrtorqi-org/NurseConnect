from django.contrib import admin
from .models import RecruitmentRequirement, Shortlist, ShortlistedCandidate

@admin.register(RecruitmentRequirement)
class RecruitmentRequirementAdmin(admin.ModelAdmin):
    list_display = ['title', 'hospital', 'quantity', 'status', 'created_at']
    list_filter = ['status']

@admin.register(Shortlist)
class ShortlistAdmin(admin.ModelAdmin):
    list_display = ['requirement', 'created_by', 'is_sent', 'created_at']

@admin.register(ShortlistedCandidate)
class ShortlistedCandidateAdmin(admin.ModelAdmin):
    list_display = ['shortlist', 'candidate', 'added_at']
