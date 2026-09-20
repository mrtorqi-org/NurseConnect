from django.db import models
from django.conf import settings


class CandidateProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='candidate_profile')
    phone = models.CharField(max_length=20, blank=True, default='')
    address = models.TextField(blank=True, default='')
    date_of_birth = models.DateField(null=True, blank=True)
    photo = models.ImageField(upload_to='candidate_photos/', blank=True, null=True)
    bio = models.TextField(blank=True, default='')
    availability = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Candidate: {self.user.get_full_name() or self.user.username}"

    @property
    def profile_completeness(self):
        fields = [self.phone, self.address, self.date_of_birth, self.bio]
        qualifications = self.qualifications.count()
        experiences = self.experiences.count()
        specializations = self.specializations.count()
        licenses = self.licenses.count()
        
        filled = sum(1 for f in fields if f)
        total = len(fields) + 4  # 4 bonus for having at least one of each
        
        if qualifications > 0: filled += 1
        if experiences > 0: filled += 1
        if specializations > 0: filled += 1
        if licenses > 0: filled += 1
        
        return min(100, int((filled / total) * 100))


class Qualification(models.Model):
    DEGREE_CHOICES = [
        ('GNM', 'GNM (General Nursing and Midwifery)'),
        ('BSC', 'B.Sc Nursing'),
        ('MSC', 'M.Sc Nursing'),
        ('PHD', 'Ph.D Nursing'),
        ('DIPLOMA', 'Diploma in Nursing'),
        ('POST_BASIC', 'Post Basic B.Sc Nursing'),
        ('OTHER', 'Other'),
    ]

    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='qualifications')
    degree = models.CharField(max_length=20, choices=DEGREE_CHOICES)
    institution = models.CharField(max_length=200)
    year_of_completion = models.PositiveIntegerField()
    grade = models.CharField(max_length=20, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-year_of_completion']

    def __str__(self):
        return f"{self.get_degree_display()} - {self.institution}"

    @property
    def degree_level(self):
        order = {'PHD': 5, 'MSC': 4, 'BSC': 3, 'POST_BASIC': 3, 'DIPLOMA': 2, 'GNM': 1, 'OTHER': 0}
        return order.get(self.degree, 0)


class Experience(models.Model):
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='experiences')
    hospital_name = models.CharField(max_length=200)
    designation = models.CharField(max_length=100)
    years_of_experience = models.PositiveIntegerField()
    specialization_name = models.CharField(max_length=100, blank=True, default='')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-years_of_experience']

    def __str__(self):
        return f"{self.designation} at {self.hospital_name}"


class Specialization(models.Model):
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
    ]

    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='specializations')
    name = models.CharField(max_length=30, choices=SPECIALIZATION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'specializations'
        unique_together = ['candidate', 'name']

    def __str__(self):
        return self.get_name_display()


class LicenseInfo(models.Model):
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='licenses')
    license_number = models.CharField(max_length=50)
    issuing_body = models.CharField(max_length=200, default='Kerala Nurses and Midwives Council')
    expiry_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"License: {self.license_number}"


class CandidateDocument(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ('profile_photo', 'Profile Photo'),
        ('registration_certificate', 'Registration Certificate'),
        ('qualification_certificate', 'Qualification Certificate'),
    ]

    candidate = models.ForeignKey(
        CandidateProfile, on_delete=models.CASCADE, related_name='documents'
    )
    document_type = models.CharField(max_length=30, choices=DOCUMENT_TYPE_CHOICES)
    document = models.FileField(upload_to='candidate_documents/%Y/%m/%d/')
    title = models.CharField(max_length=200, blank=True, default='')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['candidate', 'document_type']
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.candidate} - {self.get_document_type_display()}"


class VerificationRequest(models.Model):
    STATUS_CHOICES = [
        ('not_submitted', 'Not Submitted'),
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]

    candidate = models.OneToOneField(CandidateProfile, on_delete=models.CASCADE, related_name='verification')
    digilocker_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_submitted')
    knmc_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_submitted')
    submitted_at = models.DateTimeField(null=True, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    digilocker_verified_at = models.DateTimeField(null=True, blank=True)
    knmc_verified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name_plural = 'verification requests'

    def __str__(self):
        return f"Verification for {self.candidate}"

    @property
    def is_fully_verified(self):
        return self.digilocker_status == 'verified' and self.knmc_status == 'verified'

    @property
    def overall_status(self):
        if self.is_fully_verified:
            return 'verified'
        if self.digilocker_status == 'rejected' or self.knmc_status == 'rejected':
            return 'rejected'
        if self.digilocker_status == 'pending' or self.knmc_status == 'pending':
            return 'pending'
        return 'not_submitted'
