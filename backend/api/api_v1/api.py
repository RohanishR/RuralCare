from fastapi import APIRouter

from backend.api.api_v1.endpoints import (
    health, auth, users, patients, doctors, appointments,
    consultations, prescriptions, medical_records, ai, translation, admin
)

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(doctors.router, prefix="/doctors", tags=["doctors"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(consultations.router, prefix="/consultations", tags=["consultations"])
api_router.include_router(prescriptions.router, prefix="/prescriptions", tags=["prescriptions"])
api_router.include_router(medical_records.router, prefix="/medical-records", tags=["medical_records"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(translation.router, prefix="/translation", tags=["translation"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
