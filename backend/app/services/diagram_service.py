from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.blueprint import Blueprint
from app.models.diagram import Diagram
from app.models.user import User
from app.schemas.blueprint import ArchitectBlueprint
from app.schemas.diagram import DiagramType
from app.services import ai_service
from app.utils.exceptions import BlueprintNotFoundError


def get_user_blueprint(db: Session, user: User, blueprint_id: int) -> Blueprint:
    blueprint = db.get(Blueprint, blueprint_id)
    if blueprint is None or blueprint.owner_id != user.id:
        raise BlueprintNotFoundError()
    return blueprint


def _as_architect_blueprint(blueprint: Blueprint) -> ArchitectBlueprint:
    return ArchitectBlueprint.model_validate(blueprint.data)


def create_diagrams(
    db: Session, blueprint_id: int, diagrams: dict[str, str]
) -> list[Diagram]:
    records = [
        Diagram(
            blueprint_id=blueprint_id,
            diagram_type=diagram_type,
            mermaid_code=mermaid_code,
        )
        for diagram_type, mermaid_code in diagrams.items()
    ]
    db.add_all(records)
    db.commit()
    for record in records:
        db.refresh(record)
    return records


def list_blueprint_diagrams(
    db: Session, user: User, blueprint_id: int
) -> list[Diagram]:
    get_user_blueprint(db, user, blueprint_id)
    stmt = (
        select(Diagram)
        .where(Diagram.blueprint_id == blueprint_id)
        .order_by(Diagram.id.asc())
    )
    return list(db.scalars(stmt).all())


def _upsert_diagram(
    db: Session, blueprint_id: int, diagram_type: str, mermaid_code: str
) -> Diagram:
    existing = db.scalar(
        select(Diagram).where(
            Diagram.blueprint_id == blueprint_id,
            Diagram.diagram_type == diagram_type,
        )
    )
    if existing is not None:
        existing.mermaid_code = mermaid_code
        db.commit()
        db.refresh(existing)
        return existing
    return create_diagrams(
        db, blueprint_id, {diagram_type: mermaid_code}
    )[0]


def generate_blueprint_diagrams(
    db: Session, user: User, blueprint_id: int
) -> list[Diagram]:
    """Generate all diagrams for a blueprint, upserting by type."""
    blueprint = get_user_blueprint(db, user, blueprint_id)
    diagrams = ai_service.generate_diagrams(_as_architect_blueprint(blueprint))
    records: list[Diagram] = []
    for diagram_type, mermaid_code in diagrams.items():
        records.append(
            _upsert_diagram(db, blueprint_id, diagram_type, mermaid_code)
        )
    return records


def regenerate_blueprint_diagram(
    db: Session, user: User, blueprint_id: int, diagram_type: DiagramType
) -> Diagram:
    """Regenerate a single diagram for a blueprint, upserting by type."""
    blueprint = get_user_blueprint(db, user, blueprint_id)
    mermaid_code = ai_service.regenerate_diagram(
        _as_architect_blueprint(blueprint), diagram_type
    )
    return _upsert_diagram(
        db, blueprint_id, diagram_type.value, mermaid_code
    )
