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
        db.client = AsyncIOMotorClient(settings.MONGODB_URI)

        await db.client.admin.command("ping")

        logger.info("Successfully connected to MongoDB.")

    except Exception as exc:
        logger.error("Could not connect to MongoDB: %s", exc)
        raise


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