from sqlalchemy.orm import Session
from app.models import Interaction, Participant, Suspect, Campaign, Email
from app.schemas import InteractionCreate, ParticipantCreate
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import exists, and_


def store_participant(db: Session, participant: ParticipantCreate):
    participant = Participant(**participant.model_dump())
    db.add(participant)
    db.commit()
    return participant


def get_participants(
    db: Session, campaign_id: int = None, limit: int = 10, offset: int = 0
):
    # Subquery: does a participant have any email in 'draft' or 'sent'?
    has_draft_or_sent_email = (
        db.query(Email.id)
        .filter(
            Email.participant_id == Participant.id,
            Email.status.in_(["draft", "sent"])
        )
        .exists()
    )

    # Exclude participants with such emails
    base_query = (
        db.query(Participant)
        .options(joinedload(Participant.suspect))
        .filter(Participant.campaign_id == campaign_id)
        .filter(~has_draft_or_sent_email)  # Negate the subquery
    )

    total = base_query.count()
    participants = base_query.offset(offset).limit(limit).all()

    return participants, total


def get_participants_with_drafts(
    db: Session, campaign_id: int = None, limit: int = 10, offset: int = 0
):
    # Subquery: does a participant have a 'draft' email?
    has_draft_email = (
        db.query(Email.id)
        .filter(Email.participant_id == Participant.id, Email.status == "draft")
        .exists()
    )

    # Only include participants with a draft email
    base_query = (
        db.query(Participant)
        .options(joinedload(Participant.suspect))
        .filter(Participant.campaign_id == campaign_id)
        .filter(has_draft_email)
    )

    total = base_query.count()
    participants = base_query.offset(offset).limit(limit).all()

    return participants, total

def get_participants_with_mail(
    db: Session, campaign_id: int = None, limit: int = 10, offset: int = 0
):
    # Subquery: does a participant have a 'sent' email?
    has_sent_email = (
        db.query(Email.id)
        .filter(
            Email.participant_id == Participant.id,
            Email.status == "sent"
        )
        .exists()
    )

    # Only include participants with at least one sent email and status 'nuevo'
    base_query = (
        db.query(Participant)
        .options(joinedload(Participant.suspect))
        .filter(Participant.campaign_id == campaign_id)
        .filter(Participant.status == "nuevo")
        .filter(has_sent_email)
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
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        return None
    return db.query(Suspect).filter(Suspect.id == participant.suspect_id).first()


def transform_participant_to_lead(db: Session, participant_id: int):
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        return None
    participant.status = "lead"
    db.commit()
    return participant


def get_leads(db: Session, campaign_id: int, limit: int = 10, offset: int = 0):
    participants = (
        db.query(Suspect)
        .join(Participant, Suspect.id == Participant.suspect_id)
        .filter(Participant.campaign_id == campaign_id, Participant.status == "lead")
        .offset(offset)
        .limit(limit)
        .all()
    )
    total = len(participants)
    return participants, total


def add_interaction(db: Session, participant_id: int, interaction: InteractionCreate):
    db.add(Interaction(participant_id=participant_id, **interaction.model_dump()))
    db.commit()
    return (
        db.query(Interaction)
        .filter(Interaction.participant_id == participant_id)
        .first()
    )


def get_interactions(db: Session, participant_id: int):
    return (
        db.query(Interaction).filter(Interaction.participant_id == participant_id).all()
    )


def get_participant_id(db: Session, suspect_id: int, campaign_id: int):
    return (
        db.query(Participant.id)
        .filter(Participant.campaign_id == campaign_id)
        .filter(Participant.suspect_id == suspect_id)
        .scalar()
    )