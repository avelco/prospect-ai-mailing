from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.upload import upload as upload_routes
from .routes.mail import upload as mail_routes
from .routes.prospect import prospect as prospect_routes

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O especifica los orígenes permitidos, por ejemplo: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_routes)
app.include_router(mail_routes)
app.include_router(
    prospect_routes,
    tags=["prospects"],
)

@app.get("/")
def read_root():
    return {"message": "¡Hola, FastAPI!"}