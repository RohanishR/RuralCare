from typing import Optional
from datetime import datetime, timezone
from bson import ObjectId

from backend.core.database import get_database

class UserModel:
    collection_name = "users"

    @classmethod
    async def get_by_email(cls, email: str) -> Optional[dict]:
        db = get_database()
        return await db[cls.collection_name].find_one({"email": email})

    @classmethod
    async def get_by_id(cls, user_id: str) -> Optional[dict]:
        db = get_database()
        try:
            return await db[cls.collection_name].find_one({"_id": ObjectId(user_id)})
        except Exception:
            return None

    @classmethod
    async def create(cls, user_data: dict) -> dict:
        db = get_database()
        user_data["created_at"] = datetime.now(timezone.utc)
        user_data["updated_at"] = user_data["created_at"]
        result = await db[cls.collection_name].insert_one(user_data)
        return await cls.get_by_id(str(result.inserted_id))

    @classmethod
    async def update(cls, user_id: str, update_data: dict) -> Optional[dict]:
        db = get_database()
        update_data["updated_at"] = datetime.now(timezone.utc)
        await db[cls.collection_name].update_one(
            {"_id": ObjectId(user_id)}, {"$set": update_data}
        )
        return await cls.get_by_id(user_id)
