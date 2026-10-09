from typing import Any
from datetime import datetime, timezone

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
from backend.services.notification_service import NotificationService

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
        # Auto-create patient profile
        patient_data = {
            "full_name": current_user.name or "",
        }
        patient = await PatientModel.create(
            current_user.id, patient_data
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

    now_utc = datetime.now(timezone.utc)
    appt_date = appointment_in.appointment_date
    if appt_date.tzinfo is None:
        appt_date = appt_date.replace(tzinfo=timezone.utc)
        
    if appt_date <= now_utc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Appointment time must be in the future.")
        
    # Store as naive UTC in DB for compatibility, or keep aware. PyMongo handles aware by converting to naive UTC internally, but let's store aware to be safe.


    appointment_data = {
        "patient_id": str(patient["_id"]),
        "doctor_id": appointment_in.doctor_id,
        "appointment_date": appt_date,
        "reason": appointment_in.reason,
        "status": "pending",
    }

    appointment = await AppointmentModel.create(
        appointment_data
    )

    # Notify patient
    await NotificationService.send_notification(
        user_id=current_user.id,
        title="Appointment Booked",
        message=f"Your appointment with Dr. {doctor.get('full_name')} is booked.",
        type="appointment_booked"
    )

    # Notify doctor
    await NotificationService.send_notification(
        user_id=doctor["user_id"],
        title="New Appointment",
        message=f"You have a new appointment on {appt_date.strftime('%Y-%m-%d %H:%M')}.",
        type="new_appointment"
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
        # No patient profile yet means no appointments
        return []

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
        # No doctor profile yet means no appointments
        return []

    appointments = await AppointmentModel.get_by_doctor_id(
        str(doctor["_id"])
    )

    return [
        serialize_appointment(appointment)
        for appointment in appointments
    ]


@router.get(
    "/{appointment_id}",
    response_model=AppointmentResponse,
)
async def get_appointment(
    appointment_id: str,
    current_user: UserResponse = Depends(get_current_user),
) -> Any:
    appointment = await AppointmentModel.get_by_id(appointment_id)
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )
    
    # Check permissions
    if current_user.role == "patient":
        patient = await PatientModel.get_by_user_id(current_user.id)
        if not patient or str(patient["_id"]) != appointment["patient_id"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    elif current_user.role == "doctor":
        doctor = await DoctorModel.get_by_user_id(current_user.id)
        if not doctor or str(doctor["_id"]) != appointment["doctor_id"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    return serialize_appointment(appointment)


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

    patient = await PatientModel.get_by_user_id(current_user.id) if current_user.role == "patient" else None
    doctor = await DoctorModel.get_by_user_id(current_user.id) if current_user.role == "doctor" else None
    is_patient = bool(patient and str(patient["_id"]) == appointment["patient_id"])
    is_doctor = bool(doctor and str(doctor["_id"]) == appointment["doctor_id"])
    if not is_patient and not is_doctor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this appointment.",
        )

    update_data = {}
    if appointment_in.status:
        requested_status = appointment_in.status
        patient_transitions = {"pending": {"cancelled"}, "confirmed": {"cancelled"}}
        doctor_transitions = {"pending": {"confirmed", "cancelled"}, "confirmed": {"completed", "cancelled"}}
        allowed = (patient_transitions if is_patient else doctor_transitions).get(appointment["status"], set())
        if requested_status not in allowed:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This appointment status transition is not permitted.")
        update_data["status"] = requested_status

    if appointment_in.notes is not None:
        if not is_doctor:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only doctors can add notes.")
        update_data["notes"] = appointment_in.notes

    if not update_data:
        return serialize_appointment(appointment)

    updated = await AppointmentModel.update(
        appointment_id,
        update_data,
    )

    if appointment_in.status and updated:
        patient_record = await PatientModel.get_by_id(updated["patient_id"])
        doctor_record = await DoctorModel.get_by_id(updated["doctor_id"])

        if appointment_in.status == "confirmed":
            if patient_record:
                await NotificationService.send_notification(
                    user_id=patient_record["user_id"],
                    title="Appointment Confirmed",
                    message=f"Your appointment with Dr. {doctor_record.get('full_name')} is confirmed.",
                    type="appointment_confirmed"
                )
        elif appointment_in.status == "cancelled":
            if patient_record and is_doctor:
                await NotificationService.send_notification(
                    user_id=patient_record["user_id"],
                    title="Appointment Cancelled",
                    message=f"Your appointment with Dr. {doctor_record.get('full_name')} has been cancelled.",
                    type="appointment_cancelled"
                )
            if doctor_record and is_patient:
                await NotificationService.send_notification(
                    user_id=doctor_record["user_id"],
                    title="Appointment Cancelled",
                    message=f"Your appointment with {patient_record.get('full_name')} has been cancelled.",
                    type="appointment_cancelled"
                )

    return serialize_appointment(updated)
