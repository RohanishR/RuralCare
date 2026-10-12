import unittest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch
from bson import ObjectId
from fastapi.testclient import TestClient
from backend.main import app
from backend.api.deps import get_current_user
from backend.api.api_v1.endpoints import medical_records
from backend.schemas.user import UserResponse


class PatientRecordCorrectionTests(unittest.TestCase):
    def setUp(self):
        now = datetime.now(timezone.utc)
        self.user = UserResponse(id=str(ObjectId()), email="synthetic-correction@example.com", name="Synthetic QA",
                                 role="patient", created_at=now, updated_at=now)
        self.patient_id = ObjectId()
        self.record_id = ObjectId()
        self.document = {"_id": self.record_id, "patient_id": str(self.patient_id), "doctor_id": str(ObjectId()),
                         "diagnosis": "Synthetic clinician finding", "symptoms": "Synthetic symptoms",
                         "notes": "Original clinician note", "created_at": now, "patient_note": "Clarification",
                         "patient_note_history": [{"note": "Internal revision", "edited_at": now}]}
        self.db = MagicMock()
        self.db.medical_records.find_one_and_update = AsyncMock(side_effect=lambda *args, **kwargs: dict(self.document))
        self.profile_patch = patch.object(medical_records.PatientModel, "get_by_user_id", AsyncMock(return_value={"_id": self.patient_id}))
        self.db_patch = patch.object(medical_records, "get_database", return_value=self.db)
        self.profile_patch.start()
        self.db_patch.start()
        app.dependency_overrides[get_current_user] = lambda: self.user
        self.client = TestClient(app)

    def tearDown(self):
        self.client.close()
        app.dependency_overrides.clear()
        self.profile_patch.stop()
        self.db_patch.stop()

    def put(self, payload):
        return self.client.put(f"/api/v1/medical-records/{self.record_id}/patient-note", json=payload)

    def test_correction_is_owned_atomic_and_preserves_clinician_content(self):
        response = self.put({"patient_note": " Clarification "})
        self.assertEqual(response.status_code, 200)
        query, changes = self.db.medical_records.find_one_and_update.call_args.args
        self.assertEqual(query, {"_id": self.record_id, "patient_id": str(self.patient_id)})
        self.assertEqual(set(changes["$set"]), {"patient_note", "patient_note_updated_at"})
        self.assertEqual(changes["$set"]["patient_note"], "Clarification")
        self.assertIn("patient_note_history", changes["$push"])
        self.assertEqual(response.json()["notes"], "Original clinician note")
        self.assertNotIn("patient_note_history", response.json())

    def test_other_patients_records_are_not_updated(self):
        self.db.medical_records.find_one_and_update = AsyncMock(return_value=None)
        self.assertEqual(self.put({"patient_note": "Correction"}).status_code, 404)

    def test_invalid_and_clinical_field_edits_are_rejected(self):
        for payload in ({"patient_note": "x" * 2001}, {"patient_note": "Correction", "diagnosis": "Changed"}):
            self.assertEqual(self.put(payload).status_code, 422)
        self.db.medical_records.find_one_and_update.assert_not_called()

    def test_doctor_and_unauthenticated_edits_are_denied(self):
        self.user.role = "doctor"
        self.assertEqual(self.put({"patient_note": "Correction"}).status_code, 403)
        app.dependency_overrides.clear()
        self.assertEqual(self.put({"patient_note": "Correction"}).status_code, 401)
        self.db.medical_records.find_one_and_update.assert_not_called()

    def test_clear_and_invalid_identifier(self):
        self.assertEqual(self.put({"patient_note": ""}).status_code, 200)
        self.assertEqual(self.client.put("/api/v1/medical-records/invalid/patient-note", json={"patient_note": ""}).status_code, 400)
