from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from sqlalchemy.orm import Session
from ..schemas import UserCreate
from ..dependencies import get_db
from .services import (
    validate_if_user_exist_service,
    create_user_service,
    authenticate_user,
    create_access_token,
    get_current_user,
    hash_password,
)

user = APIRouter()


@user.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    password = hash_password(form_data.password)
    pass_auth = authenticate_user(db, form_data.username, password)
    if not pass_auth:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": form_data.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@user.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user


@user.post("/register", status_code=201)
async def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    user_exist = await validate_if_user_exist_service(user_in, db)
    if user_exist:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    hashed_password = pwd_context.hash(user_in.password)
    user_in.password = hashed_password
    new_user = await create_user_service(user_in, db)
    return new_user
