import logging

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.blueprint import Blueprint
from app.models.project import Project
from app.models.user import User
from app.schemas.blueprint import ArchitectBlueprint
from app.utils.exceptions import BlueprintNotFoundError

logger = logging.getLogger("ai_architect")


def create_blueprint(
    db: Session,
    user: User,
    title: str,
    description: str,
    blueprint: ArchitectBlueprint,
    raw_output: str,
) -> Blueprint:
    """Create blueprint and sync corresponding Project record in DB."""
    record = Blueprint(
        owner_id=user.id,
        title=title,
        description=description or "",
        data=blueprint.model_dump(mode="json"),
        raw_output=raw_output,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    # Automatically sync/create corresponding Project row in SQLite DB
    existing_proj = db.scalar(
        select(Project).where(Project.owner_id == user.id, Project.title == title)
    )
    if existing_proj is None:
        try:
            proj = Project(
                id=record.id,
                title=title,
                description=description or blueprint.project_summary or "",
                owner_id=user.id,
            )
            db.add(proj)
            db.commit()
        except Exception as exc:
            db.rollback()
            logger.info(f"Fallback project insertion for '{title}': {exc}")
            proj = Project(
                title=title,
                description=description or blueprint.project_summary or "",
                owner_id=user.id,
            )
            db.add(proj)
            db.commit()

    return record


def list_user_blueprints(db: Session, user: User) -> list[Blueprint]:
    stmt = (
        select(Blueprint)
        .where(Blueprint.owner_id == user.id)
        .order_by(Blueprint.created_at.desc())
    )
    return list(db.scalars(stmt).all())


def get_user_blueprint(db: Session, user: User, blueprint_id: int) -> Blueprint:
    blueprint = db.get(Blueprint, blueprint_id)
    if blueprint is None or blueprint.owner_id != user.id:
        raise BlueprintNotFoundError()
    return blueprint