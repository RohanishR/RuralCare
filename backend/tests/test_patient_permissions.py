"""Patient profile authorization without a live database."""
import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from fastapi import HTTPException
from backend.api.api_v1.endpoints import patients


class PatientPermissionsTests(unittest.IsolatedAsyncioTestCase):
    async def read_profile(self, role, user_id, related=False):
        with patch.object(patients.PatientModel, "get_by_id", AsyncMock(return_value={"_id": "p1", "user_id": "owner"})), \
             patch.object(patients.DoctorModel, "get_by_user_id", AsyncMock(return_value={"_id": "d1"})), \
             patch.object(patients.AppointmentModel, "has_care_relationship", AsyncMock(return_value=related)):
            return await patients.get_patient_by_id("p1", SimpleNamespace(role=role, id=user_id))

    async def test_owner_can_read(self):
        self.assertEqual((await self.read_profile("patient", "owner"))["id"], "p1")

    async def test_other_patient_cannot_read(self):
        with self.assertRaises(HTTPException) as error:
            await self.read_profile("patient", "other")
        self.assertEqual(error.exception.status_code, 403)

    async def test_unrelated_doctor_cannot_read(self):
        with self.assertRaises(HTTPException) as error:
            await self.read_profile("doctor", "doctor-user")
        self.assertEqual(error.exception.status_code, 403)

    async def test_treating_doctor_can_read(self):
        self.assertEqual((await self.read_profile("doctor", "doctor-user", True))["id"], "p1")
