"""Synthetic browser-test fixture. Credentials go only to the parent test process.

Never run create directly in a terminal: the browser runner captures its output.
No existing users, appointments, or clinical data are read or changed.
"""
import asyncio
import json
import secrets
import sys
from datetime import datetime, timezone
from uuid import uuid4

import httpx
from bson import ObjectId
from backend.core.database import get_database, close_mongo_connection


async def main():
    db = get_database()
    if sys.argv[1] == "cleanup":
        fixture = json.loads(sys.stdin.read())
        for item in fixture["users"]:
            # Delete only exact IDs carrying this test's own synthetic email prefix.
            query = {"_id": ObjectId(item["id"]), "email": item["email"]}
            if not item["email"].startswith("ruralcare-video-qa-") or not item["email"].endswith("@example.com"):
                raise ValueError("Not a synthetic fixture")
            for collection in ("patients", "doctors"):
                await db[collection].delete_many({"user_id": item["id"]})
            await db.users.delete_one(query)
        room_id = fixture["roomId"]
        await db.appointments.delete_one({"_id": ObjectId(room_id), "reason": "Synthetic video QA fixture"})
        for collection in ("consultation_presence", "consultation_signals"):
            await db[collection].delete_many({"room_id": room_id})
        print("synthetic_fixture_removed=True")
    else:
        origin = sys.argv[2]
        users = []
        async with httpx.AsyncClient(base_url=origin, timeout=30) as client:
            for role in ("patient", "doctor"):
                email = "ruralcare-video-qa-" + uuid4().hex + "@example.com"
                password = secrets.token_urlsafe(32)
                response = await client.post("/api/v1/auth/register", json={"name": "Synthetic Video QA " + role,
                                              "email": email, "password": password, "role": role})
                response.raise_for_status()
                user = response.json()
                login = await client.post("/api/v1/auth/login", data={"username": email, "password": password})
                login.raise_for_status()
                token = login.json()["access_token"]
                headers = {"Authorization": "Bearer " + token}
                if role == "patient":
                    profile = await client.get("/api/v1/patients/me", headers=headers)
                else:
                    profile = await client.post("/api/v1/doctors/me", headers=headers, json={
                        "full_name": user["name"], "specialization": "Synthetic QA",
                        "qualification": "Synthetic QA", "experience_years": 0})
                profile.raise_for_status()
                users.append({"id": user["id"], "email": email, "token": token, "role": role, "profileId": profile.json()["id"]})
        now = datetime.now(timezone.utc)
        # Seed a private synthetic appointment, not a public approved doctor listing.
        result = await db.appointments.insert_one({"patient_id": users[0]["profileId"], "doctor_id": users[1]["profileId"],
            "appointment_date": now, "reason": "Synthetic video QA fixture", "status": "confirmed",
            "notes": "", "created_at": now, "updated_at": now})
        print(json.dumps({"roomId": str(result.inserted_id), "users": users}))
    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(main())
