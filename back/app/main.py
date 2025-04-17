from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.mail import upload as mail_routes
from .suspects.routes import suspect as suspect_routes

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(mail_routes)
app.include_router(
    suspect_routes,
    tags=["suspects"],
)

@app.get("/")
def read_root():
    return {"message": "¡Hola, ProspectAI!"}