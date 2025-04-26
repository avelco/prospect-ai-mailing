from ..schemas import SuspectCreate
from ..models import Suspect
from typing import List, Optional
from typing import Dict, Any
import csv
import math
from sqlalchemy.orm import Session
from io import StringIO
import chardet
from fastapi import HTTPException, status, UploadFile
from .queries import (
    get_suspect_by_id,
    get_suspects_query,
    update_suspect_query,
    soft_delete_suspect_query,
    get_any_suspect_by_id_query,
    bulk_create_suspects_from_rows,
    get_existing_identifications
)
import logging

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

async def get_suspects_service(db: Session, limit: int = 10, offset: int = 0, campaign_id: int = None) -> List[Suspect]:
    """
    Recupera todos los suspectos que no hayan sido eliminados (soft delete).
    """
    return await get_suspects_query(db, limit=limit, offset=offset, campaign_id=campaign_id)

async def update_suspect_service(db: Session, suspect_id: int, suspect_update) -> Optional[Suspect]:
    """
    Actualiza los campos enviados de un suspecto.
    Se realiza una actualización parcial usando los campos enviados en suspect_update.
    """
    update_data = suspect_update.dict(exclude_unset=True)
    return await update_suspect_query(db, suspect_id, update_data)

async def soft_delete_suspect_service(db: Session, suspect_id: int) -> Optional[Suspect]:
    """
    Realiza un soft delete marcando el suspecto como eliminado.
    """
    return await soft_delete_suspect_query(db, suspect_id)

async def get_suspect_by_id_service(suspect_id: int):
    db = Session()
    suspect = await get_any_suspect_by_id_query(db, suspect_id)
    if not suspect:
        db.close()
        raise HTTPException(status_code=404, detail="Suspect not found")
    suspect_data = {
        "email": suspect.email,
        "name": suspect.name,
        "phone": suspect.phone,
        "city": suspect.city,
        "state": suspect.state,
        "country": suspect.country,
        "identification": suspect.identification
    }
    db.close()
    return suspect_data

async def score_company_info(company_data: Dict[str, Any]) -> int:
    """
    Scores the completeness of company information based on outreach needs.

    Scores range from 1 (very little info) to 5 (very complete info).

    Args:
        company_data (Dict[str, Any]): The JSON data returned by get_company_info.
                                       Expected structure: {"company_info": {...}}

    Returns:
        int: A score from 1 to 5.
    """
    if not company_data or "company_info" not in company_data:
        return 1 # No data or incorrect structure

    info = company_data.get("company_info", {})
    if not info:
        return 1 # Empty info block

    score_points = 0.0
    max_points = 5.0 # Corresponds to a score of 5

    # 1. Company Name (Essential) - Max 1 point
    if info.get("name") and isinstance(info.get("name"), str) and info["name"].strip():
        score_points += 1.0

    # 2. Size and Sector (Context) - Max 0.5 points each (Total 1 point)
    if info.get("size") and info["size"] != "Desconocido":
        score_points += 0.5
    if info.get("sector") and isinstance(info.get("sector"), str) and info["sector"].strip():
        score_points += 0.5

    # 3. Contacts (Crucial for Outreach) - Max 2.5 points
    best_contact_score = 0.0
    contacts = info.get("contacts", [])
    if isinstance(contacts, list) and contacts:
        for contact in contacts:
            contact_score = 0.0
            has_email = contact.get("email") and isinstance(contact.get("email"), str) and contact["email"].strip()
            has_name = contact.get("name") and isinstance(contact.get("name"), str) and contact["name"].strip()
            has_role = contact.get("role") and isinstance(contact.get("role"), str) and contact["role"].strip()

            if has_email:
                contact_score += 1.0 # Base point for any email
                if has_name:
                    contact_score += 1.0 # Additional point for having a name
                    if has_role:
                        contact_score += 0.5 # Bonus for having a role

            best_contact_score = max(best_contact_score, contact_score)

    score_points += best_contact_score

    # 4. Possible Collection Need (High Value Indicator) - Max 0.5 points
    collection_needs = info.get("possible_collection_need", [])
    if isinstance(collection_needs, list) and collection_needs:
        # Check if there's actual content, not just empty objects
        if any(need.get("source") or need.get("description") for need in collection_needs):
             score_points += 0.5

    # Normalize points to a 1-5 score
    # Ensure score is at least 1
    final_score = max(1, math.ceil(score_points))

    # Cap the score at 5
    final_score = min(5, final_score)

    return final_score

async def process_csv_upload_service(file: UploadFile, db: Session):
    if file.content_type != 'text/csv':
        raise HTTPException(status_code=400, detail="Tipo de archivo inválido. Se espera un archivo CSV.")

    contents = await file.read()

    # Detect encoding
    detection = chardet.detect(contents)
    encoding = detection.get("encoding", "utf-8")
    try:
        csv_content = contents.decode(encoding)
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="No se pudo decodificar el archivo con la codificación detectada.")

    csv_reader = csv.DictReader(StringIO(csv_content))
    rows = list(csv_reader)

    # Validate required fields before cleaning/DB
    for row in rows:
        if not row.get("client_email"):
            raise HTTPException(status_code=400, detail="El campo 'client_email' es obligatorio en cada fila.")
        if not row.get("client_document_number"):
            raise HTTPException(status_code=400, detail="El campo 'client_document_number' es obligatorio en cada fila.")

    # Clean rows: merge duplicates based on client_document_number
    cleaned_rows = await clean_csv_rows(rows)
    logging.info(f"Cleaned {len(cleaned_rows)} rows from CSV.")

    # Check which identifications already exist in the database
    rows_to_insert = []
    if cleaned_rows:
        ids_to_check = [row['client_document_number'] for row in cleaned_rows]
        logging.info(f"Checking existence for {len(ids_to_check)} identification numbers.")
        # logging.debug(f"IDs to check: {ids_to_check}") # Optional: log all IDs if needed for debug

        # Call synchronous query function without await
        existing_ids = get_existing_identifications(db, ids_to_check)
        logging.info(f"Found {len(existing_ids)} existing identification numbers in DB.")
        # logging.debug(f"Existing IDs: {existing_ids}") # Optional: log all existing IDs
        
        # Filter out rows with existing identifications
        rows_to_insert = [row for row in cleaned_rows if row['client_document_number'] not in existing_ids]
        logging.info(f"Prepared {len(rows_to_insert)} new rows for insertion.")
        # logging.debug(f"Rows to insert: {rows_to_insert}") # Optional: log all rows

    else:
        logging.info("No rows after cleaning, skipping DB check and insertion.")
        rows_to_insert = []
    
    if not rows_to_insert:
        logging.info("No new suspects to add after filtering against DB.")
        return {"message": "Archivo CSV procesado. No se encontraron nuevos suspectos para agregar."}

    try:
        # Use filtered rows for bulk creation
        # Call synchronous query function without await
        bulk_create_suspects_from_rows(db, rows_to_insert, Suspect, SuspectCreate)
    except Exception as e:
        # Map known error types to HTTPException
        import re
        exists_match = re.search(r"identificación (\d+).*ya existe", str(e))
        if exists_match:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
        raise HTTPException(status_code=500, detail=f"Ocurrió un error: {str(e)}")
    return {"message": "Archivo CSV procesado exitosamente"}

async def clean_csv_rows(rows: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """
    Cleans CSV rows by merging entries with duplicate client_document_number.
    Emails for duplicate documents are merged, separated by semicolons.
    Whitespace is stripped from client_document_number before processing.
    """
    processed_rows = {}
    for row in rows:
        # Strip whitespace immediately to ensure consistent key usage
        doc_number = row.get("client_document_number", "").strip()
        email = row.get("client_email") # Email is already stripped in bulk_create mapping

        # Ensure essential, stripped data is present
        if not doc_number or not email: 
            continue

        # Update the row's document number to the stripped version for consistency downstream
        row["client_document_number"] = doc_number 

        if doc_number in processed_rows:
            # Merge emails if the document number exists
            existing_emails = set(processed_rows[doc_number]['client_email'].split(';'))
            if email not in existing_emails:
                existing_emails.add(email)
                processed_rows[doc_number]['client_email'] = ';'.join(sorted(list(existing_emails)))
            # Optionally merge/update other fields here if needed
        else:
            # Add new document number entry
            processed_rows[doc_number] = row.copy() # Use copy to avoid modifying original row dicts

    return list(processed_rows.values())

async def get_suspect_by_id_service(db: Session, suspect_id: int):
    suspect = await get_suspect_by_id(db, suspect_id)
    return suspect