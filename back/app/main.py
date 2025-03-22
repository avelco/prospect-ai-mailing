from fastapi import FastAPI
from .routes.upload import upload as upload_routes

app = FastAPI()
app.include_router(upload_routes)

@app.get("/")
def read_root():
    return {"message": "¡Hola, FastAPI!"}