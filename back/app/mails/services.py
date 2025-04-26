from ast import Dict
import google.generativeai as genai
import os
import json
import re

from sqlalchemy.orm import Session

from app.lib.mail import send_email
from app.mails.queries import (
    delete_draft,
    get_drafts,
    get_email_by_id,
    get_sent_mails,
    store_draft,
    update_email_status,
)
from app.schemas import SuspectBase


GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
print(GEMINI_API_KEY)
if GEMINI_API_KEY is None:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

# Genai init
genai.configure(api_key=GEMINI_API_KEY)

# Prompt base (el que definimos antes)
PROMPT_TEMPLATE = """
Eres un asistente experto en redacción de correos electrónicos de ventas (cold email) B2B.
Tu objetivo es personalizar un correo base utilizando la información proporcionada sobre un prospecto y su empresa,
manejando de forma inteligente los datos faltantes.

Personaliza la siguiente plantilla de correo electrónico utilizando los datos que te proporcionaré para cada prospecto.
Asegúrate de que el correo final suene natural y profesional.
Reemplaza Placeholders: Sustituye [Nombre de la Empresa] en todos los lugares donde aparece con el valor proporcionado eliminando referencias al tipo de empresa como: (S.A.S, Ltda, S.A).

Manejo del Nombre del Contacto: Analiza la parte del correo electrónico antes del '@'.
- Si esta parte parece ser un nombre de pila claro (ej. 'juan', 'maria') o sigue un formato común como nombre.apellido o nombre_apellido (ej. 'juan.perez', 'maria_gomez'), extrae SOLO el nombre de pila (capitalizando la primera letra) y úsalo en el saludo: "Hola [Nombre de Pila]."
- Si la parte antes del '@' es solo un apellido (ej. 'avelasco', 'gomez'), iniciales seguidas de apellido (ej. 'fgomez', 'j.perez'), iniciales solas (ej. 'jp'), un término genérico (ej. 'info', 'ventas', 'contacto', 'factura', 'facturacion', 'gerencia'), o cualquier otra cadena que no sea claramente identificable como un nombre de pila, NO intentes adivinar ni usar esa cadena. En estos casos, utiliza el saludo genérico: "Buen día, mi nombre es Katherine Lopez."

Ejemplos de Manejo de Nombre:
- Si el correo se ve como juan.perez@empresa.com, el saludo sería "Hola Juan."
- Si el correo se ve como maria@empresa.com, el saludo sería "Hola Maria."
- Si el correo se ve como fgomez@empresa.com, h.londono@empresa.com, info@empresa.com, gerencia@empresa.com o jp@empresa.com, el saludo será "Buen día, mi nombre es Katherine Lopez."

Manejo de Múltiples Correos: El Correo electrónico puede contener varios correos electrónicos separados por ';' como por ejemplo contacto.co@empresa.com;camila.rodriguez@empresa.com en estos casos debes generar un objeto JSON por cada correo electrónico válido encontrado, aplicando las reglas de personalización a cada uno. Ignora partes que no parezcan correos válidos si las hubiera.

Consistencia: Asegúrate de que el resto del correo (propuesta de valor, llamado a la acción, firma) se mantenga intacto en cada correo generado.
Devuelve la respuesta únicamente en formato JSON, en forma de array con los siguientes campos para cada correo generado:
- subject: Asunto del correo
- body: Cuerpo del correo (sin el asunto)
- to: Correo electrónico del prospecto individual

Plantilla Base:
---
Asunto: ¿Quién en [Nombre de la Empresa] gestiona el flujo de caja?

[Saludo Personalizado o Genérico]

Me pongo en contacto con ustedes porque he estado investigando sobre [Nombre de la Empresa] y quería compartir una solución ideal para empresas como la suya y creo que podemos ayudarle a optimizar su flujo de caja.
Pude ver que están creciendo, y con el crecimiento suelen surgir desafíos relacionados con la gestión del flujo de caja y la puntualidad en los pagos.

En Cobranti, ayudamos a empresas a optimizar su flujo de caja con herramientas como:

*   Predicción de impagos basada en el historial de pagos de los clientes.
*   Automatización de notificaciones inteligentes para mejorar la puntualidad en los pagos.
*   Un panel de control que ofrece visibilidad completa sobre el estado de la cartera.

Y todo esto por menos de 5 dólares por mes.

Nuestros clientes han logrado mejorar hasta en un 42% el pago de las facturas y reducir hasta en un 92% los costos de cobranza.
¿Podrías indicarme quién en [Nombre de la Empresa] sería la persona adecuada para hablar sobre este tema? Me encantaría compartir más información sobre cómo hemos ayudado a otras empresas a mejorar su flujo de caja y reducir costos de cobranza.
Si eres tú quien gestiona este tema, ¿te interesaría agendar una breve llamada esta semana para explorar cómo podemos ayudarte?
¡Espero poder conectar contigo pronto!

Saludos cordiales,

Katherine Lopez<br>
Gerente Comercial | Cobranti<br>
www.cobranti.com | +57 321 8631488
---

Datos del Prospecto:
*   Nombre de la Empresa: {name}
*   Correo electrónico: {email}

Recuerda:
- Sustituye [Nombre de la Empresa] eliminando S.A.S, Ltda, S.A.
- Aplica la lógica detallada para el saludo basado en el análisis del correo.
- Genera un objeto JSON por cada correo válido si hay múltiples separados por ';'.
- Devuelve SOLO el JSON solicitado en formato de array.
- Reemplaza [Saludo Personalizado o Genérico] en la plantilla con el saludo correcto según las reglas.
"""


def generate_cold_email_draft_service(name, email) -> list[dict]:
    # Prepara el prompt con los datos del prospecto
    prompt = PROMPT_TEMPLATE.format(
        name=name,
        email=email,
    )

    # Inicializa el modelo Gemini
    model = genai.GenerativeModel("gemini-2.5-flash-preview-04-17")

    # Realiza la petición
    response = model.generate_content(prompt)

    # Extrae el texto generado
    text = response.text.strip()
    json_text = extract_json(text)

    # Si la respuesta no es un JSON válido, puedes agregar validación aquí
    # Por simplicidad, asumimos que la respuesta es un JSON correcto

    try:
        result = json.loads(json_text)
    except json.JSONDecodeError:
        print("La respuesta no es un JSON válido:")
        print(json_text)
        return None

    return result


def extract_json(text):
    # Busca bloque entre ```json ... ```
    match = re.search(r"```json\s*([\s\S]+?)\s*```", text)
    if match:
        return match.group(1).strip()
    # Busca el primer array o diccionario en el texto
    match = re.search(r"(\[.*\]|\{.*\})", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    # Si no hay bloque, intenta devolver el texto tal cual
    return text.strip()


def store_draft_service(
    db: Session, drafts: list[dict], participant_id: int
) -> SuspectBase | None:
    result = store_draft(db, drafts, participant_id)

    if result is not None:
        return result

    return None


def delete_draft_service(db: Session, participant_id: int) -> bool:
    result = delete_draft(db, participant_id)

    if result:
        return True

    return False


def get_draft_service(db: Session, participant_id: int) -> list[dict] | None:
    drafts = get_drafts(db, participant_id)
    return drafts

def get_sent_service(db: Session, participant_id: int) -> list[dict] | None:
    sent_mails = get_sent_mails(db, participant_id)
    return sent_mails


def send_email_service(db: Session, mail_id: int) -> bool:
    email = get_email_by_id(db, mail_id)
    if not email:
        return False
    provider_id, status_code = send_email(
        email.to, email.subject, email.body, "klopez@hello.cobranti.com"
    )
    if not provider_id or status_code != 200:
        return False
    update_email_status(db, mail_id, "sent", provider_id)
    return True
