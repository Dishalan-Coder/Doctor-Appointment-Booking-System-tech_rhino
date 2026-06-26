"""Appointment API routes."""
from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..config.db import get_db
from ..schemas.appointment_schema import AppointmentCreate, AppointmentUpdate
from ..models.patient import Patient
from ..models.doctor import Doctor
from ..utils.dependencies import get_current_patient, get_current_admin, get_current_doctor
from ..controllers.appointment_controller import (
    book_appointment, get_patient_appointments, get_doctor_appointments,
    get_all_appointments, update_appointment_status,
    cancel_appointment, get_available_time_slots
)

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.get("/slots")
def available_slots(
    doctor_id: int = Query(...),
    appointment_date: date = Query(...),
    db: Session = Depends(get_db)
):
    return get_available_time_slots(doctor_id, appointment_date, db)


@router.post("/")
def create_appointment(
    data: AppointmentCreate,
    patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    return book_appointment(patient.id, data, db)


@router.get("/my")
def my_appointments(
    status: str = Query(None),
    patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    return get_patient_appointments(patient.id, db, status)


@router.delete("/{appointment_id}")
def cancel_my_appointment(
    appointment_id: int,
    patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    return cancel_appointment(appointment_id, patient.id, db)


# Doctor appointment routes
@router.get("/doctor/my")
def doctor_appointments(
    status: str = Query(None),
    doctor: Doctor = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    return get_doctor_appointments(doctor.id, db, status)


@router.put("/doctor/{appointment_id}")
def doctor_update_appointment(
    appointment_id: int,
    data: AppointmentUpdate,
    db: Session = Depends(get_db),
    doctor: Doctor = Depends(get_current_doctor)
):
    # Verify appointment belongs to this doctor
    from ..models.appointment import Appointment
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.doctor_id == doctor.id
    ).first()
    if not appointment:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Appointment not found")
    result = update_appointment_status(appointment_id, data, db)
    return result


# Admin appointment routes - Note: Generic "/" route MUST come after specific routes
@router.put("/{appointment_id}")
def update_appointment(
    appointment_id: int,
    data: AppointmentUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    result = update_appointment_status(appointment_id, data, db)
    if not result:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Appointment not found")
    return result


@router.get("/")
def list_appointments(
    status: str = Query(None),
    date_filter: date = Query(None, alias="date"),
    search: str = Query(None),
    skip: int = Query(0),
    limit: int = Query(20),
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    return get_all_appointments(db, status, date_filter, search, skip, limit)