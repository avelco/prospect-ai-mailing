from app.models import Contact
from sqlalchemy.orm import Session
from app.schemas import ContactCreate


def store_contact(db: Session, contact: ContactCreate):
    contact_obj = Contact(**contact.model_dump())
    db.add(contact_obj)
    db.commit()
    db.refresh(contact_obj)
    return contact_obj


def get_contacts(db: Session, prospect_id: int):
    return db.query(Contact).filter(Contact.suspect_id == prospect_id).all()