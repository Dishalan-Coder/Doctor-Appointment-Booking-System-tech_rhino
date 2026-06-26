"""Department controller with business logic."""
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.department import Department
from ..models.doctor import Doctor
from ..schemas.department_schema import DepartmentCreate, DepartmentUpdate, DepartmentResponse


def get_departments(db: Session, active_only: bool = True) -> list:
    """Get list of departments with doctor counts."""
    query = db.query(
        Department.id,
        Department.name,
        Department.description,
        Department.icon,
        Department.is_active,
        func.count(Doctor.id).label("doctor_count")
    ).outerjoin(Doctor, Department.id == Doctor.department_id).filter(
        Doctor.status == "Active"
    ).group_by(Department.id)

    if active_only:
        query = query.filter(Department.is_active == True)

    results = query.all()
    return [
        DepartmentResponse(
            id=r.id, name=r.name, description=r.description,
            icon=r.icon, is_active=r.is_active,
            doctor_count=r.doctor_count
        ).model_dump()
        for r in results
    ]


def get_department_by_id(db: Session, dept_id: int) -> dict:
    """Get single department with doctor count."""
    result = db.query(
        Department.id,
        Department.name,
        Department.description,
        Department.icon,
        Department.is_active,
        func.count(Doctor.id).label("doctor_count")
    ).outerjoin(Doctor, Department.id == Doctor.department_id).filter(
        Department.id == dept_id,
        Doctor.status == "Active"
    ).group_by(Department.id).first()

    if not result:
        return None
    return DepartmentResponse(
        id=result.id, name=result.name, description=result.description,
        icon=result.icon, is_active=result.is_active,
        doctor_count=result.doctor_count
    ).model_dump()


def create_department(data: DepartmentCreate, db: Session) -> dict:
    """Admin: create a new department."""
    dept = Department(**data.model_dump())
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return get_department_by_id(db, dept.id)


def update_department(dept_id: int, data: DepartmentUpdate, db: Session) -> dict:
    """Admin: update department details."""
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(dept, key, value)

    db.commit()
    db.refresh(dept)
    return get_department_by_id(db, dept_id)


def delete_department(dept_id: int, db: Session) -> bool:
    """Admin: soft-delete a department."""
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        return False
    dept.is_active = False
    db.commit()
    return True