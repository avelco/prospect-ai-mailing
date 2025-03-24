from fastapi import APIRouter, UploadFile, File, HTTPException, status
import csv
from io import StringIO
import chardet
from app.conection import SessionLocal  # Importas la sesión desde tu módulo de base de datos
from app.models import Prospect        # Asumiendo que tienes el modelo en models.py

upload = APIRouter()

@upload.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...)):
    if file.content_type != 'text/csv':
        raise HTTPException(status_code=400, detail="Tipo de archivo inválido. Se espera un archivo CSV.")

    contents = await file.read()

    # Detectar la codificación del contenido
    detection = chardet.detect(contents)
    encoding = detection.get("encoding", "utf-8")
    try:
        csv_content = contents.decode(encoding)
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="No se pudo decodificar el archivo con la codificación detectada.")

    csv_reader = csv.DictReader(StringIO(csv_content))
    
    session = SessionLocal()
    try:
        for row in csv_reader:
            # Validación de campos obligatorios
            if not row.get("client_email"):
                raise HTTPException(status_code=400, detail="El campo 'client_email' es obligatorio en cada fila.")
            if not row.get("client_document_number"):
                raise HTTPException(status_code=400, detail="El campo 'client_document_number' es obligatorio en cada fila.")

            identification = row.get("client_document_number").strip()

            # Verificar si el prospecto ya existe en la base de datos
            existing_prospect = session.query(Prospect).filter(Prospect.identification == identification).first()
            if existing_prospect:
                # Si se encuentra duplicado, se lanza un error 409 Conflict
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"El prospecto con identificación {identification} ya existe."
                )

            full_name = f"{row.get('client_name', '').strip()} {row.get('client_surname', '').strip()}".strip()
            prospect = Prospect(
                email=row.get("client_email").strip(),
                name=full_name,
                phone=(row.get("client_phone", "").strip() or row.get("client_mobile", "").strip()),
                city=row.get("municipality_name", "").strip(),
                state=row.get("department_name", "").strip(),
                country=row.get("country_name", "").strip(),
                identification=identification,
                status="new"  # Se establece el estado en "new"
            )
            session.add(prospect)
        session.commit()
    except HTTPException as http_exc:
        session.rollback()
        raise http_exc
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Ocurrió un error: {str(e)}")
    finally:
        session.close()
    
    return {"message": "Archivo CSV procesado exitosamente"}
