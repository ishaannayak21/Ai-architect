from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.core.database import Base
from app.models.user import utcnow


class Blueprint(Base):
    __tablename__ = "blueprints"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    data: Mapped[dict] = mapped_column(JSON, nullable=False)
    raw_output: Mapped[str] = mapped_column(Text, default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, index=True, nullable=False
    )

    owner: Mapped["User"] = relationship(back_populates="blueprints")

    diagrams: Mapped[list["Diagram"]] = relationship(
        back_populates="blueprint",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    documentation: Mapped["Documentation | None"] = relationship(
        back_populates="blueprint",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    chat_session: Mapped["ChatSession | None"] = relationship(
        back_populates="blueprint",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
