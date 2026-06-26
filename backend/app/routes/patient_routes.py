"""Patient API routes."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..config.db import get_db
from ..schemas.patient_schema import PatientUpdate
from ..models.patient import Patient
from ..utils.dependencies import get_current_patient
from ..controllers.patient_controller import get_patient_profile, update_patient_profile, get_all_patients
from ..utils.dependencies import get_current_admin

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.get("/me")
def my_profile(patient: Patient = Depends(get_current_patient)):
    return get_patient_profile(patient)


@router.put("/me")
def update_profile(
    data: PatientUpdate,
    patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    return update_patient_profile(patient, data, db)


@router.get("/")
def list_patients(
    skip: int = 0,
    limit: int = 20,
    search: str = None,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    return get_all_patients(db, skip, limit, search)