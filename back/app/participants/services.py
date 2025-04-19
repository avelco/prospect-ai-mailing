from sqlalchemy.orm import Session
from app.participants.queries import delete_participant, get_participants, store_participant, get_product_id_from_campaign
from app.schemas import ParticipantCreate


def store_participant_service(db: Session, participant: ParticipantCreate):
    participant.product_id = get_product_id_from_campaign(db, participant.campaign_id)
    return store_participant(db, participant)


def get_participants_service(db: Session, limit: int = 10, offset: int = 0, campaign_id: int = None):
    return get_participants(db, campaign_id, limit, offset)
    
def delete_participant_service(db: Session, participant_id: int):
    return delete_participant(db, participant_id)
    