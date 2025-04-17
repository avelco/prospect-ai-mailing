from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from .queries import (get_user_by_email, create_user)
from ..schemas import UserCreate

# Secret key and algorithm
SECRET_KEY = "74c05ff5b3de22442809674504cb06fae320cbba7d28cefd2606f7bb050744f0"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3000

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def authenticate_user(db: Session, payload: OAuth2PasswordRequestForm):
    user = await get_user_by_email(db, payload.username)
    if not user:
        return False
    if not pwd_context.verify(payload.password, user.password):
        return False
    return user

def create_access_token(data: dict):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + access_token_expires
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, expire

async def get_current_user(db: Session, token: str = Depends(oauth2_scheme)):
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
    user = await get_user_by_email(db, username)
    if user is None:
        raise credentials_exception
    return user

async def create_user_service(db: Session, user_in: UserCreate):
    hashed_password = pwd_context.hash(user_in.password)
    user_in.password = hashed_password
    user_exist = await create_user(db, user_in)
    return user_exist
    
async def validate_if_user_exist_service(db: Session, user_in: UserCreate ):
    user = await get_user_by_email(db, user_in.email)
    if user:
        return True
    return False

def hash_password(password: str):
    return pwd_context.hash(password)
