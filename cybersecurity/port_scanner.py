"""Simple Port Scanner - Your first cybersecurity tool!"""
import socket

def scan_port(host, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except socket.error:
        return False

if __name__ == "__main__":
    target = input("Enter target IP or hostname: ")
    print(f"\nScanning {target}...")
    print("-" * 40)

    common_ports = {
        21: "FTP", 22: "SSH", 23: "Telnet",
        25: "SMTP", 53: "DNS", 80: "HTTP",
        443: "HTTPS", 3306: "MySQL", 8080: "HTTP-Alt"
    }

    for port, service in common_ports.items():
        if scan_port(target, port):
            print(f"[OPEN] Port {port} ({service})")

    print("-" * 40)
    print("Scan complete!")
