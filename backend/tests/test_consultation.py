import unittest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch

from bson import ObjectId
from fastapi.testclient import TestClient

from backend.main import app
from backend.api.deps import get_current_user
from backend.api.api_v1.endpoints import consultation as endpoint
from backend.schemas.user import UserResponse


class ConsultationTests(unittest.TestCase):
    def setUp(self):
        self.user = UserResponse(id=str(ObjectId()), name="Synthetic QA", email="call-qa@example.com",
                                 role="patient", auth_provider="local",
                                 created_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
        app.dependency_overrides[get_current_user] = lambda: self.user
        self.client = TestClient(app)
        self.collection = MagicMock()
        self.collection.create_index = AsyncMock()
        self.collection.update_one = AsyncMock()
        self.collection.find_one = AsyncMock(return_value=None)
        self.collection.insert_one = AsyncMock(return_value=MagicMock(inserted_id=ObjectId()))
        self.collection.delete_many = AsyncMock()
        cursor = MagicMock()
        cursor.sort.return_value = cursor
        cursor.limit.return_value = cursor
        cursor.to_list = AsyncMock(return_value=[])
        self.collection.find.return_value = cursor
        self.db = MagicMock()
        self.db.__getitem__.return_value = self.collection
        self.access = patch.object(endpoint, "verify_room_access", AsyncMock(return_value={}))
        self.database = patch.object(endpoint, "get_database", return_value=self.db)
        self.access.start()
        self.database.start()

    def tearDown(self):
        self.access.stop()
        self.database.stop()
        app.dependency_overrides.clear()
        self.client.close()

    def test_join_returns_session_boundary_and_ice_configuration(self):
        response = self.client.post("/api/v1/consultation/room/join")
        self.assertEqual(response.status_code, 200)
        self.assertIn("joined_at", response.json())
        self.assertTrue(response.json()["ice_servers"])
        self.assertFalse(response.json()["peer_ready"])
        self.assertEqual(self.collection.create_index.await_count, 4)

    def test_valid_signal_persists_authenticated_sender(self):
        response = self.client.post("/api/v1/consultation/room/signal", json={"type": "start-call"})
        self.assertEqual(response.status_code, 200)
        stored = self.collection.insert_one.call_args.args[0]
        self.assertEqual(stored["sender_id"], self.user.id)
        self.assertEqual(stored["sender_role"], "patient")

    def test_invalid_signals_are_rejected(self):
        for payload in ({"type": "unknown"}, {"type": "offer"}, {"type": "chat", "text": "x" * 4001},
                        {"type": "offer", "offer": {"type": "answer", "sdp": "wrong"}}):
            self.assertEqual(self.client.post("/api/v1/consultation/room/signal", json=payload).status_code, 422)
        self.collection.insert_one.assert_not_called()

    def test_signals_filter_stale_sessions_and_other_senders(self):
        since = datetime.now(timezone.utc)
        response = self.client.get("/api/v1/consultation/room/signals", params={"since": since.isoformat()})
        self.assertEqual(response.status_code, 200)
        query = self.collection.find.call_args.args[0]
        self.assertEqual(query["sender_id"], {"$ne": self.user.id})
        self.assertEqual(query["created_at"]["$gte"], since)
        self.assertEqual(self.client.get("/api/v1/consultation/room/signals?after_id=invalid").status_code, 400)

    def test_leave_removes_only_current_presence(self):
        self.assertEqual(self.client.post("/api/v1/consultation/room/leave").status_code, 200)
        self.collection.delete_many.assert_awaited_once_with({"room_id": "room", "user_id": self.user.id})

    def test_unauthenticated_requests_fail(self):
        app.dependency_overrides.clear()
        self.assertEqual(self.client.post("/api/v1/consultation/room/join").status_code, 401)

class RoomAuthorizationTests(unittest.IsolatedAsyncioTestCase):
    async def test_unrelated_patient_and_doctor_are_denied(self):
        from fastapi import HTTPException
        for role in ("patient", "doctor", "unknown"):
            user_id = ObjectId()
            with patch.object(endpoint.UserModel, "get_by_id", AsyncMock(return_value={"_id": user_id, "role": role})), \
                 patch.object(endpoint.AppointmentModel, "get_by_id", AsyncMock(return_value={"patient_id": "other", "doctor_id": "other"})), \
                 patch.object(endpoint.PatientModel, "get_by_user_id", AsyncMock(return_value=None)), \
                 patch.object(endpoint.DoctorModel, "get_by_user_id", AsyncMock(return_value=None)):
                with self.assertRaises(HTTPException) as error:
                    await endpoint.verify_room_access("room", str(user_id))
                self.assertEqual(error.exception.status_code, 403)
