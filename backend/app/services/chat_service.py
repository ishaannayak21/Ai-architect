import logging
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.chat import ChatMessage, ChatSession
from app.models.user import User
from app.schemas.blueprint import ArchitectBlueprint
from app.services import ai_service
from app.services.documentation_service import resolve_user_blueprint

logger = logging.getLogger("ai_architect")

_DEFAULT_WELCOME_MESSAGE = (
    "Hello! I am your **AI Software Architect**. How can I help you design, scale, or optimize your architecture today?\n\n"
    "You can ask me to:\n"
    "- **Add authentication & authorization**\n"
    "- **Replace or optimize the database**\n"
    "- **Add caching & Redis performance layer**\n"
    "- **Scale architecture to high traffic**\n"
    "- **Improve security & compliance**\n"
    "- **Generate Docker / Kubernetes deployment**\n"
    "- **Convert to microservices topology**\n"
    "- **Add payment gateway integration**"
)


def get_or_create_chat_session(
    db: Session, user: User, id_value: int
) -> ChatSession:
    """Fetch stored chat session and message history from DB (ZERO AI calls)."""
    blueprint = resolve_user_blueprint(db, user, id_value)
    session = db.scalar(
        select(ChatSession).where(ChatSession.blueprint_id == blueprint.id)
    )
    if session is None:
        logger.info(f"Creating new chat session for blueprint {blueprint.id}...")
        session = ChatSession(
            blueprint_id=blueprint.id,
            owner_id=user.id,
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        # Add initial welcome message
        welcome_msg = ChatMessage(
            session_id=session.id,
            role="assistant",
            content=_DEFAULT_WELCOME_MESSAGE,
        )
        db.add(welcome_msg)
        db.commit()
        db.refresh(session)

    return session


def post_chat_message(
    db: Session, user: User, id_value: int, content: str
) -> ChatMessage:
    """Post a user message, execute 1 AI request, update section if needed, and save to DB."""
    blueprint = resolve_user_blueprint(db, user, id_value)
    session = get_or_create_chat_session(db, user, id_value)

    # 1. Save user message to DB
    user_msg = ChatMessage(
        session_id=session.id,
        role="user",
        content=content.strip(),
    )
    db.add(user_msg)
    db.commit()

    # 2. Prepare context & history
    history = [
        {"role": m.role, "content": m.content}
        for m in session.messages
        if m.role in ("user", "assistant")
    ]
    architect_bp = ArchitectBlueprint.model_validate(blueprint.data)

    # 3. Call AI Service (EXACTLY 1 AI request)
    assistant_reply, section_name, section_data = ai_service.chat_completion(
        architect_bp, history, content.strip()
    )

    # 4. Partial section update if requested (Update ONLY requested section in DB)
    if section_name and section_data:
        try:
            current_data = dict(blueprint.data)
            current_data[section_name] = section_data
            blueprint.data = current_data
            db.commit()
            logger.info(f"Updated section '{section_name}' for blueprint {blueprint.id} in DB.")
        except Exception as exc:
            logger.warning(f"Could not update section '{section_name}': {exc}")

    # 5. Save assistant response to DB
    assistant_msg = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=assistant_reply,
        updated_section=section_name,
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return assistant_msg


def regenerate_chat_response(
    db: Session, user: User, id_value: int
) -> ChatMessage:
    """Regenerate the assistant's last response."""
    session = get_or_create_chat_session(db, user, id_value)
    messages = session.messages
    if not messages:
        return post_chat_message(db, user, id_value, "Provide architectural recommendations for this project.")

    # Find last user message
    last_user_content = "Help optimize this architecture."
    for msg in reversed(messages):
        if msg.role == "user":
            last_user_content = msg.content
            break
        elif msg.role == "assistant":
            db.delete(msg)

    db.commit()
    return post_chat_message(db, user, id_value, last_user_content)


def clear_chat_session(db: Session, user: User, id_value: int) -> ChatSession:
    """Reset conversation history for a project."""
    session = get_or_create_chat_session(db, user, id_value)
    for msg in list(session.messages):
        db.delete(msg)
    db.commit()

    welcome_msg = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=_DEFAULT_WELCOME_MESSAGE,
    )
    db.add(welcome_msg)
    db.commit()
    db.refresh(session)
    return session
