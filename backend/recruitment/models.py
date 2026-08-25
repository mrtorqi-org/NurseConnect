from django.db import models
from django.conf import settings


class RecruitmentRequirement(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shortlisted', 'Shortlisted'),
        ('completed', 'Completed'),
    ]

    QUALIFICATION_CHOICES = [
        ('GNM', 'GNM'),
        ('BSC', 'B.Sc Nursing'),
        ('MSC', 'M.Sc Nursing'),
        ('POST_BASIC', 'Post Basic B.Sc Nursing'),
        ('DIPLOMA', 'Diploma in Nursing'),
        ('ANY', 'Any'),
    ]

    SPECIALIZATION_CHOICES = [
        ('ICU', 'ICU / Critical Care'),
        ('GENERAL', 'General Nursing'),
        ('PEDIATRIC', 'Pediatric Nursing'),
        ('CARDIAC', 'Cardiac Care'),
        ('ONCOLOGY', 'Oncology Nursing'),
        ('EMERGENCY', 'Emergency / Trauma'),
        ('OPERATING_ROOM', 'Operating Room / Surgical'),
        ('COMMUNITY', 'Community Health'),
        ('MENTAL_HEALTH', 'Mental Health / Psychiatric'),
        ('OBSTETRIC', 'Obstetric / Maternity'),
        ('NEONATAL', 'Neonatal Care'),
        ('ORTHOPEDIC', 'Orthopedic Nursing'),
        ('NEPHROLOGY', 'Nephrology / Dialysis'),
        ('OTHER', 'Other'),
        ('ANY', 'Any'),
    ]

    hospital = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='requirements'
    )
    title = models.CharField(max_length=200)
    position_type = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    min_qualification = models.CharField(max_length=20, choices=QUALIFICATION_CHOICES, default='ANY')
    min_experience = models.PositiveIntegerField(default=0, help_text='Minimum years of experience')
    specialization = models.CharField(max_length=30, choices=SPECIALIZATION_CHOICES, default='ANY')
    license_required = models.BooleanField(default=True)
    additional_criteria = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.quantity} nurses)"


class Shortlist(models.Model):
    requirement = models.ForeignKey(RecruitmentRequirement, on_delete=models.CASCADE, related_name='shortlists')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_shortlists'
    )
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    is_sent = models.BooleanField(default=False)

    def __str__(self):
        return f"Shortlist for {self.requirement.title}"


class ShortlistedCandidate(models.Model):
    shortlist = models.ForeignKey(Shortlist, on_delete=models.CASCADE, related_name='candidates')
    candidate = models.ForeignKey(
        'candidates.CandidateProfile', on_delete=models.CASCADE, related_name='shortlistings'
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['shortlist', 'candidate']

    def __str__(self):
        return f"{self.candidate} in {self.shortlist}"
