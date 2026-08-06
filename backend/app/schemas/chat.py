from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ChatMessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=5000)


class ChatMessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    session_id: int
    role: str
    content: str
    updated_section: str | None = None
    created_at: datetime


class ChatSessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    blueprint_id: int
    messages: list[ChatMessageRead] = []
    created_at: datetime
    updated_at: datetime


class QuickPromptItem(BaseModel):
    label: str
    prompt: str
    icon: str
