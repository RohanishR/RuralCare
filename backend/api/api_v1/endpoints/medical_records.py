from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from backend.api.deps import get_current_user
from backend.core.database import get_database
from backend.models.appointment import AppointmentModel
from backend.models.doctor import DoctorModel
from backend.models.patient import PatientModel
from backend.schemas.medical_record import MedicalRecordCreate, MedicalRecordResponse
from backend.schemas.user import UserResponse

router = APIRouter()


def serialize(document: dict) -> dict:
    document["id"] = str(document.pop("_id"))
    return document


async def get_owned_appointment(appointment_id: str, current_user: UserResponse) -> dict:
    doctor = await DoctorModel.get_by_user_id(current_user.id)
    appointment = await AppointmentModel.get_by_id(appointment_id)
    if not doctor or not appointment or appointment["doctor_id"] != str(doctor["_id"]):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot create a record for this appointment.")
    if appointment["status"] not in {"confirmed", "completed"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Medical records can only be added to confirmed or completed appointments.")
    return appointment


@router.post("/", response_model=MedicalRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_medical_record(request: MedicalRecordCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only doctors can create medical records.")
    appointment = await get_owned_appointment(request.appointment_id, current_user)
    document = {"patient_id": appointment["patient_id"], "doctor_id": appointment["doctor_id"], "appointment_id": request.appointment_id, "diagnosis": request.diagnosis, "symptoms": request.symptoms, "notes": request.notes or "", "created_at": datetime.now(timezone.utc)}
    try:
        result = await get_database().medical_records.insert_one(document)
    except Exception as exc:
        if "duplicate key" in str(exc).lower():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A medical record already exists for this appointment.") from exc
        raise
    document["id"] = str(result.inserted_id)
    return document


@router.get("/patient", response_model=list[MedicalRecordResponse])
async def get_patient_medical_records(current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "patient":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only patients can access this endpoint.")
    patient = await PatientModel.get_by_user_id(current_user.id)
    if not patient:
        return []
    cursor = get_database().medical_records.find({"patient_id": str(patient["_id"])}).sort("created_at", -1)
    return [serialize(document) async for document in cursor]


@router.get("/{record_id}", response_model=MedicalRecordResponse)
async def get_medical_record(record_id: str, current_user: UserResponse = Depends(get_current_user)):
    if not ObjectId.is_valid(record_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid medical record ID.")
    document = await get_database().medical_records.find_one({"_id": ObjectId(record_id)})
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medical record not found.")
    if current_user.role == "patient":
        profile = await PatientModel.get_by_user_id(current_user.id)
        allowed = profile and document["patient_id"] == str(profile["_id"])
    elif current_user.role == "doctor":
        profile = await DoctorModel.get_by_user_id(current_user.id)
        allowed = profile and document["doctor_id"] == str(profile["_id"])
    else:
        allowed = False
    if not allowed:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    return serialize(document)
