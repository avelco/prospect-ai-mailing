import os
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
load_dotenv()
print("Current Working Directory:", os.getcwd())
print(".env exists:", os.path.isfile(".env"))

MAILGUN_API_KEY = os.environ.get("MAILGUN_API_KEY")
MAILGUN_DOMAIN = os.environ.get("MAILGUN_DOMAIN")

if not MAILGUN_API_KEY:
    raise ValueError("MAILGUN_API_KEY not found in .env file")
if not MAILGUN_DOMAIN:
    raise ValueError("MAILGUN_DOMAIN not found in .env file")


def service_send_email(to_email: str, subject: str, html: str, from_email: str) -> str:
    """Send an email using the Mailgun email service.

    Args:
        to_email (str): The recipient's email address
        subject (str): The email subject line
        html (str): The HTML content of the email
        from_email (str): The sender's email address

    Returns:
        str: The Mailgun message ID of the sent email
    """
    response = requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": from_email,
            "to": [to_email],
            "subject": subject,
            "html": html,
        },
    )
    response.raise_for_status()
    return response.json().get("id", "")