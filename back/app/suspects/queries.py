from requests import Session
from ..models import Suspect, Participant
from sqlalchemy import or_, exists
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy import update, func, select
from datetime import datetime, timezone
import logging

# Returns all non-deleted suspects
async def get_suspects_query(
    db, limit: int = 10, offset: int = 0, campaign_id: int = None
):
    # Subquery: does a participant exist for this suspect and campaign?
    participant_exists = (
        db.query(Participant.id)
        .filter(
            Participant.suspect_id == Suspect.id,
            Participant.campaign_id == campaign_id,
        )
        .exists()
    )

    base_query = db.query(Suspect).filter(
        or_(Suspect.deleted == False, Suspect.deleted.is_(None)),
        ~participant_exists  # Exclude suspects who are participants in this campaign
    )

    total = base_query.count()
    suspects = (
        base_query.offset(offset)
        .limit(limit)
        .all()
    )

    return suspects, total

# Returns a single non-deleted suspect by id
async def get_suspect_by_id_query(db, suspect_id: int) -> Optional[Suspect]:
    return db.query(Suspect).filter(
        Suspect.id == suspect_id,
        or_(Suspect.deleted == False, Suspect.deleted.is_(None))
    ).first()

# Updates a non-deleted suspect by id
async def update_suspect_query(db, suspect_id: int, update_data: dict) -> Optional[Suspect]:
    suspect = await get_suspect_by_id_query(db, suspect_id)
    if not suspect:
        return None
    for key, value in update_data.items():
        setattr(suspect, key, value)
    db.commit()
    db.refresh(suspect)
    return suspect

# Soft deletes a suspect by id
async def soft_delete_suspect_query(db, suspect_id: int) -> Optional[Suspect]:
    suspect = await get_suspect_by_id_query(db, suspect_id)
    if not suspect:
        return None
    suspect.deleted = True
    db.commit()
    db.refresh(suspect)
    return suspect

# Returns all suspects (regardless of deleted status)
async def get_all_suspects_query(db) -> List[Suspect]:
    return db.query(Suspect).all()

# Returns a suspect by id (regardless of deleted status)
async def get_any_suspect_by_id_query(db, suspect_id: int) -> Optional[Suspect]:
    return db.query(Suspect).filter(Suspect.id == suspect_id).first()

# Bulk create suspects from CSV rows
def bulk_create_suspects_from_rows(db: Session, suspect_rows, SuspectModel, SuspectCreateModel):
    """
    Performs a bulk insert of suspect rows using SQLAlchemy's bulk_insert_mappings.
    Assumes input rows have already been cleaned and filtered for duplicates
    both within the list and against existing database records.

    suspect_rows: list of dicts (parsed, cleaned, and filtered CSV rows)
    SuspectModel: SQLAlchemy model class
    SuspectCreateModel: Pydantic model class for validation/structure (optional usage here)
    """
    mappings_to_insert = []
    ids_in_this_batch = set() # Keep track of IDs added in this run

    for row in suspect_rows:
        # Prepare data mapping for the SuspectModel columns
        identification = row.get("client_document_number", "").strip()
        # Basic check, although primary validation should happen before this point
        if not identification or not row.get("client_email"): 
             logging.warning(f"Skipping row due to missing identification or email: {row}") # Or log warning
             continue
        
        # Prevent adding duplicates within this batch
        if identification in ids_in_this_batch:
            logging.warning(f"Skipping row with duplicate identification within this batch: {identification} - Row: {row}")
            continue

        full_name = f"{row.get('client_name', '').strip()} {row.get('client_surname', '').strip()}".strip()
        mapping = {
            "email": row.get("client_email", "").strip(),
            "name": full_name,
            "phone": (row.get("client_phone", "").strip() or row.get("client_mobile", "").strip()),
            "city": row.get("municipality_name", "").strip(),
            "state": row.get("department_name", "").strip(),
            "country": row.get("country_name", "").strip(),
            "identification": identification,
            "status": "new",
            "deleted": False,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }

        mappings_to_insert.append(mapping)
        ids_in_this_batch.add(identification) # Add ID to tracking set

    if not mappings_to_insert:
        logging.warning("No valid suspect rows to insert after mapping preparation.")
        return True # Or False, depending on desired behavior

    logging.info(f"Attempting bulk insert of {len(mappings_to_insert)} suspect mappings.")
    # logging.debug(f"Mappings for bulk insert: {mappings_to_insert}") # Optional: log all mappings

    try:
        db.bulk_insert_mappings(SuspectModel, mappings_to_insert)
        db.commit()
    except Exception as e:
        db.rollback() # Rollback in case of error during bulk insert
        # Log the specific error
        logging.error(f"Error during bulk insert: {e}", exc_info=True) # Log full traceback
        # Re-raise the original exception or a custom one
        raise Exception(f"Bulk insert failed: {e}") from e

    logging.info(f"Successfully inserted {len(mappings_to_insert)} suspects.")
    return True

async def get_suspect_by_id(db: Session, suspect_id: int) -> Optional[Suspect]:
    return db.query(Suspect).filter(
        Suspect.id == suspect_id,
        or_(Suspect.deleted == False, Suspect.deleted.is_(None))
    ).first()

def get_existing_identifications(db: Session, identification_numbers: List[str]) -> set[str]:
    """
    Queries the database to find which of the provided identification numbers
    already exist in the Suspect table.

    Args:
        db: The database session.
        identification_numbers: A list of identification strings to check.

    Returns:
        A set containing the identification numbers that already exist.
    """
    if not identification_numbers:
        return set()

    query = select(Suspect.identification).where(Suspect.identification.in_(identification_numbers))
    result = db.execute(query)
    existing_ids = {row[0] for row in result.scalars().all()}
    return existing_ids