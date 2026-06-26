from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.config.db import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    specialization = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    schedule = Column(String(100), nullable=True)

    department_id = Column(Integer, ForeignKey("departments.id"))

    department = relationship("Department")