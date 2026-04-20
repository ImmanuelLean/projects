/**
 * LESSON: Advanced OOP - CRTP, Mixins, Multiple Inheritance
 *
 * CRTP (Curiously Recurring Template Pattern):
 *   class Derived : public Base<Derived> {}
 *   Enables static polymorphism (no virtual overhead).
 */
#include <iostream>
#include <string>
#include <vector>
#include <chrono>

// ===== CRTP: Static Polymorphism =====
template <typename Derived>
class Printable {
public:
    void print() const {
        std::cout << static_cast<const Derived*>(this)->toString() << "\n";
    }

    // Compile-time polymorphism: no virtual, no overhead!
    void printWithBorder() const {
        std::cout << "=== " << static_cast<const Derived*>(this)->toString() << " ===\n";
    }
};

class Point : public Printable<Point> {
    double x, y;
public:
    Point(double x, double y) : x(x), y(y) {}
    std::string toString() const {
        return "Point(" + std::to_string(x) + ", " + std::to_string(y) + ")";
    }
};

class Color : public Printable<Color> {
    int r, g, b;
public:
    Color(int r, int g, int b) : r(r), g(g), b(b) {}
    std::string toString() const {
        return "Color(r=" + std::to_string(r) + ", g=" + std::to_string(g) + ", b=" + std::to_string(b) + ")";
    }
};

// ===== CRTP: Counter Mixin =====
template <typename T>
class Counter {
    static int count;
public:
    Counter() { count++; }
    Counter(const Counter&) { count++; }
    ~Counter() { count--; }
    static int getCount() { return count; }
};

template <typename T>
int Counter<T>::count = 0;

class Widget : public Counter<Widget> {
    std::string name;
public:
    Widget(const std::string& n) : name(n) {}
};

class Button : public Counter<Button> {
    std::string label;
public:
    Button(const std::string& l) : label(l) {}
};

// ===== MULTIPLE INHERITANCE & DIAMOND PROBLEM =====
class Flyable {
public:
    virtual void fly() const { std::cout << "Flying!\n"; }
    virtual ~Flyable() = default;
};

class Swimmable {
public:
    virtual void swim() const { std::cout << "Swimming!\n"; }
    virtual ~Swimmable() = default;
};

class Duck : public Flyable, public Swimmable {
    std::string name;
public:
    Duck(const std::string& n) : name(n) {}
    void fly() const override { std::cout << name << " is flying!\n"; }
    void swim() const override { std::cout << name << " is swimming!\n"; }
};

// Diamond problem solved with virtual inheritance
class Animal { public: std::string species = "Unknown"; virtual ~Animal() = default; };
class Bird : virtual public Animal { };  // virtual inheritance
class Fish : virtual public Animal { };  // virtual inheritance
class FlyingFish : public Bird, public Fish {
public:
    FlyingFish() { species = "FlyingFish"; } // only ONE copy of Animal
};

int main() {
    // ===== CRTP =====
    std::cout << "--- CRTP (Static Polymorphism) ---\n";
    Point p(3.0, 4.0);
    Color c(255, 128, 0);
    p.print();           // no virtual dispatch!
    c.printWithBorder();

    // ===== COUNTER MIXIN =====
    std::cout << "\n--- Counter Mixin ---\n";
    {
        Widget w1("w1"), w2("w2"), w3("w3");
        Button b1("ok"), b2("cancel");
        std::cout << "Widgets: " << Widget::getCount() << "\n"; // 3
        std::cout << "Buttons: " << Button::getCount() << "\n"; // 2
    }
    std::cout << "After scope - Widgets: " << Widget::getCount() << "\n"; // 0
    std::cout << "After scope - Buttons: " << Button::getCount() << "\n"; // 0

    // ===== MULTIPLE INHERITANCE =====
    std::cout << "\n--- Multiple Inheritance ---\n";
    Duck duck("Donald");
    duck.fly();
    duck.swim();

    // Interface-style usage
    Flyable* flyer = &duck;
    Swimmable* swimmer = &duck;
    flyer->fly();
    swimmer->swim();

    // ===== DIAMOND PROBLEM =====
    std::cout << "\n--- Virtual Inheritance (Diamond) ---\n";
    FlyingFish ff;
    std::cout << "Species: " << ff.species << "\n"; // only one copy!

    return 0;
}
