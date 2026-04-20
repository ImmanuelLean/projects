/**
 * LESSON: std::weak_ptr
 * weak_ptr is a non-owning observer of a shared_ptr.
 * It doesn't affect the reference count and breaks circular references.
 *
 * Compile: g++ -std=c++17 -o weak_ptr weak_ptr_demo.cpp
 * Run:     ./weak_ptr
 */
#include <iostream>
#include <memory>
#include <string>
#include <vector>

// ===== CIRCULAR REFERENCE PROBLEM =====
struct BadNode {
    std::string name;
    std::shared_ptr<BadNode> next;  // strong reference -> circular leak!

    BadNode(const std::string& n) : name(n) {
        std::cout << "  [BadNode " << name << " created]\n";
    }
    ~BadNode() {
        std::cout << "  [BadNode " << name << " destroyed]\n";
    }
};

// ===== SOLUTION: weak_ptr breaks the cycle =====
struct GoodNode {
    std::string name;
    std::weak_ptr<GoodNode> next;  // weak reference -> no cycle!

    GoodNode(const std::string& n) : name(n) {
        std::cout << "  [GoodNode " << name << " created]\n";
    }
    ~GoodNode() {
        std::cout << "  [GoodNode " << name << " destroyed]\n";
    }
};

// ===== OBSERVER PATTERN with weak_ptr =====
class Subject {
    std::string name;
    int value;
    std::vector<std::weak_ptr<class Observer>> observers;

public:
    Subject(const std::string& n) : name(n), value(0) {}

    void addObserver(std::shared_ptr<Observer> obs) {
        observers.push_back(obs);  // store as weak_ptr
    }

    void setValue(int v);

    std::string getName() const { return name; }
};

class Observer {
    std::string name;
public:
    Observer(const std::string& n) : name(n) {
        std::cout << "  [Observer " << name << " created]\n";
    }
    ~Observer() {
        std::cout << "  [Observer " << name << " destroyed]\n";
    }

    void notify(const std::string& subject, int value) {
        std::cout << "  " << name << " notified: " << subject << " = " << value << "\n";
    }
};

void Subject::setValue(int v) {
    value = v;
    // Notify all observers, cleaning up expired ones
    auto it = observers.begin();
    while (it != observers.end()) {
        if (auto obs = it->lock()) {  // try to get shared_ptr
            obs->notify(name, value);
            ++it;
        } else {
            it = observers.erase(it);  // observer was destroyed
            std::cout << "  [Cleaned up expired observer]\n";
        }
    }
}

int main() {
    // --- Circular reference (MEMORY LEAK!) ---
    std::cout << "--- Circular Reference (Bad) ---\n";
    {
        auto a = std::make_shared<BadNode>("A");
        auto b = std::make_shared<BadNode>("B");
        a->next = b;
        b->next = a;  // circular! Neither will be destroyed
        std::cout << "  Leaving scope...\n";
    }
    std::cout << "  (No destructors called - MEMORY LEAK!)\n";

    // --- weak_ptr breaks the cycle ---
    std::cout << "\n--- Breaking Cycle with weak_ptr (Good) ---\n";
    {
        auto a = std::make_shared<GoodNode>("A");
        auto b = std::make_shared<GoodNode>("B");
        a->next = b;   // weak_ptr: doesn't increment ref count
        b->next = a;   // weak_ptr: doesn't increment ref count
        std::cout << "  Leaving scope...\n";
    }
    std::cout << "  (Destructors called correctly!)\n";

    // --- Basic weak_ptr operations ---
    std::cout << "\n--- weak_ptr Operations ---\n";
    std::weak_ptr<int> weak;
    {
        auto shared = std::make_shared<int>(42);
        weak = shared;

        std::cout << "  expired(): " << std::boolalpha << weak.expired() << "\n";
        std::cout << "  use_count(): " << weak.use_count() << "\n";

        // lock() returns a shared_ptr (or empty if expired)
        if (auto locked = weak.lock()) {
            std::cout << "  locked value: " << *locked << "\n";
        }
        std::cout << "  Shared going out of scope...\n";
    }
    std::cout << "  expired(): " << weak.expired() << "\n";
    if (auto locked = weak.lock()) {
        std::cout << "  locked value: " << *locked << "\n";
    } else {
        std::cout << "  lock() returned empty (object destroyed)\n";
    }

    // --- Observer pattern ---
    std::cout << "\n--- Observer Pattern ---\n";
    Subject subject("Temperature");
    auto obs1 = std::make_shared<Observer>("Display");
    auto obs2 = std::make_shared<Observer>("Logger");

    subject.addObserver(obs1);
    subject.addObserver(obs2);

    subject.setValue(25);  // both notified

    std::cout << "\n  Destroying Logger...\n";
    obs2.reset();  // destroy the logger

    subject.setValue(30);  // only Display notified, Logger cleaned up

    return 0;
}
