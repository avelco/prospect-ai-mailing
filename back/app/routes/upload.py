from fastapi import APIRouter

upload = APIRouter()

@upload.get("/upload")
def upload_file():
    return {"message": "¡Cargar!"}