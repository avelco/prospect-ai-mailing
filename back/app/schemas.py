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
    status: Optional[str]

class ParticipantCreate(BaseModel):
    suspect_id: int
    campaign_id: int
    product_id: Optional[int] = None
    status: Optional[str]
    
class ParticipantRead(ParticipantBase):
    id: int
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]
    suspect: Optional[SuspectRead]

    class Config:
        from_attributes = True

class PaginatedParticipants(BaseModel):
    total: int
    limit: int
    offset: int
    pages: int
    current_page: int
    participants: List[ParticipantRead]
# --- Interaction Schemas ---

class InteractionBase(BaseModel):
    participant_id: Optional[int]
    description: Optional[str]

class InteractionCreate(BaseModel):
    description: Optional[str]

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
        
# --- Email Schemas ---

class EmailBase(BaseModel):
    participant_id: int
    body: Optional[str]
    subject: Optional[str]
    status: Optional[str]
    to: Optional[str]
    user_id: Optional[int]
    provider_id: Optional[str]
    send_events: Optional[Any]

class EmailCreate(EmailBase):
    pass

class EmailRead(EmailBase):
    id: int
    participant: Optional[ParticipantRead]
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True
        
        
class ContactBase(BaseModel):
    suspect_id: int
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

class ContactRead(ContactBase):
    id: int
    created_at: Optional[datetime.datetime] 
    updated_at: Optional[datetime.datetime]        
    
    class Config:
        from_attributes = True     