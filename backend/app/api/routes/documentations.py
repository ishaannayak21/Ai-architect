import logging
from typing import Literal

from fastapi import APIRouter, Query, Response, status

from app.api.deps import DB, CurrentUser
from app.schemas.documentation import DocumentationRead
from app.services.documentation_service import (
    _get_diagrams_dict,
    export_html,
    export_markdown,
    get_or_create_documentation,
    regenerate_documentation,
    resolve_user_blueprint,
)

logger = logging.getLogger("ai_architect")
router = APIRouter(prefix="/blueprints", tags=["Documentation"])
projects_doc_router = APIRouter(prefix="/projects", tags=["Documentation"])


@router.get(
    "/{blueprint_id}/documentation",
    response_model=DocumentationRead,
)
@projects_doc_router.get(
    "/{blueprint_id}/documentation",
    response_model=DocumentationRead,
)
def read_documentation(
    blueprint_id: int,
    current_user: CurrentUser,
    db: DB,
):
    """Retrieve documentation for a blueprint/project. Uses ZERO AI calls if already in DB cache."""
    return get_or_create_documentation(db, current_user, blueprint_id)


@router.post(
    "/{blueprint_id}/documentation/regenerate",
    response_model=DocumentationRead,
)
@projects_doc_router.post(
    "/{blueprint_id}/documentation/regenerate",
    response_model=DocumentationRead,
)
def force_regenerate_documentation(
    blueprint_id: int,
    current_user: CurrentUser,
    db: DB,
):
    """Force regenerate documentation via AI and update the DB cache."""
    return regenerate_documentation(db, current_user, blueprint_id)


@router.get(
    "/{blueprint_id}/documentation/export",
)
@projects_doc_router.get(
    "/{blueprint_id}/documentation/export",
)
def export_documentation_file(
    blueprint_id: int,
    current_user: CurrentUser,
    db: DB,
    format: Literal["markdown", "html", "pdf"] = Query(default="markdown"),
):
    """Export documentation as Markdown (.md), HTML (.html), or PDF format."""
    blueprint = resolve_user_blueprint(db, current_user, blueprint_id)
    doc = get_or_create_documentation(db, current_user, blueprint_id)
    diagrams = _get_diagrams_dict(db, blueprint.id)

    safe_title = "".join(c if c.isalnum() or c in ("-", "_") else "_" for c in blueprint.title).strip("_") or "documentation"

    if format == "markdown":
        content = export_markdown(doc.data, blueprint.title, diagrams)
        return Response(
            content=content,
            media_type="text/markdown; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{safe_title}_documentation.md"'},
        )
    elif format == "html":
        content = export_html(doc.data, blueprint.title, diagrams)
        return Response(
            content=content,
            media_type="text/html; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{safe_title}_documentation.html"'},
        )
    else:  # pdf
        content = export_html(doc.data, blueprint.title, diagrams)
        return Response(
            content=content,
            media_type="text/html; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{safe_title}_documentation.pdf.html"'},
        )
