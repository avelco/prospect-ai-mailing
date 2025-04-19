
from ..models import Email

from sqlalchemy.orm import Session


def store_draft(db: Session, drafts: list[dict], suspect_id: int):
    for draft in drafts:
        draft['status'] = "draft"
        draft['suspect_id'] = suspect_id
        draft['user_id'] = 1
        db.add(Email(**draft))
        db.commit()
    return drafts