from fastapi import APIRouter, status

from app.api.deps import DB
from app.core.security import create_access_token
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserLogin
from app.services.auth_service import authenticate_user, register_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
)
def register(payload: UserCreate, db: DB) -> Token:
    user = register_user(db, payload)
    return Token(
        access_token=create_access_token(user.id),
        user=user,
    )


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: DB) -> Token:
    user = authenticate_user(db, payload)
    return Token(
        access_token=create_access_token(user.id),
        user=user,
    )