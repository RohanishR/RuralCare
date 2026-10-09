from backend.core.database import get_database


class MedicalRecordModel:
    collection_name = "medical_records"

    @classmethod
    async def ensure_indexes(cls):
        collection = get_database()[cls.collection_name]
        await collection.create_index("patient_id")
        await collection.create_index("doctor_id")
        await collection.create_index("appointment_id", unique=True)
