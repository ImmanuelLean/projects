"""
LESSON: Socket Programming
TCP/UDP sockets, client-server, protocols, async sockets.

Run: python3 socket_programming.py
"""
import socket
import threading
import json
import time

# ===== SOCKET BASICS =====
print("--- Socket Basics ---")

print("""  Socket = endpoint for network communication
  AF_INET  = IPv4 address family
  AF_INET6 = IPv6 address family
  SOCK_STREAM = TCP (reliable, ordered)
  SOCK_DGRAM  = UDP (fast, unreliable)""")

# Get local hostname and IP
hostname = socket.gethostname()
try:
    local_ip = socket.gethostbyname(hostname)
except socket.gaierror:
    local_ip = "127.0.0.1"
print(f"\n  Hostname: {hostname}")
print(f"  Local IP: {local_ip}")

# ===== TCP ECHO SERVER & CLIENT =====
print("\n--- TCP Echo Server & Client ---")

def tcp_echo_server(host: str, port: int, ready_event: threading.Event):
    """Simple TCP echo server."""
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.settimeout(5)

    server.bind((host, port))
    server.listen(1)
    ready_event.set()
    print(f"  [Server] Listening on {host}:{port}")

    try:
        conn, addr = server.accept()
        print(f"  [Server] Client connected: {addr}")

        while True:
            data = conn.recv(1024)
            if not data:
                break
            message = data.decode()
            print(f"  [Server] Received: {message}")
            conn.sendall(f"Echo: {message}".encode())

        conn.close()
    except socket.timeout:
        pass
    finally:
        server.close()
        print("  [Server] Closed")

def tcp_echo_client(host: str, port: int):
    """TCP client that sends messages."""
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect((host, port))

    messages = ["Hello", "World", "Python"]
    for msg in messages:
        client.sendall(msg.encode())
        response = client.recv(1024).decode()
        print(f"  [Client] Sent: {msg}, Got: {response}")

    client.close()

# Run server and client
HOST, PORT = "127.0.0.1", 9999
ready = threading.Event()

server_thread = threading.Thread(target=tcp_echo_server, args=(HOST, PORT, ready))
server_thread.daemon = True
server_thread.start()

ready.wait()
time.sleep(0.1)
tcp_echo_client(HOST, PORT)
server_thread.join(timeout=2)

# ===== UDP EXAMPLE =====
print("\n--- UDP Communication ---")

def udp_server(host: str, port: int, ready_event: threading.Event):
    """UDP server (connectionless)."""
    server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server.settimeout(3)
    server.bind((host, port))
    ready_event.set()

    try:
        for _ in range(3):
            data, addr = server.recvfrom(1024)
            message = data.decode()
            print(f"  [UDP Server] From {addr}: {message}")
            server.sendto(f"ACK: {message}".encode(), addr)
    except socket.timeout:
        pass
    finally:
        server.close()

def udp_client(host: str, port: int):
    """UDP client."""
    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    client.settimeout(2)

    for msg in ["Ping", "Hello", "UDP"]:
        client.sendto(msg.encode(), (host, port))
        data, _ = client.recvfrom(1024)
        print(f"  [UDP Client] Sent: {msg}, Got: {data.decode()}")

    client.close()

UDP_PORT = 9998
ready2 = threading.Event()

server_t = threading.Thread(target=udp_server, args=(HOST, UDP_PORT, ready2))
server_t.daemon = True
server_t.start()

ready2.wait()
time.sleep(0.1)
udp_client(HOST, UDP_PORT)
server_t.join(timeout=2)

# ===== JSON PROTOCOL =====
print("\n--- JSON Protocol ---")

def send_json(sock: socket.socket, data: dict):
    """Send JSON with length prefix."""
    message = json.dumps(data).encode()
    length = len(message).to_bytes(4, 'big')
    sock.sendall(length + message)

def recv_json(sock: socket.socket) -> dict:
    """Receive JSON with length prefix."""
    length_bytes = sock.recv(4)
    if not length_bytes:
        return {}
    length = int.from_bytes(length_bytes, 'big')
    data = sock.recv(length)
    return json.loads(data.decode())

def json_server(host, port, ready_event):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.settimeout(5)
    server.bind((host, port))
    server.listen(1)
    ready_event.set()

    try:
        conn, _ = server.accept()
        request = recv_json(conn)
        print(f"  [JSON Server] Request: {request}")

        response = {
            "status": "ok",
            "result": request.get("a", 0) + request.get("b", 0)
        }
        send_json(conn, response)
        conn.close()
    except socket.timeout:
        pass
    finally:
        server.close()

def json_client(host, port):
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect((host, port))

    request = {"action": "add", "a": 10, "b": 25}
    send_json(client, request)
    print(f"  [JSON Client] Sent: {request}")

    response = recv_json(client)
    print(f"  [JSON Client] Response: {response}")
    client.close()

JSON_PORT = 9997
ready3 = threading.Event()

server_t = threading.Thread(target=json_server, args=(HOST, JSON_PORT, ready3))
server_t.daemon = True
server_t.start()

ready3.wait()
time.sleep(0.1)
json_client(HOST, JSON_PORT)
server_t.join(timeout=2)

# ===== MULTI-CLIENT SERVER =====
print("\n--- Multi-Client Server Pattern ---")

print("""  def handle_client(conn, addr):
      while True:
          data = conn.recv(1024)
          if not data:
              break
          conn.sendall(data)
      conn.close()

  server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  server.bind(('0.0.0.0', 8080))
  server.listen(5)

  while True:
      conn, addr = server.accept()
      thread = threading.Thread(target=handle_client, args=(conn, addr))
      thread.start()""")

# ===== TCP VS UDP =====
print("\n--- TCP vs UDP ---")

print("""
  Feature     | TCP              | UDP
  ──────────────────────────────────────────
  Connection  | Connection-based | Connectionless
  Reliability | Guaranteed       | Best effort
  Ordering    | Ordered          | No guarantee
  Speed       | Slower           | Faster
  Use case    | HTTP, SSH, DB    | DNS, Gaming, Video
  Overhead    | Higher           | Lower
""")

# ===== SOCKET OPTIONS =====
print("--- Socket Options ---")

print("""  SO_REUSEADDR  — Reuse address immediately after close
  SO_KEEPALIVE  — Enable TCP keepalive
  TCP_NODELAY   — Disable Nagle's algorithm (low latency)
  SO_RCVBUF     — Receive buffer size
  SO_SNDBUF     — Send buffer size
  SO_TIMEOUT    — Socket timeout""")
