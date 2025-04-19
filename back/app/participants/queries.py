


from sqlalchemy.orm import Session
from app.models import Participant, Suspect, Campaign
from app.schemas import ParticipantCreate

def store_participant(db: Session, participant: ParticipantCreate):
    participant = Participant(**participant.model_dump())
    db.add(participant)
    db.commit()
    return participant
    
from sqlalchemy.orm import joinedload

def get_participants(
    db: Session, campaign_id: int = None, limit: int = 10, offset: int = 0
):
    base_query = db.query(Participant).options(joinedload(Participant.suspect)).filter(
        Participant.campaign_id == campaign_id
    )
    total = base_query.count()
    participants = base_query.offset(offset).limit(limit).all()
    return participants, total

def delete_participant(db: Session, participant_id: int):
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        return None
    db.delete(participant)
    db.commit()
    return participant

def get_product_id_from_campaign(db: Session, campaign_id: int):
    return db.query(Campaign).filter(Campaign.id == campaign_id).first().product_id

def get_suspect_by_participant_id(db: Session, participant_id: int):
    suspect_id = db.query(Participant).filter(Participant.id == participant_id).first().suspect_id
    return db.query(Suspect).filter(Suspect.id == suspect_id).first()
    