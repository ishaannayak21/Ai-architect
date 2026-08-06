from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.user import utcnow


class Diagram(Base):
    __tablename__ = "diagrams"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    blueprint_id: Mapped[int] = mapped_column(
        ForeignKey("blueprints.id", ondelete="CASCADE"), index=True, nullable=False
    )
    diagram_type: Mapped[str] = mapped_column(String(50), nullable=False)
    mermaid_code: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )

    blueprint: Mapped["Blueprint"] = relationship(back_populates="diagrams")