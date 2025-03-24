from fastapi import APIRouter
from ..services.prospects import get_prospects_service
from ..conection import SessionLocal

prospect = APIRouter()

@prospect.get("/prospects")
async def get_prospects():
    db = SessionLocal()
    try:
        prospects = await get_prospects_service()
        return {"prospects": prospects}
    finally:
        db.close()