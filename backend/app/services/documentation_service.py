import html as html_module
import logging
from datetime import datetime
from typing import Any

from fpdf import FPDF
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


def esc(val: Any) -> str:
    """Helper to safely escape strings for HTML insertion."""
    if val is None:
        return ""
    return html_module.escape(str(val))


def export_html(doc_data: dict[str, Any], title: str, diagrams: dict[str, str]) -> str:
    """Export documentation as a standalone, styled HTML document with interactive Mermaid diagrams."""
    safe_title = esc(title)
    exec_summary = esc(doc_data.get("executive_summary", ""))
    project_vision = esc(doc_data.get("project_vision", ""))

    # Functional Requirements
    func_reqs_html = "".join(f"<li>{esc(r)}</li>" for r in doc_data.get("functional_requirements", []))
    non_func_reqs_html = "".join(f"<li>{esc(r)}</li>" for r in doc_data.get("non_functional_requirements", []))
    roles_html = "".join(f'<span class="badge badge-brand">{esc(r)}</span>' for r in doc_data.get("user_roles", []))

    # Use Cases
    use_cases_html = ""
    for uc in doc_data.get("use_cases", []):
        steps_html = "".join(f"<li>{esc(s)}</li>" for s in uc.get("main_flow", []))
        use_cases_html += f"""
        <div class="card">
          <div class="card-header">
            <h3 className="card-title">{esc(uc.get("title", "Use Case"))}</h3>
            <span class="badge badge-neutral">Actor: {esc(uc.get("actor", "N/A"))}</span>
          </div>
          <p><strong>Preconditions:</strong> {esc(uc.get("preconditions", "N/A"))}</p>
          <p><strong>Main Flow:</strong></p>
          <ol>{steps_html}</ol>
          <p><strong>Postconditions:</strong> {esc(uc.get("postconditions", "N/A"))}</p>
        </div>"""

    # Tech Stack
    tech_stack_html = "".join(f'<span class="badge badge-tech">{esc(t)}</span>' for t in doc_data.get("tech_stack", []))

    # Database Tables
    db_tables_html = ""
    for tbl in doc_data.get("database_tables", []):
        cols = "".join(f'<span class="code-pill">{esc(c)}</span>' for c in (tbl.get("columns") or []))
        db_tables_html += f"""
        <div class="card">
          <div class="card-header">
            <strong>{esc(tbl.get("name"))}</strong>
            <span class="muted">{esc(tbl.get("purpose", ""))}</span>
          </div>
          <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.25rem;">
            {cols}
          </div>
        </div>"""

    # API Endpoints
    api_endpoints_html = ""
    for ep in doc_data.get("api_endpoints", []):
        method = esc(ep.get("method", "GET")).upper()
        api_endpoints_html += f"""
        <div class="api-item">
          <span class="method-badge method-{method.lower()}">{method}</span>
          <code>{esc(ep.get("path", ""))}</code>
          <span class="muted" style="margin-left: auto;">{esc(ep.get("description", ""))}</span>
        </div>"""

    # Folder Structure
    folder_str = doc_data.get("folder_structure", "")
    if isinstance(folder_str, list):
        folder_str = "\n".join(folder_str)
    folder_html = esc(folder_str)

    # Diagrams HTML
    sys_arch_diagram_html = f'<pre class="mermaid">\n{diagrams["system_architecture"]}\n</pre>' if diagrams.get("system_architecture") else ""
    db_er_diagram_html = f'<pre class="mermaid">\n{diagrams["database_er"]}\n</pre>' if diagrams.get("database_er") else ""
    flowchart_diagram_html = f'<pre class="mermaid">\n{diagrams["application_flowchart"]}\n</pre>' if diagrams.get("application_flowchart") else ""
    api_seq_diagram_html = f'<pre class="mermaid">\n{diagrams["api_sequence"]}\n</pre>' if diagrams.get("api_sequence") else ""
    deploy_diagram_html = f'<pre class="mermaid">\n{diagrams["deployment"]}\n</pre>' if diagrams.get("deployment") else ""

    # Deployment
    deploy_html = "".join(f"<li>{esc(d)}</li>" for d in doc_data.get("deployment_strategy", []))

    # Development Timeline
    timeline_html = "".join(f"<li>{esc(t)}</li>" for t in doc_data.get("development_timeline", []))

    # Future Enhancements
    future_html = ""
    for fe in doc_data.get("future_enhancements", []):
        future_html += f"""
        <div class="card">
          <div class="card-header">
            <strong>{esc(fe.get("title"))}</strong>
            <span class="badge badge-brand">{esc(fe.get("impact", "Medium"))} Impact</span>
          </div>
          <p>{esc(fe.get("description"))}</p>
        </div>"""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{safe_title} - Professional Technical Documentation</title>
  <style>
    :root {{
      --bg: #090d16;
      --surface: #0f172a;
      --border: #1e293b;
      --text: #e2e8f0;
      --muted: #94a3b8;
      --accent: #818cf8;
      --brand: #c05621;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 2rem;
      line-height: 1.6;
    }}
    .container {{
      max-width: 960px;
      margin: 0 auto;
      background: var(--surface);
      padding: 3rem;
      border-radius: 1rem;
      border: 1px solid var(--border);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }}
    .cover-page {{
      text-align: center;
      padding: 3rem 0 4rem 0;
      border-bottom: 2px solid var(--border);
      margin-bottom: 2.5rem;
    }}
    .cover-title {{
      font-size: 2.5rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }}
    .cover-subtitle {{
      font-size: 1.15rem;
      color: var(--muted);
    }}
    h2 {{
      color: var(--accent);
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem;
      margin-top: 2.5rem;
      font-size: 1.4rem;
    }}
    h3 {{
      color: #f8fafc;
      margin-top: 1rem;
      font-size: 1.1rem;
    }}
    .card {{
      background: #141e33;
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 1.25rem;
      margin-bottom: 1rem;
    }}
    .card-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }}
    .badge {{
      display: inline-block;
      padding: 0.25rem 0.6rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      margin-right: 0.4rem;
      margin-bottom: 0.4rem;
    }}
    .badge-brand {{ background: rgba(192, 86, 33, 0.2); color: #f97316; border: 1px solid rgba(249, 115, 22, 0.3); }}
    .badge-tech {{ background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(129, 140, 248, 0.3); }}
    .badge-neutral {{ background: #1e293b; color: var(--muted); }}
    .code-pill {{
      background: #1e293b;
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      font-family: monospace;
      font-size: 0.8rem;
      color: #38bdf8;
    }}
    .api-item {{
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #141e33;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border);
      margin-bottom: 0.5rem;
    }}
    .method-badge {{
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      font-family: monospace;
      font-size: 0.75rem;
      font-weight: bold;
      color: #fff;
    }}
    .method-get {{ background: #0284c7; }}
    .method-post {{ background: #16a34a; }}
    .method-put, .method-patch {{ background: #d97706; }}
    .method-delete {{ background: #dc2626; }}
    pre {{
      background: #020617;
      padding: 1.25rem;
      border-radius: 0.75rem;
      overflow-x: auto;
      border: 1px solid var(--border);
      font-family: monospace;
      font-size: 0.85rem;
      color: #f1f5f9;
    }}
    .muted {{ color: var(--muted); font-size: 0.85rem; }}
    .footer {{
      margin-top: 4rem;
      text-align: center;
      font-size: 0.85rem;
      color: var(--muted);
      border-top: 1px solid var(--border);
      padding-top: 1.5rem;
    }}
    @media print {{
      body {{ background: #fff; color: #000; padding: 0; }}
      .container {{ max-width: 100%; border: none; box-shadow: none; padding: 0; background: #fff; }}
      h2 {{ color: #1e1b4b; border-color: #cbd5e1; }}
      .card, .api-item {{ background: #f8fafc; border-color: #cbd5e1; color: #000; }}
      pre {{ background: #f1f5f9; border-color: #cbd5e1; color: #000; }}
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="cover-page">
      <div class="cover-title">{safe_title}</div>
      <div class="cover-subtitle">Executive Architecture & Software Documentation Manual</div>
      <p style="margin-top: 1.5rem; color: var(--muted);">Generated by AI Software Architect Engine • {datetime.utcnow().strftime('%B %d, %Y')}</p>
    </div>

    <section id="sec-1">
      <h2>1. Executive Summary</h2>
      <p>{exec_summary}</p>
    </section>

    <section id="sec-2">
      <h2>2. Project Vision</h2>
      <p>{project_vision}</p>
    </section>

    <section id="sec-3">
      <h2>3. Functional Requirements</h2>
      <ul>{func_reqs_html}</ul>
    </section>

    <section id="sec-4">
      <h2>4. Non-Functional Requirements</h2>
      <ul>{non_func_reqs_html}</ul>
    </section>

    <section id="sec-5">
      <h2>5. User Roles</h2>
      <div>{roles_html}</div>
    </section>

    <section id="sec-6">
      <h2>6. Use Cases</h2>
      {use_cases_html}
    </section>

    <section id="sec-7">
      <h2>7. Tech Stack</h2>
      <div>{tech_stack_html}</div>
    </section>

    <section id="sec-8">
      <h2>8. Database Design</h2>
      {db_er_diagram_html}
      {db_tables_html}
    </section>

    <section id="sec-9">
      <h2>9. API Documentation</h2>
      {api_seq_diagram_html}
      {api_endpoints_html}
    </section>

    <section id="sec-10">
      <h2>10. Folder Structure</h2>
      <pre><code>{folder_html}</code></pre>
    </section>

    <section id="sec-11">
      <h2>11. System Architecture</h2>
      <p>{esc(doc_data.get("system_architecture_description", ""))}</p>
      {sys_arch_diagram_html}
    </section>

    <section id="sec-12">
      <h2>12. Deployment Strategy</h2>
      {deploy_diagram_html}
      <ul>{deploy_html}</ul>
    </section>

    <section id="sec-13">
      <h2>13. Development Timeline</h2>
      {flowchart_diagram_html}
      <ul>{timeline_html}</ul>
    </section>

    <section id="sec-14">
      <h2>14. Future Enhancements</h2>
      {future_html}
    </section>

    <div class="footer">
      Confidential • {safe_title} Architectural Specification
    </div>
  </div>

  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    mermaid.initialize({{ startOnLoad: true, theme: 'dark' }});
  </script>
</body>
</html>"""
    return html


def clean_text_for_pdf(text: str) -> str:
    """Clean string to safely render within standard FPDF fonts (Helvetica/Latin-1)."""
    if not text:
        return ""
    replacements = {
        "\u2019": "'",
        "\u2018": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2014": "-",
        "\u2013": "-",
        "\u2022": "-",
        "\u2026": "...",
    }
    for orig, repl in replacements.items():
        text = text.replace(orig, repl)
    return text.encode("latin-1", "replace").decode("latin-1")


class PDFReport(FPDF):
    def __init__(self, doc_title: str):
        super().__init__()
        self.doc_title = doc_title

    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 6, clean_text_for_pdf(f"{self.doc_title} - Architectural Specification"), border=0, new_x="RIGHT", new_y="TOP", align="L")
            self.cell(0, 6, clean_text_for_pdf("AI Software Architect"), border=0, new_x="LMARGIN", new_y="NEXT", align="R")
            self.set_draw_color(200, 200, 200)
            self.line(10, 15, 200, 15)
            self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, clean_text_for_pdf(f"Page {self.page_no()}/{{nb}}"), align="C")


def export_pdf(doc_data: dict[str, Any], title: str, diagrams: dict[str, str]) -> bytes:
    """Export documentation as a styled multi-page PDF document."""
    pdf = PDFReport(title)
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Cover Banner
    pdf.set_fill_color(34, 56, 41)
    pdf.rect(0, 0, 210, 35, "F")
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(255, 255, 255)
    pdf.set_y(10)
    pdf.set_x(10)
    pdf.cell(0, 10, clean_text_for_pdf(title), new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_x(10)
    pdf.cell(0, 6, clean_text_for_pdf("Executive Architecture & Software Documentation Manual"), new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.ln(15)

    def p(txt: str, style: str = "", size: int = 10, mono: bool = False):
        pdf.set_x(10)
        font_family = "Courier" if mono else "Helvetica"
        pdf.set_font(font_family, style, size)
        pdf.set_text_color(40, 40, 40)
        pdf.multi_cell(0, 4 if mono else 5, clean_text_for_pdf(txt))

    def add_section_header(num: int, name: str):
        pdf.set_x(10)
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(192, 86, 33)
        pdf.cell(0, 8, clean_text_for_pdf(f"{num}. {name}"), new_x="LMARGIN", new_y="NEXT")
        pdf.set_draw_color(226, 223, 213)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(4)
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(40, 40, 40)

    # 1. Executive Summary
    add_section_header(1, "Executive Summary")
    p(doc_data.get("executive_summary", "N/A"))
    pdf.ln(4)

    # 2. Project Vision
    add_section_header(2, "Project Vision")
    p(doc_data.get("project_vision", "N/A"))
    pdf.ln(4)

    # 3. Functional Requirements
    add_section_header(3, "Functional Requirements")
    for req in doc_data.get("functional_requirements", []):
        p(f"- {req}")
    pdf.ln(4)

    # 4. Non-Functional Requirements
    add_section_header(4, "Non-Functional Requirements")
    for nfr in doc_data.get("non_functional_requirements", []):
        p(f"- {nfr}")
    pdf.ln(4)

    # 5. User Roles
    add_section_header(5, "User Roles")
    roles = doc_data.get("user_roles", [])
    if roles:
        p(f"Configured Roles: {', '.join(roles)}")
    pdf.ln(4)

    # 6. Use Cases
    add_section_header(6, "Use Cases")
    for uc in doc_data.get("use_cases", []):
        p(uc.get("title", "Use Case"), style="B", size=10)
        p(f"Actor: {uc.get('actor', 'N/A')}", size=9)
        p(f"Preconditions: {uc.get('preconditions', 'N/A')}", size=9)
        p("Main Flow:", size=9)
        for idx, step in enumerate(uc.get("main_flow", []), 1):
            p(f"  {idx}. {step}", size=9)
        p(f"Postconditions: {uc.get('postconditions', 'N/A')}", size=9)
        pdf.ln(2)

    # 7. Tech Stack
    add_section_header(7, "Recommended Tech Stack")
    stack = doc_data.get("tech_stack", [])
    if stack:
        p(f"Technologies: {', '.join(stack)}")
    pdf.ln(4)

    # 8. Database Design
    add_section_header(8, "Database Design")
    if diagrams.get("database_er"):
        p(f"[ Database ER Diagram ]\n{diagrams['database_er']}", size=8, mono=True)
        pdf.ln(2)
    for tbl in doc_data.get("database_tables", []):
        cols = ", ".join(tbl.get("columns", []))
        p(f"Table: {tbl.get('name')} ({tbl.get('purpose', '')})", style="B", size=9)
        p(f"Columns: {cols}", size=9)
        pdf.ln(1)
    pdf.ln(4)

    # 9. API Documentation
    add_section_header(9, "API Documentation")
    if diagrams.get("api_sequence"):
        p(f"[ API Sequence Diagram ]\n{diagrams['api_sequence']}", size=8, mono=True)
        pdf.ln(2)
    for ep in doc_data.get("api_endpoints", []):
        p(f"- [{ep.get('method', 'GET')}] {ep.get('path', '')}: {ep.get('description', '')}")
    pdf.ln(4)

    # 10. Folder Structure
    add_section_header(10, "Folder Structure")
    folder_str = doc_data.get("folder_structure", "")
    if isinstance(folder_str, list):
        folder_str = "\n".join(folder_str)
    p(folder_str, size=8, mono=True)
    pdf.ln(4)

    # 11. System Architecture
    add_section_header(11, "System Architecture")
    p(doc_data.get("system_architecture_description", ""))
    if diagrams.get("system_architecture"):
        pdf.ln(2)
        p(f"[ System Architecture Diagram ]\n{diagrams['system_architecture']}", size=8, mono=True)
    pdf.ln(4)

    # 12. Deployment Strategy
    add_section_header(12, "Deployment Strategy")
    if diagrams.get("deployment"):
        p(f"[ Deployment Diagram ]\n{diagrams['deployment']}", size=8, mono=True)
        pdf.ln(2)
    for item in doc_data.get("deployment_strategy", []):
        p(f"- {item}")
    pdf.ln(4)

    # 13. Development Timeline
    add_section_header(13, "Development Timeline")
    if diagrams.get("application_flowchart"):
        p(f"[ Application Workflow Diagram ]\n{diagrams['application_flowchart']}", size=8, mono=True)
        pdf.ln(2)
    for item in doc_data.get("development_timeline", []):
        p(f"- {item}")
    pdf.ln(4)

    # 14. Future Enhancements
    add_section_header(14, "Future Enhancements")
    for fe in doc_data.get("future_enhancements", []):
        p(f"- [{fe.get('impact', 'Medium')} Impact] {fe.get('title')}: {fe.get('description')}")

    return bytes(pdf.output())


