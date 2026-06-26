"""Doctor controller with business logic."""
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.doctor import Doctor
from ..models.department import Department
from ..models.appointment import Appointment
from ..schemas.doctor_schema import DoctorCreate, DoctorUpdate, DoctorResponse


def get_doctors(
    db: Session,
    department_id: int = None,
    search: str = None,
    status: str = None,
    skip: int = 0,
    limit: int = 20
) -> list:
    """Get filtered list of doctors."""
    query = db.query(Doctor, Department.name.label("department_name")).join(
        Department, Doctor.department_id == Department.id
    )

    if department_id:
        query = query.filter(Doctor.department_id == department_id)
    if search:
        query = query.filter(
            Doctor.name.ilike(f"%{search}%") |
            Doctor.specialization.ilike(f"%{search}%")
        )
    if status:
        query = query.filter(Doctor.status == status)
    else:
        # Public endpoint only shows active doctors
        query = query.filter(Doctor.status == "Active")

    results = query.offset(skip).limit(limit).all()
    return [
        DoctorResponse(
            id=d.id, name=d.name, email=d.email, phone=d.phone,
            department_id=d.department_id, specialization=d.specialization,
            qualification=d.qualification, experience_years=d.experience_years,
            bio=d.bio, available_days=d.available_days,
            available_from=str(d.available_from)[:5],
            available_to=str(d.available_to)[:5],
            status=d.status, department_name=dept_name
        ).model_dump()
        for d, dept_name in results
    ]


def get_doctor_by_id(db: Session, doctor_id: int) -> dict:
    """Get single doctor with department name."""
    result = db.query(Doctor, Department.name.label("department_name")).join(
        Department, Doctor.department_id == Department.id
    ).filter(Doctor.id == doctor_id).first()

    if not result:
        return None

    d, dept_name = result
    return DoctorResponse(
        id=d.id, name=d.name, email=d.email, phone=d.phone,
        department_id=d.department_id, specialization=d.specialization,
        qualification=d.qualification, experience_years=d.experience_years,
        bio=d.bio, available_days=d.available_days,
        available_from=str(d.available_from)[:5],
        available_to=str(d.available_to)[:5],
        status=d.status, department_name=dept_name
    ).model_dump()


def create_doctor(data: DoctorCreate, db: Session) -> dict:
    """Admin: create a new doctor."""
    doctor = Doctor(**data.model_dump())
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return get_doctor_by_id(db, doctor.id)


def update_doctor(doctor_id: int, data: DoctorUpdate, db: Session) -> dict:
    """Admin: update doctor details."""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(doctor, key, value)

    db.commit()
    db.refresh(doctor)
    return get_doctor_by_id(db, doctor_id)


def delete_doctor(doctor_id: int, db: Session) -> bool:
    """Admin: soft-delete a doctor by setting inactive."""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        return False
    doctor.status = "Inactive"
    db.commit()
    return True
