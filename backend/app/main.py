"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import (
    auth_routes, patient_routes, doctor_routes,
    department_routes, appointment_routes, dashboard_routes
)

app = FastAPI(
    title="Doctor Appointment Booking System",
    description="A full-featured REST API for booking doctor appointments",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(auth_routes.router)
app.include_router(patient_routes.router)
app.include_router(doctor_routes.router)
app.include_router(department_routes.router)
app.include_router(appointment_routes.router)
app.include_router(dashboard_routes.router)


@app.get("/")
def root():
    return {"message": "Doctor Appointment Booking API is running", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}