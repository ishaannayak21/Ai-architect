from fastapi import APIRouter, status

from app.api.deps import DB, CurrentUser
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.services.project_service import (
    create_project,
    delete_project,
    get_user_project,
    get_user_projects,
    update_project,
)

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=list[ProjectRead])
def list_projects(current_user: CurrentUser, db: DB) -> list:
    return get_user_projects(db, current_user)


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_new_project(
    payload: ProjectCreate, current_user: CurrentUser, db: DB
):
    return create_project(db, current_user, payload)


@router.get("/{project_id}", response_model=ProjectRead)
def read_project(project_id: int, current_user: CurrentUser, db: DB):
    return get_user_project(db, current_user, project_id)


@router.patch("/{project_id}", response_model=ProjectRead)
def patch_project(
    project_id: int,
    payload: ProjectUpdate,
    current_user: CurrentUser,
    db: DB,
):
    return update_project(db, current_user, project_id, payload)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_project(project_id: int, current_user: CurrentUser, db: DB) -> None:
    delete_project(db, current_user, project_id)