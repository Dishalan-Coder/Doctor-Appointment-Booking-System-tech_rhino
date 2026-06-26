from pydantic import BaseModel
from typing import Optional


class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = "stethoscope"


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None


class DepartmentResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = True
    doctor_count: Optional[int] = 0

    class Config:
        from_attributes = True