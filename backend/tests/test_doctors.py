"""Focused Module 4 tests. Run with: python -m unittest backend.tests.test_doctors."""

import os
import unittest
from datetime import datetime, timezone
from unittest.mock import ANY, AsyncMock, patch

os.environ.setdefault("SECRET_KEY", "test-secret-that-is-long-enough-for-local-tests")

from fastapi import HTTPException

from backend.api.api_v1.endpoints import doctors
from backend.api.deps import get_current_user, require_doctor
from backend.schemas.doctor import DoctorProfileCreate, DoctorUpdate
from backend.schemas.user import UserResponse


NOW = datetime.now(timezone.utc)
DOCTOR_USER = UserResponse(id="507f1f77bcf86cd799439011", email="doctor@example.com", name="Dr Test", role="doctor", auth_provider="local", created_at=NOW, updated_at=NOW)
PATIENT_USER = UserResponse(id="507f1f77bcf86cd799439012", email="patient@example.com", name="Patient Test", role="patient", auth_provider="local", created_at=NOW, updated_at=NOW)
DOCTOR_DOCUMENT = {"_id": "507f1f77bcf86cd799439013", "user_id": DOCTOR_USER.id, "specialization": "General Medicine", "qualification": "MBBS", "registration_number": "REG-1", "experience": 5, "languages": ["English", "Hindi"], "consultation_fee": 200, "location": "Pune", "about": "Rural clinician", "availability": {"monday": {"enabled": True, "start": "09:00", "end": "13:00"}}, "profile_image": None, "verification_status": "pending", "created_at": NOW, "updated_at": NOW}


class DoctorSchemaTests(unittest.TestCase):
    def test_profile_requires_valid_professional_fields(self):
        with self.assertRaises(ValueError):
            DoctorProfileCreate(specialization="", qualification="MBBS", registration_number="1", experience=-1, languages=[], consultation_fee=-1, location="")

    def test_update_cannot_include_verification_or_user_id(self):
        update = DoctorUpdate.model_validate({"specialization": "Dermatology", "verification_status": "approved", "user_id": "other"})
        self.assertNotIn("verification_status", update.model_dump(exclude_unset=True))
        self.assertNotIn("user_id", update.model_dump(exclude_unset=True))


class DoctorEndpointTests(unittest.IsolatedAsyncioTestCase):
    async def test_patient_cannot_satisfy_doctor_dependency(self):
        with self.assertRaises(HTTPException) as context:
            require_doctor(PATIENT_USER)
        self.assertEqual(context.exception.status_code, 403)

    async def test_invalid_token_cannot_modify_profile(self):
        with self.assertRaises(HTTPException) as context:
            await get_current_user("invalid-token")
        self.assertEqual(context.exception.status_code, 401)

    @patch("backend.api.api_v1.endpoints.doctors.UserModel.get_by_id", new_callable=AsyncMock)
    @patch("backend.api.api_v1.endpoints.doctors.DoctorModel.create", new_callable=AsyncMock)
    @patch("backend.api.api_v1.endpoints.doctors.DoctorModel.get_by_user_id", new_callable=AsyncMock)
    async def test_create_uses_authenticated_doctor_and_pending_status(self, get_by_user_id, create, get_user):
        get_by_user_id.return_value = None
        create.return_value = DOCTOR_DOCUMENT
        get_user.return_value = {"name": DOCTOR_USER.name}
        profile = DoctorProfileCreate(specialization="General Medicine", qualification="MBBS", registration_number="REG-1", experience=5, languages=["English"], consultation_fee=200, location="Pune")
        response = await doctors.create_doctor_me(profile, DOCTOR_USER)
        create.assert_awaited_once_with(DOCTOR_USER.id, ANY)
        self.assertEqual(response["verification_status"], "pending")

    @patch("backend.api.api_v1.endpoints.doctors.UserModel.get_by_id", new_callable=AsyncMock)
    @patch("backend.api.api_v1.endpoints.doctors.DoctorModel.update_by_user_id", new_callable=AsyncMock)
    @patch("backend.api.api_v1.endpoints.doctors.DoctorModel.get_by_user_id", new_callable=AsyncMock)
    async def test_update_is_scoped_to_authenticated_doctor(self, get_by_user_id, update_by_user_id, get_user):
        get_by_user_id.return_value = DOCTOR_DOCUMENT
        update_by_user_id.return_value = {**DOCTOR_DOCUMENT, "location": "Nashik"}
        get_user.return_value = {"name": DOCTOR_USER.name}
        await doctors.update_doctor_me(DoctorUpdate(location="Nashik"), DOCTOR_USER)
        update_by_user_id.assert_awaited_once()
        self.assertEqual(update_by_user_id.await_args.args[0], DOCTOR_USER.id)

    def test_public_serialization_excludes_sensitive_user_fields(self):
        response = doctors.serialize_doctor(DOCTOR_DOCUMENT, {"name": "Dr Test", "password_hash": "secret", "auth_provider": "local"})
        self.assertNotIn("password_hash", response)
        self.assertNotIn("auth_provider", response)
