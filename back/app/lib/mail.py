import os
from dotenv import load_dotenv
import requests
import markdown

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


def mailgun_send_email(
    to_email: str, subject: str, markdown_body: str, from_email: str
) -> str:
    """Send an email using the Mailgun email service after converting Markdown to HTML.

    Args:
        to_email (str): The recipient's email address.
        subject (str): The email subject line.
        markdown_body (str): The email body content in Markdown format.
        from_email (str): The sender's email address.

    Returns:
        tuple[str, int]: The Mailgun message ID and the HTTP status code.
                         Returns ("", status_code) if ID is not found.
    """

    html_body = markdown.markdown(markdown_body)

    response = requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": from_email,
            "to": [to_email],
            "h:Reply-To": "avelasco@cobranti.com",
            "subject": subject,
            "html": html_body,
        },
    )

    response.raise_for_status()

    response_data = response.json()
    message_id = response_data.get("id", "")
    status_code = response.status_code

    # Mailgun a veces devuelve un mensaje de éxito pero sin 'id' si hay problemas menores
    # o si el envío está en cola de una manera particular.
    # Considera el código 200 como éxito incluso si falta el ID.
    if status_code == 200:
        print(
            f"Email queued successfully to {to_email}. Status: {status_code}. Response: {response_data}"
        )

    return message_id, status_code


def send_email(to_email: str, subject: str, html: str, from_email: str) -> bool:
    return mailgun_send_email(to_email, subject, html, from_email)
