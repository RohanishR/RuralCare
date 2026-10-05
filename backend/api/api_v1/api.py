from fastapi import APIRouter

from backend.api.api_v1.endpoints import auth
from backend.api.api_v1.endpoints import patients

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