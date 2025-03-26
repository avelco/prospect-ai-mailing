from fastapi import APIRouter, HTTPException, status
from ..services.prospects import (
    get_prospects_service,
    update_prospect_service,
    soft_delete_prospect_service
)
from ..conection import SessionLocal
from ..models import ProspectUpdate

prospect = APIRouter()

@prospect.get("/prospects")
async def get_prospects():
    db = SessionLocal()
    try:
        # Se pasa la sesión de la base de datos a la función del servicio
        prospects = await get_prospects_service(db)
        return {"prospects": prospects}
    finally:
        db.close()

@prospect.put("/prospects/{prospect_id}")
async def update_prospect(prospect_id: int, prospect_update: ProspectUpdate):
    db = SessionLocal()
    try:
        updated_prospect = await update_prospect_service(db, prospect_id, prospect_update)
        if not updated_prospect:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Prospect not found"
            )
        return updated_prospect
    finally:
        db.close()

@prospect.delete("/prospects/{prospect_id}")
async def delete_prospect(prospect_id: int):
    db = SessionLocal()
    try:
        deleted_prospect = await soft_delete_prospect_service(db, prospect_id)
        if not deleted_prospect:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Prospect not found"
            )
        return deleted_prospect
    finally:
        db.close()
