from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.services.user_service import get_user_by_email
from app.utils.exceptions import CredentialsError, EmailAlreadyRegisteredError


def register_user(db: Session, payload: UserCreate) -> User:
    email = payload.email.strip().lower()
    if get_user_by_email(db, email):
        raise EmailAlreadyRegisteredError()
    user = User(
        name=payload.name.strip(),
        email=email,
        password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, payload: UserLogin) -> User:
    user = get_user_by_email(db, payload.email)
    if user is None or not verify_password(payload.password, user.password):
        raise CredentialsError()
    return user
