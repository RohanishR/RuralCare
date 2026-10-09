from fastapi import APIRouter

from backend.api.api_v1.endpoints import (
    appointments,
    auth,
    doctors,
    patients,
    translation,
)
from backend.api.api_v1.endpoints.symptoms import router as symptoms_router

from backend.api.api_v1.endpoints import (
    appointments,
    auth,
    doctors,
    medical_records,
    patients,
    prescriptions,
    translation,
    notifications,
)

api_router = APIRouter()


api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"],
)


api_router.include_router(
    patients.router,
    prefix="/patients",
    tags=["Patients"],
)


api_router.include_router(
    doctors.router,
    prefix="/doctors",
    tags=["Doctors"],
)


api_router.include_router(
    appointments.router,
    prefix="/appointments",
    tags=["Appointments"],
)


api_router.include_router(
    symptoms_router,
    prefix="/symptoms",
    tags=["Symptoms"],
)


api_router.include_router(
    translation.router,
    prefix="/translation",
    tags=["Translation"],
)

api_router.include_router(
    medical_records.router,
    prefix="/medical-records",
    tags=["Medical Records"],
)

api_router.include_router(
    prescriptions.router,
    prefix="/prescriptions",
    tags=["Prescriptions"],
)

api_router.include_router(
    notifications.router,
    prefix="/notifications",
    tags=["Notifications"],
)