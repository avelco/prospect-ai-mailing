from sqlalchemy.orm import Session

from app.schemas import UserCreate
from ..models import User
from typing import Optional, List


async def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()

async def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

async def get_all_users(db: Session) -> List[User]:
    return db.query(User).all()

async def create_user(db: Session, user_in: UserCreate) -> User:
    user = User(name=user_in.name, last_name=user_in.last_name, email=user_in.email, password=user_in.password)
    db.add(user)
    db.commit()
    return user