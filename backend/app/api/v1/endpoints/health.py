from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def home():
    return {"message": "Hello! My FastAPI project is working."}
