from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.api_v1.api import api_router
from backend.api.api_v1.endpoints.consultation import (
    router as consultation_router,
)
from backend.core.config import settings
from backend.core.database import (
    close_mongo_connection,
    connect_to_mongo,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()

    from backend.models.user import UserModel
    from backend.models.patient import PatientModel
    from backend.models.doctor import DoctorModel
    from backend.models.appointment import AppointmentModel
    from backend.models.medical_record import MedicalRecordModel
    from backend.models.prescription import PrescriptionModel
    from backend.models.notification import NotificationModel

    await UserModel.ensure_indexes()
    await PatientModel.ensure_indexes()
    await DoctorModel.ensure_indexes()
    await AppointmentModel.ensure_indexes()
    await MedicalRecordModel.ensure_indexes()
    await PrescriptionModel.ensure_indexes()
    await NotificationModel.ensure_indexes()

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


# REST API
app.include_router(
    api_router,
    prefix="/api/v1",
)


# WebRTC consultation signaling
app.include_router(
    consultation_router,
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
