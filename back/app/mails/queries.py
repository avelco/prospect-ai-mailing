
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
    drafts = db.query(Email).filter(Email.participant_id == participant_id).all()
    return drafts
    