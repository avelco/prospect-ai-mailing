from fastapi import APIRouter, Depends, HTTPException
from requests import Session

from app.dependencies import get_db
from app.mails.services import (
    delete_draft_service, 
    generate_cold_email_draft_service, 
    get_draft_service, 
    store_draft_service, 
    send_email_service
)
from app.participants.queries import get_suspect_by_participant_id


mails = APIRouter()

@mails.post("/{participant_id}")
async def create_draft(participant_id: int, db: Session = Depends(get_db)):
    if not participant_id:
        raise HTTPException(status_code=400, detail="Participant ID is required")
    suspect = get_suspect_by_participant_id(db, participant_id)
    if suspect is None:
        raise HTTPException(status_code=404, detail="Participant not found")
    drafts = generate_cold_email_draft_service(suspect.name, suspect.email)
    store_draft_service(db, drafts, participant_id)
    return drafts

@mails.delete("/{participant_id}")
async def delete_draft(participant_id: int, db: Session = Depends(get_db)):
    if not participant_id:
        raise HTTPException(status_code=400, detail="Participant ID is required")
    delete_draft_service(db, participant_id)
    return {"message": "Draft deleted successfully"}

@mails.get("/{participant_id}")
async def get_drafts(participant_id: int, db: Session = Depends(get_db)):
    if not participant_id:
        raise HTTPException(status_code=400, detail="Participant ID is required")
    drafts = get_draft_service(db, participant_id)
    return drafts

@mails.post("/send/{mail_id}")
async def send_email(mail_id: int, db: Session = Depends(get_db)):
    if not mail_id:
        raise HTTPException(status_code=400, detail="Mail ID is required")
    return send_email_service(db, mail_id)
