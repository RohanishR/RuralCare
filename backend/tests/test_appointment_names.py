import unittest
from unittest.mock import AsyncMock, MagicMock, patch
from bson import ObjectId
from backend.api.api_v1.endpoints.appointments import add_patient_names


class AppointmentNameTests(unittest.IsolatedAsyncioTestCase):
    async def test_names_are_batched_and_only_name_fields_are_read(self):
        patient_id, legacy_id, user_id = ObjectId(), ObjectId(), ObjectId()
        profiles = MagicMock()
        profiles.find.return_value.to_list = AsyncMock(return_value=[
            {"_id": patient_id, "full_name": "", "user_id": str(user_id)},
        ])
        users = MagicMock()
        users.find.return_value.to_list = AsyncMock(return_value=[
            {"_id": user_id, "name": "Profile Patient"}, {"_id": legacy_id, "name": "Legacy Patient"},
        ])
        db = MagicMock(patients=profiles, users=users)
        appointments = [{"patient_id": str(patient_id)}, {"patient_id": str(legacy_id)}, {"patient_id": "missing"}]
        with patch("backend.api.api_v1.endpoints.appointments.get_database", return_value=db):
            result = await add_patient_names(appointments)
        self.assertEqual([item["patient_name"] for item in result], ["Profile Patient", "Legacy Patient", None])
        self.assertEqual(profiles.find.call_count, 1)
        self.assertEqual(users.find.call_count, 1)
        self.assertEqual(profiles.find.call_args.args[1], {"full_name": 1, "user_id": 1})
        self.assertEqual(users.find.call_args.args[1], {"name": 1})

    async def test_empty_list_does_not_read_database(self):
        with patch("backend.api.api_v1.endpoints.appointments.get_database") as database:
            self.assertEqual(await add_patient_names([]), [])
        database.assert_not_called()
