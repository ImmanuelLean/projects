/**
 * LESSON: Multiple Inheritance
 * C++ allows a class to inherit from multiple base classes.
 * This is powerful but introduces the "Diamond Problem."
 *
 * Compile: g++ -std=c++17 -o multiple_inh multiple_inheritance.cpp
 * Run:     ./multiple_inh
 */
#include <iostream>
#include <string>

// ===== BASIC MULTIPLE INHERITANCE =====
class Printable {
public:
    virtual void print() const = 0;
    virtual ~Printable() = default;
};

class Saveable {
public:
    virtual void save() const { std::cout << "  Saving to disk...\n"; }
    virtual ~Saveable() = default;
};

// Inherits from BOTH Printable and Saveable
class Document : public Printable, public Saveable {
    std::string title;
    std::string content;
public:
    Document(const std::string& t, const std::string& c) : title(t), content(c) {}

    void print() const override {
        std::cout << "  [" << title << "]: " << content << "\n";
    }

    void save() const override {
        std::cout << "  Saving \"" << title << "\" to disk...\n";
    }
};

// ===== THE DIAMOND PROBLEM =====
/*
 *        Animal
 *       /      \
 *    Flyer   Swimmer
 *       \      /
 *       FlyingFish
 *
 * Without virtual inheritance, FlyingFish has TWO copies of Animal!
 */

// Base class
class Animal {
protected:
    std::string name;
public:
    Animal(const std::string& n = "Unknown") : name(n) {
        std::cout << "  [Animal constructed: " << name << "]\n";
    }
    virtual ~Animal() = default;

    void eat() const { std::cout << "  " << name << " eats\n"; }
};

// WITHOUT virtual inheritance (BAD - diamond problem)
class FlierBad : public Animal {
public:
    FlierBad(const std::string& n) : Animal(n) {}
    void fly() const { std::cout << "  " << name << " flies\n"; }
};

class SwimmerBad : public Animal {
public:
    SwimmerBad(const std::string& n) : Animal(n) {}
    void swim() const { std::cout << "  " << name << " swims\n"; }
};

// FlyingFishBad has TWO Animal bases - ambiguous!
// class FlyingFishBad : public FlierBad, public SwimmerBad { ... };
// FlyingFishBad f; f.eat();  // ERROR: ambiguous - which Animal::eat()?

// ===== SOLUTION: Virtual Inheritance =====
class Flier : public virtual Animal {
public:
    Flier(const std::string& n = "Unknown") : Animal(n) {}
    void fly() const { std::cout << "  " << name << " flies\n"; }
};

class Swimmer : public virtual Animal {
public:
    Swimmer(const std::string& n = "Unknown") : Animal(n) {}
    void swim() const { std::cout << "  " << name << " swims\n"; }
};

// With virtual inheritance, only ONE Animal base exists
class FlyingFish : public Flier, public Swimmer {
public:
    // Most-derived class must initialize the virtual base
    FlyingFish(const std::string& n) : Animal(n), Flier(n), Swimmer(n) {}
};

// ===== CONSTRUCTION ORDER =====
class A {
public:
    A() { std::cout << "  A constructed\n"; }
    virtual ~A() { std::cout << "  A destroyed\n"; }
};

class B : public virtual A {
public:
    B() { std::cout << "  B constructed\n"; }
    ~B() { std::cout << "  B destroyed\n"; }
};

class C : public virtual A {
public:
    C() { std::cout << "  C constructed\n"; }
    ~C() { std::cout << "  C destroyed\n"; }
};

class D : public B, public C {
public:
    D() { std::cout << "  D constructed\n"; }
    ~D() { std::cout << "  D destroyed\n"; }
};

int main() {
    // --- Basic multiple inheritance ---
    std::cout << "--- Basic Multiple Inheritance ---\n";
    Document doc("Report", "Quarterly sales data");
    doc.print();
    doc.save();

    // Use as either interface
    Printable* p = &doc;
    p->print();
    Saveable* s = &doc;
    s->save();

    // --- Diamond problem solved ---
    std::cout << "\n--- Diamond Problem (Virtual Inheritance) ---\n";
    FlyingFish fish("Nemo");
    fish.fly();
    fish.swim();
    fish.eat();  // no ambiguity - only one Animal base!

    // --- Construction/Destruction order ---
    std::cout << "\n--- Construction Order ---\n";
    std::cout << "Creating D:\n";
    {
        D obj;
        // Order: A (virtual base first), B, C (left to right), D
    }
    // Destruction: reverse order

    // --- When to use / avoid ---
    std::cout << "\n--- Guidelines ---\n";
    std::cout << "USE: Multiple interfaces (abstract classes)\n";
    std::cout << "USE: Mixin classes (small, focused functionality)\n";
    std::cout << "AVOID: Multiple classes with state (complex)\n";
    std::cout << "PREFER: Composition over inheritance when possible\n";

    return 0;
}
