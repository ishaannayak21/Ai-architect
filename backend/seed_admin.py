"""Seed an administrator account into the database.

Usage:
    python seed_admin.py
"""

import os
import sys

from sqlalchemy import select

import app.models.project  # noqa: F401  (registers Project for the User relationship)
from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models.user import User

ADMIN_NAME = os.getenv("ADMIN_NAME", "Administrator")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@aiarchitect.dev")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Admin@1234")


def main() -> None:
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        existing = db.scalar(select(User).where(User.email == ADMIN_EMAIL))
        if existing is not None:
            existing.is_admin = True
            db.commit()
            print(f"Admin already exists; ensured is_admin=True for {existing.email}")
            return

        user = User(
            name=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password=hash_password(ADMIN_PASSWORD),
            is_admin=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Created admin account: {user.email} (id={user.id})")


if __name__ == "__main__":
    sys.exit(main())
