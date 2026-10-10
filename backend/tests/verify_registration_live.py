"""Explicit live test: creates one synthetic user and verifies the real MongoDB record.

Run from repository root: python -B -m backend.tests.verify_registration_live
Optional --base-url tests a deployed API against the configured database.
No passwords, tokens, connection strings, or real user records are printed.
"""
import argparse
import asyncio
import secrets
from uuid import uuid4

import httpx

from backend.core.database import close_mongo_connection, get_database
from backend.core.security import decode_access_token, verify_password
from backend.main import app


async def verify(base_url=None):
    email = "ruralcare-registration-qa-" + uuid4().hex + "@example.com"
    password = secrets.token_urlsafe(32)
    payload = {"name": "RuralCare Registration QA", "email": email,
               "password": password, "role": "patient"}
    transport = None if base_url else httpx.ASGITransport(app=app)
    try:
        await get_database().command("ping")
        async with httpx.AsyncClient(transport=transport,
                                     base_url=base_url or "http://testserver", timeout=30) as client:
            response = await client.post("/api/v1/auth/register", json=payload)
            print("registration_http_status=" + str(response.status_code))
            if response.status_code != 200:
                print("registration_verified=False")
                return False
            record = await get_database().users.find_one({"email": email})
            saved = bool(record and str(record["_id"]) == response.json().get("id"))
            print("user_saved_to_configured_mongodb=" + str(saved))
            safe_hash = bool(record and "password" not in record and
                             verify_password(password, record["password_hash"]))
            print("password_hashed_and_verified=" + str(safe_hash))
            login = await client.post("/api/v1/auth/login", data={"username": email, "password": password})
            print("login_http_status=" + str(login.status_code))
            jwt_valid = False
            if login.status_code == 200 and record:
                jwt_valid = decode_access_token(login.json()["access_token"])["sub"] == str(record["_id"])
            print("signed_jwt_verified=" + str(jwt_valid))
            if saved:
                print("synthetic_test_account_retained=" + email)
            return saved and safe_hash and jwt_valid
    except Exception as exc:
        print("live_verification_failed error_type=" + type(exc).__name__)
        return False
    finally:
        await close_mongo_connection()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", help="Deployed origin, without /api/v1")
    arguments = parser.parse_args()
    raise SystemExit(0 if asyncio.run(verify(arguments.base_url)) else 1)
