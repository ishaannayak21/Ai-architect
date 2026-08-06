from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class DatabaseTableItem(BaseModel):
    model_config = ConfigDict(extra="ignore", from_attributes=True)

    name: str = ""
    purpose: str = ""
    columns: list[str] | None = None

    @field_validator("name", mode="before")
    @classmethod
    def coerce_name(cls, v: Any) -> str:
        return str(v) if v is not None else ""

    @field_validator("columns", mode="before")
    @classmethod
    def coerce_columns(cls, v: Any) -> list[str] | None:
        if v is None:
            return None
        if isinstance(v, list):
            res: list[str] = []
            for item in v:
                if isinstance(item, str):
                    res.append(item)
                elif isinstance(item, dict):
                    name = item.get("name") or item.get("column") or ""
                    col_type = item.get("type") or item.get("data_type") or ""
                    if name and col_type:
                        res.append(f"{name}: {col_type}")
                    elif name:
                        res.append(str(name))
                    else:
                        res.append(str(item))
                else:
                    res.append(str(item))
            return res
        if isinstance(v, str):
            return [v]
        return None


class ApiEndpoint(BaseModel):
    model_config = ConfigDict(extra="ignore", from_attributes=True)

    method: str = "GET"
    path: str = ""
    description: str = ""


class ArchitectBlueprint(BaseModel):
    model_config = ConfigDict(extra="ignore")

    project_summary: str = ""
    functional_requirements: list[str] = []
    non_functional_requirements: list[str] = []
    user_roles: list[str] = []
    core_features: list[str] = []
    recommended_tech_stack: list[str] = []
    database_tables: list[DatabaseTableItem] = []
    rest_api_endpoints: list[ApiEndpoint] = []
    folder_structure: str | list[str] = ""
    security_recommendations: list[str] = []
    deployment_strategy: list[str] = []
    development_timeline: list[str] = []
    estimated_team_size: int | str | None = None

    @field_validator("database_tables", mode="before")
    @classmethod
    def coerce_database_tables(cls, v: Any) -> Any:
        if isinstance(v, list):
            items = []
            for item in v:
                if isinstance(item, str):
                    items.append({"name": item, "purpose": "", "columns": []})
                elif isinstance(item, dict):
                    items.append(item)
                else:
                    items.append({"name": str(item), "purpose": "", "columns": []})
            return items
        if isinstance(v, dict):
            items = []
            for tbl_name, tbl_val in v.items():
                if isinstance(tbl_val, dict):
                    items.append({"name": tbl_name, **tbl_val})
                elif isinstance(tbl_val, list):
                    items.append({"name": tbl_name, "columns": tbl_val})
                else:
                    items.append({"name": tbl_name, "purpose": str(tbl_val)})
            return items
        return v

    @field_validator("rest_api_endpoints", mode="before")
    @classmethod
    def coerce_rest_api_endpoints(cls, v: Any) -> Any:
        if isinstance(v, list):
            items = []
            for item in v:
                if isinstance(item, str):
                    # Parse strings like "POST /api/v1/rides: Create a ride"
                    parts = item.split(":", 1)
                    ep_str = parts[0].strip()
                    desc = parts[1].strip() if len(parts) > 1 else ""
                    ep_parts = ep_str.split(" ", 1)
                    if len(ep_parts) > 1 and ep_parts[0].upper() in ("GET", "POST", "PUT", "PATCH", "DELETE"):
                        method = ep_parts[0].upper()
                        path = ep_parts[1].strip()
                    else:
                        method = "GET"
                        path = ep_str
                    items.append({"method": method, "path": path, "description": desc})
                elif isinstance(item, dict):
                    items.append(item)
                else:
                    items.append({"method": "GET", "path": str(item), "description": ""})
            return items
        if isinstance(v, dict):
            items = []
            for path, details in v.items():
                if isinstance(details, dict):
                    items.append({"path": path, **details})
                else:
                    items.append({"path": path, "description": str(details)})
            return items
        return v

    @field_validator(
        "functional_requirements",
        "non_functional_requirements",
        "user_roles",
        "core_features",
        "recommended_tech_stack",
        "security_recommendations",
        "deployment_strategy",
        "development_timeline",
        mode="before",
    )
    @classmethod
    def coerce_list_of_strings(cls, v: Any) -> Any:
        if isinstance(v, str):
            return [line.strip("- *") for line in v.splitlines() if line.strip()]
        if isinstance(v, list):
            return [str(item) for item in v]
        return v

    @field_validator("estimated_team_size", mode="before")
    @classmethod
    def coerce_team_size(cls, v: Any) -> Any:
        if isinstance(v, dict):
            return str(
                v.get("size")
                or v.get("team_size")
                or v.get("count")
                or list(v.values())[0]
            )
        return v


class BlueprintGenerateRequest(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str = Field(default="", max_length=5000)


class BlueprintRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    data: ArchitectBlueprint
    created_at: datetime