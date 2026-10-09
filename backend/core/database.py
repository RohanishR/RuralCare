import logging

from motor.motor_asyncio import AsyncIOMotorClient

from backend.core.config import settings

logger = logging.getLogger(__name__)


class Database:
    client: AsyncIOMotorClient | None = None


db = Database()


async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")

    try:
        client_kwargs = {"serverSelectionTimeoutMS": 5000}
        if "mongodb+srv://" in settings.MONGODB_URI:
            try:
                import certifi
                client_kwargs["tlsCAFile"] = certifi.where()
            except ImportError:
                pass

        db.client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            **client_kwargs,
        )

        await db.client.admin.command("ping")
        logger.info("Successfully connected to MongoDB Atlas.")

    except Exception as exc:
        logger.warning(
            "Could not connect to MongoDB Atlas (%s). "
            "Please whitelist your IP in MongoDB Atlas Network Access. "
            "Attempting fallback to local MongoDB...",
            exc,
        )
        try:
            db.client = AsyncIOMotorClient(
                "mongodb://localhost:27017",
                serverSelectionTimeoutMS=3000,
            )
            await db.client.admin.command("ping")
            logger.info("Successfully connected to local MongoDB fallback.")
        except Exception:
            logger.error("Both Atlas and local MongoDB connection failed.")
            raise exc


async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")

    if db.client:
        db.client.close()
        db.client = None

    logger.info("MongoDB connection closed.")


def get_database():
    if db.client is None:
        raise RuntimeError("Database connection has not been initialized.")

    return db.client[settings.DATABASE_NAME]