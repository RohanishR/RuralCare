from datetime import datetime
from typing import Optional
from bson import ObjectId
from backend.core.database import get_database

class NotificationModel:
    collection_name = "notifications"

    @classmethod
    async def ensure_indexes(cls):
        import pymongo
        db = get_database()
        await db[cls.collection_name].create_index([("user_id", pymongo.ASCENDING)])

    @classmethod
    async def create(cls, user_id: str, data: dict) -> dict:
        db = get_database()
        notification_data = {
            "user_id": user_id,
            "title": data["title"],
            "message": data["message"],
            "type": data["type"],
            "read": False,
            "created_at": datetime.utcnow()
        }
        result = await db[cls.collection_name].insert_one(notification_data)
        notification_data["_id"] = result.inserted_id
        return notification_data

    @classmethod
    async def get_by_user_id(cls, user_id: str) -> list[dict]:
        db = get_database()
        cursor = db[cls.collection_name].find({"user_id": user_id}).sort("created_at", -1)
        return await cursor.to_list(length=100)

    @classmethod
    async def get_by_id(cls, notification_id: str) -> Optional[dict]:
        db = get_database()
        try:
            return await db[cls.collection_name].find_one({"_id": ObjectId(notification_id)})
        except Exception:
            return None

    @classmethod
    async def mark_as_read(cls, notification_id: str) -> Optional[dict]:
        db = get_database()
        try:
            result = await db[cls.collection_name].find_one_and_update(
                {"_id": ObjectId(notification_id)},
                {"$set": {"read": True}},
                return_document=True
            )
            return result
        except Exception:
            return None

    @classmethod
    async def mark_all_as_read(cls, user_id: str) -> int:
        db = get_database()
        result = await db[cls.collection_name].update_many(
            {"user_id": user_id, "read": False},
            {"$set": {"read": True}}
        )
        return result.modified_count
