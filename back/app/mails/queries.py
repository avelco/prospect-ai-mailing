
from ..models import Email

from sqlalchemy.orm import Session


def store_draft(db: Session, drafts: list[dict], participant_id: int):
    for draft in drafts:
        draft['status'] = "draft"
        draft['participant_id'] = participant_id
        draft['user_id'] = 1
        db.add(Email(**draft))
        db.commit()
    return drafts


def delete_draft(db: Session, participant_id: int):
    drafts = db.query(Email).filter(Email.participant_id == participant_id).all()
    for draft in drafts:
        db.delete(draft)
    db.commit()
    return True

def get_drafts(db: Session, participant_id: int) -> list[dict]:
    drafts = db.query(Email).filter(Email.participant_id == participant_id, Email.status == 'draft').all()
    return drafts

def get_sent_mails(db: Session, participant_id: int) -> list[dict]:
    sent_mails = db.query(Email).filter(Email.participant_id == participant_id, Email.status == 'sent').all()
    return sent_mails

def get_email_by_id(db: Session, mail_id: int) -> Email | None:
    return db.query(Email).filter(Email.id == mail_id).first()

def update_email_status(db: Session, mail_id: int, status: str, provider_id: str):
    email = db.query(Email).filter(Email.id == mail_id).first()
    if not email:
        return False
    email.status = status
    email.provider_id = provider_id
    db.commit()
    return True
    