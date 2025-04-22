from sqlalchemy.orm import Session
from app.participants.queries import (
    delete_participant,
    get_leads,
    get_participants,
    store_participant,
    get_product_id_from_campaign,
    get_participants_with_drafts,
    get_participants_with_mail,
    transform_participant_to_lead
)
from app.schemas import ParticipantCreate


def store_participant_service(db: Session, participant: ParticipantCreate):
    participant.product_id = get_product_id_from_campaign(db, participant.campaign_id)
    return store_participant(db, participant)


def get_participants_service(
    db: Session, limit: int = 10, offset: int = 0, campaign_id: int = None
):
    return get_participants(db, campaign_id, limit, offset)

def get_participants_with_drafts_service(
    db: Session, limit: int = 10, offset: int = 0, campaign_id: int = None
):
    return get_participants_with_drafts(db, campaign_id, limit, offset)

def get_participants_with_mail_service(
    db: Session, limit: int = 10, offset: int = 0, campaign_id: int = None
):
    return get_participants_with_mail(db, campaign_id, limit, offset)

def delete_participant_service(db: Session, participant_id: int):
    return delete_participant(db, participant_id)

def transform_participant_to_lead_service(db: Session, participant_id: int):
    return transform_participant_to_lead(db, participant_id)

def get_leads_service(
    db: Session, limit: int = 10, offset: int = 0, campaign_id: int = None
):
    return get_leads(db, campaign_id, limit, offset)
    