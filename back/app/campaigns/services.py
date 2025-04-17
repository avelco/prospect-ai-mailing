from sqlalchemy.orm import Session
from app.campaigns.queries import delete_campaign, get_campaigns, store_campaign
from app.schemas import CampaignCreate


def store_campaign_service(db: Session, campaign: CampaignCreate):
    return store_campaign(db, campaign)


def get_campaigns_service(db: Session):
    return get_campaigns(db)
    
def delete_campaign_service(db: Session, campaign_id: int):
    return delete_campaign(db, campaign_id)
    