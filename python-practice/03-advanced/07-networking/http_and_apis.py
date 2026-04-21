"""
LESSON: HTTP & REST APIs
urllib, http.server, JSON APIs, REST patterns, error handling.

Run: python3 http_and_apis.py
"""
import json
import urllib.request
import urllib.parse
import urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time

# ===== HTTP BASICS =====
print("--- HTTP Basics ---")

print("""  HTTP Methods:
    GET    — Retrieve data
    POST   — Create new resource
    PUT    — Update/replace resource
    PATCH  — Partial update
    DELETE — Remove resource

  Status Codes:
    2xx — Success (200 OK, 201 Created, 204 No Content)
    3xx — Redirect (301, 302, 304)
    4xx — Client Error (400 Bad Request, 401, 403, 404)
    5xx — Server Error (500, 502, 503)""")

# ===== SIMPLE HTTP SERVER =====
print("\n--- Simple HTTP Server ---")

# In-memory data store
USERS = {
    1: {"id": 1, "name": "Alice", "email": "alice@example.com"},
    2: {"id": 2, "name": "Bob", "email": "bob@example.com"},
}
NEXT_ID = 3

class APIHandler(BaseHTTPRequestHandler):
    """Simple REST API handler."""

    def do_GET(self):
        if self.path == "/api/users":
            self._send_json(200, list(USERS.values()))
        elif self.path.startswith("/api/users/"):
            user_id = int(self.path.split("/")[-1])
            user = USERS.get(user_id)
            if user:
                self._send_json(200, user)
            else:
                self._send_json(404, {"error": "User not found"})
        elif self.path == "/api/health":
            self._send_json(200, {"status": "healthy"})
        else:
            self._send_json(404, {"error": "Not found"})

    def do_POST(self):
        global NEXT_ID
        if self.path == "/api/users":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode()
            data = json.loads(body)

            user = {"id": NEXT_ID, "name": data["name"], "email": data["email"]}
            USERS[NEXT_ID] = user
            NEXT_ID += 1

            self._send_json(201, user)
        else:
            self._send_json(404, {"error": "Not found"})

    def do_DELETE(self):
        if self.path.startswith("/api/users/"):
            user_id = int(self.path.split("/")[-1])
            if user_id in USERS:
                del USERS[user_id]
                self._send_json(204, None)
            else:
                self._send_json(404, {"error": "User not found"})

    def _send_json(self, status: int, data):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        if data is not None:
            self.wfile.write(json.dumps(data).encode())

    def log_message(self, format, *args):
        pass  # suppress default logging

# Start server in background
PORT = 8765
server = HTTPServer(("127.0.0.1", PORT), APIHandler)
server_thread = threading.Thread(target=server.serve_forever)
server_thread.daemon = True
server_thread.start()
time.sleep(0.2)
print(f"  Server running on port {PORT}")

# ===== HTTP CLIENT WITH URLLIB =====
print("\n--- HTTP Client (urllib) ---")

BASE_URL = f"http://127.0.0.1:{PORT}/api"

def api_get(path: str) -> dict:
    """Make a GET request."""
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def api_post(path: str, data: dict) -> dict:
    """Make a POST request."""
    url = f"{BASE_URL}{path}"
    body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def api_delete(path: str) -> int:
    """Make a DELETE request."""
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, method="DELETE")
    with urllib.request.urlopen(req) as response:
        return response.status

# GET all users
users = api_get("/users")
print(f"  GET /users: {users}")

# GET single user
user = api_get("/users/1")
print(f"  GET /users/1: {user}")

# POST new user
new_user = api_post("/users", {"name": "Charlie", "email": "charlie@test.com"})
print(f"  POST /users: {new_user}")

# GET all users again
users = api_get("/users")
print(f"  GET /users (after POST): {len(users)} users")

# DELETE user
status = api_delete(f"/users/{new_user['id']}")
print(f"  DELETE /users/{new_user['id']}: status {status}")

# ===== ERROR HANDLING =====
print("\n--- HTTP Error Handling ---")

try:
    api_get("/users/999")
except urllib.error.HTTPError as e:
    error_body = json.loads(e.read().decode())
    print(f"  HTTPError {e.code}: {error_body}")

try:
    urllib.request.urlopen("http://127.0.0.1:1/nonexistent", timeout=1)
except urllib.error.URLError as e:
    print(f"  URLError: {e.reason}")

# ===== URL BUILDING =====
print("\n--- URL Building ---")

# Build query strings
params = urllib.parse.urlencode({
    "q": "python programming",
    "page": 1,
    "limit": 10,
    "sort": "relevance",
})
url = f"https://api.example.com/search?{params}"
print(f"  URL: {url}")

# Parse URL
parsed = urllib.parse.urlparse(url)
print(f"  Scheme: {parsed.scheme}")
print(f"  Host: {parsed.netloc}")
print(f"  Path: {parsed.path}")
print(f"  Query: {dict(urllib.parse.parse_qsl(parsed.query))}")

# ===== REST API DESIGN =====
print("\n--- REST API Design Principles ---")

print("""  Resource-Based URLs:
    GET    /api/users          — List all users
    GET    /api/users/123      — Get user 123
    POST   /api/users          — Create user
    PUT    /api/users/123      — Replace user 123
    PATCH  /api/users/123      — Update user 123
    DELETE /api/users/123      — Delete user 123

  Nested Resources:
    GET    /api/users/123/posts     — User's posts
    POST   /api/users/123/posts     — Create post for user

  Filtering & Pagination:
    GET    /api/users?role=admin&page=2&limit=20
    GET    /api/users?sort=-created_at

  Response Format:
    {
      "data": [...],
      "meta": {"total": 100, "page": 2, "per_page": 20},
      "links": {"next": "/api/users?page=3"}
    }""")

# ===== HEALTH CHECK =====
print("\n--- Health Check ---")
health = api_get("/health")
print(f"  Health: {health}")

# Cleanup
server.shutdown()
print("  Server stopped")
