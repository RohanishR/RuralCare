"""Contract tests for the doctor and appointment request schemas."""

import unittest
from datetime import datetime, timedelta, timezone

from pydantic import ValidationError

from backend.schemas.appointment import AppointmentCreate, AppointmentUpdate
from backend.schemas.doctor import DoctorCreate, DoctorUpdate


class DoctorSchemaTests(unittest.TestCase):
    def test_create_requires_professional_details(self):
        with self.assertRaises(ValidationError):
            DoctorCreate(full_name="D", specialization="", qualification="", experience_years=-1)

    def test_update_allows_one_safe_field(self):
        update = DoctorUpdate.model_validate({"location": "Pune", "user_id": "other"})
        self.assertEqual(update.location, "Pune")
        self.assertNotIn("user_id", update.model_dump(exclude_unset=True))


class AppointmentSchemaTests(unittest.TestCase):
    def test_create_requires_reason_and_datetime(self):
        with self.assertRaises(ValidationError):
            AppointmentCreate(doctor_id="doctor", appointment_date=datetime.now(timezone.utc), reason="x")

    def test_update_only_accepts_status(self):
        update = AppointmentUpdate(status="cancelled")
        self.assertEqual(update.status, "cancelled")
        with self.assertRaises(ValidationError):
            AppointmentUpdate.model_validate({"appointment_date": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()})


if __name__ == "__main__":
    unittest.main()
