from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Text,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from app.conection import Base
from pydantic import BaseModel
from typing import Optional, List
import datetime

# --- SQLAlchemy ORM Models ---

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    last_name = Column(String)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    emails = relationship("Email", back_populates="user")


class Suspect(Base):
    __tablename__ = "suspects"

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
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    details = relationship("SuspectDetail", back_populates="suspect", uselist=False)
    participants = relationship("Participant", back_populates="suspect")
    contacts = relationship("Contact", back_populates="suspect")

class SuspectDetail(Base):
    __tablename__ = "suspect_details"

    id = Column(Integer, primary_key=True, autoincrement=True)
    suspect_id = Column(Integer, ForeignKey("suspects.id"), nullable=False)
    description = Column(Text)
    llm = Column(String)
    score = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    suspect = relationship("Suspect", back_populates="details")


class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, autoincrement=True)
    participant_id = Column(Integer, ForeignKey("participants.id"), nullable=False)
    body = Column(Text)
    subject = Column(String)
    to = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String)
    provider_id = Column(String)
    send_events = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    participant = relationship("Participant", back_populates="emails")
    user = relationship("User", back_populates="emails")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    campaigns = relationship("Campaign", back_populates="product")
    participants = relationship("Participant", back_populates="product")


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    participants = relationship("Participant", back_populates="campaign")
    product = relationship("Product", back_populates="campaigns")


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, autoincrement=True)
    suspect_id = Column(Integer, ForeignKey("suspects.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    suspect = relationship("Suspect", back_populates="participants")
    product = relationship("Product", back_populates="participants")
    campaign = relationship("Campaign", back_populates="participants")
    interactions = relationship("Interaction", back_populates="participant")
    tasks = relationship("Task", back_populates="participant")
    emails = relationship("Email", back_populates="participant")


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    participant_id = Column(Integer, ForeignKey("participants.id"), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    participant = relationship("Participant", back_populates="interactions")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    participant_id = Column(Integer, ForeignKey("participants.id"), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    participant = relationship("Participant", back_populates="tasks")


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    suspect_id = Column(Integer, ForeignKey("suspects.id"), nullable=False)
    name = Column(String)
    phone = Column(String)
    email = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    suspect = relationship("Suspect", back_populates="contacts")