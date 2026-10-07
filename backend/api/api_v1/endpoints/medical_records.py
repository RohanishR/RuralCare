from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from backend.core.database import get_database
from backend.core.security import get_current_user
from backend.schemas.medical_record import (
    MedicalRecordCreate,
    MedicalRecordResponse,
)


router = APIRouter()


def get_user_id(current_user) -> str:
    if isinstance(current_user, dict):
        return str(
            current_user.get("_id")
            or current_user.get("id")
        )

    return str(
        getattr(current_user, "id", None)
        or getattr(current_user, "_id", None)
    )


def get_user_role(current_user) -> str:
    if isinstance(current_user, dict):
        return str(current_user.get("role", ""))

    return str(getattr(current_user, "role", ""))


@router.post(
    "/",
    response_model=MedicalRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_medical_record(
    request: MedicalRecordCreate,
    current_user=Depends(get_current_user),
):
    if get_user_role(current_user) != "doctor":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can create medical records.",
        )

    db = get_database()

    doctor_id = get_user_id(current_user)

    document = {
        "patient_id": request.patient_id,
        "doctor_id": doctor_id,
        "appointment_id": request.appointment_id,
        "diagnosis": request.diagnosis,
        "symptoms": request.symptoms,
        "notes": request.notes or "",
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.medical_records.insert_one(document)

    document["id"] = str(result.inserted_id)

    return MedicalRecordResponse(**document)


@router.get(
    "/patient",
    response_model=list[MedicalRecordResponse],
)
async def get_patient_medical_records(
    current_user=Depends(get_current_user),
):
    if get_user_role(current_user) != "patient":
        raise HTTPException(
            status_code=403,
            detail="Only patients can access this endpoint.",
        )

    db = get_database()

    patient_id = get_user_id(current_user)

    records = []

    cursor = (
        db.medical_records
        .find({"patient_id": patient_id})
        .sort("created_at", -1)
    )

    async for document in cursor:
        document["id"] = str(document.pop("_id"))
        records.append(document)

    return records


@router.get(
    "/{record_id}",
    response_model=MedicalRecordResponse,
)
async def get_medical_record(
    record_id: str,
    current_user=Depends(get_current_user),
):
    if not ObjectId.is_valid(record_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid medical record ID.",
        )

    db = get_database()

    document = await db.medical_records.find_one(
        {"_id": ObjectId(record_id)}
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Medical record not found.",
        )

    user_id = get_user_id(current_user)
    role = get_user_role(current_user)

    if role == "patient":
        if document["patient_id"] != user_id:
            raise HTTPException(
                status_code=403,
                detail="Access denied.",
            )

    elif role == "doctor":
        if document["doctor_id"] != user_id:
            raise HTTPException(
                status_code=403,
                detail="Access denied.",
            )

    document["id"] = str(document.pop("_id"))

    return document