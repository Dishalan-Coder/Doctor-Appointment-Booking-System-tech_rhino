import bcrypt
from datetime import date, timedelta
from sqlalchemy import func
from ..models.appointment import Appointment
from ..models.doctor import Doctor
from ..models.patient import Patient
from ..models.department import Department
from sqlalchemy.orm import Session


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


def get_available_slots(
    db: Session,
    doctor_id: int,
    appointment_date: date
) -> list[str]:
    # Calculate available time slots for a doctor on a given date.
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        return []

    # Parse available days
    day_map = {
        0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu",
        4: "Fri", 5: "Sat", 6: "Sun"
    }
    day_name = day_map.get(appointment_date.weekday(), "")
    if day_name not in doctor.available_days:
        return []

    # Generate 30-minute slots
    start_hour = doctor.available_from.hour
    start_min = doctor.available_from.minute
    end_hour = doctor.available_to.hour
    end_min = doctor.available_to.minute

    slots = []
    current_min = start_hour * 60 + start_min
    end_total = end_hour * 60 + end_min

    while current_min + 30 <= end_total:
        h = current_min // 60
        m = current_min % 60
        slot = f"{h:02d}:{m:02d}"
        slots.append(slot)
        current_min += 30

    # Remove already booked slots
    booked = db.query(Appointment.time_slot).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.appointment_date == appointment_date,
        Appointment.status.in_(["Pending", "Approved"])
    ).all()

    booked_slots = {b[0] for b in booked}
    return [s for s in slots if s not in booked_slots]


def get_dashboard_stats(db: Session) -> dict:
    # Get statistics for the admin dashboard.
    total_patients = db.query(func.count(Patient.id)).scalar() or 0
    total_doctors = db.query(func.count(Doctor.id)).filter(
        Doctor.status == "Active"
    ).scalar() or 0
    total_departments = db.query(func.count(Department.id)).filter(
        Department.is_active == True
    ).scalar() or 0
    total_appointments = db.query(func.count(Appointment.id)).scalar() or 0
    pending_appointments = db.query(func.count(Appointment.id)).filter(
        Appointment.status == "Pending"
    ).scalar() or 0
    today_appointments = db.query(func.count(Appointment.id)).filter(
        Appointment.appointment_date == date.today()
    ).scalar() or 0

    return {
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "total_departments": total_departments,
        "total_appointments": total_appointments,
        "pending_appointments": pending_appointments,
        "today_appointments": today_appointments
    }