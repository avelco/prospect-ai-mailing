from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..schemas import UserCreate
from ..dependencies import get_db
from .services import (
    validate_if_user_exist_service,
    create_user_service,
    authenticate_user,
    create_access_token,
)

user = APIRouter()


@user.post("/token")
async def login(
    payload: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):

    user = await authenticate_user(db, payload)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token, expire = create_access_token(data={"sub": payload.username})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "expires": expire,
        "user": {
            "name": user.name,
            "last_name": user.last_name,
            "email": user.email
            }
        }


# @user.get("/me")
# async def read_users_me(current_user: dict = Depends(get_current_user)):
#     return current_user


@user.post("/register", status_code=201)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    user_exist = await validate_if_user_exist_service(db, user)
    if user_exist:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    new_user = await create_user_service(db, user)
    return new_user
