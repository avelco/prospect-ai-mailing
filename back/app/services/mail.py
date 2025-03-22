import os
from dotenv import load_dotenv
import resend

load_dotenv()
print("Current Working Directory:", os.getcwd())
print(".env exists:", os.path.isfile(".env"))
if not os.environ.get("RESEND_API_KEY"):
    raise ValueError("RESEND_API_KEY not found in .env file")

resend.api_key = os.environ.get("RESEND_API_KEY")


def service_send_email(to_email: str, subject: str, html: str, from_email: str):
    """Send an email using the Resend email service.

    Args:
        to_email (str): The recipient's email address
        subject (str): The email subject line
        html (str): The HTML content of the email
        from_email (str): The sender's email address

    Returns:
        str: The unique identifier of the sent email
    """
    params: resend.Emails.SendParams = {
    "from": from_email,
    "to": [to_email],
    "subject": subject,
    "html": html,
    }
    return resend.Emails.send(params)["id"]

