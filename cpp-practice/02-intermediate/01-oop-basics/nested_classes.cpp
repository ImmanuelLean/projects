/**
 * LESSON: Nested Classes
 * A class defined inside another class. Useful for encapsulating
 * helper types that are only relevant to the outer class.
 *
 * Compile: g++ -std=c++17 -o nested nested_classes.cpp
 * Run:     ./nested
 */
#include <iostream>
#include <string>
#include <vector>

// ===== BASIC NESTED CLASS =====
class LinkedList {
private:
    // Node is only used by LinkedList - nest it inside
    struct Node {
        int data;
        Node* next;
        Node(int d) : data(d), next(nullptr) {}
    };

    Node* head;
    int size;

public:
    LinkedList() : head(nullptr), size(0) {}

    ~LinkedList() {
        Node* current = head;
        while (current) {
            Node* next = current->next;
            delete current;
            current = next;
        }
    }

    void pushFront(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
        size++;
    }

    void display() const {
        Node* current = head;
        while (current) {
            std::cout << current->data;
            if (current->next) std::cout << " -> ";
            current = current->next;
        }
        std::cout << "\n";
    }

    int getSize() const { return size; }

    // ===== NESTED ITERATOR CLASS =====
    class Iterator {
        Node* current;
    public:
        Iterator(Node* node) : current(node) {}
        int& operator*() { return current->data; }
        Iterator& operator++() { current = current->next; return *this; }
        bool operator!=(const Iterator& other) const { return current != other.current; }
    };

    Iterator begin() { return Iterator(head); }
    Iterator end() { return Iterator(nullptr); }
};

// ===== NESTED CLASS WITH OUTER ACCESS =====
class Game {
public:
    // Public nested class - accessible outside
    class Player {
        std::string name;
        int score;
    public:
        Player(const std::string& n) : name(n), score(0) {}
        void addScore(int points) { score += points; }
        std::string getName() const { return name; }
        int getScore() const { return score; }
    };

private:
    // Private nested class - only Game can use
    class ScoreBoard {
        std::vector<Player*> players;
    public:
        void addPlayer(Player* p) { players.push_back(p); }
        void display() const {
            std::cout << "  === Scoreboard ===\n";
            for (const auto* p : players) {
                std::cout << "  " << p->getName() << ": " << p->getScore() << "\n";
            }
        }
    };

    ScoreBoard board;
    std::vector<Player> players;

public:
    void addPlayer(const std::string& name) {
        players.emplace_back(name);
        board.addPlayer(&players.back());
    }

    void awardPoints(int playerIdx, int points) {
        if (playerIdx < static_cast<int>(players.size())) {
            players[playerIdx].addScore(points);
        }
    }

    void showScores() const { board.display(); }
};

// ===== NESTED ENUM AND STRUCT =====
class HttpRequest {
public:
    // Nested enum class
    enum class Method { GET, POST, PUT, DELETE_ };

    // Nested struct
    struct Header {
        std::string key;
        std::string value;
    };

private:
    Method method;
    std::string url;
    std::vector<Header> headers;

public:
    HttpRequest(Method m, const std::string& u) : method(m), url(u) {}

    void addHeader(const std::string& key, const std::string& val) {
        headers.push_back({key, val});
    }

    void display() const {
        const char* methods[] = {"GET", "POST", "PUT", "DELETE"};
        std::cout << "  " << methods[static_cast<int>(method)] << " " << url << "\n";
        for (const auto& h : headers) {
            std::cout << "    " << h.key << ": " << h.value << "\n";
        }
    }
};

int main() {
    // --- LinkedList with nested Node and Iterator ---
    std::cout << "--- LinkedList (Nested Node & Iterator) ---\n";
    LinkedList list;
    list.pushFront(30);
    list.pushFront(20);
    list.pushFront(10);

    std::cout << "List: ";
    list.display();

    // Use nested iterator
    std::cout << "Via iterator: ";
    for (auto it = list.begin(); it != list.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << "\n";

    // Range-for works because we have begin() and end()
    std::cout << "Range-for: ";
    for (int val : list) {
        std::cout << val << " ";
    }
    std::cout << "\n";

    // --- Game with public and private nested classes ---
    std::cout << "\n--- Game (Nested Player & ScoreBoard) ---\n";
    Game game;
    game.addPlayer("Emmanuel");
    game.addPlayer("Alice");
    game.addPlayer("Bob");

    game.awardPoints(0, 100);
    game.awardPoints(1, 150);
    game.awardPoints(2, 120);
    game.awardPoints(0, 50);

    game.showScores();

    // Can create Player directly (it's public)
    Game::Player standalone("Charlie");
    standalone.addScore(200);
    std::cout << "  Standalone: " << standalone.getName() << " = " << standalone.getScore() << "\n";

    // --- HttpRequest with nested enum and struct ---
    std::cout << "\n--- HttpRequest (Nested Enum & Struct) ---\n";
    HttpRequest req(HttpRequest::Method::POST, "/api/users");
    req.addHeader("Content-Type", "application/json");
    req.addHeader("Authorization", "Bearer token123");
    req.display();

    return 0;
}
