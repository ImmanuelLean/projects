/**
 * LESSON: Virtual Inheritance
 * Solving the diamond problem in multiple inheritance.
 * Ensures only one copy of the base class exists.
 *
 * Compile: g++ -std=c++17 -o virtual_inh virtual_inheritance.cpp
 * Run:     ./virtual_inh
 */
#include <iostream>
#include <string>
#include <memory>

// ===== THE DIAMOND PROBLEM =====
//        A
//       / \
//      B   C       <-- both inherit A
//       \ /
//        D         <-- diamond: which A does D use?

namespace problem {
    struct A {
        int value = 0;
        A() { std::cout << "  A() constructed\n"; }
    };

    struct B : A {
        B() { std::cout << "  B() constructed\n"; }
    };

    struct C : A {
        C() { std::cout << "  C() constructed\n"; }
    };

    struct D : B, C {
        D() { std::cout << "  D() constructed\n"; }
    };
}

// ===== THE SOLUTION: VIRTUAL INHERITANCE =====
namespace solution {
    struct A {
        int value = 0;
        A() { std::cout << "  A() constructed\n"; }
        A(int v) : value(v) { std::cout << "  A(" << v << ") constructed\n"; }
        virtual ~A() = default;
    };

    struct B : virtual A {
        B() { std::cout << "  B() constructed\n"; }
        B(int v) : A(v) { std::cout << "  B(" << v << ") constructed\n"; }
    };

    struct C : virtual A {
        C() { std::cout << "  C() constructed\n"; }
        C(int v) : A(v) { std::cout << "  C(" << v << ") constructed\n"; }
    };

    // Most-derived class must initialize virtual base
    struct D : B, C {
        D() { std::cout << "  D() constructed\n"; }
        D(int v) : A(v), B(v), C(v) { std::cout << "  D(" << v << ") constructed\n"; }
    };
}

// ===== PRACTICAL: INTERFACE DIAMOND =====
class Printable {
public:
    virtual ~Printable() = default;
    virtual std::string toString() const = 0;
    void print() const { std::cout << toString() << "\n"; }
};

class Serializable : virtual public Printable {
public:
    virtual std::string serialize() const = 0;
    std::string toString() const override {
        return "Serializable{" + serialize() + "}";
    }
};

class Loggable : virtual public Printable {
public:
    virtual std::string logEntry() const = 0;
    std::string toString() const override {
        return "Log: " + logEntry();
    }
};

class NetworkMessage : public Serializable, public Loggable {
    std::string type_;
    std::string payload_;

public:
    NetworkMessage(std::string type, std::string payload)
        : type_(std::move(type)), payload_(std::move(payload)) {}

    std::string serialize() const override {
        return type_ + "|" + payload_;
    }

    std::string logEntry() const override {
        return "[" + type_ + "] " + payload_;
    }

    std::string toString() const override {
        return "Message(" + type_ + "): " + payload_;
    }
};

// ===== CONSTRUCTION ORDER DEMO =====
struct Base {
    std::string name;
    Base(std::string n) : name(std::move(n)) {
        std::cout << "  Base(\"" << name << "\") constructed\n";
    }
    virtual ~Base() = default;
};

struct Left : virtual Base {
    Left() : Base("default-left") { std::cout << "  Left constructed\n"; }
};

struct Right : virtual Base {
    Right() : Base("default-right") { std::cout << "  Right constructed\n"; }
};

struct Bottom : Left, Right {
    Bottom(std::string n) : Base(std::move(n)), Left(), Right() {
        std::cout << "  Bottom constructed\n";
    }
};

int main() {
    // ===== WITHOUT VIRTUAL =====
    std::cout << "--- Diamond Problem (without virtual) ---\n";
    {
        problem::D d;
        d.B::value = 10;
        d.C::value = 20;
        std::cout << "d.B::value = " << d.B::value << "\n";
        std::cout << "d.C::value = " << d.C::value << "\n";
        std::cout << "(Two separate A objects exist)\n";
    }

    // ===== WITH VIRTUAL =====
    std::cout << "\n--- Virtual Inheritance (one A) ---\n";
    {
        solution::D d(42);
        d.value = 100;
        std::cout << "d.value = " << d.value << "\n";
        std::cout << "d.B::value = " << d.B::value << "\n";
        std::cout << "d.C::value = " << d.C::value << "\n";
        std::cout << "Same object: "
                  << std::boolalpha << (&d.B::value == &d.C::value) << "\n";
    }

    // ===== POLYMORPHISM =====
    std::cout << "\n--- Polymorphic Usage ---\n";
    {
        solution::D d(99);
        solution::A* aPtr = &d;
        std::cout << "Via A*: value = " << aPtr->value << "\n";

        solution::B* bPtr = &d;
        solution::C* cPtr = &d;
        std::cout << "B* and C* same A: "
                  << (&bPtr->value == &cPtr->value) << "\n";
    }

    // ===== PRACTICAL DIAMOND =====
    std::cout << "\n--- Interface Diamond ---\n";
    {
        NetworkMessage msg("PING", "keepalive");
        msg.print();
        std::cout << "Serialized: " << msg.serialize() << "\n";
        std::cout << "Log: " << msg.logEntry() << "\n";

        Printable* p = &msg;
        p->print();
    }

    // ===== CONSTRUCTION ORDER =====
    std::cout << "\n--- Construction Order ---\n";
    std::cout << "Virtual bases constructed FIRST by most-derived class:\n";
    {
        Bottom b("from-bottom");
        std::cout << "Name: " << b.name << "\n";
    }

    // ===== SIZE COMPARISON =====
    std::cout << "\n--- Size Overhead ---\n";
    std::cout << "Without virtual: sizeof(D) = " << sizeof(problem::D) << "\n";
    std::cout << "With virtual:    sizeof(D) = " << sizeof(solution::D) << "\n";

    return 0;
}
