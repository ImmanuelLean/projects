/**
 * LESSON: Structs
 * Structs group related data together. In C++ they're almost identical to classes
 * but with default public access. Great for plain data types.
 *
 * Compile: g++ -std=c++17 -o structs structs.cpp
 * Run:     ./structs
 */
#include <iostream>
#include <string>
#include <vector>

// ===== BASIC STRUCT =====
struct Point {
    double x;
    double y;
};

// ===== STRUCT WITH METHODS =====
struct Rectangle {
    double width;
    double height;

    double area() const { return width * height; }
    double perimeter() const { return 2 * (width + height); }

    void display() const {
        std::cout << "Rectangle(" << width << "x" << height
                  << ", area=" << area() << ")\n";
    }
};

// ===== STRUCT WITH CONSTRUCTOR =====
struct Student {
    std::string name;
    int age;
    double gpa;

    // Constructor
    Student(const std::string& n, int a, double g) : name(n), age(a), gpa(g) {}

    void print() const {
        std::cout << "Student{" << name << ", " << age << ", GPA=" << gpa << "}\n";
    }
};

// ===== NESTED STRUCT =====
struct Address {
    std::string street;
    std::string city;
    std::string country;
};

struct Employee {
    std::string name;
    int id;
    Address address;  // nested struct

    void print() const {
        std::cout << "Employee #" << id << ": " << name << "\n"
                  << "  Address: " << address.street << ", "
                  << address.city << ", " << address.country << "\n";
    }
};

// ===== STRUCT vs CLASS =====
// struct: members are PUBLIC by default
// class:  members are PRIVATE by default
// That's the ONLY difference in C++!

struct PublicByDefault {
    int x;  // public
};

class PrivateByDefault {
    int x;  // private
public:
    int getX() const { return x; }
};

int main() {
    // --- Basic struct ---
    std::cout << "--- Basic Struct ---\n";
    Point p1 = {3.0, 4.0};      // aggregate initialization
    Point p2{5.0, 12.0};        // uniform initialization (C++11)
    Point p3;                    // uninitialized (values are garbage)
    p3.x = 1.0;
    p3.y = 1.0;

    std::cout << "p1: (" << p1.x << ", " << p1.y << ")\n";
    std::cout << "p2: (" << p2.x << ", " << p2.y << ")\n";

    // --- Struct with methods ---
    std::cout << "\n--- Struct with Methods ---\n";
    Rectangle rect{10.0, 5.0};
    rect.display();
    std::cout << "Perimeter: " << rect.perimeter() << "\n";

    // --- Struct with constructor ---
    std::cout << "\n--- Struct with Constructor ---\n";
    Student s1("Emmanuel", 20, 3.8);
    Student s2("Alice", 22, 3.9);
    s1.print();
    s2.print();

    // --- Vector of structs ---
    std::cout << "\n--- Vector of Structs ---\n";
    std::vector<Student> students = {
        {"Bob", 21, 3.5},
        {"Charlie", 19, 3.7},
        {"Diana", 23, 4.0}
    };
    for (const auto& s : students) {
        s.print();
    }

    // --- Nested struct ---
    std::cout << "\n--- Nested Struct ---\n";
    Employee emp{
        "Emmanuel",
        1001,
        {"123 Main St", "Lagos", "Nigeria"}
    };
    emp.print();

    // --- Struct assignment (copies all members) ---
    std::cout << "\n--- Struct Copy ---\n";
    Point original{7.0, 8.0};
    Point copy = original;  // copies all fields
    copy.x = 99.0;
    std::cout << "Original: (" << original.x << ", " << original.y << ")\n";
    std::cout << "Copy:     (" << copy.x << ", " << copy.y << ")\n";

    // --- Struct comparison (must define manually) ---
    std::cout << "\n--- Struct Comparison ---\n";
    Point a{1.0, 2.0}, b{1.0, 2.0}, c{3.0, 4.0};
    // a == b;  // ERROR: no operator== by default
    bool equal = (a.x == b.x && a.y == b.y);
    std::cout << "a == b? " << std::boolalpha << equal << "\n";

    // --- Pointer to struct ---
    std::cout << "\n--- Pointer to Struct ---\n";
    Student* sptr = &s1;
    std::cout << "Name via pointer: " << sptr->name << "\n";  // arrow operator
    std::cout << "Name via deref:   " << (*sptr).name << "\n"; // equivalent

    return 0;
}
