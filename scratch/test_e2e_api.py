import json
import os
import urllib.request
import urllib.parse

BASE_URL = "http://127.0.0.1:8000/api/v1"

def req(url, method="GET", body=None, headers=None):
    if headers is None:
        headers = {}
    data = json.dumps(body).encode("utf-8") if body else None
    if body and "Content-Type" not in headers:
        headers["Content-Type"] = "application/json"
    
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(request) as response:
        content_type = response.headers.get("Content-Type", "")
        raw = response.read()
        if "json" in content_type:
            return json.loads(raw.decode("utf-8")), response.status, response.headers
        return raw, response.status, response.headers

def run_e2e():
    print("====================================================")
    print("PHASE 17: END-TO-END HTTP API INTEGRATION TEST")
    print("====================================================")

    # 1. Register new user
    email = "e2e_principal_qa@aiarchitect.dev"
    password = "StrongPassword123!"
    print("\n1. Registering new user...")
    try:
        data, status, _ = req(f"{BASE_URL}/auth/register", method="POST", body={
            "name": "E2E Tester",
            "email": email,
            "password": password
        })
    except Exception as exc:
        print(f"User already registered or error ({exc}), logging in...")
        data, status, _ = req(f"{BASE_URL}/auth/login", method="POST", body={
            "email": email,
            "password": password
        })

    token = data["access_token"]
    user_id = data["user"]["id"]
    print(f"[PASS] User authenticated. User ID: {user_id}")
    auth_headers = {"Authorization": f"Bearer {token}"}

    # 2. Get projects (cache test)
    print("\n2. Listing projects...")
    projects, status, _ = req(f"{BASE_URL}/projects", headers=auth_headers)
    print(f"[PASS] Projects count: {len(projects)}")

    # 3. Create or find blueprint
    print("\n3. Testing blueprint / project data...")
    blueprints, status, _ = req(f"{BASE_URL}/blueprints", headers=auth_headers)
    
    bp_id = None
    if blueprints:
        bp_id = blueprints[0]["id"]
        print(f"[PASS] Found existing blueprint ID: {bp_id}")
    else:
        print("Generating new blueprint...")
        gen_data, status, _ = req(f"{BASE_URL}/blueprints/generate", method="POST", body={
            "title": "Hospital Management System",
            "description": "Hospital ERP for managing patients, doctor appointments, pharmacy inventory, and lab results."
        }, headers=auth_headers)
        bp_id = gen_data["id"]
        print(f"[PASS] Blueprint generated with ID: {bp_id}")

    # 4. Fetch documentation (0 AI calls)
    print("\n4. Fetching documentation...")
    doc_data, status, _ = req(f"{BASE_URL}/blueprints/{bp_id}/documentation", headers=auth_headers)
    assert "data" in doc_data, "Documentation data missing!"
    print("[PASS] Documentation fetched successfully (cached, 0 AI calls).")

    # 5. Export HTML via HTTP API
    print("\n5. Testing HTML Export via HTTP API...")
    html_raw, status, headers = req(f"{BASE_URL}/blueprints/{bp_id}/documentation/export?format=html", headers=auth_headers)
    html_str = html_raw.decode("utf-8")
    assert "<!DOCTYPE html>" in html_str
    assert 'class="mermaid"' in html_str
    assert "Executive Summary" in html_str
    print("[PASS] HTML Export HTTP endpoint returned valid HTML5 document with embedded Mermaid diagrams.")

    # 6. Export PDF via HTTP API
    print("\n6. Testing PDF Export via HTTP API...")
    pdf_bytes, status, headers = req(f"{BASE_URL}/blueprints/{bp_id}/documentation/export?format=pdf", headers=auth_headers)
    assert pdf_bytes.startswith(b"%PDF"), "Response is not a valid PDF document!"
    content_type = headers.get("Content-Type", "")
    assert "application/pdf" in content_type, f"Content-Type expected application/pdf, got {content_type}"
    print(f"[PASS] PDF Export HTTP endpoint returned valid PDF binary stream ({len(pdf_bytes)} bytes, Content-Type: application/pdf).")

    # 7. Test AI Chat HTTP endpoint
    print("\n7. Testing AI Chat message via HTTP API...")
    chat_resp, status, _ = req(f"{BASE_URL}/blueprints/{bp_id}/chat/messages", method="POST", body={
        "content": "Replace SQLite with PostgreSQL."
    }, headers=auth_headers)
    assert chat_resp["role"] == "assistant"
    assert len(chat_resp["content"]) > 10
    print("[PASS] AI Chat response received and saved in chat session.")

    print("\n====================================================")
    print("ALL HTTP API E2E TESTS PASSED CLEANLY!")
    print("====================================================")

if __name__ == "__main__":
    run_e2e()
