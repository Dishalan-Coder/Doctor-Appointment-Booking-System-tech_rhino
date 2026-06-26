"""Department API routes."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..config.db import get_db
from ..schemas.department_schema import DepartmentCreate, DepartmentUpdate
from ..controllers.department_controller import (
    get_departments, get_department_by_id,
    create_department, update_department, delete_department
)
from ..utils.dependencies import get_current_admin

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.get("/")
def list_departments(db: Session = Depends(get_db)):
    return get_departments(db)


@router.get("/{dept_id}")
def get_department(dept_id: int, db: Session = Depends(get_db)):
    dept = get_department_by_id(db, dept_id)
    if not dept:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Department not found")
    return dept


@router.post("/")
def add_department(
    data: DepartmentCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    return create_department(data, db)


@router.put("/{dept_id}")
def edit_department(
    dept_id: int,
    data: DepartmentUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    dept = update_department(dept_id, data, db)
    if not dept:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Department not found")
    return dept


@router.delete("/{dept_id}")
def remove_department(
    dept_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    success = delete_department(dept_id, db)
    if not success:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Department not found")
    return {"message": "Department deactivated successfully"}