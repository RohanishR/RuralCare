from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId

from backend.core.database import get_database


class DoctorModel:
    collection_name = "doctors"

    @classmethod
    async def get_by_user_id(cls, user_id: str) -> Optional[dict]:
        db = get_database()

        return await db[cls.collection_name].find_one(
            {"user_id": user_id}
        )

    @classmethod
    async def get_by_id(cls, doctor_id: str) -> Optional[dict]:
        db = get_database()

        try:
            return await db[cls.collection_name].find_one(
                {"_id": ObjectId(doctor_id)}
            )
        except Exception:
            return None

    @classmethod
    async def create(
        cls,
        user_id: str,
        doctor_data: dict,
    ) -> dict:
        db = get_database()

        now = datetime.now(timezone.utc)

        doctor_data["user_id"] = user_id
        doctor_data["created_at"] = now
        doctor_data["updated_at"] = now

        result = await db[cls.collection_name].insert_one(
            doctor_data
        )

        return await cls.get_by_id(str(result.inserted_id))

    @classmethod
    async def update_by_user_id(
        cls,
        user_id: str,
        update_data: dict,
    ) -> Optional[dict]:
        db = get_database()

        now = datetime.now(timezone.utc)

        update_data["updated_at"] = now

        await db[cls.collection_name].update_one(
            {"user_id": user_id},
            {
                "$set": update_data,
                "$setOnInsert": {
                    "user_id": user_id,
                    "created_at": now,
                },
            },
            upsert=True,
        )

        return await cls.get_by_user_id(user_id)

    @classmethod
    async def get_all(cls, query: dict = None) -> list[dict]:
        db = get_database()

        cursor = db[cls.collection_name].find(query or {})

        return await cursor.to_list(length=100)

    @classmethod
    async def ensure_indexes(cls):
        db = get_database()

        await db[cls.collection_name].create_index(
            "user_id",
            unique=True,
        )

        await db[cls.collection_name].create_index(
            "specialization"
        )