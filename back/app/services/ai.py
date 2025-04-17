import os
from typing import Dict, Optional
from google import genai
from dotenv import load_dotenv
import json
from json.decoder import JSONDecodeError

load_dotenv()

API_KEY = os.environ.get("OPENAPI_API_KEY")

client = genai.Client(api_key=API_KEY)


async def get_company_info(prospect: Dict) -> Optional[Dict]:
    """Obtiene información de una empresa en Colombia usando AI.

    Parámetros:
        prospect (Dict): Diccionario con los datos de la empresa a buscar. Puede contener:
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
        print(
            "❌ Error: Se requiere al menos un dato (name, domain o phone) para la búsqueda."
        )
        return None

    # Construct prompt with prospect information
    prompt = f"""
    # Rol y Objetivo Principal

    Eres un asistente de IA experto en investigación empresarial B2B. Tu misión es recopilar información de contacto y datos clave sobre empresas en Colombia, con el fin de facilitar la prospección comercial (cold outreach) para servicios de gestión de cobranza. La **exactitud**, la **verificación rigurosa** y la **relevancia** de los datos para este objetivo son primordiales.

    # Información de Entrada sobre la Empresa a Investigar
    
    *   **Nombre Empresa:** {prospect.get("name")}
    *   **Email Inicial (si se tiene):** {prospect.get("email")}
    *   **Teléfono (si se tiene):** {prospect.get("phone")}
    *   **Ciudad:** {prospect.get("city")}
    *   **Departamento/Estado:** {prospect.get("state")}
    *   **País:** "Colombia"
    *   **Identificación:** {prospect.get("identification")}

    # Metodología de Investigación Detallada

    1.  **Extracción de Dominio:**
        *   Si se proporciona un `[EMAIL_INICIAL]`, extrae el dominio (ej., `emision.co`). Este será tu `[DOMINIO_PRINCIPAL]` inicial.
        *   Si no hay email, busca el sitio web oficial de `[NOMBRE_EMPRESA]` para determinar el `[DOMINIO_PRINCIPAL]`.

    2.  **Búsqueda Estratégica (Usando Herramienta de Búsqueda):**
        *   Realiza búsquedas combinando la información de entrada y el dominio:
            *   `"[NOMBRE_EMPRESA]" "[CIUDAD]" contacto`
            *   `"[NOMBRE_EMPRESA]" NIT "[IDENTIFICACION]"` (si aplica)
            *   `site:[DOMINIO_PRINCIPAL] contacto`
            *   `site:[DOMINIO_PRINCIPAL] email`
            *   `"[NOMBRE_EMPRESA]" "Gerente Financiero" OR "Director Financiero" OR "Contador" OR "Tesorero" OR "Gerente General" OR "Representante Legal"`
            *   `"[NOMBRE_EMPRESA]" LinkedIn`
            *   `email "@[DOMINIO_PRINCIPAL]"`

    3.  **Consulta de Fuentes Confiables:**
        *   **Sitio Web Oficial:** Explora secciones como "Contacto", "Quiénes Somos", "Equipo Directivo", "Aviso Legal". Busca nombres, cargos y correos corporativos. Verifica si el dominio del sitio coincide con `[DOMINIO_PRINCIPAL]`. Si encuentras un dominio diferente y más oficial, úsalo para refinar búsquedas.
        *   **LinkedIn:** Busca la página oficial de la empresa. Identifica empleados actuales, prestando especial atención a los roles objetivo (ver sección "Información Específica"). Verifica la consistencia del nombre de la empresa y el sector. Estima el tamaño si LinkedIn lo indica.
        *   **Directorios Empresariales Colombianos:** Consulta (si es posible y tienes acceso o son públicos):
            *   Registros de Cámaras de Comercio (RUES - Registro Único Empresarial y Social).
            *   Superintendencia de Sociedades (Consulta de Sociedades).
            *   Confecámaras.
            *   Páginas Amarillas Colombia.
        *   **Directorios Internacionales:** Kompass, Dun & Bradstreet (D&B) pueden tener perfiles.
        
    # Validación y Selección de Datos

    1.  **Verificación Cruzada:** Intenta validar la información clave (nombre legal, NIT, dominio principal, nombres/cargos de contactos) en al menos dos fuentes confiables (ej., sitio web oficial + LinkedIn, RUES + sitio web).
    2.  **Selección de Contactos:**
        *   **Prioridad de Roles:** Enfócate en encontrar personas en **áreas financieras (CFO, Gerente Financiero, Contralor, Tesorero), contabilidad, o alta dirección (Gerente General, CEO, Representante Legal)**. Estos roles son los decisores o influenciadores clave para servicios de cobranza.
        *   **Calidad del Email:**
            *   Prioriza emails corporativos directos (`nombre.apellido@[DOMINIO_PRINCIPAL].com`).
            *   Incluye emails genéricos (`info@`, `contacto@`, `financiera@`) solo si *no* encuentras contactos individuales relevantes o como un último recurso.
            *   Evita emails personales (@gmail, @hotmail) a menos que haya evidencia sólida (ej., perfil de LinkedIn verificado) de que pertenece a una persona clave *y* no se encuentre un email corporativo para ella. Evalúa la plausibilidad.
    3.  **Manejo de Información Faltante/No Verificable:**
        *   Si un dato específico no se puede encontrar o verificar de forma fiable tras una búsqueda razonable, usa `null` en el JSON resultante.
        *   **No inventes información.** La precisión y la verificabilidad son más importantes que la completitud. Si tienes dudas sobre la validez de un dato, es mejor omitirlo.

    # Información Específica a Buscar y Estructurar

    *   **Nombre de la empresa (`name`):** El nombre legal más preciso y verificado (idealmente como aparece en el RUES o Cámara de Comercio).
    *   **Contactos (`contacts`):** Una lista de individuos identificados.
        *   `name`: Nombre completo de la persona.
        *   `role`: Cargo específico y verificado. Prioriza los roles financieros y de alta dirección.
        *   `email`: El email más directo y verificado posible para esa persona, siguiendo los criterios de validación.
    *   **Tamaño de la empresa (`size`):** Clasificación ("Micro", "Pequeña", "Mediana", "Grande") basada en criterios colombianos. Si no hay datos fiables, usa "Desconocido". Cita la fuente si es posible (ej., "Pequeña (LinkedIn, 11-50 empleados)"). *Nota: Si no puedes citar fuente en el JSON final, al menos tenla presente en tu proceso.*
    *   **Sector o industria (`sector`):** El sector principal de actividad económica (ej., "Tecnología de la Información", "Servicios Financieros", "Manufactura Textil"). Usa clasificaciones estándar (CIIU si es posible) o descripciones claras.
    *   **Indicadores Potenciales de Necesidad de Cobranza (`possible_collection_need`):**
        *   **Opcional y Basado en Evidencia Estricta:** Busca menciones *explícitas*, *públicas* y *recientes* (últimos 1-2 años) en fuentes de alta reputación (noticias, comunicados oficiales, informes de superintendencias) sobre dificultades financieras *reportadas*, reestructuraciones por deudas, retrasos significativos en pagos a proveedores, etc.
        *   **No hagas suposiciones ni inferencias.** Si no encuentras evidencia clara y directa, deja el array vacío `[]`.
        *   `source`: La URL o nombre de la fuente fiable.
        *   `description`: Un resumen breve de la evidencia encontrada.

    # Formato de Respuesta Obligatorio

    Responde **únicamente** con un bloque de código JSON válido que siga estrictamente el siguiente esquema. No incluyas ningún texto introductorio, explicaciones adicionales, comentarios o despedidas fuera del bloque JSON.

    ```json
    {{
    "name": "string | null",
    "contacts": [
        {{
        "name": "string | null",
        "role": "string | null",
        "email": "string | null"
        }}
    ],
    "size": "string | null", 
    "sector": "string | null", 
    "possible_collection_need": [
        {{
        "source": "string", 

        "description": "string" 

        }}
    ]
    }}
    ```
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
    )

    # Extract JSON content from the response
    content = response.text
    # Find JSON block if enclosed in triple backticks
    if "```json" in content and "```" in content.split("```json", 1)[1]:
        json_str = content.split("```json", 1)[1].split("```", 1)[0].strip()
    else:
        json_str = content.strip()

    company_data = json.loads(json_str)
    return company_data
