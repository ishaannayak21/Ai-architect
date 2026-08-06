import logging

from fastapi import APIRouter, status

from app.api.deps import DB, CurrentUser
from app.schemas.chat import ChatMessageCreate, ChatMessageRead, ChatSessionRead
from app.services.chat_service import (
    clear_chat_session,
    get_or_create_chat_session,
    post_chat_message,
    regenerate_chat_response,
)

logger = logging.getLogger("ai_architect")
router = APIRouter(prefix="/blueprints", tags=["AI Chat"])
projects_chat_router = APIRouter(prefix="/projects", tags=["AI Chat"])


@router.get(
    "/{blueprint_id}/chat",
    response_model=ChatSessionRead,
)
@projects_chat_router.get(
    "/{blueprint_id}/chat",
    response_model=ChatSessionRead,
)
def read_chat_session(
    blueprint_id: int,
    current_user: CurrentUser,
    db: DB,
):
    """Get chat session & message history for a project (0 AI calls)."""
    return get_or_create_chat_session(db, current_user, blueprint_id)


@router.post(
    "/{blueprint_id}/chat/messages",
    response_model=ChatMessageRead,
    status_code=status.HTTP_201_CREATED,
)
@projects_chat_router.post(
    "/{blueprint_id}/chat/messages",
    response_model=ChatMessageRead,
    status_code=status.HTTP_201_CREATED,
)
def send_chat_message_route(
    blueprint_id: int,
    payload: ChatMessageCreate,
    current_user: CurrentUser,
    db: DB,
):
    """Post a user message, execute 1 AI request, save to DB, and return response."""
    return post_chat_message(db, current_user, blueprint_id, payload.content)


@router.post(
    "/{blueprint_id}/chat/regenerate",
    response_model=ChatMessageRead,
)
@projects_chat_router.post(
    "/{blueprint_id}/chat/regenerate",
    response_model=ChatMessageRead,
)
def regenerate_chat_route(
    blueprint_id: int,
    current_user: CurrentUser,
    db: DB,
):
    """Regenerate the assistant's last response."""
    return regenerate_chat_response(db, current_user, blueprint_id)


@router.delete(
    "/{blueprint_id}/chat",
    response_model=ChatSessionRead,
)
@projects_chat_router.delete(
    "/{blueprint_id}/chat",
    response_model=ChatSessionRead,
)
def clear_chat_route(
    blueprint_id: int,
    current_user: CurrentUser,
    db: DB,
):
    """Clear chat session history for a project."""
    return clear_chat_session(db, current_user, blueprint_id)
