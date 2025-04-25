from sqlalchemy.orm import Session
from app.participants.queries import (
    add_interaction,
    delete_participant,
    get_interactions,
    get_leads,
    get_participant_id,
    get_participants,
    store_participant,
    get_product_id_from_campaign,
    get_participants_with_drafts,
    get_participants_with_mail,
    transform_participant_to_lead,
)
from app.schemas import InteractionCreate, ParticipantCreate


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

def add_interaction_service(db: Session, suspect_id: int, campaign_id: int, interaction: InteractionCreate):
    participant_id = get_participant_id(db, suspect_id, campaign_id)
    if not participant_id:
        return None
    return add_interaction(db, participant_id, interaction)

def get_interactions_service(db: Session, suspect_id: int, campaign_id:int):
    participant_id = get_participant_id(db, suspect_id, campaign_id)
    if not participant_id:
        return None
    return get_interactions(db, participant_id)