from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.campaigns.services import delete_campaign_service, get_campaigns_service, store_campaign_service
from app.schemas import CampaignCreate
from ..dependencies import get_db

campaigns = APIRouter()

@campaigns.post("/")
async def store_campaign(campaign: CampaignCreate, db: Session = Depends(get_db)):
    return store_campaign_service(db, campaign)

@campaigns.get("/")
async def get_campaigns(db: Session = Depends(get_db)):
    return get_campaigns_service(db)

@campaigns.delete("/{campaign_id}")
async def delete_campaign(campaign_id: int, db: Session = Depends(get_db)):
    return delete_campaign_service(db, campaign_id)
