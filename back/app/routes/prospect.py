from fastapi import APIRouter, HTTPException, status
from ..services.prospects import (
    get_prospects_service,
    update_prospect_service,
    soft_delete_prospect_service
)
from ..services.prospects import get_prospects_service, get_prospect_by_id_service
from ..services.ai import get_company_info
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
@prospect.get("/prospects/{prospect_id}/company-info")
async def get_prospect_company_info(prospect_id: str):
    try:
        prospect_data = await get_prospect_by_id_service(prospect_id)
        company_info = await get_company_info(prospect_data)
        return {"company_info": company_info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
