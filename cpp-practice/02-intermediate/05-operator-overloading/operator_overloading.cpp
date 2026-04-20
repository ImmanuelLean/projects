/**
 * LESSON: Operator Overloading
 * Define how operators (+, -, ==, <<, etc.) work with your custom classes.
 */
#include <iostream>
#include <cmath>

class Vector2D {
    double x, y;
public:
    Vector2D(double x = 0, double y = 0) : x(x), y(y) {}

    // Arithmetic operators (return new object)
    Vector2D operator+(const Vector2D& other) const {
        return Vector2D(x + other.x, y + other.y);
    }

    Vector2D operator-(const Vector2D& other) const {
        return Vector2D(x - other.x, y - other.y);
    }

    // Scalar multiplication
    Vector2D operator*(double scalar) const {
        return Vector2D(x * scalar, y * scalar);
    }

    // Compound assignment
    Vector2D& operator+=(const Vector2D& other) {
        x += other.x;
        y += other.y;
        return *this;
    }

    // Comparison operators
    bool operator==(const Vector2D& other) const {
        return x == other.x && y == other.y;
    }

    bool operator!=(const Vector2D& other) const {
        return !(*this == other);
    }

    // Unary minus (negation)
    Vector2D operator-() const {
        return Vector2D(-x, -y);
    }

    // Pre-increment (++)
    Vector2D& operator++() {
        ++x; ++y;
        return *this;
    }

    // Post-increment (++) - note the dummy int parameter
    Vector2D operator++(int) {
        Vector2D temp = *this;
        ++x; ++y;
        return temp;
    }

    // Subscript operator
    double& operator[](int index) {
        if (index == 0) return x;
        if (index == 1) return y;
        throw std::out_of_range("Index must be 0 or 1");
    }

    // Function call operator (functor)
    double operator()() const {
        return std::sqrt(x * x + y * y); // magnitude
    }

    double getX() const { return x; }
    double getY() const { return y; }

    // Friend function: allows non-member function to access private members
    // Stream insertion operator (must be non-member)
    friend std::ostream& operator<<(std::ostream& os, const Vector2D& v);
    friend std::istream& operator>>(std::istream& is, Vector2D& v);
    friend Vector2D operator*(double scalar, const Vector2D& v);
};

// Stream operators (non-member friend functions)
std::ostream& operator<<(std::ostream& os, const Vector2D& v) {
    os << "(" << v.x << ", " << v.y << ")";
    return os;
}

std::istream& operator>>(std::istream& is, Vector2D& v) {
    is >> v.x >> v.y;
    return is;
}

// Allow: scalar * vector (not just vector * scalar)
Vector2D operator*(double scalar, const Vector2D& v) {
    return Vector2D(v.x * scalar, v.y * scalar);
}

int main() {
    Vector2D a(3, 4);
    Vector2D b(1, 2);

    std::cout << "--- Basic Operations ---\n";
    std::cout << "a = " << a << "\n";
    std::cout << "b = " << b << "\n";
    std::cout << "a + b = " << (a + b) << "\n";
    std::cout << "a - b = " << (a - b) << "\n";
    std::cout << "a * 2 = " << (a * 2) << "\n";
    std::cout << "3 * b = " << (3 * b) << "\n";
    std::cout << "-a = " << (-a) << "\n";

    std::cout << "\n--- Comparison ---\n";
    std::cout << "a == b: " << std::boolalpha << (a == b) << "\n";
    std::cout << "a != b: " << (a != b) << "\n";

    std::cout << "\n--- Compound Assignment ---\n";
    Vector2D c(1, 1);
    c += a;
    std::cout << "c += a: " << c << "\n";

    std::cout << "\n--- Increment ---\n";
    Vector2D d(5, 5);
    std::cout << "d = " << d << "\n";
    std::cout << "++d = " << (++d) << "\n";     // (6, 6)
    std::cout << "d++ = " << (d++) << "\n";     // (6, 6) then becomes (7, 7)
    std::cout << "d = " << d << "\n";            // (7, 7)

    std::cout << "\n--- Subscript ---\n";
    std::cout << "a[0] = " << a[0] << "\n"; // x
    std::cout << "a[1] = " << a[1] << "\n"; // y

    std::cout << "\n--- Functor (magnitude) ---\n";
    std::cout << "|a| = " << a() << "\n"; // sqrt(9+16) = 5

    return 0;
}
