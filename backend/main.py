from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.api_v1.api import api_router
from backend.core.config import settings
from backend.core.database import connect_to_mongo, close_mongo_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()

    from backend.models.user import UserModel
    from backend.models.patient import PatientModel

    await UserModel.ensure_indexes()
    await PatientModel.ensure_indexes()

    yield

    await close_mongo_connection()


app = FastAPI(
    title="RuralCare API",
    description="AI-assisted rural healthcare platform",
    version="1.0.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    api_router,
    prefix="/api/v1",
)


@app.get("/")
async def root():
    return {
        "message": "RuralCare API is running",
        "version": "1.0.0",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "RuralCare API",
    }