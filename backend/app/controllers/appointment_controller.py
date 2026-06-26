"""Appointment controller with business logic."""
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import and_
from ..models.appointment import Appointment
from ..models.doctor import Doctor
from ..models.department import Department
from ..models.patient import Patient
from ..schemas.appointment_schema import (
    AppointmentCreate, AppointmentUpdate, AppointmentResponse
)
from ..utils.helpers import get_available_slots
from fastapi import HTTPException, status


def book_appointment(
    patient_id: int, data: AppointmentCreate, db: Session
) -> dict:
    """Book a new appointment for a patient."""
    # Validate doctor exists and is active
    doctor = db.query(Doctor).filter(
        Doctor.id == data.doctor_id, Doctor.status == "Active"
    ).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor not available"
        )

    # Validate department
    dept = db.query(Department).filter(Department.id == data.department_id).first()
    if not dept:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department not found"
        )

    # Check date is not in the past
    if data.appointment_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot book appointment in the past"
        )

    # Check slot availability
    available = get_available_slots(db, data.doctor_id, data.appointment_date)
    if data.time_slot not in available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Time slot not available"
        )

    appointment = Appointment(
        patient_id=patient_id,
        doctor_id=data.doctor_id,
        department_id=data.department_id,
        appointment_date=data.appointment_date,
        time_slot=data.time_slot,
        reason=data.reason,
        status="Pending"
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return get_appointment_by_id(db, appointment.id)


def get_patient_appointments(patient_id: int, db: Session, status_filter: str = None) -> list:
    """Get all appointments for a patient."""
    query = db.query(
        Appointment, Doctor.name.label("doctor_name"),
        Department.name.label("department_name")
    ).join(Doctor, Appointment.doctor_id == Doctor.id).join(
        Department, Appointment.department_id == Department.id
    ).filter(Appointment.patient_id == patient_id)

    if status_filter:
        query = query.filter(Appointment.status == status_filter)

    query = query.order_by(Appointment.appointment_date.desc(), Appointment.time_slot)
    results = query.all()

    return [
        _format_appointment(a, doc_name, dept_name) for a, doc_name, dept_name in results
    ]


def get_doctor_appointments(doctor_id: int, db: Session, status_filter: str = None) -> list:
    """Get all appointments for a doctor."""
    query = db.query(
        Appointment, Patient.name.label("patient_name"),
        Department.name.label("department_name")
    ).join(Patient, Appointment.patient_id == Patient.id).join(
        Department, Appointment.department_id == Department.id
    ).filter(Appointment.doctor_id == doctor_id)

    if status_filter:
        query = query.filter(Appointment.status == status_filter)

    query = query.order_by(Appointment.appointment_date.desc(), Appointment.time_slot)
    results = query.all()

    return [
        _format_appointment(a, None, dept_name, pat_name) for a, pat_name, dept_name in results
    ]


def get_all_appointments(
    db: Session,
    status_filter: str = None,
    date_filter: date = None,
    search: str = None,
    skip: int = 0,
    limit: int = 20
) -> list:
    """Admin: get all appointments with patient and doctor info."""
    query = db.query(
        Appointment,
        Patient.name.label("patient_name"),
        Doctor.name.label("doctor_name"),
        Department.name.label("department_name")
    ).join(Patient, Appointment.patient_id == Patient.id).join(
        Doctor, Appointment.doctor_id == Doctor.id
    ).join(Department, Appointment.department_id == Department.id)

    if status_filter:
        query = query.filter(Appointment.status == status_filter)
    if date_filter:
        query = query.filter(Appointment.appointment_date == date_filter)
    if search:
        query = query.filter(
            Patient.name.ilike(f"%{search}%") |
            Doctor.name.ilike(f"%{search}%")
        )

    query = query.order_by(Appointment.created_at.desc())
    results = query.offset(skip).limit(limit).all()

    return [
        _format_appointment(a, doc_name, dept_name, pat_name)
        for a, pat_name, doc_name, dept_name in results
    ]


def update_appointment_status(
    appointment_id: int, data: AppointmentUpdate, db: Session
) -> dict:
    """Admin/Doctor: update appointment status and notes."""
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()
    if not appointment:
        return None

    if data.status:
        appointment.status = data.status
    if data.notes is not None:
        appointment.notes = data.notes

    db.commit()
    db.refresh(appointment)
    return get_appointment_by_id(db, appointment_id)


def cancel_appointment(appointment_id: int, patient_id: int, db: Session) -> dict:
    """Patient: cancel their own appointment."""
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.patient_id == patient_id
    ).first()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    if appointment.status not in ["Pending", "Approved"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel this appointment"
        )

    appointment.status = "Cancelled"
    db.commit()
    db.refresh(appointment)
    return get_appointment_by_id(db, appointment_id)


def get_appointment_by_id(db: Session, appointment_id: int) -> dict:
    """Get single appointment with related names."""
    result = db.query(
        Appointment,
        Patient.name.label("patient_name"),
        Doctor.name.label("doctor_name"),
        Department.name.label("department_name")
    ).join(Patient, Appointment.patient_id == Patient.id).join(
        Doctor, Appointment.doctor_id == Doctor.id
    ).join(Department, Appointment.department_id == Department.id).filter(
        Appointment.id == appointment_id
    ).first()

    if not result:
        return None

    a, pat_name, doc_name, dept_name = result
    return _format_appointment(a, doc_name, dept_name, pat_name)


def get_available_time_slots(
    doctor_id: int, appointment_date: date, db: Session
) -> list:
    """Get available time slots for a doctor on a date."""
    return get_available_slots(db, doctor_id, appointment_date)


def _format_appointment(appointment, doctor_name, department_name, patient_name=None):
    return AppointmentResponse(
        id=appointment.id,
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        department_id=appointment.department_id,
        appointment_date=str(appointment.appointment_date),
        time_slot=appointment.time_slot,
        status=appointment.status,
        reason=appointment.reason,
        notes=appointment.notes,
        created_at=str(appointment.created_at) if appointment.created_at else None,
        patient_name=patient_name,
        doctor_name=doctor_name,
        department_name=department_name
    ).model_dump()