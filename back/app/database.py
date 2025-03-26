from sqlalchemy import Column, Integer, Boolean, String, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

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
    deleted = Column(Boolean, default=False)
    
    # Define relationships to related tables
    details = relationship("ProspectDetail", back_populates="prospect", cascade="all, delete-orphan")
    emails = relationship("Email", back_populates="prospect", cascade="all, delete-orphan")
    
class ProspectDetail(Base):
    __tablename__ = 'prospect_details'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    prospect_id = Column(Integer, ForeignKey('prospects.id'), nullable=False)
    description = Column(Text)
    llm = Column(String)
    score = Column(Integer, nullable=False)
    
    # Back reference to Prospect
    prospect = relationship("Prospect", back_populates="details")
    
class Email(Base):
    __tablename__ = 'emails'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    prospect_id = Column(Integer, ForeignKey('prospects.id'), nullable=False)
    body = Column(Text)
    subject = Column(String)
    status = Column(String)
    send_id = Column(String)
    send_events = Column(JSON)
    
    # Back reference to Prospect
    prospect = relationship("Prospect", back_populates="emails")
