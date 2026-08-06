import logging

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.blueprint import Blueprint
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.utils.exceptions import ProjectNotFoundError

logger = logging.getLogger("ai_architect")


def get_user_projects(db: Session, user: User) -> list[Project]:
    """Fetch user projects. Automatically backfill/sync Project records for any user blueprints."""
    user_blueprints = db.scalars(
        select(Blueprint).where(Blueprint.owner_id == user.id)
    ).all()

    existing_projects = db.scalars(
        select(Project).where(Project.owner_id == user.id)
    ).all()

    existing_titles_or_ids = {p.title for p in existing_projects} | {p.id for p in existing_projects}

    new_projects_added = False
    for bp in user_blueprints:
        if bp.title not in existing_titles_or_ids and bp.id not in existing_titles_or_ids:
            summary = bp.description or (bp.data.get("project_summary") if isinstance(bp.data, dict) else "")
            try:
                new_proj = Project(
                    id=bp.id,
                    title=bp.title,
                    description=summary or "",
                    owner_id=user.id,
                    created_at=bp.created_at,
                )
                db.add(new_proj)
                new_projects_added = True
            except Exception:
                pass

    if new_projects_added:
        try:
            db.commit()
        except Exception as exc:
            db.rollback()
            logger.info(f"Fallback project auto-sync for user {user.id}: {exc}")
            for bp in user_blueprints:
                if bp.title not in existing_titles_or_ids:
                    summary = bp.description or (bp.data.get("project_summary") if isinstance(bp.data, dict) else "")
                    new_proj = Project(
                        title=bp.title,
                        description=summary or "",
                        owner_id=user.id,
                        created_at=bp.created_at,
                    )
                    db.add(new_proj)
            db.commit()

    stmt = (
        select(Project)
        .where(Project.owner_id == user.id)
        .order_by(Project.updated_at.desc())
    )
    return list(db.scalars(stmt).all())


def get_user_project(db: Session, user: User, project_id: int) -> Project:
    project = db.get(Project, project_id)
    if project is None or project.owner_id != user.id:
        raise ProjectNotFoundError()
    return project


def create_project(db: Session, user: User, payload: ProjectCreate) -> Project:
    project = Project(
        title=payload.title,
        description=payload.description,
        owner_id=user.id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def update_project(
    db: Session, user: User, project_id: int, payload: ProjectUpdate
) -> Project:
    project = get_user_project(db, user, project_id)
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        if value is not None:
            setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, user: User, project_id: int) -> None:
    project = get_user_project(db, user, project_id)
    # Also delete corresponding Blueprint if title/owner matches
    blueprint = db.scalar(
        select(Blueprint).where(
            Blueprint.owner_id == user.id,
            (Blueprint.id == project_id) | (Blueprint.title == project.title)
        )
    )
    if blueprint is not None:
        db.delete(blueprint)

    db.delete(project)
    db.commit()
