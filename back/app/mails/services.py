from ast import Dict
import google.generativeai as genai
import os
import json
import re

from sqlalchemy.orm import Session

from app.mails.queries import store_draft


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
Reemplaza Placeholders: Sustituye [Nombre de la Empresa] en todos los lugares donde aparece con el valor proporcionado eliminando referencias al tipo de empresa (S.A.S, Ltda, S.A).

Manejo del Nombre del Contacto: Si de Correo electrónico puedes obtener un nombre de persona, usalo como nombre del contacto : "Hola [Nombre del Contacto]."

Si del Correo electrónico NO se puede obtener el nombre de una persona, utiliza un saludo más genérico pero profesional. Opciones:
    - "Hola equipo de [Nombre de la Empresa],"
    - "Hola,"

O adapta el inicio de la primera frase: "Investigando sobre [Nombre de la Empresa], creo que podemos ayudarles a optimizar su flujo de caja." (Eliminando el saludo directo). Elige la opción que suene más natural en el contexto.

El Correo electrónico puede contener varios correos electrónicos separados por ; como por ejemplo factura.electronica.ff.co@geodis.com;sandra.sanchez@geodis.com en estos casos debes generar 2 correos, uno por cada correo

Consistencia: Asegúrate de que el resto del correo (propuesta de valor, llamado a la acción, firma) se mantenga intacto.
Devuelve la respuesta únicamente en formato JSON, en forma de array con los siguientes campos:
- subject: Asunto del correo
- body: Cuerpo del correo (sin el asunto)
- to: Correo electrónico del prospecto

Plantilla Base:
---
Asunto: ¿Quién en [Nombre de la Empresa] gestiona el flujo de caja?

Hola [Nombre]. He estado investigando sobre [Nombre de la Empresa] y creo que podemos ayudarte a optimizar tu flujo de caja.
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

Katherine Lopez
Gerente Comercial | Cobranti
www.cobranti.com | +57 321 8631488
---

Datos del Prospecto:
*   Nombre de la Empresa: {name}
*   Correo electrónico: {email}

Recuerda:
- Sustituye [Nombre de la Empresa] eliminando S.A.S, Ltda, S.A.
- Si el nombre del contacto no puede ser identificado, usa un saludo genérico profesional.
- Devuelve SOLO el JSON solicitado.
"""

def generate_cold_email_draft_service(name, email) -> list[dict]:
    # Prepara el prompt con los datos del prospecto
    prompt = PROMPT_TEMPLATE.format(
        name=name,
        email=email,
    )

    # Inicializa el modelo Gemini
    model = genai.GenerativeModel("gemini-2.0-flash")

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

def store_draft_service(db: Session, drafts: list[dict], suspect_id: int):
    result = store_draft(db, drafts, suspect_id)
    
    if(result is not None):
        return result
    
    return None
    