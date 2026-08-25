import re
from django.core.exceptions import ValidationError


def validate_email(value):
    pattern = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, value):
        raise ValidationError('Enter a valid email address.')


def validate_indian_phone(value):
    if not value:
        return  # optional
    cleaned = re.sub(r'[\s\-]', '', value)
    pattern = r'^(?:\+91)?[6-9]\d{9}$'
    if not re.match(pattern, cleaned):
        raise ValidationError(
            'Enter a valid Indian phone number (10 digits starting with 6-9).'
        )


def validate_password_strength(value):
    if len(value) < 8:
        raise ValidationError('Password must be at least 8 characters long.')
    if not re.search(r'[A-Z]', value):
        raise ValidationError('Password must contain at least one uppercase letter.')
    if not re.search(r'[a-z]', value):
        raise ValidationError('Password must contain at least one lowercase letter.')
    if not re.search(r'[0-9]', value):
        raise ValidationError('Password must contain at least one number.')
    if not re.search(r'[^A-Za-z0-9]', value):
        raise ValidationError('Password must contain at least one special character.')
