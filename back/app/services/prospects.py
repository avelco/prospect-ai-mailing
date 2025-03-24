from ..models import Prospect
from ..conection import SessionLocal

async def get_prospects_service():
    db = SessionLocal()
    prospects = db.query(Prospect).all()
    return prospects