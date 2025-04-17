from fastapi import APIRouter, HTTPException, status, File, UploadFile, Depends, Query
from ..services.ai import get_company_info
from sqlalchemy.orm import Session
from ..dependencies import get_db
from ..schemas import SuspectCreate
import math
from .services import (
    get_suspects_service,
    update_suspect_service,
    soft_delete_suspect_service,
    score_company_info,
    get_suspect_by_id_service,
    process_csv_upload_service
)

suspect = APIRouter()

@suspect.post("/suspects/upload-csv/")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db) ):
    return await process_csv_upload_service(file, db)

@suspect.get("/suspects")
async def get_suspects(
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    suspects, total = await get_suspects_service(db, limit=limit, offset=offset)
    pages = math.ceil(total / limit) if limit else 1
    current_page = (offset // limit) + 1 if limit else 1
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "pages": pages,
        "current_page": current_page,
        "suspects": suspects
    }

@suspect.put("/suspects/{suspect_id}")
async def update_suspect(suspect_id: int, suspect_update: SuspectCreate, db: Session = Depends(get_db)):
    updated_suspect = await update_suspect_service(db, suspect_id, suspect_update)
    if not updated_suspect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="suspect not found"
        )
    return updated_suspect

@suspect.delete("/suspects/{suspect_id}")
async def delete_suspect(suspect_id: int, db: Session = Depends(get_db)):
        deleted_suspect = await soft_delete_suspect_service(db, suspect_id)
        if not deleted_suspect:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="suspect not found"
            )
        return deleted_suspect
    
@suspect.get("/suspects/{suspect_id}/company-info")
async def get_suspect_company_info(suspect_id: str, db: Session = Depends(get_db)):
    try:
        suspect_data = await get_suspect_by_id_service(suspect_id)
        company_info = await get_company_info(suspect_data)
        score = await score_company_info(company_info)
        return {"company_info": company_info, "score": score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
