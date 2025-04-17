from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
import datetime

# --- User Schemas ---

class UserBase(BaseModel):
    name: Optional[str]
    last_name: Optional[str]
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

# --- SuspectDetail Schemas ---

class SuspectDetailBase(BaseModel):
    suspect_id: int
    description: Optional[str]
    llm: Optional[str]
    score: int

class SuspectDetailCreate(SuspectDetailBase):
    pass

class SuspectDetailRead(SuspectDetailBase):
    id: int
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

# --- Email Schemas ---

class EmailBase(BaseModel):
    suspect_id: int
    body: Optional[str]
    subject: Optional[str]
    status: Optional[str]
    send_id: Optional[str]
    send_events: Optional[Any]

class EmailCreate(EmailBase):
    pass

class EmailRead(EmailBase):
    id: int
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

# --- Product Schemas ---

class ProductBase(BaseModel):
    name: str
    description: Optional[str]
    status: Optional[str]

class ProductCreate(ProductBase):
    pass

class ProductRead(ProductBase):
    id: int
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

# --- Campaign Schemas ---

class CampaignBase(BaseModel):
    name: str
    description: Optional[str]
    status: Optional[str]
    product_id: int

class CampaignCreate(CampaignBase):
    pass

class CampaignRead(CampaignBase):
    id: int
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

# --- Participant Schemas ---

class ParticipantBase(BaseModel):
    suspect_id: int
    product_id: int
    campaign_id: int

class ParticipantCreate(ParticipantBase):
    pass

class ParticipantRead(ParticipantBase):
    id: int
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

# --- Interaction Schemas ---

class InteractionBase(BaseModel):
    participant_id: int
    description: Optional[str]

class InteractionCreate(InteractionBase):
    pass

class InteractionRead(InteractionBase):
    id: int
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

# --- Task Schemas ---

class TaskBase(BaseModel):
    participant_id: int
    description: Optional[str]

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

# --- Suspect Schemas (with nested details/emails/participants for read) ---

class SuspectBase(BaseModel):
    email: str
    name: Optional[str]
    phone: Optional[str]
    city: Optional[str]
    state: Optional[str]
    country: Optional[str]
    identification: str
    status: str
    deleted: Optional[bool] = False

class SuspectCreate(SuspectBase):
    pass

class SuspectRead(SuspectBase):
    id: int
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]
    details: Optional[SuspectDetailRead]
    emails: Optional[List[EmailRead]]
    participants: Optional[List[ParticipantRead]]

    class Config:
        from_attributes = True
