"""Registration contracts and failure handling; no live database needed."""
import unittest
import os
import secrets
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch

from bson import ObjectId
from fastapi.testclient import TestClient
from pymongo.errors import DuplicateKeyError, ServerSelectionTimeoutError

from backend.main import app
from backend.api.api_v1.endpoints.auth import UserModel
from backend.core.config import settings
from backend.core.security import create_access_token, decode_access_token, get_password_hash, verify_password


class RegistrationTests(unittest.TestCase):
    def setUp(self):
        # TestClient without a context does not run database startup.
        self.client = TestClient(app)
        self.payload = {"name": "Registration QA", "email": "registration-qa@example.com",
                        "password": "Synthetic password for tests 2026", "role": "patient"}

    def tearDown(self):
        self.client.close()

    def test_create_hashes_password_and_filters_response(self):
        async def create(data):
            self.assertNotIn("password", data)
            self.assertTrue(verify_password(self.payload["password"], data["password_hash"]))
            return {**data, "_id": ObjectId(), "created_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc)}
        with patch.object(UserModel, "get_by_email", AsyncMock(return_value=None)), \
             patch.object(UserModel, "ensure_indexes", AsyncMock()), \
             patch.object(UserModel, "create", AsyncMock(side_effect=create)):
            response = self.client.post("/api/v1/auth/register", json=self.payload)
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("password_hash", response.json())
        self.assertNotIn("password", response.json())
        self.assertRegex(response.headers["x-request-id"], "^[a-f0-9]{32}$")

    def test_schema_and_role_checks(self):
        for change, expected in (({"password": "short"}, 422), ({"email": "invalid"}, 422),
                                 ({"role": "admin"}, 403)):
            response = self.client.post("/api/v1/auth/register", json={**self.payload, **change})
            self.assertEqual(response.status_code, expected)

    def test_duplicate_is_safe(self):
        with patch.object(UserModel, "get_by_email", AsyncMock(return_value=None)), \
             patch.object(UserModel, "ensure_indexes", AsyncMock()), \
             patch.object(UserModel, "create", AsyncMock(side_effect=DuplicateKeyError("private database detail"))):
            response = self.client.post("/api/v1/auth/register", json=self.payload)
        self.assertEqual(response.status_code, 400)
        self.assertNotIn("private database detail", response.text)

    def test_database_outage_does_not_log_credentials(self):
        with patch.object(UserModel, "get_by_email", AsyncMock(side_effect=ServerSelectionTimeoutError("private URI"))), \
             self.assertLogs("backend.api.api_v1.endpoints.auth", level="ERROR") as captured:
            response = self.client.post("/api/v1/auth/register", json=self.payload)
        self.assertEqual(response.status_code, 503)
        logged = " ".join(captured.output)
        for private in ("private URI", self.payload["password"], self.payload["email"]):
            self.assertNotIn(private, logged)
            self.assertNotIn(private, response.text)
        self.assertIn("stage=lookup", logged)
        self.assertIn(response.headers["x-request-id"], logged)

    def test_hashing_failure_has_safe_500(self):
        with patch.object(UserModel, "get_by_email", AsyncMock(return_value=None)), \
             patch("backend.api.api_v1.endpoints.auth.get_password_hash", side_effect=RuntimeError("private detail")), \
             self.assertLogs("backend.api.api_v1.endpoints.auth", level="ERROR"):
            response = self.client.post("/api/v1/auth/register", json=self.payload)
        self.assertEqual(response.status_code, 500)
        self.assertNotIn("private detail", response.text)

    def test_exact_cors_origin(self):
        response = self.client.options("/api/v1/auth/register", headers={
            "Origin": settings.FRONTEND_URL, "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["access-control-allow-origin"], settings.FRONTEND_URL)
        denied = self.client.options("/api/v1/auth/register", headers={
            "Origin": "https://unrelated.example.com", "Access-Control-Request-Method": "POST",
        })
        self.assertNotIn("access-control-allow-origin", denied.headers)

    def test_password_hash_and_signed_jwt(self):
        hashed = get_password_hash(self.payload["password"])
        self.assertTrue(verify_password(self.payload["password"], hashed))
        self.assertFalse(verify_password("incorrect password", hashed))
        decoded = decode_access_token(create_access_token("test-subject", "patient"))
        self.assertEqual(decoded["sub"], "test-subject")
        self.assertEqual(decoded["role"], "patient")

    def test_vercel_entrypoint_and_exact_production_origin(self):
        environment = {**os.environ, "VERCEL": "1",
                       "MONGODB_URI": "mongodb://database.example.com/ruralcare",
                       "SECRET_KEY": secrets.token_urlsafe(32),
                       "FRONTEND_URL": "https://ruralcare-cyan.vercel.app"}
        code = """
from entrypoint import app
from fastapi.testclient import TestClient
client = TestClient(app)
origin = "https://ruralcare-cyan.vercel.app"
response = client.options("/api/v1/auth/register", headers={
    "Origin": origin, "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "content-type"})
assert response.status_code == 200
assert response.headers["access-control-allow-origin"] == origin
client.close()
print("production_entrypoint_and_cors_passed")
"""
        result = subprocess.run([sys.executable, "-B", "-c", code],
                                cwd=Path(__file__).resolve().parents[1],
                                env=environment, capture_output=True, text=True, timeout=30)
        self.assertEqual(result.returncode, 0, "Production entry point/CORS failed; output suppressed.")
        self.assertIn("production_entrypoint_and_cors_passed", result.stdout)
