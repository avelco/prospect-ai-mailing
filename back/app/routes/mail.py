from fastapi import APIRouter
from ..services.mail import service_send_email

upload = APIRouter()

@upload.get("/send-email")
def send_email(to_email: str, subject: str, html: str, from_email: str = "klopez@notify.cobranti.com"):
    """Send an email via HTTP GET request.

    Args:
        to_email (str): The recipient's email address
        subject (str): The email subject line
        html (str): The HTML content of the email
        from_email (str, optional): The sender's email address. Defaults to "klopez@notify.cobranti.com"

    Returns:
        dict: A dictionary containing the transaction ID of the sent email
              {"message": "transaction_id"}
    """
    transaction_id = service_send_email(to_email, subject, html, from_email)
    return {"message": transaction_id}