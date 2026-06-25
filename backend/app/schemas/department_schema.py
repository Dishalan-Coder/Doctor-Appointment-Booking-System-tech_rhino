from pydantic import BaseModel
from typing import Optional

class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None