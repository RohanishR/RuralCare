from contextlib import asynccontextmanager
import logging
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError
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

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    from backend.models.user import UserModel
    from backend.models.patient import PatientModel
    from backend.models.doctor import DoctorModel
    from backend.models.appointment import AppointmentModel
    from backend.models.medical_record import MedicalRecordModel
    from backend.models.prescription import PrescriptionModel
    from backend.models.notification import NotificationModel

    try:
        await connect_to_mongo()
        for model in (UserModel, PatientModel, DoctorModel, AppointmentModel,
                      MedicalRecordModel, PrescriptionModel, NotificationModel):
            await model.ensure_indexes()
    except PyMongoError as exc:
        # Allow endpoints to report safe 503 errors and retry a transient outage.
        logger.error("database_initialization_failed error_type=%s", type(exc).__name__)
        await close_mongo_connection()

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
    expose_headers=["X-Request-ID"],
)


@app.middleware("http")
async def request_reference(request: Request, call_next):
    request.state.request_id = uuid4().hex
    response = await call_next(request)
    response.headers["X-Request-ID"] = request.state.request_id
    return response


@app.exception_handler(PyMongoError)
async def database_error(request: Request, exc: PyMongoError):
    reference = getattr(request.state, "request_id", uuid4().hex)
    logger.error("database_request_failed request_id=%s error_type=%s",
                 reference, type(exc).__name__)
    return JSONResponse(status_code=503, content={
        "detail": "The database is temporarily unavailable. Please try again shortly.",
        "request_id": reference,
    })


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
