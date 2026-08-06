import logging
from datetime import datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.blueprint import Blueprint
from app.models.diagram import Diagram
from app.models.documentation import Documentation
from app.models.project import Project
from app.models.user import User
from app.schemas.blueprint import ArchitectBlueprint
from app.schemas.documentation import (
    DocumentationData,
    FutureEnhancementItem,
    UseCaseItem,
)
from app.services import ai_service
from app.utils.exceptions import BlueprintNotFoundError

logger = logging.getLogger("ai_architect")


def resolve_user_blueprint(db: Session, user: User, id_value: int) -> Blueprint:
    """Resolve a blueprint for a user by blueprint ID or project ID."""
    # Direct Blueprint lookup
    bp = db.get(Blueprint, id_value)
    if bp is not None and bp.owner_id == user.id:
        return bp

    # Project lookup by ID -> match corresponding Blueprint by title/owner
    proj = db.get(Project, id_value)
    if proj is not None and proj.owner_id == user.id:
        stmt = (
            select(Blueprint)
            .where(Blueprint.owner_id == user.id, Blueprint.title == proj.title)
            .order_by(Blueprint.created_at.desc())
        )
        found_bp = db.scalar(stmt)
        if found_bp is not None:
            return found_bp

    # Fallback to matching any blueprint owned by user by title or ID
    stmt = (
        select(Blueprint)
        .where(Blueprint.owner_id == user.id)
        .order_by(Blueprint.created_at.desc())
    )
    user_bps = list(db.scalars(stmt).all())
    if user_bps:
        for u_bp in user_bps:
            if u_bp.id == id_value:
                return u_bp
        return user_bps[0]

    raise BlueprintNotFoundError()


def _get_diagrams_dict(db: Session, blueprint_id: int) -> dict[str, str]:
    stmt = select(Diagram).where(Diagram.blueprint_id == blueprint_id)
    diagrams = db.scalars(stmt).all()
    return {d.diagram_type: d.mermaid_code for d in diagrams}


def build_documentation_from_blueprint(
    blueprint: ArchitectBlueprint, diagrams: dict[str, str] | None = None
) -> DocumentationData:
    """Build complete 14-section documentation directly from stored blueprint in DB (ZERO AI calls)."""
    summary = blueprint.project_summary or "Architecture Blueprint Documentation"
    features = blueprint.core_features or []
    reqs = blueprint.functional_requirements or []
    non_reqs = blueprint.non_functional_requirements or []
    roles = blueprint.user_roles or ["User", "Administrator"]
    stack = blueprint.recommended_tech_stack or []
    tables = blueprint.database_tables or []
    endpoints = blueprint.rest_api_endpoints or []
    folder = blueprint.folder_structure or ""
    deployment = blueprint.deployment_strategy or []
    timeline = blueprint.development_timeline or []
    security = blueprint.security_recommendations or []

    # Project Vision
    vision = (
        f"{summary} Designed as a production-ready software solution, "
        f"the system emphasizes enterprise scalability, high availability, and robust security "
        f"serving {', '.join(roles)} across client applications."
    )

    # Structured Use Cases
    use_cases: list[UseCaseItem] = []
    if features:
        for idx, feat in enumerate(features[:5], 1):
            actor = roles[(idx - 1) % len(roles)]
            matching_ep = endpoints[(idx - 1) % len(endpoints)] if endpoints else None
            ep_path = matching_ep.path if matching_ep else f"/api/v1/resource-{idx}"

            use_cases.append(
                UseCaseItem(
                    title=f"UC-{idx:02d}: {feat}",
                    actor=actor,
                    preconditions=f"{actor} is authenticated with valid authorization token",
                    main_flow=[
                        f"{actor} accesses the application interface",
                        "System validates input parameters and user permissions",
                        f"Client dispatches request payload to {ep_path}",
                        "Backend executes business logic transaction and persists updates to database",
                        f"System returns status confirmation and renders updated view for {actor}",
                    ],
                    postconditions="Transaction committed to database and state synchronized",
                )
            )
    else:
        use_cases.append(
            UseCaseItem(
                title="UC-01: Core System Workflow",
                actor=roles[0],
                preconditions="Authenticated session active",
                main_flow=[
                    f"{roles[0]} accesses primary application interface",
                    "System processes user request and updates application state",
                    "Database transaction completes successfully",
                    "Response returned to client with updated state",
                ],
                postconditions="Application state synchronized",
            )
        )

    # System Architecture Description
    stack_text = ", ".join(stack) if stack else "Modern Multi-Tier Stack"
    tables_text = f"{len(tables)} relational database tables" if tables else "persistent data store"
    endpoints_text = f"{len(endpoints)} REST API endpoints" if endpoints else "RESTful API services"
    arch_desc = (
        f"The system architecture utilizes a multi-tier decoupled topology built on {stack_text}. "
        f"The presentation layer communicates with the backend via {endpoints_text}, "
        f"persisting state across {tables_text}. "
        f"Security recommendations include {', '.join(security[:3]) if security else 'role-based access controls and TLS encryption'}."
    )

    # Future Enhancements
    future_enhancements: list[FutureEnhancementItem] = []
    if security:
        for sec_item in security[:3]:
            future_enhancements.append(
                FutureEnhancementItem(
                    title=f"Security Hardening: {sec_item.split(':')[0] if ':' in sec_item else sec_item[:30]}",
                    description=sec_item,
                    impact="High",
                )
            )

    future_enhancements.extend([
        FutureEnhancementItem(
            title="Microservices Decoupling & Global Edge Caching",
            description="Decouple high-traffic API modules into microservices with global CDN edge caching.",
            impact="High",
        ),
        FutureEnhancementItem(
            title="Real-Time Telemetry & Distributed Tracing",
            description="Integrate OpenTelemetry collectors and automated operational monitoring dashboards.",
            impact="Medium",
        ),
    ])

    return DocumentationData(
        executive_summary=summary,
        project_vision=vision,
        functional_requirements=reqs,
        non_functional_requirements=non_reqs,
        user_roles=roles,
        use_cases=use_cases,
        tech_stack=stack,
        database_tables=tables,
        api_endpoints=endpoints,
        folder_structure=folder,
        system_architecture_description=arch_desc,
        deployment_strategy=deployment,
        development_timeline=timeline,
        future_enhancements=future_enhancements,
    )


def get_or_create_documentation(
    db: Session, user: User, id_value: int
) -> Documentation:
    """Fetch cached documentation from DB (ZERO AI requests). Automatically compile ONCE if missing."""
    blueprint = resolve_user_blueprint(db, user, id_value)
    existing = db.scalar(
        select(Documentation).where(Documentation.blueprint_id == blueprint.id)
    )
    if existing is not None:
        logger.info(f"Loaded documentation for blueprint {blueprint.id} from DB cache (0 AI calls).")
        return existing

    logger.info(f"Compiling initial documentation for blueprint {blueprint.id} from stored database blueprint (0 AI calls)...")
    architect_bp = ArchitectBlueprint.model_validate(blueprint.data)
    diagrams = _get_diagrams_dict(db, blueprint.id)

    # Generate ONCE directly from stored blueprint in database (NO AI call)
    doc_data = build_documentation_from_blueprint(architect_bp, diagrams)

    record = Documentation(
        blueprint_id=blueprint.id,
        data=doc_data.model_dump(mode="json"),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def regenerate_documentation(
    db: Session, user: User, id_value: int
) -> Documentation:
    """Force regenerate documentation via AI (or fallback to blueprint compiler) and update DB."""
    blueprint = resolve_user_blueprint(db, user, id_value)
    logger.info(f"Regenerating documentation for blueprint {blueprint.id}...")
    architect_bp = ArchitectBlueprint.model_validate(blueprint.data)
    diagrams = _get_diagrams_dict(db, blueprint.id)

    try:
        doc_data = ai_service.generate_documentation(architect_bp, diagrams)
    except Exception as exc:
        logger.warning(f"AI regeneration unavailable ({exc}), compiling from stored blueprint...")
        doc_data = build_documentation_from_blueprint(architect_bp, diagrams)

    existing = db.scalar(
        select(Documentation).where(Documentation.blueprint_id == blueprint.id)
    )
    if existing is not None:
        existing.data = doc_data.model_dump(mode="json")
        existing.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing

    record = Documentation(
        blueprint_id=blueprint.id,
        data=doc_data.model_dump(mode="json"),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def export_markdown(doc_data: dict[str, Any], title: str, diagrams: dict[str, str]) -> str:
    """Export documentation in GitHub Flavored Markdown format."""
    lines: list[str] = [
        f"# {title} - Architecture Documentation",
        "",
        "> **AI Software Architect Professional Documentation Center**",
        "",
        "## Table of Contents",
        "1. [Executive Summary](#1-executive-summary)",
        "2. [Project Vision](#2-project-vision)",
        "3. [Functional Requirements](#3-functional-requirements)",
        "4. [Non-Functional Requirements](#4-non-functional-requirements)",
        "5. [User Roles](#5-user-roles)",
        "6. [Use Cases](#6-use-cases)",
        "7. [Tech Stack](#7-tech-stack)",
        "8. [Database Design](#8-database-design)",
        "9. [API Documentation](#9-api-documentation)",
        "10. [Folder Structure](#10-folder-structure)",
        "11. [System Architecture](#11-system-architecture)",
        "12. [Deployment Strategy](#12-deployment-strategy)",
        "13. [Development Timeline](#13-development-timeline)",
        "14. [Future Enhancements](#14-future-enhancements)",
        "",
        "---",
        "",
        "## 1. Executive Summary",
        doc_data.get("executive_summary", ""),
        "",
        "## 2. Project Vision",
        doc_data.get("project_vision", ""),
        "",
        "## 3. Functional Requirements",
    ]
    for item in doc_data.get("functional_requirements", []):
        lines.append(f"- {item}")
    lines.extend(["", "## 4. Non-Functional Requirements"])
    for item in doc_data.get("non_functional_requirements", []):
        lines.append(f"- {item}")
    lines.extend(["", "## 5. User Roles"])
    for item in doc_data.get("user_roles", []):
        lines.append(f"- {item}")
    lines.extend(["", "## 6. Use Cases"])
    for uc in doc_data.get("use_cases", []):
        lines.append(f"### {uc.get('title', 'Use Case')}")
        lines.append(f"- **Actor**: {uc.get('actor', 'N/A')}")
        lines.append(f"- **Preconditions**: {uc.get('preconditions', 'N/A')}")
        lines.append("- **Main Flow**:")
        for step in uc.get("main_flow", []):
            lines.append(f"  1. {step}")
        lines.append(f"- **Postconditions**: {uc.get('postconditions', 'N/A')}")
        lines.append("")

    lines.extend(["## 7. Tech Stack"])
    for item in doc_data.get("tech_stack", []):
        lines.append(f"- {item}")

    lines.extend(["", "## 8. Database Design"])
    if diagrams.get("database_er"):
        lines.extend(["```mermaid", diagrams["database_er"], "```", ""])
    for tbl in doc_data.get("database_tables", []):
        lines.append(f"### Table: `{tbl.get('name')}`")
        lines.append(f"*{tbl.get('purpose', '')}*")
        lines.append("Columns:")
        for col in tbl.get("columns") or []:
            lines.append(f"- `{col}`")
        lines.append("")

    lines.extend(["## 9. API Documentation"])
    if diagrams.get("api_sequence"):
        lines.extend(["```mermaid", diagrams["api_sequence"], "```", ""])
    for ep in doc_data.get("api_endpoints", []):
        lines.append(f"- **`{ep.get('method', 'GET')} {ep.get('path', '')}`**: {ep.get('description', '')}")
    lines.append("")

    folder_str = doc_data.get("folder_structure", "")
    if isinstance(folder_str, list):
        folder_str = "\n".join(folder_str)
    lines.extend(["## 10. Folder Structure", "```", folder_str, "```", ""])

    lines.extend(["## 11. System Architecture", doc_data.get("system_architecture_description", "")])
    if diagrams.get("system_architecture"):
        lines.extend(["", "```mermaid", diagrams["system_architecture"], "```", ""])

    lines.extend(["", "## 12. Deployment Strategy"])
    if diagrams.get("deployment"):
        lines.extend(["```mermaid", diagrams["deployment"], "```", ""])
    for item in doc_data.get("deployment_strategy", []):
        lines.append(f"- {item}")

    lines.extend(["", "## 13. Development Timeline"])
    if diagrams.get("application_flowchart"):
        lines.extend(["```mermaid", diagrams["application_flowchart"], "```", ""])
    for item in doc_data.get("development_timeline", []):
        lines.append(f"- {item}")

    lines.extend(["", "## 14. Future Enhancements"])
    for fe in doc_data.get("future_enhancements", []):
        lines.append(f"- **{fe.get('title')}** `[{fe.get('impact', 'Medium')} Impact]`: {fe.get('description')}")

    return "\n".join(lines)


def export_html(doc_data: dict[str, Any], title: str, diagrams: dict[str, str]) -> str:
    """Export documentation as a standalone, styled HTML document."""
    md_content = export_markdown(doc_data, title, diagrams)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} - Professional Technical Documentation</title>
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #090d16;
      color: #e2e8f0;
      margin: 0;
      padding: 2rem;
      line-height: 1.6;
    }}
    .container {{
      max-width: 900px;
      margin: 0 auto;
      background: #0f172a;
      padding: 3rem;
      border-radius: 1rem;
      border: 1px solid #1e293b;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }}
    .cover-page {{
      text-align: center;
      padding: 4rem 0 6rem 0;
      border-bottom: 2px solid #334155;
      margin-bottom: 3rem;
    }}
    .cover-title {{
      font-size: 2.75rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 1rem;
    }}
    .cover-subtitle {{
      font-size: 1.25rem;
      color: #94a3b8;
    }}
    h1, h2, h3 {{
      color: #f8fafc;
      margin-top: 2rem;
    }}
    h2 {{
      border-bottom: 1px solid #334155;
      padding-bottom: 0.5rem;
      color: #818cf8;
    }}
    pre {{
      background: #1e293b;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      border: 1px solid #334155;
      font-family: monospace;
      font-size: 0.9rem;
    }}
    code {{
      background: #1e293b;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-family: monospace;
      color: #38bdf8;
    }}
    ul, ol {{
      padding-left: 1.5rem;
    }}
    li {{
      margin-bottom: 0.5rem;
    }}
    .footer {{
      margin-top: 4rem;
      text-align: center;
      font-size: 0.85rem;
      color: #64748b;
      border-top: 1px solid #1e293b;
      padding-top: 1.5rem;
    }}
    @media print {{
      body {{ background: #fff; color: #000; padding: 0; }}
      .container {{ max-width: 100%; border: none; box-shadow: none; padding: 0; }}
      h2 {{ color: #1e1b4b; border-color: #cbd5e1; }}
      pre {{ background: #f8fafc; border-color: #e2e8f0; color: #0f172a; }}
      code {{ background: #f1f5f9; color: #0284c7; }}
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="cover-page">
      <div class="cover-title">{title}</div>
      <div class="cover-subtitle">Executive Architecture & Software Documentation Manual</div>
      <p style="margin-top: 2rem; color: #64748b;">Generated by AI Software Architect Engine • {datetime.utcnow().strftime('%B %d, %Y')}</p>
    </div>
    <div class="content">
      <pre style="white-space: pre-wrap; font-family: inherit; background: transparent; border: none; padding: 0; color: inherit;">{md_content}</pre>
    </div>
    <div class="footer">
      Confidential • {title} Architectural Specification
    </div>
  </div>
</body>
</html>"""
    return html
