/**
 * LESSON: POSIX Socket Basics
 * TCP client/server communication using the POSIX socket API.
 * Demonstrates: socket, bind, listen, accept, connect, send, recv.
 *
 * Compile: g++ -std=c++17 -pthread -o socket_basics socket_basics.cpp
 * Run:     ./socket_basics
 *
 * Runs both server and client in one process using threads.
 */
#include <iostream>
#include <string>
#include <cstring>
#include <thread>
#include <chrono>
#include <vector>

#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <unistd.h>

constexpr int PORT = 9876;
constexpr int BUFFER_SIZE = 1024;

// ===== RAII Socket Wrapper =====
class Socket {
    int fd_ = -1;

public:
    Socket() = default;
    explicit Socket(int fd) : fd_(fd) {}

    Socket(int domain, int type, int protocol) {
        fd_ = ::socket(domain, type, protocol);
        if (fd_ < 0)
            throw std::runtime_error("socket() failed: " + std::string(strerror(errno)));
    }

    ~Socket() { close(); }

    Socket(Socket&& other) noexcept : fd_(other.fd_) { other.fd_ = -1; }
    Socket& operator=(Socket&& other) noexcept {
        if (this != &other) { close(); fd_ = other.fd_; other.fd_ = -1; }
        return *this;
    }
    Socket(const Socket&) = delete;
    Socket& operator=(const Socket&) = delete;

    int fd() const { return fd_; }

    void close() {
        if (fd_ >= 0) { ::close(fd_); fd_ = -1; }
    }

    void setReuseAddr() {
        int opt = 1;
        setsockopt(fd_, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    }
};

// ===== TCP SERVER =====
void runServer() {
    std::cout << "[Server] Starting on port " << PORT << "...\n";

    Socket serverSock(AF_INET, SOCK_STREAM, 0);
    serverSock.setReuseAddr();

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(PORT);

    if (bind(serverSock.fd(), (sockaddr*)&addr, sizeof(addr)) < 0) {
        std::cerr << "[Server] bind() failed: " << strerror(errno) << "\n";
        return;
    }

    if (listen(serverSock.fd(), 5) < 0) {
        std::cerr << "[Server] listen() failed: " << strerror(errno) << "\n";
        return;
    }
    std::cout << "[Server] Listening...\n";

    sockaddr_in clientAddr{};
    socklen_t clientLen = sizeof(clientAddr);
    int clientFd = accept(serverSock.fd(), (sockaddr*)&clientAddr, &clientLen);
    if (clientFd < 0) {
        std::cerr << "[Server] accept() failed: " << strerror(errno) << "\n";
        return;
    }

    Socket clientSock(clientFd);
    char clientIP[INET_ADDRSTRLEN];
    inet_ntop(AF_INET, &clientAddr.sin_addr, clientIP, sizeof(clientIP));
    std::cout << "[Server] Client connected from " << clientIP
              << ":" << ntohs(clientAddr.sin_port) << "\n";

    // Echo loop
    char buffer[BUFFER_SIZE];
    while (true) {
        std::memset(buffer, 0, sizeof(buffer));
        ssize_t bytesRead = recv(clientSock.fd(), buffer, sizeof(buffer) - 1, 0);

        if (bytesRead <= 0) {
            std::cout << "[Server] Client disconnected.\n";
            break;
        }

        std::string msg(buffer, bytesRead);
        std::cout << "[Server] Received: " << msg;

        std::string response = "Echo: " + msg;
        send(clientSock.fd(), response.c_str(), response.size(), 0);
    }
}

// ===== TCP CLIENT =====
void runClient() {
    std::this_thread::sleep_for(std::chrono::milliseconds(200));

    std::cout << "[Client] Connecting to localhost:" << PORT << "...\n";

    Socket sock(AF_INET, SOCK_STREAM, 0);

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(PORT);
    inet_pton(AF_INET, "127.0.0.1", &serverAddr.sin_addr);

    if (connect(sock.fd(), (sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        std::cerr << "[Client] connect() failed: " << strerror(errno) << "\n";
        return;
    }
    std::cout << "[Client] Connected!\n";

    std::vector<std::string> messages = {
        "Hello, server!\n",
        "How are you?\n",
        "C++ sockets are cool!\n"
    };

    char buffer[BUFFER_SIZE];
    for (const auto& msg : messages) {
        send(sock.fd(), msg.c_str(), msg.size(), 0);
        std::cout << "[Client] Sent: " << msg;

        std::memset(buffer, 0, sizeof(buffer));
        ssize_t bytesRead = recv(sock.fd(), buffer, sizeof(buffer) - 1, 0);
        if (bytesRead > 0) {
            std::cout << "[Client] Got back: " << std::string(buffer, bytesRead);
        }

        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    std::cout << "[Client] Done, closing connection.\n";
}

// ===== SOCKET INFO =====
void socketInfoDemo() {
    std::cout << "--- Socket API Overview ---\n";
    std::cout << "Key functions:\n";
    std::cout << "  socket()  - Create a socket file descriptor\n";
    std::cout << "  bind()    - Assign address/port to socket\n";
    std::cout << "  listen()  - Mark socket as passive (server)\n";
    std::cout << "  accept()  - Accept incoming connection\n";
    std::cout << "  connect() - Connect to remote server (client)\n";
    std::cout << "  send()    - Send data on connected socket\n";
    std::cout << "  recv()    - Receive data from connected socket\n";
    std::cout << "  close()   - Close socket file descriptor\n";

    std::cout << "\nSocket types:\n";
    std::cout << "  SOCK_STREAM - TCP (reliable, ordered)\n";
    std::cout << "  SOCK_DGRAM  - UDP (unreliable, unordered)\n";

    std::cout << "\nByte order:\n";
    std::cout << "  htons()/htonl() - Host to network byte order\n";
    std::cout << "  ntohs()/ntohl() - Network to host byte order\n";
}

int main() {
    socketInfoDemo();

    std::cout << "\n--- TCP Echo Server/Client Demo ---\n";

    std::thread serverThread(runServer);
    std::thread clientThread(runClient);

    clientThread.join();
    std::this_thread::sleep_for(std::chrono::milliseconds(200));

    std::cout << "\n[Main] Demo complete.\n";
    serverThread.detach();

    return 0;
}
