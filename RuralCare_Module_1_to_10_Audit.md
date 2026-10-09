# RuralCare Modules 1–10 Audit

Audit date: 8 October 2026  
Scope: Modules 1–10 only. No implementation changes were made as part of this audit.

## Executive summary

**Overall completion: 47%**

| Module | Completion | Status |
|---|---:|---|
| 1. Project Foundation | 65% | ⚠️ Partially complete |
| 2. Authentication | 70% | ⚠️ Partially complete |
| 3. Patient Management | 55% | ⚠️ Partially complete |
| 4. Doctor Management | 50% | ⚠️ Partially complete |
| 5. Appointment Management | 45% | 🐛 Broken |
| 6. AI Symptom Assistant | 50% | ⚠️ Partially complete |
| 7. Translation | 60% | ⚠️ Partially complete |
| 8. Video Consultation | 25% | 🐛 Broken |
| 9. Medical Records | 25% | 🐛 Broken |
| 10. Prescriptions | 25% | 🐛 Broken |

The repository contains substantial UI and API work, but it is not currently releasable. The frontend production build fails, there are two incompatible authenticated-user implementations, and record/prescription ownership queries use incompatible user and profile identifiers.

## Verification performed

- Inspected `src/app`, `src/components`, `src/contexts`, `src/lib`, `backend/api`, `backend/models`, `backend/schemas`, `backend/services`, and `backend/core`.
- Started FastAPI on `127.0.0.1:8001`. `/health` and `/openapi.json` returned **200** and MongoDB connected successfully.
- Read-only MongoDB inspection found `users` (7), `patients` (2), `doctors` (2), and `appointments` (1). `medical_records` and `prescriptions` collections do not yet exist. No duplicate user-email groups were found.
- Verified safe error paths: invalid login **400**, invalid Google credential **400**, unauthenticated patient profile request **401**, and unknown doctor **404**.
- Confirmed an unauthenticated WebSocket connection successfully joined `/ws/audit-unauthenticated-room`.
- Ran `npm run lint` successfully. `npm run build` failed (details below). The supplied backend test module fails during import.
- Did **not** create users, appointments, records, prescriptions, or other data in the connected database. Consequently, authenticated 200/403 flows and two-browser media exchange remain unverified.

## Critical issues

1. **Frontend production build is broken.** `src/app/doctor/appointments/page.tsx` imports `getAppointments` from `src/lib/patient-portal.ts`, but that module does not export it. This prevents deployment of the entire Next.js frontend.
2. **Unauthenticated users can join any WebRTC signaling room.** `backend/api/api_v1/endpoints/consultation.py` accepts every WebSocket before validating a JWT, appointment, participant identity, or room membership. The live audit connected without credentials.
3. **Medical records and prescriptions use incompatible identities.** Their endpoints use `backend.core.security.get_current_user`, which returns JWT claims (`sub` = user ID), while records/prescriptions are created with a caller-provided `patient_id` expected to be a patient profile ID. Patient list queries therefore look for user IDs in fields holding patient-profile IDs. Creation also does not verify that the doctor is associated with the appointment/patient.
4. **The application has two incompatible `get_current_user` implementations.** `backend/api/deps.py` loads a `UserResponse` from MongoDB; `backend/core/security.py` returns only JWT claims. Different APIs therefore receive different shapes and authorisation semantics.
5. **AI output presents possible medical conditions.** `backend/services/ai_service.py` returns labels such as “Viral respiratory infection” and “Migraine.” This conflicts with the platform rule that AI must be assistive rather than an autonomous diagnostic system.

## Module findings

### Module 1 — Project Foundation (65%)

| Item | Existing implementation | Status | Problems / recommended fix |
|---|---|---|---|
| FastAPI / MongoDB | Lifespan connects, pings MongoDB, and ensures user/patient/doctor/appointment indexes. Runtime startup succeeded. | ✅ | Make connection failure behaviour explicit: Atlas failures fall back to local MongoDB, which can silently use a different data store. |
| Environment configuration | `BaseSettings` reads `backend/.env`; frontend uses `.env.local`. Example backend environment file exists. | ⚠️ | `SECRET_KEY` has an unsafe development default. Require a strong secret outside development and validate settings at startup. |
| Router structure | REST routes are aggregated in `backend/api/api_v1/api.py`; WebSocket route is mounted separately. | ⚠️ | Duplicate/obsolete endpoint files remain (`ai.py`, `consultations.py`, `health.py`, `users.py`); API prefix configuration is duplicated/hardcoded. |
| CORS | CORS is limited to `FRONTEND_URL`, credentials enabled. | ✅ | Support a validated comma-separated production-origin list rather than only one origin. |
| Next.js / routing | App Router routes and shared components exist. | 🐛 | `npm run build` fails due to the doctor appointments import error. Next 16 also warns that `middleware.ts` is deprecated in favour of `proxy.ts`. |
| API client | Shared client attaches a cookie token and models doctor/appointment calls. | ⚠️ | Duplicate/stale `src/lib/patient-portal.ts` calls endpoints and fields that do not exist in the backend. Remove or align it. |

### Module 2 — Authentication (70%)

| Feature | Existing implementation | Status | Problems / recommended fix |
|---|---|---|---|
| Patient and doctor registration | Public registration accepts only `patient` and `doctor`; UI includes both roles. | ⚠️ | Password policy is not enforced in Pydantic schemas; registration does not create role profiles or require doctor-verification data. |
| Email/password login and JWT | OAuth form login verifies local password and returns signed JWT with role. Invalid-credentials response verified as **400**. | ✅ | JWT is kept in readable JavaScript cookie rather than `HttpOnly`/`Secure`/`SameSite` server cookie, making XSS token theft possible. |
| Google authentication | Frontend Google provider and backend ID-token verification exist; invalid credential gives **400**. | ⚠️ | Google credentials were not configured/tested. Email ownership/provider-linking rules are not enforced; a local account matching a Google email can be signed in via Google without verifying provider association. |
| Route authorization | `src/middleware.ts` performs client-readable JWT role redirects. | ⚠️ | It trusts an unsigned decoded token for routing, uses deprecated convention, and cannot replace API authorization. It does not cover `/find-doctor`, `/consultation/*`, or `/translation`. |
| Logout | Context removes token, clears state, redirects. | ✅ | Backend logout is a no-op; no token revocation/rotation is available. |

### Module 3 — Patient Management (55%)

| Feature | Existing implementation | Status | Problems / recommended fix |
|---|---|---|---|
| Profile create/view/update | `GET/PUT /patients/me` exists, role-checks patients, and auto-creates a minimal profile. Frontend profile form exists. | ⚠️ | `date_of_birth` is a free-form string; phone, gender, and language are weakly validated. Mutable list defaults should use `default_factory`. |
| Patient dashboard | Dashboard loads confirmed appointments and shows profile/prescription/record links. | ⚠️ | It does not load patient profile, medical history, or prescription counts/data. “AI Generated Summary” is generated entirely client-side rather than through Module 6. |
| Medical-record navigation | A populated page exists at `/patient/medical-records`. | 🐛 | Dashboard and patient layout link to `/patient/records`, which is a stale/empty duplicate page. |

### Module 4 — Doctor Management (50%)

| Feature | Existing implementation | Status | Problems / recommended fix |
|---|---|---|---|
| Doctor profile | List, individual, `GET /me`, and `PUT /me` endpoints exist. UI profile and dashboard call them. | ⚠️ | `GET /doctors/me` auto-creates defaults; `PUT /doctors/me` incorrectly requires the full `DoctorCreate` payload rather than `DoctorUpdate`. UI attempts `POST /doctors/me`, but no such endpoint exists. |
| Availability / search data | Profile stores boolean `is_available`, location, specialisation, qualifications, languages, and fee. | ⚠️ | No date/time availability schedule, verification status, approval process, or approved-only doctor filtering. Find-doctor UI marks every result “Verified.” |
| Doctor dashboard | Loads profile and doctor appointments with loading/error UI. | ⚠️ | Appointments contain only IDs/reason/date; no authorized patient summary or patient information is hydrated. |
| Tests | `backend/tests/test_doctors.py` exists. | 🐛 | Test module cannot import `DoctorProfileCreate`; it targets an older schema/endpoint API and currently runs zero tests. |

### Module 5 — Appointment Management (45%)

| Feature | Existing implementation | Status | Problems / recommended fix |
|---|---|---|---|
| Patient booking | Doctor search filters live data and submits `POST /appointments/`. | ⚠️ | Backend accepts any future/past datetime, has no slot/availability schedule validation, conflict prevention, timezone policy, or doctor approval restriction. |
| Patient/doctor lists | `/appointments/patient` and `/appointments/doctor` are role limited. | ✅ | Frontend doctor appointment page is the build-breaking stale integration. |
| Status changes | Generic `PATCH /appointments/{id}` exists; dashboard can use it. | 🐛 | Both patient and doctor can set *any* status and alter date/reason. Patients can confirm/complete their own appointments; doctors can modify reason/date. Enforce a transition matrix by role. |
| Access control | Endpoint verifies the caller owns the patient/doctor profile matching the appointment. | ⚠️ | It is not an explicit role transition model and does not check doctor approval/availability at update time. |
| Database records | Appointment model/indexes exist and one record is present. | ⚠️ | No unique/conflict index for doctor time slots, and no transaction/duplicate booking protection. |

### Module 6 — AI Symptom Assistant (50%)

| Feature | Existing implementation | Status | Problems / recommended fix |
|---|---|---|---|
| Input and submission UI | `/patient/symptom-assistant` accepts 3–2000 characters and has loading/error/result states. | ✅ | Dashboard’s symptom modal does not navigate/use this endpoint. |
| `/api/v1/symptoms/analyze` | Protected endpoint and Pydantic request/response exist. | ⚠️ | Uses JWT-claims auth, not the shared DB-backed dependency. The symptom language is merely echoed; it does not change analysis. |
| Clinical safety | Emergency warning signs and disclaimer exist. | 🐛 | `possible_conditions` makes diagnostic suggestions. Rename to non-diagnostic “possible discussion points,” expand crisis handling, and require clinician review before any record sharing. |
| Persistence / sharing | None. | ❌ | Analysis is not saved, linked to an appointment, or shared with a doctor under explicit consent. |

### Module 7 — Translation (60%)

| Feature | Existing implementation | Status | Problems / recommended fix |
|---|---|---|---|
| API / service | `/translation/translate` validates `en`, `hi`, `ta`; service loads `TRANSLATION_API_KEY`, has timeout/error handling, and same-language shortcut. | ⚠️ | Live English→Hindi/Tamil could not be exercised without using a configured third-party credential. It uses synchronous `requests` inside an async endpoint, blocking the event loop. |
| Translation UI | Language picker, input, result, loading, and error states exist. | ✅ | It is not integrated into consultations, symptom capture, or patient/doctor messaging. API URL fallback differs (`127.0.0.1` here versus `localhost` elsewhere). |
| Security | JWT required. | ⚠️ | Uses the claims-only dependency; no rate limiting or sensitive-data handling policy is implemented. |

### Module 8 — Video Consultation (25%)

| Feature | Existing implementation | Status | Problems / recommended fix |
|---|---|---|---|
| Browser media / WebRTC | Consultation page requests camera/mic, manages RTCPeerConnection, offer/answer/ICE, mute/camera/end controls. | ⚠️ | Camera/microphone and peer media were not tested because it requires two authenticated browser users and device permission. No TURN server is configured, so rural/NAT connectivity will be unreliable. |
| Signaling / rooms | In-memory WebSocket broadcast manager works. | 🐛 | Confirmed: unauthenticated socket joined a room. Rooms have no appointment membership, authorization, size limit, origin check, expiration, or persistence. Multi-instance deployment will not work with in-memory rooms. |
| Consultation lifecycle | UI starts/ends a peer connection. | ❌ | No appointment/status authorization, audit log, recording policy, attendance tracking, reconnect flow, or server-side end state. |

### Module 9 — Medical Records (25%)

| Feature | Existing implementation | Status | Problems / recommended fix |
|---|---|---|---|
| Model/schema/API | Schema and `POST`, patient list, and individual record endpoints exist. | ⚠️ | There is no `MedicalRecordModel`, index setup, or collection currently in MongoDB. |
| Doctor creation | Role is checked. | 🐛 | Caller supplies arbitrary `patient_id` and `appointment_id`; neither is validated or linked to the authenticated doctor. Doctor can create records for unrelated patients. |
| Patient ownership | Individual-record endpoint compares record `patient_id` to the current user ID. | 🐛 | The patient list and per-record check use user ID but appointment/record payloads use patient profile IDs. Valid patient records will not reliably display; if conventions change, this may also become an authorization risk. |
| Frontend | `/patient/medical-records` has loading/error/empty/data UI. | 🐛 | The primary navigation points to the stale `/patient/records` page instead. |

### Module 10 — Prescriptions (25%)

| Feature | Existing implementation | Status | Problems / recommended fix |
|---|---|---|---|
| Model/schema/API | Schema and doctor-create/patient-list/individual endpoints exist. | ⚠️ | There is no `PrescriptionModel`, indexes, or MongoDB collection yet. |
| Doctor creation / security | Doctor role check exists. | 🐛 | Arbitrary patient and appointment IDs are accepted without relationship validation. No prescription amendment, cancellation, signing, or immutable clinical audit exists. |
| Patient access | Patient list and individual endpoint exist. | 🐛 | Same user-ID vs patient-profile-ID mismatch means valid prescriptions will not appear in the patient UI. |
| Frontend | `/patient/prescriptions` contains loading/error/empty/details UI. | ⚠️ | It cannot be end-to-end verified until the ownership and doctor-creation flows are repaired. |

## Database audit

| Collection | Observed state | Status / recommendation |
|---|---|---|
| `users` | 7 documents; `_id_`, unique `email_1`; no duplicate email groups. | ✅ Maintain lower-case email normalization; add index migration/versioning. |
| `patients` | 2 documents; `_id_`, unique `user_id_`. | ⚠️ Use profile ID consistently only where appropriate; avoid mixing it with user ID. |
| `doctors` | 2 documents; `_id_`, unique `user_id_`, `specialization_1`. | ⚠️ Add verification-status and availability/query indexes when those fields are implemented. |
| `appointments` | 1 document; patient, doctor, and compound doctor/date indexes. | ⚠️ Add duplicate-slot/concurrency protection and a defined timezone field. |
| `medical_records` | Collection absent. | ❌ Add model, indexes on patient/doctor/appointment, and referential authorization checks. |
| `prescriptions` | Collection absent. | ❌ Add model, indexes on patient/doctor/appointment, and integrity checks. |

## API checklist

| Method | URL | Auth | Current status |
|---|---|---|---|
| GET | `/` | No | ✅ 200 runtime verified |
| GET | `/health` | No | ✅ 200 runtime verified |
| POST | `/api/v1/auth/register` | No | ⚠️ Exists; no mutation test performed |
| POST | `/api/v1/auth/login` | No | ✅ Invalid credentials return 400; valid flow untested |
| POST | `/api/v1/auth/google` | No | ⚠️ Invalid credential returns 400; configured flow untested |
| GET | `/api/v1/auth/me` | Yes | ⚠️ Exists; valid token flow untested |
| POST | `/api/v1/auth/logout` | No | ⚠️ No server token invalidation |
| GET/PUT | `/api/v1/patients/me` | Patient | ⚠️ Exists; valid flow untested |
| GET | `/api/v1/patients/{patient_id}` | Yes | ⚠️ Exists; doctor relation is overbroad |
| GET | `/api/v1/doctors/` | No | ✅ 200 runtime verified |
| GET | `/api/v1/doctors/me` | Doctor | ⚠️ Auto-creates profile; valid flow untested |
| PUT | `/api/v1/doctors/me` | Doctor | 🐛 Full create schema used, not partial update schema |
| GET | `/api/v1/doctors/{doctor_id}` | No | ✅ Invalid ID/unknown resource returns 404 |
| POST | `/api/v1/appointments/` | Patient | ⚠️ Exists; booking rules incomplete |
| GET | `/api/v1/appointments/patient` | Patient | ✅ Unauthenticated request returned 401 |
| GET | `/api/v1/appointments/doctor` | Doctor | ⚠️ Exists; frontend integration broken |
| PATCH | `/api/v1/appointments/{appointment_id}` | Owner | 🐛 Over-permissive status/date/reason mutations |
| POST | `/api/v1/symptoms/analyze` | Yes | ⚠️ Exists; validation/auth semantics need consolidation |
| POST | `/api/v1/translation/translate` | Yes | ⚠️ Exists; third-party live test not run |
| POST | `/api/v1/medical-records/` | Doctor | 🐛 Relationship validation missing |
| GET | `/api/v1/medical-records/patient` | Patient | 🐛 Identity mismatch prevents reliable results |
| GET | `/api/v1/medical-records/{record_id}` | Patient/doctor | 🐛 Identity mismatch and overbroad input model |
| POST | `/api/v1/prescriptions/` | Doctor | 🐛 Relationship validation missing |
| GET | `/api/v1/prescriptions/patient` | Patient | 🐛 Identity mismatch prevents reliable results |
| GET | `/api/v1/prescriptions/{prescription_id}` | Patient/doctor | 🐛 Identity mismatch |
| WS | `/ws/{room_id}` | No | ❌ Unauthenticated room join verified |

## UI/UX audit

- Most recently built feature pages have loading, error, and empty states (doctor search, doctor dashboard/profile, patient appointments, records, prescriptions, translation).
- The production build currently prevents any page deployment because of the stale doctor appointments import.
- `src/components/layout/Navbar.tsx` and `Sidebar.tsx` include links such as `/appointments`, `/records`, and `/settings` without matching routes; these are broken links if rendered.
- There are duplicate/stale patient paths: `/patient/records` and `/patient/medical-records`.
- No browser console audit was possible after the global build failure. Responsive behaviour was reviewed from source only, not manually device-tested.
- The landing-page language selector changes state but does not translate page content.

## Exact files requiring changes

1. `src/app/doctor/appointments/page.tsx`
2. `src/lib/patient-portal.ts`
3. `backend/core/security.py`
4. `backend/api/deps.py`
5. `backend/api/api_v1/endpoints/consultation.py`
6. `backend/api/api_v1/endpoints/medical_records.py`
7. `backend/api/api_v1/endpoints/prescriptions.py`
8. `backend/api/api_v1/endpoints/appointments.py`
9. `backend/api/api_v1/endpoints/doctors.py`
10. `backend/schemas/doctor.py`
11. `backend/services/ai_service.py`
12. `backend/models/medical_record.py` (missing)
13. `backend/models/prescription.py` (missing)
14. `src/app/patient/dashboard/page.tsx`
15. `src/app/patient/layout.tsx`
16. `src/app/patient/records/page.tsx` and `src/app/patient/medical-records/page.tsx`
17. `src/components/layout/Navbar.tsx`
18. `src/components/layout/Sidebar.tsx`
19. `src/middleware.ts` (migrate to `src/proxy.ts` for Next.js 16)
20. `backend/tests/test_doctors.py`
21. `backend/core/config.py`

## Recommended fix order

1. **Stop the build failure:** reconcile/remove the stale patient-portal API and repair the doctor appointments page; rerun lint/build.
2. **Unify authentication identity:** adopt one DB-backed authenticated-user dependency across every protected endpoint, then add negative 401/403 tests.
3. **Secure WebRTC:** authenticate WebSocket upgrades, validate appointment participant/role/status, issue short-lived room tokens, cap room membership, and introduce TURN plus scalable signaling.
4. **Repair clinical-data integrity:** introduce record/prescription models and indexes; derive patient and doctor IDs from the authenticated appointment rather than client payload; consistently use profile IDs or user IDs by documented contract.
5. **Constrain appointment transitions:** authorize patient cancellation only, doctor confirm/reject/complete only, validate availability/time slots/timezones, and prevent duplicate bookings.
6. **Repair doctor profile flow:** add or remove the frontend `POST /doctors/me` branch, use `DoctorUpdate` for `PUT`, and implement verification/availability policy.
7. **Make AI safely assistive:** remove diagnostic condition labels, support language handling, persist only with consent, and clearly route emergencies.
8. **Complete UI route consolidation:** correct `/patient/records`, root navigation links, and dashboard data sources; then browser-test responsive and error states.
9. **Replace stale tests with current integration tests:** use an isolated MongoDB/test database and test success plus 400/401/403/404 cases for every endpoint.
10. **Harden configuration:** remove insecure secret defaults, validate production configuration, migrate Next middleware to proxy, and document deployment variables.

## Approval gate

No fixes have been made during this audit. Approval is required before any module is changed. Module 11 Notifications has not been started.
