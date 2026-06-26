#Authentication controller with business logic.
from sqlalchemy.orm import Session
from ..models.patient import Patient
from ..models.doctor import Doctor
from ..schemas.patient_schema import PatientRegister, PatientResponse
from ..schemas.doctor_schema import DoctorRegister, DoctorLogin, DoctorResponse
from ..utils.helpers import hash_password, verify_password
from ..utils.auth import create_patient_token, create_admin_token, create_doctor_token
from ..config.settings import get_settings
from fastapi import HTTPException, status


def register_patient(data: PatientRegister, db: Session) -> dict:
    # Register a new patient account.
    existing = db.query(Patient).filter(Patient.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    patient = Patient(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        phone=data.phone,
        gender=data.gender,
        date_of_birth=data.date_of_birth
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)

    token = create_patient_token(patient.id, patient.email)
    return {
        "token": token,
        "patient": PatientResponse.model_validate(patient).model_dump()
    }


def login_patient(email: str, password: str, db: Session) -> dict:
    # Authenticate a patient and return token.
    patient = db.query(Patient).filter(Patient.email == email).first()
    if not patient or not verify_password(password, patient.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_patient_token(patient.id, patient.email)
    return {
        "token": token,
        "patient": PatientResponse.model_validate(patient).model_dump()
    }


def login_admin(email: str, password: str, db: Session) -> dict:
    # Authenticate admin using credentials from settings
    settings = get_settings()
    if email != settings.ADMIN_EMAIL or password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )

    token = create_admin_token(1, email)
    return {
        "token": token,
        "admin": {"id": 1, "name": "Admin User", "email": email}
    }


def register_doctor(data: DoctorRegister, db: Session) -> dict:
    # Register a new doctor account.
    existing = db.query(Doctor).filter(Doctor.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    doctor = Doctor(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        phone=data.phone,
        department_id=data.department_id,
        specialization=data.specialization,
        qualification=data.qualification,
        experience_years=data.experience_years,
        bio=data.bio
    )
    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    token = create_doctor_token(doctor.id, doctor.email)
    return {
        "token": token,
        "doctor": DoctorResponse.model_validate(doctor).model_dump()
    }


def login_doctor(email: str, password: str, db: Session) -> dict:
    # Authenticate a doctor and return token.
    doctor = db.query(Doctor).filter(Doctor.email == email).first()
    if not doctor or not verify_password(password, doctor.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_doctor_token(doctor.id, doctor.email)
    return {
        "token": token,
        "doctor": DoctorResponse.model_validate(doctor).model_dump()
    }