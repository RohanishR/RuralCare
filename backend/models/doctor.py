from datetime import datetime, timezone
import re
from typing import Optional

from bson import ObjectId

from backend.core.database import get_database


class DoctorModel:
    collection_name = "doctors"

    @classmethod
    async def ensure_indexes(cls) -> None:
        database = get_database()
        await database[cls.collection_name].create_index("user_id", unique=True)
        await database[cls.collection_name].create_index("verification_status")
        await database[cls.collection_name].create_index("specialization")
        await database[cls.collection_name].create_index("location")

    @classmethod
    async def get_by_user_id(cls, user_id: str) -> Optional[dict]:
        return await get_database()[cls.collection_name].find_one({"user_id": user_id})

    @classmethod
    async def get_by_id(cls, doctor_id: str) -> Optional[dict]:
        try:
            return await get_database()[cls.collection_name].find_one(
                {"_id": ObjectId(doctor_id)}
            )
        except Exception:
            return None

    @classmethod
    async def create(cls, user_id: str, doctor_data: dict) -> dict:
        now = datetime.now(timezone.utc)
        doctor_data.update(
            {
                "user_id": user_id,
                "verification_status": "pending",
                "created_at": now,
                "updated_at": now,
            }
        )
        result = await get_database()[cls.collection_name].insert_one(doctor_data)
        return await cls.get_by_id(str(result.inserted_id))

    @classmethod
    async def update_by_user_id(cls, user_id: str, update_data: dict) -> Optional[dict]:
        update_data["updated_at"] = datetime.now(timezone.utc)
        await get_database()[cls.collection_name].update_one(
            {"user_id": user_id}, {"$set": update_data}
        )
        return await cls.get_by_user_id(user_id)

    @classmethod
    async def list_approved(cls, filters: dict) -> list[dict]:
        clauses: list[dict] = [{"verification_status": "approved"}]
        if filters.get("specialization"):
            clauses.append({"specialization": {
                "$regex": re.escape(filters["specialization"]),
                "$options": "i",
            }})
        if filters.get("language"):
            clauses.append({"languages": {"$regex": re.escape(filters["language"]), "$options": "i"}})
        if filters.get("location"):
            clauses.append({"location": {"$regex": re.escape(filters["location"]), "$options": "i"}})
        if filters.get("search"):
            pattern = {"$regex": re.escape(filters["search"]), "$options": "i"}
            clauses.append({"$or": [
                {"specialization": pattern},
                {"qualification": pattern},
                {"location": pattern},
                {"languages": pattern},
                *(
                    [{"user_id": {"$in": filters["search_user_ids"]}}]
                    if filters.get("search_user_ids")
                    else []
                ),
            ]})

        experience: dict = {}
        if filters.get("min_experience") is not None:
            experience["$gte"] = filters["min_experience"]
        if filters.get("max_experience") is not None:
            experience["$lte"] = filters["max_experience"]
        if experience:
            clauses.append({"experience": experience})
        if filters.get("max_fee") is not None:
            clauses.append({"consultation_fee": {"$lte": filters["max_fee"]}})
        if filters.get("available"):
            clauses.append({"$or": [
                *[
                    {f"availability.{day}.enabled": True}
                    for day in ("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")
                ],
            ]})

        return await get_database()[cls.collection_name].find({"$and": clauses}).sort("created_at", -1).to_list(None)
