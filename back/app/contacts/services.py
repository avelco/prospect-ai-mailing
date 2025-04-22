



from sqlalchemy.orm import Session
from app.contacts.queries import get_contacts, store_contact
from app.schemas import ContactCreate


def store_contact_service(db: Session, contact: ContactCreate):
    return store_contact(db, contact)

def get_contacts_service(db: Session, prospect_id: int):
    return get_contacts(db, prospect_id)
    