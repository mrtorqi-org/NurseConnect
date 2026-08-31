# NurseConnect

> A nurse recruitment and shortlisting platform that connects hospitals with qualified nurse candidates through a structured verification, requirement, matching, and shortlisting workflow.

## 📌 Overview

**NurseConnect** is an academic full-stack web application.
The platform is designed to simplify the recruitment process between **hospitals** and **nurse candidates**. Instead of allowing candidates to browse and apply for individual jobs, NurseConnect maintains a verified candidate pool from which suitable candidates can be shortlisted according to the requirements submitted by hospitals.

The platform includes dedicated workflows for candidates, hospitals, administrators, and verifiers.

---

## 🎯 Problem Statement

Traditional recruitment processes can require hospitals to manually search through candidate profiles and evaluate whether applicants meet specific requirements.

NurseConnect aims to provide a structured platform where:

- Nurse candidates maintain their professional profiles.
- Candidate verification information can be recorded.
- Hospitals submit recruitment requirements.
- Administrators review candidate pools and generate suitable shortlists.
- Verifiers handle hospital credential verification.
- Hospitals receive shortlisted candidates matching their requirements.

The goal is to make the recruitment and candidate-shortlisting process more organized and efficient.

---

## 👥 User Roles

### 👩‍⚕️ Nurse Candidate

Candidates can:

- Register on the platform.
- Create and maintain their professional profile.
- Provide qualification information.
- Add work experience.
- Provide nursing license information.
- Submit verification information.
- View their verification status.

### 🏥 Hospital

Hospitals can:

- Register on the platform.
- Provide hospital information and credentials.
- Submit recruitment requirements.
- Specify criteria such as:
  - Required number of nurses
  - Qualification
  - Experience
  - Specialization
- View submitted requirements.
- View shortlisted candidates.

### 🔍 Verifier

The verifier is responsible for:

- Reviewing hospital registration information.
- Verifying hospital credentials.
- Approving or rejecting hospital verification requests.

For this academic prototype, external verification services are represented using dummy/simulated verification workflows.

### 👨‍💼 Administrator

The administrator manages the overall recruitment workflow.

The administrator can:

- Monitor registered users.
- Review hospital requirements.
- View candidate information.
- Match candidates against recruitment requirements.
- Build shortlists.
- Manage shortlist information.

---

## 🔄 Core Workflow

```text
Nurse Candidate
      │
      ▼
Candidate Registration
      │
      ▼
Professional Profile
      │
      ├── Qualification
      ├── Experience
      ├── Specialization
      └── License Information
      │
      ▼
Candidate Verification
      │
      ▼
Verified Candidate Pool
```

```text
Hospital
   │
   ▼
Hospital Registration
   │
   ▼
Hospital Verification
   │
   ▼
Verified Hospital
   │
   ▼
Recruitment Requirement
   │
   ▼
Administrator Reviews Requirement
   │
   ▼
Candidate Matching
   │
   ▼
Shortlist Generated
   │
   ▼
Hospital Views Shortlist
```

---

## ✨ Core Features

### Candidate Management

- Candidate registration
- Candidate authentication
- Candidate profile management
- Qualification management
- Experience management
- Specialization management
- Nursing license information
- Candidate verification workflow

### Hospital Management

- Hospital registration
- Hospital authentication
- Hospital profile management
- Hospital credential verification
- Recruitment requirement creation
- Requirement management
- Shortlist viewing

### Recruitment Management

- Recruitment requirement creation
- Candidate pool management
- Candidate matching
- Shortlist creation
- Shortlist management
- Shortlist viewing by hospitals

### Administration

- Administrative dashboard
- Candidate monitoring
- Hospital monitoring
- Recruitment requirement monitoring
- Candidate matching
- Shortlist management

---

## 🧪 Verification

The conceptual system considers external verification mechanisms such as:

- DigiLocker-based identity verification for candidates
- KNMC license verification for nurse candidates
- Hospital credential verification

Since NurseConnect is an **academic prototype**, these external integrations are represented using **dummy/simulated verification workflows** rather than live third-party integrations.

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Python
- Django
- Django REST Framework

### Database

- PostgreSQL

### Authentication

- Token/JWT-based authentication

### Development Tools

- Visual Studio Code
- Git
- GitHub
- PostgreSQL

---

## 📁 Project Structure

```text
NurseConnect/
│
├── backend/
│   ├── accounts/
│   ├── candidates/
│   ├── hospitals/
│   ├── recruitment/
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── api/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── requirements.txt
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:

- Python 3.12+
- Node.js
- npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/mrtorqi-org/NurseConnect.git
cd NurseConnect
```

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### 3. PostgreSQL Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE nurseconnect_db;
```

Configure the database credentials using environment variables.

> **Do not commit database passwords or other secrets to GitHub.**

Example environment variables:

```env
DB_NAME=nurseconnect_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### 4. Run Django Migrations

```bash
python manage.py migrate
```

### 5. Start the Backend

```bash
python manage.py runserver
```

The Django development server will normally be available at:

```text
http://127.0.0.1:8000/
```

### 6. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173/
```

---

## 🔐 Environment Variables

Sensitive configuration should be stored in a `.env` file.

Example:

```env
DB_NAME=nurseconnect_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

The `.env` file should **never be committed to GitHub**.

---

## 🗄️ Database Migration

The project was initially developed using SQLite during development and was later migrated to PostgreSQL.

The migration process involved:

```text
SQLite
   │
   ▼
Django dumpdata
   │
   ▼
JSON Fixture
   │
   ▼
PostgreSQL
   │
   ▼
Django loaddata
```

The final application uses **PostgreSQL** as its database.

---

## 🚫 Out of Scope

The current version of NurseConnect intentionally does not include:

- Payroll management
- Salary processing
- Interview scheduling
- Online interviews
- Job browsing by candidates
- Candidate self-application to individual jobs
- Real DigiLocker integration
- Real KNMC API integration
- Real hospital credential verification services
- Payment processing

These features may be considered for future versions.

---

## 🔮 Future Enhancements

Potential future improvements include:

- Real DigiLocker integration
- Real KNMC license verification
- Automated hospital credential verification
- Advanced candidate matching algorithms
- Email/SMS notifications
- Advanced recruitment analytics
- Hospital-specific recruitment dashboards
- Candidate recommendation system
- Cloud-based file storage
- Production deployment
- Automated testing and CI/CD

---

## 📊 Project Objectives

The main objectives of NurseConnect are to:

1. Provide a centralized platform for nurse recruitment.
2. Maintain structured candidate profiles.
3. Provide a verification workflow for candidates and hospitals.
4. Allow hospitals to submit specific recruitment requirements.
5. Assist administrators in identifying suitable candidates.
6. Generate candidate shortlists based on hospital requirements.
7. Reduce the manual effort involved in candidate screening.

---

## 🎓 Academic Context

**Project:** NurseConnect  
**Type:** Academic / MCA Project  
**Domain:** Healthcare Recruitment  
**Architecture:** Full-stack web application  
**Frontend:** React + Vite  
**Backend:** Django + Django REST Framework  
**Database:** PostgreSQL

This project was developed as an academic prototype to demonstrate the design and implementation of a role-based healthcare recruitment and candidate-shortlisting platform.

---

## 📄 License

This project was developed for academic purposes.

If you intend to reuse, modify, or distribute the project, please contact the repository owner.

---

## 👨‍💻 Author

**Albin Benny**

MCA Student

GitHub: [https://github.com/mrtorqi-org](https://github.com/mrtorqi-org)
