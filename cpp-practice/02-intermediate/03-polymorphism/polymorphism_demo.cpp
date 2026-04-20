/**
 * LESSON: Polymorphism
 * "Many forms" - same interface, different behavior.
 *
 * Compile-time: function overloading, templates
 * Runtime:      virtual functions, override
 *
 * virtual = enables runtime polymorphism
 * override = ensures you're actually overriding (catches typos)
 * = 0 (pure virtual) = makes class abstract
 */
#include <iostream>
#include <vector>
#include <memory>
#include <cmath>

// Abstract base class (has at least one pure virtual function)
class Shape {
public:
    virtual ~Shape() = default;

    // Pure virtual functions (= 0) - MUST be overridden
    virtual double area() const = 0;
    virtual double perimeter() const = 0;
    virtual std::string name() const = 0;

    // Concrete method
    void display() const {
        std::cout << name() << " -> area: " << area()
                  << ", perimeter: " << perimeter() << "\n";
    }
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override { return M_PI * radius * radius; }
    double perimeter() const override { return 2 * M_PI * radius; }
    std::string name() const override { return "Circle(r=" + std::to_string(radius) + ")"; }
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
    double perimeter() const override { return 2 * (w + h); }
    std::string name() const override {
        return "Rectangle(" + std::to_string((int)w) + "x" + std::to_string((int)h) + ")";
    }
};

class Triangle : public Shape {
    double a, b, c;
public:
    Triangle(double a, double b, double c) : a(a), b(b), c(c) {}
    double area() const override {
        double s = (a + b + c) / 2;
        return std::sqrt(s * (s - a) * (s - b) * (s - c));
    }
    double perimeter() const override { return a + b + c; }
    std::string name() const override { return "Triangle"; }
};

// Compile-time polymorphism: function overloading
void print(int x)    { std::cout << "int: " << x << "\n"; }
void print(double x) { std::cout << "double: " << x << "\n"; }
void print(const std::string& x) { std::cout << "string: " << x << "\n"; }

int main() {
    // ===== RUNTIME POLYMORPHISM =====
    std::cout << "--- Runtime Polymorphism ---\n";

    // Cannot instantiate abstract class:
    // Shape s; // ERROR!

    // Polymorphism through base class pointers
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5));
    shapes.push_back(std::make_unique<Rectangle>(4, 6));
    shapes.push_back(std::make_unique<Triangle>(3, 4, 5));

    // Same interface, different behavior!
    for (const auto& shape : shapes) {
        shape->display();
    }

    // ===== COMPILE-TIME POLYMORPHISM =====
    std::cout << "\n--- Compile-Time Polymorphism (Overloading) ---\n";
    print(42);
    print(3.14);
    print(std::string("Hello"));

    // ===== DYNAMIC CAST =====
    std::cout << "\n--- Dynamic Cast ---\n";
    Shape* basePtr = new Circle(10);

    // Safe downcast with dynamic_cast
    Circle* circlePtr = dynamic_cast<Circle*>(basePtr);
    if (circlePtr) {
        std::cout << "Successfully cast to Circle: area = " << circlePtr->area() << "\n";
    }

    Rectangle* rectPtr = dynamic_cast<Rectangle*>(basePtr);
    if (!rectPtr) {
        std::cout << "Cannot cast Circle to Rectangle (as expected)\n";
    }

    delete basePtr;

    return 0;
}
