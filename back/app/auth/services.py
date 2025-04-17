from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from .queries import (get_user_by_email, create_user, get_user_by_email_and_password)
from ..schemas import UserCreate

# Secret key and algorithm
SECRET_KEY = "74c05ff5b3de22442809674504cb06fae320cbba7d28cefd2606f7bb050744f0"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def authenticate_user(db, username: str, password: str):
    user = get_user_by_email_and_password(db, username, password)
    if not user:
        return False
    return True

def create_access_token(data: dict):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + access_token_expires
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username)
    if user is None:
        raise credentials_exception
    return user

async def create_user_service(user_in: UserCreate, db: Session):
    user_exist = await create_user(user_in, db)
    return user_exist
    
async def validate_if_user_exist_service(user_in: UserCreate, db: Session):
    user = await get_user_by_email(user_in.email, db)
    if user:
        return True
    return False

def hash_password(password: str):
    return 
