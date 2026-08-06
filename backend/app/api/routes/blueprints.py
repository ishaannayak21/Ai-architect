import logging

from fastapi import APIRouter, status

from app.api.deps import DB, CurrentUser
from app.schemas.blueprint import BlueprintGenerateRequest, BlueprintRead
from app.schemas.diagram import DiagramRead, DiagramType
from app.services import ai_service
from app.services.blueprint_service import (
    create_blueprint,
    get_user_blueprint,
    list_user_blueprints,
)
from app.services.diagram_service import (
    create_diagrams,
    generate_blueprint_diagrams,
    list_blueprint_diagrams,
    regenerate_blueprint_diagram,
)
from app.utils.exceptions import AIGenerationError

logger = logging.getLogger("ai_architect")
router = APIRouter(prefix="/blueprints", tags=["Blueprints"])


@router.post(
    "/generate",
    response_model=BlueprintRead,
    status_code=status.HTTP_201_CREATED,
)
def generate_blueprint(
    payload: BlueprintGenerateRequest,
    current_user: CurrentUser,
    db: DB,
):
    # Request 1: Generate complete architecture blueprint
    blueprint, raw_output = ai_service.generate_blueprint(
        title=payload.title,
        description=payload.description,
    )
    record = create_blueprint(
        db,
        current_user,
        title=payload.title,
        description=payload.description,
        blueprint=blueprint,
        raw_output=raw_output,
    )
    # Request 2: Generate all five Mermaid diagrams
    try:
        generate_blueprint_diagrams(db, current_user, record.id)
        logger.info("Generated architecture (Request 1) and all 5 diagrams (Request 2).")
    except AIGenerationError as exc:
        logger.warning(f"Blueprint created, but diagram generation failed: {exc}")

    return record


@router.get("", response_model=list[BlueprintRead])
def list_blueprints(current_user: CurrentUser, db: DB) -> list:
    logger.info("Loaded from database cache.")
    return list_user_blueprints(db, current_user)


@router.get("/{blueprint_id}", response_model=BlueprintRead)
def read_blueprint(blueprint_id: int, current_user: CurrentUser, db: DB):
    logger.info("Loaded from database cache.")
    return get_user_blueprint(db, current_user, blueprint_id)


@router.get("/{blueprint_id}/diagrams", response_model=list[DiagramRead])
def list_diagrams(blueprint_id: int, current_user: CurrentUser, db: DB) -> list:
    logger.info("Loaded from database cache.")
    return list_blueprint_diagrams(db, current_user, blueprint_id)


@router.post(
    "/{blueprint_id}/diagrams",
    response_model=list[DiagramRead],
    status_code=status.HTTP_201_CREATED,
)
def generate_all_diagrams(
    blueprint_id: int, current_user: CurrentUser, db: DB
) -> list:
    return generate_blueprint_diagrams(db, current_user, blueprint_id)


@router.post(
    "/{blueprint_id}/diagrams/{diagram_type}/regenerate",
    response_model=DiagramRead,
)
def regenerate_diagram(
    blueprint_id: int,
    diagram_type: DiagramType,
    current_user: CurrentUser,
    db: DB,
):
    return regenerate_blueprint_diagram(
        db, current_user, blueprint_id, diagram_type
    )
