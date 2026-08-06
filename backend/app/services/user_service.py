from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserUpdate


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def get_user_by_email(db: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email.lower())
    return db.scalar(stmt)


def update_user(db: Session, user: User, payload: UserUpdate) -> User:
    data = payload.model_dump(exclude_unset=True)
    if "email" in data and data["email"] is not None:
        candidate = data["email"].lower()
        existing = get_user_by_email(db, candidate)
        if existing is not None and existing.id != user.id:
            raise ValueError("Email is already registered")
        data["email"] = candidate
    if "password" in data and data["password"] is not None:
        data["password"] = hash_password(data["password"])
    for field, value in data.items():
        if value is not None:
            setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user
