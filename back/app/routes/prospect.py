from fastapi import APIRouter
from ..services.mail import service_send_email

upload = APIRouter()

@upload.get("/")