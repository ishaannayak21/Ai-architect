from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, field_validator

from app.schemas.blueprint import ApiEndpoint, DatabaseTableItem


class UseCaseItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    title: str = ""
    actor: str = ""
    preconditions: str = ""
    main_flow: list[str] = []
    postconditions: str = ""


class FutureEnhancementItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    title: str = ""
    description: str = ""
    impact: str = "Medium"  # High, Medium, Low


class DocumentationData(BaseModel):
    model_config = ConfigDict(extra="ignore")

    executive_summary: str = ""
    project_vision: str = ""
    functional_requirements: list[str] = []
    non_functional_requirements: list[str] = []
    user_roles: list[str] = []
    use_cases: list[UseCaseItem] = []
    tech_stack: list[str] = []
    database_tables: list[DatabaseTableItem] = []
    api_endpoints: list[ApiEndpoint] = []
    folder_structure: str | list[str] = ""
    system_architecture_description: str = ""
    deployment_strategy: list[str] = []
    development_timeline: list[str] = []
    future_enhancements: list[FutureEnhancementItem] = []

    @field_validator(
        "functional_requirements",
        "non_functional_requirements",
        "user_roles",
        "tech_stack",
        "deployment_strategy",
        "development_timeline",
        mode="before",
    )
    @classmethod
    def coerce_list_strings(cls, v: Any) -> Any:
        if isinstance(v, str):
            return [line.strip("- *") for line in v.splitlines() if line.strip()]
        return v


class DocumentationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    blueprint_id: int
    data: DocumentationData
    created_at: datetime
    updated_at: datetime
