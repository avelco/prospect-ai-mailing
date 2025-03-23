from fastapi import APIRouter
from ..services.mail import service_send_email

prospect = APIRouter()

@prospect.get("/prospects")
async def get_prospects():
    return {"message": "Hello World"}
