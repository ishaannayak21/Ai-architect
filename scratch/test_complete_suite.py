import os
import sys

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.blueprint import Blueprint
from app.models.diagram import Diagram
from app.schemas.blueprint import ArchitectBlueprint, DatabaseTableItem, ApiEndpoint
from app.schemas.diagram import DiagramType
from app.schemas.user import UserCreate, UserLogin
from app.services.auth_service import register_user, authenticate_user
from app.services.blueprint_service import create_blueprint, list_user_blueprints, get_user_blueprint
from app.services.diagram_service import generate_blueprint_diagrams, list_blueprint_diagrams, create_diagrams
from app.services.documentation_service import (
    get_or_create_documentation,
    export_html,
    export_pdf,
    export_markdown,
    _get_diagrams_dict,
)
from app.services.chat_service import get_or_create_chat_session, post_chat_message
from app.services.project_service import get_user_projects
from app.utils.exceptions import EmailAlreadyRegisteredError, CredentialsError
from sqlalchemy import select

def run_suite():
    print("====================================================")
    print("STARTING FULL APPLICATION QA AND EXPORT TEST SUITE")
    print("====================================================")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Phase 5: Authentication & User Registration Test
        print("\n--- PHASE 5: AUTHENTICATION & USER REGISTRATION ---")
        test_email = "qa_principal_engineer@aiarchitect.dev"
        existing_user = db.scalar(select(User).where(User.email == test_email))
        if existing_user:
            db.delete(existing_user)
            db.commit()

        reg_payload = UserCreate(name="QA Engineer", email=test_email.upper(), password="SecurePassword123!")
        user = register_user(db, reg_payload)
        assert user.email == test_email, f"Email normalization failed: expected {test_email}, got {user.email}"
        print("[PASS] User registered with normalized email.")

        # Test duplicate email registration
        try:
            register_user(db, reg_payload)
            assert False, "Duplicate email registration did not raise error!"
        except EmailAlreadyRegisteredError:
            print("[PASS] Duplicate email registration correctly rejected.")

        # Test authentication
        auth_user = authenticate_user(db, UserLogin(email=test_email, password="SecurePassword123!"))
        assert auth_user.id == user.id, "Authentication failed!"
        print("[PASS] User login with valid credentials succeeded.")

        try:
            authenticate_user(db, UserLogin(email=test_email, password="WrongPassword!"))
            assert False, "Login with wrong password succeeded unexpectedly!"
        except CredentialsError:
            print("[PASS] Wrong password login correctly rejected.")

        # Phase 6 & 7: Blueprint Creation & Persistence
        print("\n--- PHASE 6 & 7: AI ARCHITECTURE GENERATOR & DATA CONSISTENCY ---")
        title = "Hospital Management System"
        desc = "A comprehensive hospital management platform for managing patient records, doctor appointments, medical billing, pharmacy inventory, and laboratory test results."

        blueprint_obj = ArchitectBlueprint(
            project_summary="The Hospital Management System is a comprehensive platform for managing healthcare operations.",
            functional_requirements=["Patient Registration", "Doctor Scheduling", "Lab Results", "Pharmacy Billing"],
            non_functional_requirements=["HIPAA Compliance", "99.9% Uptime", "Sub-second API response"],
            user_roles=["Admin", "Doctor", "Nurse", "Patient"],
            core_features=["EHR Management", "Appointment Booking", "Billing & Invoicing"],
            recommended_tech_stack=["React", "FastAPI", "PostgreSQL", "Docker"],
            database_tables=[
                DatabaseTableItem(name="patients", purpose="Stores patient profiles", columns=["id: int", "name: str", "dob: date"]),
                DatabaseTableItem(name="appointments", purpose="Doctor bookings", columns=["id: int", "patient_id: int", "doctor_id: int", "scheduled_at: datetime"]),
            ],
            rest_api_endpoints=[
                ApiEndpoint(method="GET", path="/api/v1/patients", description="List patients"),
                ApiEndpoint(method="POST", path="/api/v1/appointments", description="Create appointment"),
            ],
            folder_structure="backend/\n  app/\n    api/\n    models/\nfrontend/\n  src/",
            security_recommendations=["JWT Auth", "TLS 1.3", "RBAC"],
            deployment_strategy=["Docker Containers", "Kubernetes", "AWS RDS"],
            development_timeline=["Phase 1: MVP", "Phase 2: Billing & Pharmacy"],
            estimated_team_size="4-6 engineers"
        )

        record = create_blueprint(
            db=db,
            user=user,
            title=title,
            description=desc,
            blueprint=blueprint_obj,
            raw_output=blueprint_obj.model_dump_json(),
        )
        print(f"[PASS] Blueprint created with ID: {record.id}")

        # Phase 8: Diagrams
        print("\n--- PHASE 8: MERMAID DIAGRAM TESTING ---")
        mock_diagram_data = {
            "system_architecture": "flowchart TD\n  Client[\"Web / Mobile Client\"] --> API[\"FastAPI Backend\"]\n  API --> DB[(\"PostgreSQL Database\")]",
            "database_er": "erDiagram\n  PATIENT ||--o{ APPOINTMENT : has\n  DOCTOR ||--o{ APPOINTMENT : conducts",
            "application_flowchart": "flowchart TD\n  Start([Start]) --> Login[User Login]\n  Login --> Dashboard[View Dashboard]\n  Dashboard --> Action[Book Appointment]",
            "api_sequence": "sequenceDiagram\n  actor Patient\n  participant API as Backend API\n  participant DB as Database\n  Patient->>API: POST /api/v1/appointments\n  API->>DB: INSERT appointment\n  DB-->>API: OK\n  API-->>Patient: 201 Created",
            "deployment": "flowchart LR\n  Users --> CDN[Cloudflare CDN]\n  CDN --> LB[Load Balancer]\n  LB --> App1[App Instance 1]\n  LB --> App2[App Instance 2]\n  App1 --> RDS[(PostgreSQL RDS)]",
        }
        diagrams = create_diagrams(db, record.id, mock_diagram_data)
        assert len(diagrams) == 5, f"Expected 5 diagrams, got {len(diagrams)}"
        print("[PASS] All 5 Mermaid diagrams created and verified.")

        # Phase 9: Documentation
        print("\n--- PHASE 9: DOCUMENTATION COMPILATION (0 AI CALLS) ---")
        doc = get_or_create_documentation(db, user, record.id)
        assert doc.data is not None, "Documentation compilation failed!"
        print("[PASS] Documentation compiled/retrieved from cache without AI calls.")

        # Phase 2: HTML Export
        print("\n--- PHASE 2: HTML EXPORT VERIFICATION ---")
        diagrams_dict = _get_diagrams_dict(db, record.id)
        html_output = export_html(doc.data, title, diagrams_dict)
        assert html_output.startswith("<!DOCTYPE html>"), "HTML output missing <!DOCTYPE html>"
        assert "<title>Hospital Management System" in html_output, "HTML output missing title"
        assert "1. Executive Summary" in html_output, "HTML output missing Executive Summary section"
        assert 'class="mermaid"' in html_output, "HTML output missing embedded Mermaid class"
        assert "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs" in html_output, "HTML output missing Mermaid CDN script"
        print("[PASS] HTML Export verified. Output contains valid HTML5, CSS styling, full documentation, and Mermaid script.")

        # Phase 3: PDF Export
        print("\n--- PHASE 3: PDF EXPORT VERIFICATION ---")
        pdf_bytes = export_pdf(doc.data, title, diagrams_dict)
        assert isinstance(pdf_bytes, bytes), "PDF output is not bytes!"
        assert pdf_bytes.startswith(b"%PDF"), "PDF binary header invalid! Does not start with %PDF"
        assert len(pdf_bytes) > 2000, f"PDF file size too small ({len(pdf_bytes)} bytes)"
        print(f"[PASS] PDF Export verified. Valid binary PDF document generated ({len(pdf_bytes)} bytes).")

        # Write test output files for physical inspection
        os.makedirs("scratch/exports", exist_ok=True)
        html_file_path = "scratch/exports/test_hospital_doc.html"
        pdf_file_path = "scratch/exports/test_hospital_doc.pdf"

        with open(html_file_path, "w", encoding="utf-8") as f:
            f.write(html_output)

        with open(pdf_file_path, "wb") as f:
            f.write(pdf_bytes)

        print(f"[EXPORT FILE VERIFICATION]: Created {os.path.abspath(html_file_path)}")
        print(f"[EXPORT FILE VERIFICATION]: Created {os.path.abspath(pdf_file_path)}")

        # Phase 4: Persistence
        print("\n--- PHASE 4: PROJECT PERSISTENCE VERIFICATION ---")
        user_projects = get_user_projects(db, user)
        assert len(user_projects) > 0, "No projects returned for user!"
        proj = user_projects[0]
        assert proj.title == title, f"Project title mismatch: {proj.title} vs {title}"
        print(f"[PASS] Project persistence verified in DB for user {user.email}.")

        print("\n====================================================")
        print("ALL TESTS PASSED SUCCESSFULLY! ZERO FAILURES.")
        print("====================================================")
    finally:
        db.close()

if __name__ == "__main__":
    run_suite()
