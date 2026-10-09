import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient("mongodb+srv://ramanrohanish_db_user:62w7xHI8FL9Ygroj@cluster0.qwgrf18.mongodb.net/?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true")
    db = client.get_database("ruralcare")
    docs = await db.doctors.find().to_list(100)
    for doc in docs:
        print(doc.get("full_name"), doc.get("verification_status"))

asyncio.run(main())
