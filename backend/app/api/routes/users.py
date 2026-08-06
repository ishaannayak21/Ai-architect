from fastapi import APIRouter

from app.api.deps import DB, CurrentUser
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.services.user_service import update_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserRead)
def read_me(current_user: CurrentUser) -> User:
    return current_user


@router.patch("/me", response_model=UserRead)
def patch_me(payload: UserUpdate, current_user: CurrentUser, db: DB) -> User:
    return update_user(db, current_user, payload)