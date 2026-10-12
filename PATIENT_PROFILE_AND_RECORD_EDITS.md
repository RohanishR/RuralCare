# Patient profile and correction notes — 13 October 2026

## Profile-save investigation

A synthetic browser test of the original profile form returned HTTP 200 and retained name/allergy changes after reload. The general profile-save API failure reported by the user was not reproduced in that test. Confirmed presentation/integration issues were:

- Save feedback was above the long form, outside the view when pressing the bottom Save button.
- Profile-load errors were swallowed, leaving an empty editable form that could overwrite existing information.
- The dashboard greeting used the registration user name, not the saved patient-profile name.

Changes keep the existing authenticated PUT /api/v1/patients/me endpoint. Feedback is now next to Save, profile-load failures require retry before editing, blank optional fields are normalized, duplicate submission is guarded, and inputs are disabled during save. Form values remain intact after a failed save. Input types and accessible names follow the existing schema. The dashboard reads the saved profile name.

## Patient-owned medical-record corrections

The user explicitly chose editing patient health details and correction notes, while preserving doctor-authored diagnoses and notes. The dashboard and medical-records page link to the health-profile editor. Each medical-record card offers Add/Edit correction notes.

New endpoint: PUT /api/v1/medical-records/{record_id}/patient-note.

- Requires an authenticated patient and atomically filters the write by their own patient-profile ID and record ID.
- Accepts only patient_note (up to 2,000 characters); rejects clinical fields and unsupported fields.
- Persists patient_note and patient_note_updated_at plus append-only patient_note_history entries in the existing medical_records collection.
- Original diagnosis, symptoms, doctor notes, ownership and creation date remain unchanged. Clearing the current note is allowed and is recorded in history.
- Existing authorized record readers receive the current correction and its timestamp. Internal history is not included in API response schemas.
- No new collection, deployment environment variables or third-party dependency is required. Existing MongoDB permissions must allow the update.

## Verification

- 32 backend tests passed, including ownership filtering, clinical-field rejection, atomic correction updates, role restrictions and clearing notes.
- Production Next.js build and targeted frontend lint passed.
- Nine frontend-library tests passed, including safe API-error handling.
- Synthetic browser testing against real local FastAPI/MongoDB confirmed profile save and reload, visible save feedback, and correction creation, reload and edit while preserving clinician content.
- The final browser check also confirmed the dashboard greeting reads the updated patient-profile name. Isolated test ports used process-only environment settings and forwarded requests to real FastAPI, without mock responses; existing .env files and the running development server were left untouched.
- Test credentials and medical content are never logged. Synthetic fixtures are cleaned up by exact IDs; existing records are untouched.

Changes are local and require frontend/backend deployment together before being available on Vercel. The specific production/user-account save failure remains unverified; if it persists after release, capture only the request status and safe request reference, not the medical payload.
