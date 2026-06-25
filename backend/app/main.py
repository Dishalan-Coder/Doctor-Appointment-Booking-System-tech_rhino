from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.db import Base, engine


from app.models.patient import Patient
from app.models.department import Department
from app.models.doctor import Doctor
from app.models.appointment import Appointment


from app.routes.auth_routes import router as auth_router
from app.routes.patient_routes import router as patient_router
from app.routes.department_routes import router as department_router
from app.routes.doctor_routes import router as doctor_router
from app.routes.appointment_routes import router as appointment_router
from app.routes.dashboard_routes import router as dashboard_router

app = FastAPI(title="Doctor Appointment Booking API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(patient_router, prefix="/api/patients", tags=["Patients"])
app.include_router(department_router, prefix="/api/departments", tags=["Departments"])
app.include_router(doctor_router, prefix="/api/doctors", tags=["Doctors"])
app.include_router(appointment_router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get("/")
def root():
    return {"message": "Doctor Appointment Booking Backend Running"}