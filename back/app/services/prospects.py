from ..models import Prospect, ProspectUpdate
from ..conection import SessionLocal
from typing import List, Optional
from sqlalchemy import or_

<<<<<<< HEAD
async def get_prospects_service(db: SessionLocal) -> List[Prospect]:
    """
    Recupera todos los prospectos que no hayan sido eliminados (soft delete).
    """
    prospects = db.query(Prospect).filter(
        or_(
            Prospect.deleted == False,
            Prospect.deleted.is_(None)
        )
    ).all()
    return prospects

async def update_prospect_service(db: SessionLocal, prospect_id: int, prospect_update: ProspectUpdate) -> Optional[Prospect]:
    """
    Actualiza los campos enviados de un prospecto.
    Se realiza una actualización parcial usando los campos enviados en prospect_update.
    """
    prospect = db.query(Prospect).filter(
        Prospect.id == prospect_id,
        or_(
            Prospect.deleted == False,
            Prospect.deleted.is_(None)
        )
    ).first()
    if not prospect:
        return None
    
    update_data = prospect_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(prospect, key, value)
    db.commit()
    db.refresh(prospect)
    return prospect

async def soft_delete_prospect_service(db: SessionLocal, prospect_id: int) -> Optional[Prospect]:
    """
    Realiza un soft delete marcando el prospecto como eliminado.
    """
    prospect = db.query(Prospect).filter(
        Prospect.id == prospect_id,
        or_(
            Prospect.deleted == False,
            Prospect.deleted.is_(None)
        )
    ).first()
    if not prospect:
        return None

    prospect.deleted = True
    db.commit()
    db.refresh(prospect)
    return prospect
=======
async def get_prospects_service():
    db = SessionLocal()
    prospects = db.query(Prospect).all()
    return prospects

async def get_prospect_by_id_service(prospect_id: str):
    db = SessionLocal()
    prospect = db.query(Prospect).filter(Prospect.id == prospect_id).first()
    
    if not prospect:
        raise HTTPException(status_code=404, detail="Prospect not found")
    
    db.close()
    
    prospect_data = {
        "email": prospect.email,
        "name": prospect.name,
        "phone": prospect.phone,
        "city": prospect.city,
        "state": prospect.state,
        "country": prospect.country,
        "identification": prospect.identification
    }
    
    return prospect_data
>>>>>>> 115e2c9 (IA feature progress for searching companies info)
