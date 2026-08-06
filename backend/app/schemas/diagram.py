from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class DiagramType(str, Enum):
    system_architecture = "system_architecture"
    database_er = "database_er"
    application_flowchart = "application_flowchart"
    api_sequence = "api_sequence"
    deployment = "deployment"


class DiagramRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    blueprint_id: int
    diagram_type: DiagramType
    mermaid_code: str
    created_at: datetime
