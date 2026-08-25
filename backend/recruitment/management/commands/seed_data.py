from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from candidates.models import CandidateProfile, Qualification, Experience, Specialization, LicenseInfo, VerificationRequest
from hospitals.models import HospitalProfile, HospitalVerification
from recruitment.models import RecruitmentRequirement

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with demo data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')
        self._create_admin()
        self._create_verifier()
        hospitals = self._create_hospitals()
        self._create_candidates()
        self._create_requirements(hospitals)
        self.stdout.write(self.style.SUCCESS('Database seeded!'))

    def _create_admin(self):
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(username="admin", email="admin@nurseconnect.com", password="admin123", first_name="Admin", last_name="User", role="admin")
            self.stdout.write("  Admin: admin@nurseconnect.com / admin123")

    def _create_verifier(self):
        if not User.objects.filter(username="verifier").exists():
            User.objects.create_user(username="verifier", email="verifier@nurseconnect.com", password="verifier123", first_name="Priya", last_name="Menon", role="verifier")
            self.stdout.write("  Verifier: verifier@nurseconnect.com / verifier123")

    def _create_candidates(self):
        data = [
            ("anu","anu@example.com","Anu","Thomas","9876543210","Kochi",[("BSC","SN College",2020,"A")],[("City Hospital","Staff Nurse",4,"ICU")],["ICU"],("KNMC-1234","KNMC"),True),
            ("maria","maria@example.com","Maria","Joseph","9876543211","Kottayam",[("BSC","Medical College",2019,"A+")],[("General Hospital","Senior Nurse",5,"ICU")],["ICU","GENERAL"],("KNMC-5678","KNMC"),True),
            ("sarah","sarah@example.com","Sarah","Paul","9876543212","Trivandrum",[("MSC","Amrita Institute",2018,"A")],[("Apollo Hospital","ICU Nurse",6,"ICU")],["ICU","CARDIAC"],("KNMC-9012","KNMC"),True),
            ("raji","raji@example.com","Raji","Nair","9876543213","Calicut",[("BSC","Govt Medical College",2021,"B+")],[("MIMS Hospital","Nurse",3,"Pediatric")],["PEDIATRIC"],("KNMC-3456","KNMC"),True),
            ("deepa","deepa@example.com","Deepa","Kumar","9876543214","Palakkad",[("BSC","MES Medical College",2020,"A")],[("Baby Memorial","Staff Nurse",4,"General")],["GENERAL","OBSTETRIC"],("KNMC-7890","KNMC"),True),
            ("lissy","lissy@example.com","Lissy","Varghese","9876543215","Ernakulam",[("BSC","Lissie College",2022,"A")],[("Lissie Hospital","Nurse",2,"Emergency")],["EMERGENCY"],("KNMC-1111","KNMC"),True),
            ("nimmy","nimmy@example.com","Nimmy","George","9876543216","Thrissur",[("POST_BASIC","Amala Institute",2019,"B+")],[("Amala Cancer","Oncology Nurse",5,"Oncology")],["ONCOLOGY"],("KNMC-2222","KNMC"),True),
            ("athira","athira@example.com","Athira","Pillai","9876543217","Alappuzha",[("BSC","TD Medical College",2021,"A")],[("TD Hospital","Nurse",3,"Obstetric")],["OBSTETRIC","NEONATAL"],("KNMC-3333","KNMC"),True),
            ("abin","abin@example.com","Abin","John","9876543218","Idukki",[("GNM","Govt Nursing School",2023,"B")],[],["GENERAL"],("KNMC-4444","KNMC"),False),
            ("meera","meera@example.com","Meera","Singh","9876543219","Wayanad",[("BSC","Govt Medical College",2020,"A")],[("Govt Hospital","Nurse",4,"General")],["GENERAL"],("KNMC-5555","KNMC"),True),
        ]
        for uname, email, fn, ln, phone, addr, quals, exps, specs, lic, verified in data:
            if User.objects.filter(username=uname).exists(): continue
            user = User.objects.create_user(username=uname, email=email, password="password123", first_name=fn, last_name=ln, role="candidate")
            profile = CandidateProfile.objects.create(user=user, phone=phone, address=addr, bio="Nursing professional")
            VerificationRequest.objects.create(candidate=profile)
            for degree, inst, year, grade in quals:
                Qualification.objects.create(candidate=profile, degree=degree, institution=inst, year_of_completion=year, grade=grade)
            for hosp, desg, yrs, sn in exps:
                Experience.objects.create(candidate=profile, hospital_name=hosp, designation=desg, years_of_experience=yrs, specialization_name=sn)
            for s in specs:
                Specialization.objects.create(candidate=profile, name=s)
            LicenseInfo.objects.create(candidate=profile, license_number=lic[0], issuing_body=lic[1])
            if verified:
                vr = profile.verification
                vr.digilocker_status = "verified"
                vr.knmc_status = "verified"
                vr.submitted_at = timezone.now() - timedelta(days=30)
                vr.verified_at = timezone.now() - timedelta(days=29)
                vr.digilocker_verified_at = timezone.now() - timedelta(days=29)
                vr.knmc_verified_at = timezone.now() - timedelta(days=29)
                vr.save()
            self.stdout.write(f"  Candidate: {uname} / password123")

    def _create_hospitals(self):
        data = [
            ("city_hospital","City Hospital","KL/HOSP/2020/001","MG Road, Kochi","Kochi","Kerala","0484-2345678","Multi-specialty 500 beds",True,"NABH accredited"),
            ("care_hospital","Care Hospital","KL/HOSP/2019/045","Banerji Road, Ernakulam","Ernakulam","Kerala","0484-3456789","Cardiac care 300 beds",True,"NABH accredited cardiac care"),
            ("green_hospital","Green Valley Hospital","KL/HOSP/2021/078","Kazhakoottam, Trivandrum","Trivandrum","Kerala","0471-4567890","Multi-specialty",False,"Registered, NABH pending"),
        ]
        created = []
        for uname, hname, reg, addr, city, state, phone, desc, verified, creds in data:
            if User.objects.filter(username=uname).exists(): continue
            user = User.objects.create_user(username=uname, email=f"{uname}@example.com", password="password123", first_name=uname.split("_")[0].title(), last_name="Hospital", role="hospital")
            profile = HospitalProfile.objects.create(user=user, hospital_name=hname, registration_number=reg, address=addr, city=city, state=state, phone=phone, description=desc, is_verified=verified)
            HospitalVerification.objects.create(hospital=profile, credentials_text=creds, status="approved" if verified else "pending")
            created.append(user)
            self.stdout.write(f"  Hospital: {uname} / password123")
        return created

    def _create_requirements(self, hospitals):
        if RecruitmentRequirement.objects.exists() or len(hospitals) < 2:
            return
        reqs = [
            (hospitals[0],"ICU Nurse Recruitment","Staff Nurse",5,"BSC",2,"ICU",True,"ICU experience preferred"),
            (hospitals[0],"General Ward Nurses","Staff Nurse",3,"GNM",1,"GENERAL",True,""),
            (hospitals[1],"Cardiac Care Nurses","Senior Nurse",4,"BSC",3,"CARDIAC",True,"Cardiac cath lab experience"),
        ]
        for h, title, pos, qty, qual, exp, spec, lic, criteria in reqs:
            RecruitmentRequirement.objects.create(hospital=h, title=title, position_type=pos, quantity=qty, min_qualification=qual, min_experience=exp, specialization=spec, license_required=lic, additional_criteria=criteria)
            self.stdout.write(f"  Requirement: {title}")
