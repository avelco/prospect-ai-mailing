from fastapi import APIRouter, Depends
from requests import Session

from app.dependencies import get_db
from app.mails.services import generate_cold_email_draft_service, store_draft_service
from app.participants.queries import get_suspect_by_participant_id


mails = APIRouter()

@mails.post("/{participant_id}")
async def create_draft(participant_id: int, db: Session = Depends(get_db)):
    if not participant_id:
        raise HTTPException(status_code=400, detail="Participant ID is required")
    suspect = get_suspect_by_participant_id(db, participant_id)
    if not suspect:
        raise HTTPException(status_code=404, detail="Participant not found")
    drafts = generate_cold_email_draft_service(suspect.name, suspect.email)
    store_draft_service(db, drafts, suspect.id)
    return drafts