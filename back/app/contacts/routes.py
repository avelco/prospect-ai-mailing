


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.contacts.services import get_contacts_service, store_contact_service
from app.dependencies import get_db
from app.schemas import ContactCreate


contacts = APIRouter()


@contacts.post("/")
async def store_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    return store_contact_service(db, contact)


@contacts.get("/{suspect_id}")
async def get_contacts(suspect_id: int, db: Session = Depends(get_db)):
    return get_contacts_service(db, suspect_id)
