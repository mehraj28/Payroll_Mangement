from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from app import crud, schemas, database, auth

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=schemas.UserRead)
def signup(user_in: schemas.UserCreate, session: Session = Depends(database.get_session)):
    try:
        user = crud.create_user(session, user_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return user

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(database.get_session)):
    user = crud.authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = auth.create_access_token(data={"sub": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserRead)
def read_me(current_user = Depends(auth.get_current_user)):
    return current_user