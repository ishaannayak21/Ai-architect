"""Gemini-powered AI Software Architect engine.

Calls the Gemini REST API using only the standard library and validates the
structured JSON response against the ArchitectBlueprint schema.

The API key is always read from the environment (Settings.GEMINI_API_KEY) and is
never hardcoded or leaked into logs, errors, or responses.
"""

import json
import logging
import re
import time
import urllib.error
import urllib.request
from typing import Any

from pydantic import ValidationError

from app.core.config import get_settings
from app.schemas.blueprint import ArchitectBlueprint
from app.schemas.diagram import DiagramType
from app.schemas.documentation import DocumentationData
from app.utils.exceptions import (
    AIGenerationError,
    AIGenerationUnavailableError,
    BlueprintValidationError,
    DiagramGenerationError,
)

logger = logging.getLogger("ai_architect")
settings = get_settings()

_GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"

_SYSTEM_PROMPT = """You are a senior software architect. You turn a product idea into a precise,
production-ready engineering blueprint.

Return ONLY valid JSON. No markdown, no code fences, no commentary.
The JSON must match EXACTLY this structure:

{
  "project_summary": "2-3 sentence summary of the application",
  "functional_requirements": ["string", "..."],
  "non_functional_requirements": ["string", "..."],
  "user_roles": ["string", "..."],
  "core_features": ["string", "..."],
  "recommended_tech_stack": ["string", "..."],
  "database_tables": [
    {"name": "table_name", "purpose": "what it stores", "columns": ["column: type", "..."]}
  ],
  "rest_api_endpoints": [
    {"method": "GET", "path": "/api/resource", "description": "what it does"}
  ],
  "folder_structure": "multi-line text representing the recommended folder tree",
  "security_recommendations": ["string", "..."],
  "deployment_strategy": ["string", "..."],
  "development_timeline": ["string", "..."],
  "estimated_team_size": "2-3 engineers"
}

Rules:
- All lists must be non-empty unless the idea makes them clearly unnecessary.
- database_tables and rest_api_endpoints must be detailed and realistic.
- Be specific and practical; avoid generic filler."""


def build_prompt(title: str, description: str) -> str:
    user_prompt = f"Application idea: {title}"
    if description and description.strip():
        user_prompt += f"\n\nAdditional context: {description.strip()}"
    user_prompt += (
        "\n\nProduce the complete architecture blueprint as valid JSON."
    )
    return f"{_SYSTEM_PROMPT}\n\n---\n\n{user_prompt}"


def _post_gemini(
    prompt: str, response_mime_type: str = "application/json"
) -> dict[str, Any]:
    """Send a prompt to Gemini and return the parsed JSON response.

    Raises AIGenerationError with the exact reason on any failure.
    """
    if not settings.GEMINI_API_KEY:
        raise AIGenerationUnavailableError()

    logger.info("Calling Gemini...")

    url = (
        f"{_GEMINI_BASE_URL}/{settings.GEMINI_MODEL}:generateContent"
        f"?key={settings.GEMINI_API_KEY}"
    )
    body = json.dumps(
        {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": settings.GEMINI_GENERATION_TEMPERATURE,
                "responseMimeType": response_mime_type,
            },
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=settings.GEMINI_TIMEOUT_SECONDS) as response:
            payload = json.loads(response.read().decode("utf-8"))
            logger.info("AI response received.")
    except urllib.error.HTTPError as exc:
        reason = _extract_http_error(exc)
        if exc.code == 429 or "quota" in reason.lower() or "limit" in reason.lower():
            raise AIGenerationError("Daily AI quota exceeded. Please try again later.") from exc
        raise AIGenerationError(f"Gemini API HTTP error {exc.code}: {reason}") from exc
    except urllib.error.URLError as exc:
        reason = str(getattr(exc, "reason", exc))
        raise AIGenerationError(f"Could not reach the Gemini API: {reason}") from exc
    except TimeoutError as exc:
        raise AIGenerationError("The Gemini API request timed out.") from exc
    except json.JSONDecodeError as exc:
        raise AIGenerationError("The Gemini API returned an invalid response.") from exc

    if "error" in payload:
        error = payload["error"]
        message = error.get("message") or error.get("status") or "unknown error"
        code = error.get("code")
        if code == 429 or "quota" in str(message).lower() or "limit" in str(message).lower():
            raise AIGenerationError("Daily AI quota exceeded. Please try again later.")
        raise AIGenerationError(
            f"Gemini API error ({code}): {message}" if code else f"Gemini API error: {message}"
        )

    return payload


def _extract_http_error(exc: urllib.error.HTTPError) -> str:
    """Read the Gemini error body to surface the exact reason."""
    try:
        raw = exc.read().decode("utf-8")
        data = json.loads(raw)
        return data.get("error", {}).get("message") or raw
    except Exception:
        return f"HTTP {exc.code}"


def _extract_text(payload: dict[str, Any]) -> str:
    try:
        parts = payload["candidates"][0]["content"]["parts"]
    except (KeyError, IndexError, TypeError) as exc:
        raise AIGenerationError(
            "The AI service returned an unexpected response. Please try again."
        ) from exc
    text = "".join(part.get("text", "") for part in parts).strip()
    if not text:
        raise AIGenerationError(
            "The AI service returned an empty response. Please try again."
        )
    return text


def _extract_json_text(raw: str) -> str:
    text = raw.strip()

    # Strip markdown code fences if present
    if text.startswith("```"):
        text = re.sub(r"^```[a-zA-Z]*\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
        text = text.strip()

    # Extract JSON object substring between first '{' and last '}'
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        text = text[first_brace : last_brace + 1]

    return text


def parse_blueprint(raw: str) -> ArchitectBlueprint:
    text = _extract_json_text(raw)
    try:
        data = json.loads(text, strict=False)
    except json.JSONDecodeError as exc:
        logger.error(f"[AI RAW PARSE FAILURE]: {raw}")
        print(f"[AI RAW PARSE FAILURE]: {raw}")
        raise BlueprintValidationError() from exc

    if not isinstance(data, dict):
        logger.error(f"[AI RAW INVALID DICT]: {raw}")
        print(f"[AI RAW INVALID DICT]: {raw}")
        raise BlueprintValidationError()

    # Support root dict or nested under 'blueprint' or 'architecture' key
    if "blueprint" in data and isinstance(data["blueprint"], dict):
        data = data["blueprint"]
    elif "architecture" in data and isinstance(data["architecture"], dict):
        data = data["architecture"]

    try:
        return ArchitectBlueprint.model_validate(data)
    except ValidationError as exc:
        logger.error(f"[AI RAW VALIDATION ERROR]: {exc}\nRAW: {raw}")
        print(f"[AI RAW VALIDATION ERROR]: {exc}\nRAW: {raw}")
        raise BlueprintValidationError() from exc


def _is_transient_error(exc: AIGenerationError) -> bool:
    detail = str(exc.detail)
    if "Daily AI quota exceeded" in detail:
        return False
    return any(
        code in detail for code in ("503", "429", "500", "quota", "rate limit")
    ) or "timed out" in detail


def _backoff_seconds(attempt: int) -> float:
    return (attempt + 1) * 2.0


def _retry_seconds(exc: AIGenerationError, attempt: int) -> float:
    detail = str(exc.detail)
    match = re.search(r"[Rr]etry in ~?(\d+(?:\.\d+)?)", detail)
    if match:
        return min(float(match.group(1)) + 2.0, 70.0)
    if "429" in detail or "quota" in detail:
        return 20.0
    return _backoff_seconds(attempt)


def generate_blueprint(title: str, description: str) -> tuple[ArchitectBlueprint, str]:
    prompt = build_prompt(title, description)
    attempts = max(1, settings.GEMINI_MAX_RETRIES)
    last_error: AIGenerationError | None = None
    for attempt in range(attempts):
        try:
            payload = _post_gemini(prompt)
            raw = _extract_text(payload)
            blueprint = parse_blueprint(raw)
            return blueprint, raw
        except BlueprintValidationError as exc:
            last_error = exc
            continue
        except AIGenerationError as exc:
            if _is_transient_error(exc) and attempt < attempts - 1:
                time.sleep(_retry_seconds(exc, attempt))
                continue
            raise
    if last_error is not None:
        raise last_error
    raise AIGenerationError()


def test_ai_connection() -> dict[str, Any]:
    """Verify the Gemini connection. Never includes the API key value."""
    if not settings.GEMINI_API_KEY:
        return {"ok": False, "error": "Gemini API key not configured."}
    try:
        payload = _post_gemini(
            "Reply with exactly: ok", response_mime_type="text/plain"
        )
        reply = _extract_text(payload)
        return {
            "ok": True,
            "message": "Gemini API connected successfully.",
            "reply": reply[:100],
            "model": settings.GEMINI_MODEL,
        }
    except AIGenerationError as exc:
        return {"ok": False, "error": exc.detail}
    except Exception as exc:  # pragma: no cover - defensive
        return {"ok": False, "error": str(exc) or type(exc).__name__}


_DIAGRAM_SYSTEM_PROMPT = """You are a senior software architect who creates precise Mermaid.js diagrams.

Generate Mermaid diagrams that accurately represent the software architecture provided in the context.

Return ONLY valid JSON. No markdown, no code fences, no commentary.
The JSON must match EXACTLY this structure:

{
  "system_architecture": "<mermaid code>",
  "database_er": "<mermaid code>",
  "application_flowchart": "<mermaid code>",
  "api_sequence": "<mermaid code>",
  "deployment": "<mermaid code>"
}

Diagram requirements:
- "system_architecture": a `flowchart TD` or `flowchart LR` showing the major components (frontend, backend, database, external services) and how they connect.
- "database_er": an `erDiagram` with the entities, their attributes and the relationships between them.
- "application_flowchart": a `flowchart TD` describing the core end-to-end user workflow step by step.
- "api_sequence": a `sequenceDiagram` showing the main API request flow between actors and services.
- "deployment": a `flowchart LR` or `graph LR` describing the deployment topology (client, load balancer, app servers, database, CDN, cloud regions).

Mermaid syntax rules (STRICT):
- Start each diagram with its correct declaration line: `flowchart TD`, `flowchart LR`, `graph LR`, `erDiagram`, or `sequenceDiagram`.
- NEVER wrap mermaid code in backticks, ``` fences, or markdown.
- Escape any double quotes used inside node labels with backslashes, or use single quotes inside label text.
- Keep node identifiers short (lowercase words or letters) and put human-friendly text in the label: A["Label"].
- For erDiagram use `IDENTIFIER {` blocks with `TYPE name` attributes.
- For sequenceDiagram use `participant`, `actor`, `->>`, `-->>`, `activate`, `deactivate`, `Note over`.
- Avoid unsupported Mermaid features. Simple, valid syntax only.
- Do not include comments in the output."""


def _blueprint_context(blueprint: ArchitectBlueprint) -> str:
    """Serialize a blueprint into a compact context string for the model."""
    lines: list[str] = []
    if blueprint.project_summary:
        lines.append(f"Project summary: {blueprint.project_summary}")
    if blueprint.core_features:
        lines.append("Core features: " + "; ".join(blueprint.core_features))
    if blueprint.recommended_tech_stack:
        lines.append("Tech stack: " + "; ".join(blueprint.recommended_tech_stack))
    if blueprint.database_tables:
        lines.append("Database tables:")
        for table in blueprint.database_tables:
            columns = ", ".join(table.columns or [])
            lines.append(f"- {table.name}: {columns}")
    if blueprint.rest_api_endpoints:
        lines.append("REST API endpoints:")
        for endpoint in blueprint.rest_api_endpoints:
            lines.append(
                f"- {endpoint.method} {endpoint.path}: {endpoint.description}"
            )
    if blueprint.deployment_strategy:
        lines.append(
            "Deployment strategy: " + "; ".join(blueprint.deployment_strategy)
        )
    return "\n".join(lines)


def _build_diagram_prompt(
    blueprint: ArchitectBlueprint, diagram_type: DiagramType | None = None
) -> str:
    context = _blueprint_context(blueprint) or "No additional context provided."
    if diagram_type is None:
        task = (
            "Generate all five diagrams for this architecture as valid JSON "
            "with the exact keys described above."
        )
    else:
        task = (
            f"Generate ONLY the \"{diagram_type.value}\" diagram for this "
            "architecture. Return valid JSON with exactly one key "
            f"\"{diagram_type.value}\" whose value is the mermaid code string."
        )
    user_prompt = (
        f"{context}\n\n{task}\n\nProduce only valid JSON containing valid "
        "Mermaid.js code."
    )
    return f"{_DIAGRAM_SYSTEM_PROMPT}\n\n---\n\n{user_prompt}"


_DIAGRAM_START_KEYWORDS = (
    "flowchart",
    "graph",
    "sequenceDiagram",
    "erDiagram",
    "classDiagram",
    "stateDiagram",
    "stateDiagram-v2",
    "gantt",
    "journey",
    "pie",
    "mindmap",
    "timeline",
    "quadrantChart",
    "xychart-beta",
    "architecture-beta",
)


def _clean_mermaid(raw: str) -> str:
    text = raw.strip()
    lines = text.splitlines()
    while lines and lines[0].strip().startswith("```"):
        lines.pop(0)
    while lines and lines[-1].strip().startswith("```"):
        lines.pop(-1)
    return "\n".join(lines).strip()


def validate_mermaid(code: str) -> str:
    """Lightweight Mermaid validation that rejects obviously invalid output."""
    text = _clean_mermaid(code)
    if not text:
        raise DiagramGenerationError()
    first_line = text.splitlines()[0].strip()
    first_token = first_line.split()[0] if first_line else ""
    if not any(
        first_line.startswith(keyword) or first_token == keyword
        for keyword in _DIAGRAM_START_KEYWORDS
    ):
        raise DiagramGenerationError()
    if len(text) > 20_000:
        raise DiagramGenerationError()
    # ER diagrams legitimately use `{` in one-to-many cardinality notation
    # (e.g. `||--o{`), so balance checks only apply to other diagram types.
    if first_line.startswith("erDiagram"):
        return text
    for open_char, close_char in (("{", "}"), ("[", "]"), ("(", ")")):
        if text.count(open_char) != text.count(close_char):
            raise DiagramGenerationError()
    return text


def generate_diagrams(blueprint: ArchitectBlueprint) -> dict[str, str]:
    """Generate all five Mermaid diagrams for a blueprint."""
    prompt = _build_diagram_prompt(blueprint)
    attempts = max(1, settings.GEMINI_MAX_RETRIES)
    last_error: AIGenerationError | None = None
    for attempt in range(attempts):
        raw = ""
        try:
            payload = _post_gemini(prompt)
            raw = _extract_text(payload)
            data = json.loads(_extract_json_text(raw), strict=False)
            if not isinstance(data, dict):
                logger.error(f"[AI DIAGRAM RAW INVALID DICT]: {raw}")
                print(f"[AI DIAGRAM RAW INVALID DICT]: {raw}")
                raise DiagramGenerationError()
            result: dict[str, str] = {}
            for diagram_type in DiagramType:
                mermaid = validate_mermaid(str(data.get(diagram_type.value, "")))
                result[diagram_type.value] = mermaid
            return result
        except (DiagramGenerationError, json.JSONDecodeError) as exc:
            if raw:
                logger.error(f"[AI DIAGRAM RAW PARSE FAILURE]: {raw}")
                print(f"[AI DIAGRAM RAW PARSE FAILURE]: {raw}")
            last_error = exc if isinstance(exc, AIGenerationError) else DiagramGenerationError()
            continue
        except AIGenerationError as exc:
            if _is_transient_error(exc) and attempt < attempts - 1:
                time.sleep(_retry_seconds(exc, attempt))
                continue
            raise
    if last_error is not None:
        raise last_error
    raise DiagramGenerationError()


def regenerate_diagram(
    blueprint: ArchitectBlueprint, diagram_type: DiagramType
) -> str:
    """Regenerate a single Mermaid diagram for a blueprint."""
    prompt = _build_diagram_prompt(blueprint, diagram_type=diagram_type)
    attempts = max(1, settings.GEMINI_MAX_RETRIES)
    last_error: AIGenerationError | None = None
    for attempt in range(attempts):
        raw = ""
        try:
            payload = _post_gemini(prompt)
            raw = _extract_text(payload)
            data = json.loads(_extract_json_text(raw), strict=False)
            if not isinstance(data, dict):
                logger.error(f"[AI DIAGRAM REGEN RAW INVALID DICT]: {raw}")
                print(f"[AI DIAGRAM REGEN RAW INVALID DICT]: {raw}")
                raise DiagramGenerationError()
            return validate_mermaid(str(data.get(diagram_type.value, "")))
        except (DiagramGenerationError, json.JSONDecodeError) as exc:
            if raw:
                logger.error(f"[AI DIAGRAM REGEN RAW PARSE FAILURE]: {raw}")
                print(f"[AI DIAGRAM REGEN RAW PARSE FAILURE]: {raw}")
            last_error = exc if isinstance(exc, AIGenerationError) else DiagramGenerationError()
            continue
        except AIGenerationError as exc:
            if _is_transient_error(exc) and attempt < attempts - 1:
                time.sleep(_retry_seconds(exc, attempt))
                continue
            raise
_CHAT_SYSTEM_PROMPT = """You are a Senior Software Architect assistant for the AI Software Architect application.

You help users evolve, scale, security-harden, and optimize their application architecture based on their project blueprint.

Guidelines:
- Provide direct, expert architectural recommendations in clean GitHub Markdown.
- Use code fences with appropriate syntax highlighting for configuration, Docker, or code snippets.
- Include valid Mermaid diagrams (`flowchart TD`, `erDiagram`, `sequenceDiagram`, `graph LR`) when illustrating architectural changes.
- Be specific, actionable, and realistic.
- If the user asks to modify or add something to their architecture (e.g., adding authentication, caching, Docker, payment gateway, microservices, database change, security), explain the change clearly. If a single blueprint section is directly affected, you may append an optional update block at the very end of your response in the format:

```json_section_update
{
  "section": "recommended_tech_stack",
  "data": ["Updated item 1", "..."]
}
```

Valid section names if included: `recommended_tech_stack`, `database_tables`, `rest_api_endpoints`, `security_recommendations`, `deployment_strategy`, `development_timeline`, `core_features`."""


def chat_completion(
    blueprint: ArchitectBlueprint,
    history: list[dict[str, str]],
    user_message: str,
) -> tuple[str, str | None, Any | None]:
    """Execute 1 AI request for a chat message and return (assistant_reply, section_name, section_data)."""
    context = _blueprint_context(blueprint)
    
    dialogue_lines: list[str] = [f"System: {_CHAT_SYSTEM_PROMPT}", f"Current Architecture Blueprint:\n{context}", "---"]
    for msg in history[-8:]:  # Include last 8 dialogue turns for context window efficiency
        role = "User" if msg["role"] == "user" else "Architect"
        dialogue_lines.append(f"{role}: {msg['content']}")
    dialogue_lines.append(f"User: {user_message}")
    dialogue_lines.append("Architect:")

    prompt = "\n\n".join(dialogue_lines)
    
    attempts = max(1, settings.GEMINI_MAX_RETRIES)
    raw_reply = ""
    for attempt in range(attempts):
        try:
            payload = _post_gemini(prompt, response_mime_type="text/plain")
            raw_reply = _extract_text(payload)
            if raw_reply:
                break
        except Exception as exc:
            if attempt < attempts - 1:
                time.sleep(1.5)
                continue
            logger.warning(f"Gemini API unavailable for chat completion: {exc}")

    if not raw_reply:
        # Fallback offline architectural assistant response if API key unavailable
        msg_lower = user_message.lower()
        if "auth" in msg_lower:
            raw_reply = (
                "### Authentication & Authorization Strategy\n\n"
                "To add robust authentication to this architecture, I recommend implementing **JWT (JSON Web Tokens)** with OAuth2 / OIDC integration.\n\n"
                "#### Key Steps:\n"
                "1. **Identity Provider**: Implement OAuth2 password & refresh token flow.\n"
                "2. **Password Hashing**: Use `Argon2id` or `bcrypt` (12 rounds).\n"
                "3. **Token Storage**: Store access tokens in memory / short-lived session, refresh tokens in `HttpOnly` Secure cookies.\n\n"
                "```mermaid\nsequenceDiagram\n  participant Client\n  participant API Gateway\n  participant Auth Service\n  participant DB\n  Client->>Auth Service: POST /api/v1/auth/login\n  Auth Service->>DB: Verify credentials\n  Auth Service-->>Client: 200 OK (JWT Access & Refresh Token)\n```"
            )
        elif "cache" in msg_lower or "caching" in msg_lower:
            raw_reply = (
                "### Caching Architecture Integration\n\n"
                "Adding **Redis** as a distributed cache layer will significantly reduce database load and improve response latency under high traffic.\n\n"
                "#### Implementation Strategy:\n"
                "- **Read-aside pattern**: Query Redis first (cache hit), fallback to Database on cache miss.\n"
                "- **TTL Configuration**: Set 15-minute TTL for high-read entities.\n\n"
                "```mermaid\nflowchart LR\n  Client['Client App'] --> API['Backend REST API']\n  API --> Redis[('Redis Cache')]\n  API --> DB[('Relational DB')]\n```"
            )
        elif "docker" in msg_lower or "deploy" in msg_lower:
            raw_reply = (
                "### Containerized Docker Deployment\n\n"
                "Here is the production-ready `docker-compose.yml` configuration for multi-container orchestration:\n\n"
                "```yaml\nversion: '3.8'\nservices:\n  backend:\n    build: ./backend\n    ports:\n      - \"8000:8000\"\n    environment:\n      - DATABASE_URL=postgresql://user:pass@db:5432/app_db\n    depends_on:\n      - db\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_DB: app_db\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n    volumes:\n      - pgdata:/var/lib/postgresql/data\nvolumes:\n  pgdata:\n```"
            )
        else:
            raw_reply = (
                f"### Architectural Guidance: {user_message}\n\n"
                f"Based on the project blueprint for **{blueprint.project_summary or 'this application'}**, "
                "I recommend refining your system component design with modular service isolation, automated CI/CD deployment pipelines, "
                "and distributed database indexing to maintain low latency as traffic scales."
            )

    # Parse optional section update block if present
    section_name: str | None = None
    section_data: Any | None = None

    if "```json_section_update" in raw_reply:
        try:
            parts = raw_reply.split("```json_section_update")
            clean_reply = parts[0].strip()
            json_block = parts[1].split("```")[0].strip()
            update_obj = json.loads(json_block, strict=False)
            section_name = update_obj.get("section")
            section_data = update_obj.get("data")
            raw_reply = clean_reply
        except Exception as exc:
            logger.warning(f"Could not parse json_section_update: {exc}")

    return raw_reply, section_name, section_data



_DOCUMENTATION_SYSTEM_PROMPT = """You are a Principal Software Architect writing an executive technical documentation manual.

Synthesize the architecture blueprint into a comprehensive 14-section engineering document.
Return ONLY valid JSON matching this structure EXACTLY:

{
  "executive_summary": "High-level summary of the application architecture and value proposition",
  "project_vision": "Strategic vision, target users, and long-term business goals",
  "functional_requirements": ["Requirement 1", "..."],
  "non_functional_requirements": ["Requirement 1", "..."],
  "user_roles": ["Role 1", "..."],
  "use_cases": [
    {
      "title": "Use Case Title",
      "actor": "Primary Actor",
      "preconditions": "Preconditions required",
      "main_flow": ["Step 1", "Step 2", "Step 3"],
      "postconditions": "System state post-execution"
    }
  ],
  "tech_stack": ["Tech item 1", "..."],
  "database_tables": [
    {"name": "table_name", "purpose": "what it stores", "columns": ["col1: type", "..."]}
  ],
  "api_endpoints": [
    {"method": "GET", "path": "/api/v1/resource", "description": "endpoint details"}
  ],
  "folder_structure": "multi-line folder tree string",
  "system_architecture_description": "Detailed explanation of component interaction, network topologies, and data flow",
  "deployment_strategy": ["Strategy item 1", "..."],
  "development_timeline": ["Phase 1 (Weeks 1-2): ...", "..."],
  "future_enhancements": [
    {
      "title": "Enhancement Title",
      "description": "Details on scaling or feature addition",
      "impact": "High"
    }
  ]
}

Ensure all 14 sections are rich, thorough, realistic, and detailed."""


def generate_documentation(
    blueprint: ArchitectBlueprint, diagrams: dict[str, str] | None = None
) -> DocumentationData:
    """Generate a 14-section comprehensive documentation for a blueprint."""
    context = _blueprint_context(blueprint)
    if diagrams:
        context += "\n\nAvailable Diagram Types: " + ", ".join(diagrams.keys())

    prompt = f"{_DOCUMENTATION_SYSTEM_PROMPT}\n\n---\n\n{context}\n\nGenerate full documentation JSON."
    attempts = max(1, settings.GEMINI_MAX_RETRIES)
    for attempt in range(attempts):
        raw = ""
        try:
            payload = _post_gemini(prompt)
            raw = _extract_text(payload)
            data = json.loads(_extract_json_text(raw), strict=False)
            if isinstance(data, dict):
                # Support root dict or nested under 'documentation' key
                if "documentation" in data and isinstance(data["documentation"], dict):
                    data = data["documentation"]
                return DocumentationData.model_validate(data)
        except Exception as exc:
            if raw:
                logger.error(f"[AI DOCS RAW PARSE FAILURE]: {raw}")
                print(f"[AI DOCS RAW PARSE FAILURE]: {raw}")
            if attempt < attempts - 1:
                time.sleep(2.0)
                continue

    # Fallback compilation if AI prompt fails or hits quota
    return DocumentationData(
        executive_summary=blueprint.project_summary or "Architecture Blueprint Documentation",
        project_vision=f"Production-ready architecture blueprint for high scalability and reliability.",
        functional_requirements=blueprint.functional_requirements or [],
        non_functional_requirements=blueprint.non_functional_requirements or [],
        user_roles=blueprint.user_roles or [],
        use_cases=[
            UseCaseItem(
                title="Primary Workflow Execution",
                actor=blueprint.user_roles[0] if blueprint.user_roles else "User",
                preconditions="Authenticated session active",
                main_flow=[
                    "User accesses application UI dashboard",
                    "User submits request payload",
                    "System processes request and persists state to database",
                    "System returns JSON response to client",
                ],
                postconditions="State successfully updated and cached",
            )
        ],
        tech_stack=blueprint.recommended_tech_stack or [],
        database_tables=blueprint.database_tables or [],
        api_endpoints=blueprint.rest_api_endpoints or [],
        folder_structure=blueprint.folder_structure or "",
        system_architecture_description="The system architecture utilizes standard multi-tiered design patterns decoupling presentation, business logic, and storage.",
        deployment_strategy=blueprint.deployment_strategy or [],
        development_timeline=blueprint.development_timeline or [],
        future_enhancements=[
            FutureEnhancementItem(
                title="Microservices Transition & Edge Caching",
                description="Refactor core services into decoupled microservices with global CDN edge caching.",
                impact="High",
            ),
            FutureEnhancementItem(
                title="Automated Analytics & Telemetry",
                description="Integrate distributed tracing (OpenTelemetry) and real-time operational dashboards.",
                impact="Medium",
            ),
        ],
    )


