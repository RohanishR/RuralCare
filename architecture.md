# RuralCare — System Architecture

> **AI-Assisted Telemedicine Platform for Rural Healthcare Accessibility**

---

## 1. Project Overview

**RuralCare** is a software-based telemedicine platform designed to improve access to healthcare for people living in rural and remote areas.

The platform connects patients with qualified doctors through online consultations. It provides appointment management, video consultations, digital prescriptions, medical records, multilingual communication, and AI-assisted symptom analysis.

The system is designed with a focus on:

- Accessibility
- Simple user experience
- Rural connectivity constraints
- Multilingual communication
- Secure medical information
- Remote doctor-patient consultation
- AI-assisted healthcare workflows

The project does **not require any dedicated hardware**.

---

# 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js |
| Backend | FastAPI |
| Database | MongoDB |
| Authentication | JWT + Google OAuth |
| Video Consultation | WebRTC |
| AI | Python |
| Translation | Translation API / Multilingual Model |
| Frontend Deployment | Vercel |
| Backend Deployment | Cloud backend service |
| UI/UX Design | Figma |

---

# 3. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │       USERS         │
                         │                     │
                         │ Patient / Doctor    │
                         │       / Admin       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Next.js        │
                         │      Frontend       │
                         │                     │
                         │ • Patient UI        │
                         │ • Doctor UI         │
                         │ • Admin UI          │
                         │ • Authentication UI │
                         └──────────┬──────────┘
                                    │
                              HTTPS / REST
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      FastAPI        │
                         │       Backend       │
                         │                     │
                         │ • Authentication    │
                         │ • Users             │
                         │ • Appointments      │
                         │ • Consultations     │
                         │ • Prescriptions     │
                         │ • Medical Records   │
                         └───────┬─────┬───────┘
                                 │     │
                    ┌────────────┘     └──────────────┐
                    ▼                                 ▼
           ┌────────────────┐                ┌────────────────┐
           │    MongoDB     │                │   AI Service   │
           │    Database    │                │    Python      │
           └────────────────┘                └───────┬────────┘
                                                     │
                                                     ▼
                                            ┌──────────────────┐
                                            │ Translation API /│
                                            │ Multilingual AI  │
                                            └──────────────────┘

                     Patient ◄──── WebRTC ────► Doctor
```

---

# 4. User Roles

RuralCare has three primary user roles.

## 4.1 Patient

Patients can:

- Register and login
- Login using Google
- Create and update their profile
- Enter symptoms
- Use AI-assisted symptom collection
- Search for doctors
- Filter doctors
- View doctor profiles
- Book appointments
- Join video consultations
- Chat with doctors
- View prescriptions
- View medical history
- Schedule follow-ups
- Change language preferences

---

## 4.2 Doctor

Doctors can:

- Register and login
- Login using Google
- Create a professional profile
- Submit professional information for verification
- Add specialization
- Add qualifications
- Set availability
- View appointments
- View patient information
- View medical history
- View AI-generated symptom summaries
- Conduct video consultations
- Add consultation notes
- Create prescriptions
- Schedule follow-up appointments

---

## 4.3 Administrator

Administrators can:

- Manage patients
- Manage doctors
- Verify doctors
- Manage user accounts
- View appointments
- Monitor consultations
- View system statistics
- Manage reported issues
- Manage platform settings

---

# 5. Major System Modules

```text
RuralCare
│
├── Authentication
│
├── Patient Management
│
├── Doctor Management
│
├── Appointment Management
│
├── AI Symptom Assistant
│
├── Translation
│
├── Video Consultation
│
├── Medical Records
│
├── Prescription Management
│
├── Notifications
│
└── Administration
```

---

# 6. Frontend Architecture

The frontend is developed using **Next.js**.

```text
Next.js
│
├── Public Pages
│   ├── Landing Page
│   ├── About
│   ├── How It Works
│   └── Contact
│
├── Authentication
│   ├── Login
│   ├── Register
│   └── Google Login
│
├── Patient
│   ├── Dashboard
│   ├── Find Doctor
│   ├── Doctor Profile
│   ├── Appointments
│   ├── Consultations
│   ├── AI Symptoms
│   ├── Medical Records
│   ├── Prescriptions
│   └── Profile
│
├── Doctor
│   ├── Dashboard
│   ├── Appointments
│   ├── Patients
│   ├── Consultations
│   ├── Medical Records
│   ├── Prescriptions
│   ├── Availability
│   └── Profile
│
└── Admin
    ├── Dashboard
    ├── Patients
    ├── Doctors
    ├── Appointments
    └── Reports
```

---

# 7. Backend Architecture

The backend uses **FastAPI**.

FastAPI provides REST APIs consumed by the Next.js frontend.

```text
FastAPI
│
├── Authentication API
│
├── User API
│
├── Patient API
│
├── Doctor API
│
├── Appointment API
│
├── Consultation API
│
├── Prescription API
│
├── Medical Record API
│
├── AI API
│
├── Translation API
│
└── Admin API
```

Example API structure:

```text
/api/auth
/api/users
/api/patients
/api/doctors
/api/appointments
/api/consultations
/api/prescriptions
/api/medical-records
/api/ai
/api/translation
/api/admin
```

---

# 8. Database Architecture

MongoDB is used as the primary database.

Main collections:

```text
MongoDB
│
├── users
├── patients
├── doctors
├── appointments
├── consultations
├── prescriptions
├── medical_records
├── symptom_reports
├── notifications
└── doctor_verifications
```

---

## 8.1 Users

Stores common authentication information.

```text
users
├── _id
├── name
├── email
├── role
├── auth_provider
├── profile_image
├── created_at
└── updated_at
```

Possible roles:

```text
patient
doctor
admin
```

---

## 8.2 Patients

```text
patients
├── _id
├── user_id
├── date_of_birth
├── gender
├── phone
├── location
├── preferred_language
├── blood_group
├── allergies
├── medical_conditions
├── medications
└── emergency_contact
```

---

## 8.3 Doctors

```text
doctors
├── _id
├── user_id
├── specialization
├── qualification
├── registration_number
├── experience
├── languages
├── consultation_fee
├── availability
├── verification_status
└── location
```

---

## 8.4 Appointments

```text
appointments
├── _id
├── patient_id
├── doctor_id
├── appointment_date
├── appointment_time
├── consultation_type
├── status
├── reason
├── created_at
└── updated_at
```

Possible statuses:

```text
pending
confirmed
completed
cancelled
rescheduled
```

---

## 8.5 Consultations

```text
consultations
├── _id
├── appointment_id
├── patient_id
├── doctor_id
├── symptoms
├── ai_summary
├── doctor_notes
├── consultation_start
├── consultation_end
└── created_at
```

---

## 8.6 Prescriptions

```text
prescriptions
├── _id
├── consultation_id
├── patient_id
├── doctor_id
├── medicines
├── instructions
├── follow_up_date
└── created_at
```

---

# 9. Authentication Architecture

RuralCare supports two authentication mechanisms:

1. JWT authentication
2. Google OAuth

```text
                    Login
                      │
            ┌─────────┴─────────┐
            │                   │
            ▼                   ▼
       Email/Password       Google OAuth
            │                   │
            └─────────┬─────────┘
                      ▼
                  FastAPI
                      │
                      ▼
               Authentication
                      │
                      ▼
                  JWT Token
                      │
                      ▼
                 Next.js
                      │
                      ▼
              Protected Pages
```

Role-based access control ensures that users can access only the appropriate parts of the system.

Example:

```text
Patient → Patient Dashboard
Doctor  → Doctor Dashboard
Admin   → Admin Dashboard
```

---

# 10. Patient Workflow

```text
Patient
   │
   ▼
Register / Login
   │
   ▼
Complete Profile
   │
   ▼
Enter Symptoms
   │
   ▼
AI-Assisted Symptom Analysis
   │
   ▼
Search Doctor
   │
   ▼
Select Doctor
   │
   ▼
Select Date & Time
   │
   ▼
Book Appointment
   │
   ▼
Appointment Confirmation
   │
   ▼
Video Consultation
   │
   ▼
Doctor Notes
   │
   ▼
Prescription
   │
   ▼
Medical History Updated
   │
   ▼
Follow-up Appointment
```

---

# 11. Doctor Workflow

```text
Doctor
   │
   ▼
Register / Login
   │
   ▼
Submit Professional Details
   │
   ▼
Admin Verification
   │
   ▼
Doctor Dashboard
   │
   ▼
Set Availability
   │
   ▼
Receive Appointment
   │
   ▼
View Patient Information
   │
   ▼
View AI Symptom Summary
   │
   ▼
Start Video Consultation
   │
   ▼
Add Consultation Notes
   │
   ▼
Create Prescription
   │
   ▼
Schedule Follow-up
```

---

# 12. Appointment Architecture

The appointment process is:

```text
Patient
   │
   ▼
Search Doctor
   │
   ▼
Doctor Availability
   │
   ▼
Select Date & Time
   │
   ▼
FastAPI
   │
   ├── Validate Patient
   ├── Validate Doctor
   ├── Check Availability
   └── Create Appointment
              │
              ▼
           MongoDB
              │
              ▼
        Appointment Confirmed
```

The backend must prevent double-booking of the same doctor/time slot.

---

# 13. AI Architecture

The AI system provides **decision-support functionality**.

It must not be presented as an autonomous medical diagnosis system.

```text
Patient Symptoms
       │
       ▼
Next.js
       │
       ▼
FastAPI
       │
       ▼
Python AI Service
       │
       ├── Symptom Extraction
       │
       ├── Duration Extraction
       │
       ├── Severity Information
       │
       ├── Symptom Summarization
       │
       └── Preliminary Triage
       │
       ▼
Structured Result
       │
       ▼
Doctor Dashboard
```

Example:

```text
Patient Input:

"I have fever for three days,
cough and weakness."

            ↓

AI Processing

            ↓

Symptoms:
• Fever
• Cough
• Weakness

Duration:
• Fever: 3 days

            ↓

Doctor Summary
```

The system can classify urgency into categories such as:

```text
Routine
Moderate
High Priority
```

The result is presented as **AI-assisted information for the doctor**, not a diagnosis.

---

# 14. Translation Architecture

Translation allows patients and doctors to communicate across languages.

```text
Patient
   │
   │ Local Language
   ▼
Translation Service
   │
   │ English
   ▼
Doctor

Doctor
   │
   │ English
   ▼
Translation Service
   │
   │ Local Language
   ▼
Patient
```

Initial language support can include:

- English
- Hindi
- Tamil

The architecture should allow additional languages to be added later.

---

# 15. WebRTC Video Consultation

WebRTC provides real-time communication between the patient and doctor.

```text
                Consultation Room
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
      PATIENT                    DOCTOR
          │                         │
     Camera/Mic                Camera/Mic
          │                         │
          └──────── WebRTC ─────────┘
```

The consultation interface can include:

- Camera
- Microphone
- Camera on/off
- Microphone mute
- Chat
- Screen sharing
- End consultation

The backend manages appointment and consultation information while WebRTC handles real-time media communication.

---

# 16. Consultation Workflow

```text
Appointment Confirmed
        │
        ▼
Patient joins room
        │
        ▼
Doctor joins room
        │
        ▼
WebRTC Connection
        │
        ▼
Video Consultation
        │
        ├──────────────┐
        ▼              ▼
Patient Information   Chat
        │
        ▼
Doctor Consultation Notes
        │
        ▼
Prescription
        │
        ▼
Consultation Completed
```

---

# 17. Medical Records

Medical records provide a historical view of the patient's healthcare interactions.

```text
Patient
   │
   ▼
Medical Records
   │
   ├── Previous Consultations
   ├── Doctor Notes
   ├── Prescriptions
   ├── Symptoms
   └── Follow-ups
```

Doctors should only be able to access medical information permitted by the application's access-control rules.

---

# 18. Prescription Workflow

```text
Doctor
   │
   ▼
Consultation
   │
   ▼
Create Prescription
   │
   ├── Medicine
   ├── Dosage
   ├── Frequency
   ├── Duration
   ├── Instructions
   └── Follow-up
   │
   ▼
Save
   │
   ▼
MongoDB
   │
   ▼
Patient
   │
   ▼
View Prescription
```

---

# 19. Notification System

The system can notify users about:

### Patient

- Appointment confirmation
- Appointment reminder
- Doctor joining consultation
- Prescription availability
- Follow-up reminder

### Doctor

- New appointment
- Appointment cancellation
- Patient joining consultation
- Follow-up request

Notifications can initially be implemented inside the application.

---

# 20. Low-Bandwidth Architecture

RuralCare is designed with rural connectivity limitations in mind.

The frontend should prioritize:

- Lightweight pages
- Compressed images
- Minimal unnecessary animations
- Efficient API requests
- Lazy loading
- Responsive design
- Simple navigation

For consultation:

```text
Good Internet
     │
     ▼
Video + Audio + Chat

Limited Internet
     │
     ▼
Lower Video Quality
     │
     ▼
Audio / Chat Fallback
```

The system should degrade gracefully rather than completely failing when connectivity becomes unstable.

---

# 21. Security Architecture

Healthcare information is sensitive, so security is a major part of the system.

Security measures include:

### Authentication

- JWT
- Google OAuth
- Secure password handling
- Token expiration

### Authorization

Role-based access control:

```text
Patient
   └── Patient resources

Doctor
   └── Assigned patient/consultation resources

Admin
   └── Administrative resources
```

### API Security

- Input validation
- Request authentication
- Authorization checks
- Rate limiting where appropriate
- Secure error handling

### Data Security

- HTTPS
- Secure environment variables
- Database access controls
- Minimal collection of sensitive information
- Appropriate logging without exposing medical data

---

# 22. Privacy

The system should follow privacy-by-design principles.

Important principles:

- Collect only necessary information
- Restrict access to medical records
- Do not expose patient information publicly
- Do not place sensitive information in URLs
- Protect authentication credentials
- Secure API communication
- Provide appropriate privacy and consent notices

AI-generated outputs should also be clearly identified as AI-assisted information.

---

# 23. Deployment Architecture

The frontend can be deployed using **Vercel**.

The FastAPI backend can be deployed separately on a cloud backend platform.

```text
                    INTERNET
                       │
                       ▼
              ┌─────────────────┐
              │     Vercel      │
              │     Next.js     │
              └────────┬────────┘
                       │
                    HTTPS
                       │
                       ▼
              ┌─────────────────┐
              │ FastAPI Backend │
              │ Cloud Hosting   │
              └───────┬─────────┘
                      │
             ┌────────┴────────┐
             ▼                 ▼
       ┌──────────┐       ┌───────────┐
       │ MongoDB  │       │ Python AI │
       │  Atlas   │       │  Service  │
       └──────────┘       └───────────┘
```

---

# 24. Environment Variables

Sensitive configuration must not be hardcoded.

Example:

```text
NEXT_PUBLIC_API_URL=
MONGODB_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AI_API_KEY=
TRANSLATION_API_KEY=
```

These values should be stored using environment-variable configuration.

---

# 25. API Communication

The communication flow is:

```text
Next.js
   │
   │ HTTPS
   ▼
FastAPI
   │
   ├── Authentication
   ├── Validation
   ├── Business Logic
   │
   ▼
MongoDB / AI / External Services
```

Example:

```text
POST /api/appointments
```

Request:

```json
{
  "doctor_id": "doctor123",
  "date": "2026-09-20",
  "time": "10:30"
}
```

FastAPI:

```text
Validate JWT
      ↓
Validate Patient
      ↓
Check Doctor
      ↓
Check Availability
      ↓
Create Appointment
      ↓
MongoDB
```

Response:

```json
{
  "success": true,
  "appointment_id": "APT123"
}
```

---

# 26. Error Handling

The system should provide meaningful errors.

Examples:

```text
Invalid Login
     ↓
"Email or password is incorrect."
```

```text
Doctor unavailable
     ↓
"This appointment slot is no longer available."
```

```text
Network failure
     ↓
"Connection interrupted. Please try again."
```

```text
AI unavailable
     ↓
"AI assistance is temporarily unavailable.
You can continue with your consultation."
```

AI failure should **not prevent the patient from accessing normal healthcare services**.

---

# 27. Scalability

The architecture is designed so individual services can be improved independently.

```text
                    RuralCare
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
    Frontend         Backend          AI
    Next.js          FastAPI         Python
        │              │              │
        ▼              ▼              ▼
     Vercel          Cloud         AI Service
                       │
                       ▼
                    MongoDB
```

Possible future scaling:

- Horizontal backend scaling
- Database indexing
- Caching
- CDN
- Separate AI service
- Message queues
- Dedicated WebRTC infrastructure

---

# 28. UI/UX Architecture

The UI is designed in **Figma** before implementation.

Primary screens:

### Public

- Landing page
- About
- How It Works

### Authentication

- Login
- Patient Registration
- Doctor Registration
- Google Login

### Patient

- Dashboard
- Find Doctor
- Doctor Profile
- Appointment Booking
- Appointments
- AI Symptom Assistant
- Video Consultation
- Medical Records
- Prescriptions
- Profile

### Doctor

- Dashboard
- Appointments
- Patient Details
- Consultation
- Medical Records
- Prescription
- Availability
- Profile

### Admin

- Dashboard
- Patients
- Doctors
- Doctor Verification
- Appointments
- Reports

---

# 29. Overall Data Flow

```text
                       PATIENT
                          │
                          ▼
                    Next.js UI
                          │
                          ▼
                       FastAPI
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
          MongoDB        AI       Translation
             │            │            │
             └────────────┼────────────┘
                          │
                          ▼
                    Doctor Dashboard
                          │
                          ▼
                     WebRTC Call
                          │
                          ▼
                  Consultation Notes
                          │
                          ▼
                     Prescription
                          │
                          ▼
                   Medical Records
```

---

# 30. Development Phases

## Phase 1 — UI/UX

- Figma design
- Landing page
- Authentication screens
- Patient dashboard
- Doctor dashboard
- Admin dashboard
- Doctor search
- Appointment screens
- Consultation UI
- Prescription UI
- Medical records UI
- Responsive mobile UI

---

## Phase 2 — Backend

- FastAPI setup
- Authentication APIs
- User APIs
- Patient APIs
- Doctor APIs
- Appointment APIs
- Consultation APIs
- Prescription APIs
- Medical record APIs

---

## Phase 3 — Database

- MongoDB setup
- Collections
- Indexes
- Data validation
- Database relationships/references

---

## Phase 4 — Authentication

- JWT
- Google OAuth
- Role-based access
- Protected routes

---

## Phase 5 — AI

- Symptom extraction
- Symptom summarization
- Preliminary triage
- Doctor-facing AI summary

---

## Phase 6 — Translation

- Language selection
- Patient-to-doctor translation
- Doctor-to-patient translation

---

## Phase 7 — Video Consultation

- WebRTC implementation
- Consultation rooms
- Audio/video controls
- Chat
- Consultation state management

---

## Phase 8 — Testing & Deployment

- Unit testing
- API testing
- UI testing
- Security testing
- Responsive testing
- Performance testing
- Deployment

---

# 31. Final Architecture Summary

```text
                    ┌──────────────────────┐
                    │       RuralCare      │
                    │ Telemedicine System  │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
      PATIENT                DOCTOR               ADMIN
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
                               ▼
                     ┌──────────────────┐
                     │     Next.js      │
                     │    Frontend      │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │     FastAPI      │
                     │     Backend      │
                     └────┬─────┬───────┘
                          │     │
             ┌────────────┘     └──────────────┐
             ▼                                 ▼
       ┌──────────┐                      ┌────────────┐
       │ MongoDB  │                      │ Python AI  │
       └──────────┘                      └─────┬──────┘
                                               │
                                               ▼
                                      Translation Service

                    Patient ◄── WebRTC ──► Doctor
```

---

## 32. Key Project Features

The completed RuralCare platform will provide:

- ✅ Patient registration and authentication
- ✅ Doctor registration and verification
- ✅ Google authentication
- ✅ Role-based access
- ✅ Patient profiles
- ✅ Doctor profiles
- ✅ Doctor search
- ✅ Appointment booking
- ✅ AI-assisted symptom analysis
- ✅ AI symptom summarization
- ✅ Preliminary triage support
- ✅ Multilingual communication
- ✅ Video consultation
- ✅ Consultation notes
- ✅ Digital prescriptions
- ✅ Medical history
- ✅ Follow-up appointments
- ✅ Notifications
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ Low-bandwidth considerations
- ✅ Secure API architecture

---

## 33. Important Medical Safety Principle

RuralCare is an **assistive telemedicine platform**, not an autonomous diagnostic system.

The AI component should:

- Organize patient-provided information
- Summarize symptoms
- Assist with preliminary triage
- Help doctors understand patient information

The AI should **not independently diagnose diseases or prescribe medication**.

Final diagnosis, treatment, and medical decisions remain with qualified healthcare professionals.