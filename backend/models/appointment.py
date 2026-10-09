from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId

from backend.core.database import get_database


class AppointmentModel:
    collection_name = "appointments"

    @classmethod
    async def has_care_relationship(cls, doctor_id: str, patient_id: str) -> bool:
        document = await get_database()[cls.collection_name].find_one({
            "doctor_id": doctor_id,
            "patient_id": patient_id,
            "status": {"$in": ["confirmed", "completed"]},
        }, {"_id": 1})
        return document is not None

    @classmethod
    async def get_by_id(
        cls,
        appointment_id: str,
    ) -> Optional[dict]:
        db = get_database()

        try:
            return await db[cls.collection_name].find_one(
                {"_id": ObjectId(appointment_id)}
            )
        except Exception:
            return None

    @classmethod
    async def create(
        cls,
        appointment_data: dict,
    ) -> dict:
        db = get_database()

        now = datetime.now(timezone.utc)

        appointment_data["created_at"] = now
        appointment_data["updated_at"] = now

        result = await db[cls.collection_name].insert_one(
            appointment_data
        )

        return await cls.get_by_id(
            str(result.inserted_id)
        )

    @classmethod
    async def get_by_patient_id(
        cls,
        patient_id: str,
    ) -> list[dict]:
        db = get_database()

        cursor = db[cls.collection_name].find(
            {"patient_id": patient_id}
        ).sort("appointment_date", 1)

        return await cursor.to_list(length=100)

    @classmethod
    async def get_by_doctor_id(
        cls,
        doctor_id: str,
    ) -> list[dict]:
        db = get_database()

        cursor = db[cls.collection_name].find(
            {"doctor_id": doctor_id}
        ).sort("appointment_date", 1)

        return await cursor.to_list(length=100)

    @classmethod
    async def update(
        cls,
        appointment_id: str,
        update_data: dict,
    ) -> Optional[dict]:
        db = get_database()

        update_data["updated_at"] = datetime.now(
            timezone.utc
        )

        try:
            await db[cls.collection_name].update_one(
                {"_id": ObjectId(appointment_id)},
                {"$set": update_data},
            )
        except Exception:
            return None

        return await cls.get_by_id(appointment_id)

    @classmethod
    async def ensure_indexes(cls):
        db = get_database()

        await db[cls.collection_name].create_index(
            "patient_id"
        )

        await db[cls.collection_name].create_index(
            "doctor_id"
        )

        await db[cls.collection_name].create_index(
            [
                ("doctor_id", 1),
                ("appointment_date", 1),
            ]
        )
