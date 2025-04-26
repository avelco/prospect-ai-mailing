from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.participants.services import (
    add_interaction_service,
    delete_participant_service,
    get_interactions_service,
    get_leads_service,
    get_participants_service,
    get_participants_with_drafts_service,
    store_participant_service,
    get_participants_with_mail_service,
    transform_participant_to_lead_service,
)
from app.schemas import InteractionCreate, ParticipantCreate, PaginatedParticipants
from ..dependencies import get_db
import math

participants = APIRouter()


@participants.post("")
async def store_participant(
    participant: ParticipantCreate, db: Session = Depends(get_db)
):
    return store_participant_service(db, participant)


@participants.get("/{campaign_id}/participants")
async def get_participants(
    campaign_id: int,
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    participants, total = get_participants_service(
        db, limit=limit, offset=offset, campaign_id=campaign_id
    )
    pages = math.ceil(total / limit) if limit else 1
    current_page = (offset // limit) + 1 if limit else 1
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "pages": pages,
        "current_page": current_page,
        "participants": participants,
    }


@participants.get("/{campaign_id}/drafts")
async def get_participants_with_drafts(
    campaign_id: int,
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    participants, total = get_participants_with_drafts_service(
        db, limit=limit, offset=offset, campaign_id=campaign_id
    )
    pages = math.ceil(total / limit) if limit else 1
    current_page = (offset // limit) + 1 if limit else 1
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "pages": pages,
        "current_page": current_page,
        "participants": participants,
    }


@participants.get("/{campaign_id}/mails")
async def get_participants_with_drafts(
    campaign_id: int,
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    participants, total = get_participants_with_mail_service(
        db, limit=limit, offset=offset, campaign_id=campaign_id
    )
    pages = math.ceil(total / limit) if limit else 1
    current_page = (offset // limit) + 1 if limit else 1
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "pages": pages,
        "current_page": current_page,
        "participants": participants,
    }


@participants.delete("/{participant_id}")
async def delete_participant(participant_id: int, db: Session = Depends(get_db)):
    return delete_participant_service(db, participant_id)

@participants.post("/{participant_id}/to-lead")
async def transform_participant_to_lead(participant_id: int, db: Session = Depends(get_db)):
    return transform_participant_to_lead_service(db, participant_id)
    
@participants.get("/{campaign_id}/leads")
async def get_leads(
    campaign_id: int,
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    leads, total = get_leads_service(
        db, limit=limit, offset=offset, campaign_id=campaign_id
    )
    pages = math.ceil(total / limit) if limit else 1
    current_page = (offset // limit) + 1 if limit else 1
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "pages": pages,
        "current_page": current_page,
        "leads": leads,
    }
    

@participants.post("/{suspect_id}/interactions/{campaign_id}")
async def add_interaction(suspect_id: int, interaction: InteractionCreate, campaign_id: int,  db: Session = Depends(get_db)):
    return add_interaction_service(db, suspect_id, campaign_id, interaction)

@participants.get("/{suspect_id}/interactions/{campaign_id}")
async def get_interactions(suspect_id: int, campaign_id: int, db: Session = Depends(get_db)):
    return get_interactions_service(db, suspect_id, campaign_id)