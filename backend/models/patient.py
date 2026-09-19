from typing import Optional, List
from datetime import datetime, timezone
from bson import ObjectId

from backend.core.database import get_database

class PatientModel:
    collection_name = "patients"

    @classmethod
    async def get_by_user_id(cls, user_id: str) -> Optional[dict]:
        db = get_database()
        try:
            return await db[cls.collection_name].find_one({"user_id": user_id})
        except Exception:
            return None
            
    @classmethod
    async def get_by_id(cls, patient_id: str) -> Optional[dict]:
        db = get_database()
        try:
            return await db[cls.collection_name].find_one({"_id": ObjectId(patient_id)})
        except Exception:
            return None

    @classmethod
    async def create(cls, user_id: str, patient_data: dict) -> dict:
        db = get_database()
        
        # Add metadata
        patient_data["user_id"] = user_id
        patient_data["created_at"] = datetime.now(timezone.utc)
        patient_data["updated_at"] = patient_data["created_at"]
        
        result = await db[cls.collection_name].insert_one(patient_data)
        return await cls.get_by_id(str(result.inserted_id))

    @classmethod
    async def update_by_user_id(cls, user_id: str, update_data: dict) -> Optional[dict]:
        db = get_database()
        
        update_data["updated_at"] = datetime.now(timezone.utc)
        
        # Use upsert in case the patient profile doesn't exist yet but they try to update it
        await db[cls.collection_name].update_one(
            {"user_id": user_id}, 
            {"$set": update_data, "$setOnInsert": {"created_at": update_data["updated_at"]}},
            upsert=True
        )
        return await cls.get_by_user_id(user_id)
