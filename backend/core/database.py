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
        logger.error("database_connection_failed error_type=%s", type(exc).__name__)
        if db.client is not None:
            db.client.close()
            db.client = None
        raise


async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")

    if db.client:
        db.client.close()
        db.client = None

    logger.info("MongoDB connection closed.")


def get_client() -> AsyncIOMotorClient:
    if db.client is None:
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
    return db.client


def get_database():
    client = get_client()
    return client[settings.DATABASE_NAME]
