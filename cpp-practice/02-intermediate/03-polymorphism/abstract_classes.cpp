/**
 * LESSON: Abstract Classes and Interfaces
 * A pure virtual function (= 0) makes a class abstract.
 * Abstract classes cannot be instantiated - they define contracts.
 *
 * Compile: g++ -std=c++17 -o abstract abstract_classes.cpp
 * Run:     ./abstract
 */
#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <cmath>

// ===== ABSTRACT CLASS (has at least one pure virtual function) =====
class Shape {
protected:
    std::string name;

public:
    Shape(const std::string& n) : name(n) {}
    virtual ~Shape() = default;

    // Pure virtual functions (= 0) - MUST be overridden
    virtual double area() const = 0;
    virtual double perimeter() const = 0;

    // Regular virtual function - CAN be overridden
    virtual void display() const {
        std::cout << name << ": area=" << area()
                  << ", perimeter=" << perimeter() << "\n";
    }

    std::string getName() const { return name; }
};

// Shape s("test");  // ERROR: cannot instantiate abstract class!

// ===== CONCRETE CLASS: Circle =====
class Circle : public Shape {
    double radius;
public:
    Circle(double r) : Shape("Circle"), radius(r) {}

    double area() const override { return M_PI * radius * radius; }
    double perimeter() const override { return 2 * M_PI * radius; }
};

// ===== CONCRETE CLASS: Rectangle =====
class Rectangle : public Shape {
    double width, height;
public:
    Rectangle(double w, double h) : Shape("Rectangle"), width(w), height(h) {}

    double area() const override { return width * height; }
    double perimeter() const override { return 2 * (width + height); }
};

// ===== CONCRETE CLASS: Triangle =====
class Triangle : public Shape {
    double a, b, c;  // sides
public:
    Triangle(double a, double b, double c) : Shape("Triangle"), a(a), b(b), c(c) {}

    double area() const override {
        double s = (a + b + c) / 2;  // semi-perimeter
        return std::sqrt(s * (s - a) * (s - b) * (s - c));  // Heron's formula
    }
    double perimeter() const override { return a + b + c; }
};

// ===== INTERFACE PATTERN (all pure virtual, no data) =====
class Printable {
public:
    virtual ~Printable() = default;
    virtual std::string toString() const = 0;
};

class Serializable {
public:
    virtual ~Serializable() = default;
    virtual std::string serialize() const = 0;
    virtual void deserialize(const std::string& data) = 0;
};

// Class implementing multiple interfaces
class Product : public Printable, public Serializable {
    std::string name;
    double price;
public:
    Product(const std::string& n, double p) : name(n), price(p) {}

    // Implement Printable
    std::string toString() const override {
        return name + " ($" + std::to_string(price) + ")";
    }

    // Implement Serializable
    std::string serialize() const override {
        return name + "|" + std::to_string(price);
    }
    void deserialize(const std::string& data) override {
        size_t pos = data.find('|');
        name = data.substr(0, pos);
        price = std::stod(data.substr(pos + 1));
    }
};

int main() {
    // --- Polymorphism with abstract class ---
    std::cout << "--- Shapes (Abstract Class) ---\n";
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5.0));
    shapes.push_back(std::make_unique<Rectangle>(4.0, 6.0));
    shapes.push_back(std::make_unique<Triangle>(3.0, 4.0, 5.0));

    for (const auto& shape : shapes) {
        shape->display();  // polymorphic call
    }

    // --- Total area calculation ---
    std::cout << "\n--- Total Area ---\n";
    double totalArea = 0;
    for (const auto& shape : shapes) {
        totalArea += shape->area();
    }
    std::cout << "Total area of all shapes: " << totalArea << "\n";

    // --- Interface pattern ---
    std::cout << "\n--- Interface Pattern ---\n";
    Product laptop("Laptop", 999.99);

    // Use as Printable
    Printable* printable = &laptop;
    std::cout << "toString(): " << printable->toString() << "\n";

    // Use as Serializable
    Serializable* serializable = &laptop;
    std::string data = serializable->serialize();
    std::cout << "serialize(): " << data << "\n";

    Product restored("", 0);
    restored.deserialize(data);
    std::cout << "deserialized: " << restored.toString() << "\n";

    // --- Cannot instantiate abstract class ---
    std::cout << "\n--- Rules ---\n";
    std::cout << "1. Cannot create instances of abstract classes\n";
    std::cout << "2. Derived class MUST override ALL pure virtuals to be concrete\n";
    std::cout << "3. Abstract classes can have non-pure virtual methods\n";
    std::cout << "4. Interface = abstract class with ONLY pure virtuals\n";

    return 0;
}
