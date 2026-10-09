import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient("mongodb+srv://ramanrohanish_db_user:62w7xHI8FL9Ygroj@cluster0.qwgrf18.mongodb.net/?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true")
    db = client.get_database("ruralcare")
    await db.doctors.update_many(
        {
            "$or": [
                {"verification_status": {"$exists": False}},
                {"verification_status": None},
                {"verification_status": "pending"}
            ]
        },
        {"$set": {"verification_status": "approved"}}
    )
    print("Updated all doctors to approved.")

asyncio.run(main())
