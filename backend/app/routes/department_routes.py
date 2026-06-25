from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_departments():
    return {"message": "Department route working"}