from django.core.management.base import BaseCommand
from candidates.models import VerificationRequest


class Command(BaseCommand):
    help = "Set all candidate verification requests to pending status"

    def handle(self, *args, **options):
        verifications = VerificationRequest.objects.all()
        count = verifications.count()

        if count == 0:
            self.stdout.write(self.style.WARNING("No verification requests found."))
            return

        updated = 0
        for verification in verifications:
            verification.digilocker_status = "pending"
            verification.knmc_status = "pending"
            verification.submitted_at = None
            verification.verified_at = None
            verification.digilocker_verified_at = None
            verification.knmc_verified_at = None
            verification.save()
            updated += 1

        self.stdout.write(
            self.style.SUCCESS(f"Successfully set {updated}/{count} verification(s) to pending.")
        )
