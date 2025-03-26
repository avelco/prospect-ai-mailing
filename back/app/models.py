# models.py
from sqlalchemy import Column, Integer, String, Boolean
from app.conection import Base
from pydantic import BaseModel
from typing import Optional

class Prospect(Base):
    __tablename__ = 'prospects'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, nullable=False)
    name = Column(String)
    phone = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String)
    identification = Column(String, nullable=False, unique=True)
    status = Column(String, nullable=False)
    deleted = Column(Boolean, default=False)  # Campo para soft delete

# Modelo Pydantic para actualización parcial de un prospecto
class ProspectUpdate(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    identification: Optional[str] = None
    status: Optional[str] = None
