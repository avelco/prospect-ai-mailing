from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .suspects.routes import suspect as suspect_routes
from .auth.routes import user as user_routes
from .products.routes import products as products_routes
from .campaigns.routes import campaigns as campaigns_routes
from .participants.routes import participants as participants_routes
from .mails.routes import mails as mails_routes
from .contacts.routes import contacts as contacts_routes

app = FastAPI(
    title="ProspectAI",
    description="API para gestionar prospectos y campañas de marketing.",
    version="1.0.0",
    contact={
        "name": "Cobranti",
        "url": "https://cobranti.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(
    suspect_routes,
    tags=["suspects"],
)
app.include_router(user_routes, prefix="/auth", tags=["auth"])
app.include_router(products_routes, prefix="/products", tags=["products"])
app.include_router(campaigns_routes, prefix="/campaigns", tags=["campaigns"])
app.include_router(participants_routes, prefix="/participants", tags=["participants"])
app.include_router(mails_routes, prefix="/mails", tags=["mails"])
app.include_router(contacts_routes, prefix="/contacts", tags=["contacts"])

@app.get("/")
def read_root():
    return {"message": "¡Hola, ProspectAI!"}