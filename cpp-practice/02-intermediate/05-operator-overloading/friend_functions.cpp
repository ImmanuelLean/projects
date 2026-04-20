/**
 * LESSON: Friend Functions and Friend Classes
 * Friends can access private/protected members of a class.
 * Commonly used for operator overloading (especially << and >>).
 *
 * Compile: g++ -std=c++17 -o friend_func friend_functions.cpp
 * Run:     ./friend_func
 */
#include <iostream>
#include <string>

// ===== FRIEND FUNCTION FOR operator<< =====
class Vector2D {
private:
    double x, y;

public:
    Vector2D(double x = 0, double y = 0) : x(x), y(y) {}

    // Member operator+
    Vector2D operator+(const Vector2D& other) const {
        return Vector2D(x + other.x, y + other.y);
    }

    Vector2D operator*(double scalar) const {
        return Vector2D(x * scalar, y * scalar);
    }

    // Friend: operator<< (must be non-member because left operand is ostream)
    friend std::ostream& operator<<(std::ostream& os, const Vector2D& v);

    // Friend: operator>> for input
    friend std::istream& operator>>(std::istream& is, Vector2D& v);

    // Friend: scalar * vector (non-member, reversed order)
    friend Vector2D operator*(double scalar, const Vector2D& v);

    // Friend function for comparison
    friend bool operator==(const Vector2D& a, const Vector2D& b);
};

// Implement friend operator<<
std::ostream& operator<<(std::ostream& os, const Vector2D& v) {
    os << "(" << v.x << ", " << v.y << ")";  // accesses private x, y
    return os;
}

std::istream& operator>>(std::istream& is, Vector2D& v) {
    is >> v.x >> v.y;
    return is;
}

Vector2D operator*(double scalar, const Vector2D& v) {
    return Vector2D(v.x * scalar, v.y * scalar);
}

bool operator==(const Vector2D& a, const Vector2D& b) {
    return a.x == b.x && a.y == b.y;
}

// ===== FRIEND CLASS =====
class Engine {
private:
    int horsepower;
    double temperature;

public:
    Engine(int hp) : horsepower(hp), temperature(20.0) {}

    // Mechanic class can access ALL private members
    friend class Mechanic;
};

class Mechanic {
public:
    void inspect(const Engine& e) const {
        // Can access private members because we're a friend
        std::cout << "  Engine: " << e.horsepower << " HP, "
                  << e.temperature << "°C\n";
    }

    void tune(Engine& e, int newHp) {
        e.horsepower = newHp;  // directly modifying private member
        std::cout << "  Tuned to " << e.horsepower << " HP\n";
    }
};

// ===== WHEN TO USE FRIENDS =====
class Matrix {
private:
    int data[2][2];

public:
    Matrix(int a, int b, int c, int d) {
        data[0][0] = a; data[0][1] = b;
        data[1][0] = c; data[1][1] = d;
    }

    // Friend is better than member for symmetric operators
    friend Matrix operator+(const Matrix& a, const Matrix& b);
    friend std::ostream& operator<<(std::ostream& os, const Matrix& m);
};

Matrix operator+(const Matrix& a, const Matrix& b) {
    return Matrix(
        a.data[0][0] + b.data[0][0], a.data[0][1] + b.data[0][1],
        a.data[1][0] + b.data[1][0], a.data[1][1] + b.data[1][1]
    );
}

std::ostream& operator<<(std::ostream& os, const Matrix& m) {
    os << "[" << m.data[0][0] << " " << m.data[0][1] << "]\n"
       << "[" << m.data[1][0] << " " << m.data[1][1] << "]";
    return os;
}

int main() {
    // --- Friend operator<< ---
    std::cout << "--- Friend operator<< ---\n";
    Vector2D v1(3.0, 4.0);
    Vector2D v2(1.0, 2.0);
    std::cout << "v1 = " << v1 << "\n";
    std::cout << "v2 = " << v2 << "\n";

    // --- Friend operators ---
    std::cout << "\n--- Friend Operators ---\n";
    Vector2D v3 = v1 + v2;
    std::cout << "v1 + v2 = " << v3 << "\n";

    Vector2D v4 = v1 * 2.0;       // member operator
    Vector2D v5 = 3.0 * v1;       // friend operator (reversed)
    std::cout << "v1 * 2 = " << v4 << "\n";
    std::cout << "3 * v1 = " << v5 << "\n";

    std::cout << "v1 == v1? " << std::boolalpha << (v1 == v1) << "\n";
    std::cout << "v1 == v2? " << (v1 == v2) << "\n";

    // --- Friend class ---
    std::cout << "\n--- Friend Class ---\n";
    Engine engine(200);
    Mechanic mech;
    mech.inspect(engine);
    mech.tune(engine, 250);

    // --- Matrix with friend operators ---
    std::cout << "\n--- Matrix ---\n";
    Matrix m1(1, 2, 3, 4);
    Matrix m2(5, 6, 7, 8);
    std::cout << "m1:\n" << m1 << "\n\n";
    std::cout << "m1 + m2:\n" << (m1 + m2) << "\n";

    // --- Guidelines ---
    std::cout << "\n--- When to Use Friends ---\n";
    std::cout << "1. operator<< and operator>> (left operand isn't your class)\n";
    std::cout << "2. Symmetric binary operators (a + b should work like b + a)\n";
    std::cout << "3. Related utility classes that need deep access\n";
    std::cout << "4. Avoid: excessive friends break encapsulation\n";

    return 0;
}
