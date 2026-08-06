from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.core.database import Base
from app.models.user import utcnow


class Documentation(Base):
    __tablename__ = "documentations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    blueprint_id: Mapped[int] = mapped_column(
        ForeignKey("blueprints.id", ondelete="CASCADE"),
        unique=True,
        index=True,
        nullable=False,
    )
    data: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    blueprint: Mapped["Blueprint"] = relationship(back_populates="documentation")
