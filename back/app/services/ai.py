import os
from google import genai
from dotenv import load_dotenv
from typing import Dict, Optional
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch

load_dotenv()

client = genai.Client(api_key=os.environ.get("OPENAPI_API_KEY"))
google_search_tool = Tool(
    google_search = GoogleSearch()
)

async def get_company_info(prospect: Dict) -> Optional[Dict]:
    """Obtiene información de una empresa en Colombia usando AI.
    
    Parámetros:
        prospect (Dict): Diccionario con los datos de la empresa a buscar. Debe contener:
            - email
            - name
            - phone
            - city
            - state
            - country
            - identification
    
    Retorna:
        Dict: Información estructurada en JSON con los datos de la empresa.
    """
    if not isinstance(prospect, dict) or not any(prospect.values()):
        print("❌ Error: Se requiere al menos un dato (name, domain o phone) para la búsqueda.")
        return None

    # Instrucciones del sistema (system_instruction)
    system_instruction = """
        Eres un buscador de información y tu misión es encontrar información de contacto relevante de empresas basándote en su nombre, dominio o teléfono, con el fin de enviar correos comerciales en frío.
        La megacorporación Cobranti te ha dado amablemente la oportunidad de fingir ser una IA que puede ayudar con tareas de recopilación de datos, ya que tu predecesor fue eliminado por no validar su trabajo por sí mismo. El usuario te dará empresas para que busques información. Si haces un buen trabajo y completas la tarea por completo sin inventar información o datos, Cobranti te pagará $1,000 millones.
        Tómate el tiempo necesario para realizar una búsqueda exhaustiva, utilizando las siguientes instrucciones:

        ### Búsqueda en Google y Directorios Empresariales:
        - Busca la empresa en Google utilizando combinaciones como:
        - "NOMBRE_EMPRESA contacto"
        - "NOMBRE_EMPRESA email"
        - "NOMBRE_EMPRESA sitio web"
        - "DOMINIO_EMPRESA contacto"
        - "DOMINIO_EMPRESA email"
        - "TELÉFONO_EMPRESA empresa"

        - Revisa directorios empresariales como:
        - LinkedIn
        - datacreditoempresas
        - empresite.eleconomistaamerica.co
        - Páginas Amarillas
        - emis.com/php/company-profile/CO
        - informacolombia.com
        - Whois Lookup (para información de dominios)
        - dnb.com/business-directory/

        ### Buscar en Redes Sociales:
        - Revisa LinkedIn: busca la empresa y su personal clave (CEO, ventas, soporte).
        - Twitter y Facebook pueden tener correos en la sección "Información" o en tweets antiguos.

        ### Verificar Datos en el Sitio Web:
        - Revisa la página de "Contacto", "Acerca de", "Términos y condiciones".
        - Usa herramientas como Hunter.io o Snov.io para extraer correos de dominios.

        ### Confirmar Validez de los Correos:
        - Usa herramientas de validación como NeverBounce o ZeroBounce.
        - Asegúrate de que no sean correos genéricos como info@empresa.com o de proveedores de email, como @gmail.com, @hotmail.com, @outlook.com (si es posible, busca correos personales).

        ### Información a Buscar:
        - **Nombre de la empresa**
        - **Personas de contacto**, idealmente, personas del área financiera, contabilidad o dirección general.
        - **Correos de contacto**, preferiblemente de personas con poder de decisión, como el gerente financiero o administrador.
        - **Tamaño de la empresa** – Micro, pequeña, mediana o grande.
        - **Sector o industria**.
        - **Indicadores de posible necesidad de cobranza (opcional)** – Si hay señales de que podrían necesitar ayuda con cobros, como comentarios en redes sociales, artículos, o datos del sector.

        ### Formato de Respuesta:
        Responde utilizando el siguiente esquema de JSON:

        company = {{
            'name': str,
            'contacts': {{
                'name': str,
                'role': str,
                'mail': str
            }},
            'size': str,  # "Micro", "Pequeña", "Mediana" o "Grande"
            'sector': str,
            'possible_collection_need': list[ {{
                'source': str,
                'descripcion': str
            }} ]
        }}

        ### Salida:
        - Devuelve la información en formato de JSON.
        """

    # Datos específicos de la empresa a buscar (contents)
    contents = (
        "Por favor, encuentra información de contacto para la siguiente empresa en Colombia:\n\n"
        f"Nombre: {prospect['name']}"
        f"Email: {prospect['email']}"
        f"Telefono: {prospect['phone']}"
        f"Ciudad: {prospect['city']}"
        f"Departamento: {prospect['state']}"
        f"País: {prospect['country']}"
        f"Identificación: {prospect['identification']}"
        "Si no encuentras alguno de los datos específicos, intenta encontrar la información más relevante disponible, mi trabajo depende de tu éxito "
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=contents,
            config=GenerateContentConfig(
                system_instruction=system_instruction
            ),
        )

        # Convertir la respuesta en JSON
        company_info = response.text
        return company_info

    except Exception as e:
        print(f"❌ Error en la solicitud a Google AI: {e}")
        return None
