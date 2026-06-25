from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_appointments():
    return {"message": "Appointment route working"}