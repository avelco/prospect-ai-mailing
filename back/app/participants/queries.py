from sqlalchemy.orm import Session
from app.models import Participant, Suspect, Campaign, Email
from app.schemas import ParticipantCreate
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
    # Subquery to check if a participant has a 'draft' email
    has_draft_email = (
        db.query(Email.id)
        .filter(Email.participant_id == Participant.id, Email.status == "draft")
        .exists()
    )

    # Add the 'has_email' column to the query
    base_query = (
        db.query(Participant, has_draft_email.label("has_email"))
        .options(joinedload(Participant.suspect))
        .filter(Participant.campaign_id == campaign_id)
    )

    total = base_query.count()
    participants = base_query.offset(offset).limit(limit).all()

    # Attach 'has_email' as an attribute to each participant
    for participant, has_email in participants:
        setattr(participant, "has_email", has_email)

    # Return only the participant objects (now with 'has_email' attribute)
    return [participant for participant, _ in participants], total


def get_participants_with_drafts(
    db: Session, campaign_id: int = None, limit: int = 10, offset: int = 0
):
    # Subquery to check if a participant has a 'draft' email
    has_draft_email = (
        db.query(Email.id)
        .filter(Email.participant_id == Participant.id, Email.status == "draft")
        .exists()
    )

    # Add the 'has_email' column to the query
    base_query = (
        db.query(Participant, has_draft_email.label("has_email"))
        .options(joinedload(Participant.suspect))
        .filter(Participant.campaign_id == campaign_id)
    )

    total = base_query.count()
    participants = base_query.offset(offset).limit(limit).all()

    # Attach 'has_email' as an attribute to each participant
    for participant, has_email in participants:
        setattr(participant, "has_email", has_email)

    # Return only the participant objects (now with 'has_email' attribute)
    return [participant for participant, _ in participants], total


def get_participants_with_mail(
    db: Session, campaign_id: int = None, limit: int = 10, offset: int = 0
):
    # Subquery to check if a participant has a 'mail' email
    has_email = (
        db.query(Email.id)
        .join(Participant, Email.participant_id == Participant.id)
        .filter(
            Email.participant_id == Participant.id,
            Email.status == "sent",
            Participant.status == "nuevo",
        )
        .exists()
    )

    # Add the 'has_email' column to the query
    base_query = (
        db.query(Participant, has_email.label("has_email"))
        .options(joinedload(Participant.suspect))
        .filter(Participant.campaign_id == campaign_id)
        .filter(has_email)  # Only include participants who have at least one sent email
    )

    total = base_query.count()
    participants = base_query.offset(offset).limit(limit).all()

    # Attach 'has_email' as an attribute to each participant
    for participant, has_email in participants:
        setattr(participant, "has_email", has_email)

    # Return only the participant objects (now with 'has_email' attribute)
    return [participant for participant, _ in participants], total


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
