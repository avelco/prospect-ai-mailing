# models.py
from sqlalchemy import Column, Integer, String
from app.conection import Base

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
