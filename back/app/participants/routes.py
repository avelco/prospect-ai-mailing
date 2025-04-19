from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.participants.services import delete_participant_service, get_participants_service, store_participant_service
from app.schemas import ParticipantCreate, PaginatedParticipants
from ..dependencies import get_db
import math

participants = APIRouter()

@participants.post("/")
async def store_participant(participant: ParticipantCreate, db: Session = Depends(get_db)):
    return store_participant_service(db, participant)

@participants.get("/{campaign_id}")
async def get_participants(    
    campaign_id: int,
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
):    
    participants, total = get_participants_service(db, limit=limit, offset=offset, campaign_id=campaign_id)
    pages = math.ceil(total / limit) if limit else 1
    current_page = (offset // limit) + 1 if limit else 1
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "pages": pages,
        "current_page": current_page,
        "participants": participants
    }


@participants.delete("/{participant_id}")
async def delete_participant(participant_id: int, db: Session = Depends(get_db)):
    return delete_participant_service(db, participant_id)
