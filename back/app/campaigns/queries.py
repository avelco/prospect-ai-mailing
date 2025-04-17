


from sqlalchemy.orm import Session
from app.models import Campaign
from app.schemas import CampaignCreate


def store_campaign(db: Session, campaign: CampaignCreate):
    campaign = Campaign(**campaign.model_dump())
    db.add(campaign)
    db.commit()
    return campaign
    
def get_campaigns(db: Session):
    return db.query(Campaign).all()

def delete_campaign(db: Session, campaign_id: int):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        return None
    db.delete(campaign)
    db.commit()
    return campaign