from ..models import Suspect, Participant
from sqlalchemy import or_, exists
from typing import Optional, List

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
async def bulk_create_suspects_from_rows(db, suspect_rows, SuspectModel, SuspectCreateModel):
    """
    suspect_rows: list of dicts (parsed CSV rows)
    SuspectModel: SQLAlchemy model class
    SuspectCreateModel: Pydantic model class
    """
    for row in suspect_rows:
        identification = row.get("client_document_number", "").strip()
        if not identification:
            raise ValueError("El campo 'client_document_number' es obligatorio en cada fila.")
        existing_suspect = db.query(SuspectModel).filter(SuspectModel.identification == identification).first()
        if existing_suspect:
            raise Exception(f"El suspecto con identificación {identification} ya existe.")
        full_name = f"{row.get('client_name', '').strip()} {row.get('client_surname', '').strip()}".strip()
        suspect_data = SuspectCreateModel(
            email=row.get("client_email", "").strip(),
            name=full_name,
            phone=(row.get("client_phone", "").strip() or row.get("client_mobile", "").strip()),
            city=row.get("municipality_name", "").strip(),
            state=row.get("department_name", "").strip(),
            country=row.get("country_name", "").strip(),
            identification=identification,
            status="new",
            deleted=False
        )
        suspect = SuspectModel(**suspect_data.model_dump())
        db.add(suspect)
    db.commit()
    return True
