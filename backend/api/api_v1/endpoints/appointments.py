from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from backend.api.deps import get_current_user
from backend.models.appointment import AppointmentModel
from backend.models.doctor import DoctorModel
from backend.models.patient import PatientModel
from backend.schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
)
from backend.schemas.user import UserResponse


router = APIRouter()


def serialize_appointment(
    appointment: dict,
) -> dict:

    appointment["id"] = str(
        appointment["_id"]
    )

    appointment.pop("_id", None)

    return appointment


@router.post(
    "/",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_appointment(
    appointment_in: AppointmentCreate,
    current_user: UserResponse = Depends(
        get_current_user
    ),
) -> Any:

    if current_user.role != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can book appointments.",
        )

    patient = await PatientModel.get_by_user_id(
        current_user.id
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    doctor = await DoctorModel.get_by_id(
        appointment_in.doctor_id
    )

    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found.",
        )

    if not doctor.get("is_available", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor is currently unavailable.",
        )

    appointment_data = {
        "patient_id": str(patient["_id"]),
        "doctor_id": appointment_in.doctor_id,
        "appointment_date": appointment_in.appointment_date,
        "reason": appointment_in.reason,
        "status": "pending",
    }

    appointment = await AppointmentModel.create(
        appointment_data
    )

    return serialize_appointment(appointment)


@router.get(
    "/patient",
    response_model=list[AppointmentResponse],
)
async def get_patient_appointments(
    current_user: UserResponse = Depends(
        get_current_user
    ),
) -> list[dict]:

    if current_user.role != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access patient appointments.",
        )

    patient = await PatientModel.get_by_user_id(
        current_user.id
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    appointments = await AppointmentModel.get_by_patient_id(
        str(patient["_id"])
    )

    return [
        serialize_appointment(appointment)
        for appointment in appointments
    ]


@router.get(
    "/doctor",
    response_model=list[AppointmentResponse],
)
async def get_doctor_appointments(
    current_user: UserResponse = Depends(
        get_current_user
    ),
) -> list[dict]:

    if current_user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can access doctor appointments.",
        )

    doctor = await DoctorModel.get_by_user_id(
        current_user.id
    )

    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found.",
        )

    appointments = await AppointmentModel.get_by_doctor_id(
        str(doctor["_id"])
    )

    return [
        serialize_appointment(appointment)
        for appointment in appointments
    ]


@router.patch(
    "/{appointment_id}",
    response_model=AppointmentResponse,
)
async def update_appointment(
    appointment_id: str,
    appointment_in: AppointmentUpdate,
    current_user: UserResponse = Depends(
        get_current_user
    ),
) -> Any:

    appointment = await AppointmentModel.get_by_id(
        appointment_id
    )

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    patient = await PatientModel.get_by_user_id(
        current_user.id
    )

    doctor = await DoctorModel.get_by_user_id(
        current_user.id
    )

    is_patient = (
        patient
        and str(patient["_id"])
        == appointment["patient_id"]
    )

    is_doctor = (
        doctor
        and str(doctor["_id"])
        == appointment["doctor_id"]
    )

    if not is_patient and not is_doctor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this appointment.",
        )

    update_data = appointment_in.model_dump(
        exclude_unset=True
    )

    updated = await AppointmentModel.update(
        appointment_id,
        update_data,
    )

    return serialize_appointment(updated)