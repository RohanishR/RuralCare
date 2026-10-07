from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from backend.core.database import get_database
from backend.core.security import get_current_user
from backend.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionResponse,
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
    response_model=PrescriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_prescription(
    request: PrescriptionCreate,
    current_user=Depends(get_current_user),
):
    if get_user_role(current_user) != "doctor":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can create prescriptions.",
        )

    db = get_database()

    doctor_id = get_user_id(current_user)

    document = {
        "patient_id": request.patient_id,
        "doctor_id": doctor_id,
        "appointment_id": request.appointment_id,
        "medicine": request.medicine,
        "dosage": request.dosage,
        "frequency": request.frequency,
        "duration": request.duration,
        "instructions": request.instructions or "",
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.prescriptions.insert_one(document)

    document["id"] = str(result.inserted_id)

    return PrescriptionResponse(**document)


@router.get(
    "/patient",
    response_model=list[PrescriptionResponse],
)
async def get_patient_prescriptions(
    current_user=Depends(get_current_user),
):
    if get_user_role(current_user) != "patient":
        raise HTTPException(
            status_code=403,
            detail="Only patients can access this endpoint.",
        )

    db = get_database()

    patient_id = get_user_id(current_user)

    prescriptions = []

    cursor = (
        db.prescriptions
        .find({"patient_id": patient_id})
        .sort("created_at", -1)
    )

    async for document in cursor:
        document["id"] = str(document.pop("_id"))
        prescriptions.append(document)

    return prescriptions


@router.get(
    "/{prescription_id}",
    response_model=PrescriptionResponse,
)
async def get_prescription(
    prescription_id: str,
    current_user=Depends(get_current_user),
):
    if not ObjectId.is_valid(prescription_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid prescription ID.",
        )

    db = get_database()

    document = await db.prescriptions.find_one(
        {"_id": ObjectId(prescription_id)}
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Prescription not found.",
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