from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..config.db import get_db
from ..utils.auth import verify_patient_token, verify_admin_token, verify_doctor_token
from ..models.patient import Patient
from ..models.doctor import Doctor
from ..models.department import Department
from ..models.appointment import Appointment

security = HTTPBearer()


def get_current_patient(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Patient:
    """Extract and validate patient from JWT token."""
    payload = verify_patient_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    patient_id = int(payload["sub"])
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Patient not found"
        )
    return patient


def get_current_doctor(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Doctor:
    """Extract and validate doctor from JWT token."""
    payload = verify_doctor_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    doctor_id = int(payload["sub"])
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Doctor not found"
        )
    return doctor


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> dict:
    """Extract and validate admin from JWT token."""
    payload = verify_admin_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired admin token"
        )
    return {"id": int(payload["sub"]), "email": payload["email"]}