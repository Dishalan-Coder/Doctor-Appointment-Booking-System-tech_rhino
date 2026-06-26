#Patient controller with business logic.
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.patient import Patient
from ..models.appointment import Appointment
from ..schemas.patient_schema import PatientUpdate, PatientResponse, PatientListResponse


def get_patient_profile(patient: Patient) -> dict:
    # Return the current patient's profile.
    return PatientResponse.model_validate(patient).model_dump()


def update_patient_profile(patient: Patient, data: PatientUpdate, db: Session) -> dict:
    # Update patient profile fields.
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(patient, key, value)
    db.commit()
    db.refresh(patient)
    return PatientResponse.model_validate(patient).model_dump()


def get_all_patients(db: Session, skip: int = 0, limit: int = 20, search: str = None) -> list:
    # Admin: get paginated list of patients with appointment counts.
    query = db.query(
        Patient.id,
        Patient.name,
        Patient.email,
        Patient.phone,
        Patient.gender,
        func.count(Appointment.id).label("appointment_count")
    ).outerjoin(Appointment, Patient.id == Appointment.patient_id)

    if search:
        query = query.filter(
            Patient.name.ilike(f"%{search}%") |
            Patient.email.ilike(f"%{search}%")
        )

    results = query.group_by(Patient.id).offset(skip).limit(limit).all()
    return [
        PatientListResponse(
            id=r.id, name=r.name, email=r.email,
            phone=r.phone, gender=r.gender,
            appointment_count=r.appointment_count
        ).model_dump()
        for r in results
    ]
