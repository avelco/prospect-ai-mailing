from fastapi import FastAPI
from .routes.upload import upload as upload_routes
from .routes.mail import upload as mail_routes

app = FastAPI()
app.include_router(upload_routes)
app.include_router(mail_routes)

@app.get("/")
def read_root():
    return {"message": "¡Hola, FastAPI!"}