/**
 * LESSON: Template Specialization
 * Specialization lets you provide custom implementations
 * for specific types while keeping the generic template for others.
 *
 * Compile: g++ -std=c++17 -o template_spec template_specialization.cpp
 * Run:     ./template_spec
 */
#include <iostream>
#include <string>
#include <cstring>
#include <type_traits>

// ===== PRIMARY TEMPLATE =====
template<typename T>
class Printer {
public:
    void print(const T& value) const {
        std::cout << "  Generic: " << value << "\n";
    }
};

// ===== FULL SPECIALIZATION for std::string =====
template<>
class Printer<std::string> {
public:
    void print(const std::string& value) const {
        std::cout << "  String (length=" << value.size() << "): \"" << value << "\"\n";
    }
};

// ===== FULL SPECIALIZATION for bool =====
template<>
class Printer<bool> {
public:
    void print(const bool& value) const {
        std::cout << "  Bool: " << (value ? "TRUE" : "FALSE") << "\n";
    }
};

// ===== FUNCTION TEMPLATE SPECIALIZATION =====
template<typename T>
T maxOf(T a, T b) {
    std::cout << "  [generic maxOf] ";
    return (a > b) ? a : b;
}

// Specialization for C-strings (can't use > directly)
template<>
const char* maxOf(const char* a, const char* b) {
    std::cout << "  [const char* maxOf] ";
    return (std::strcmp(a, b) > 0) ? a : b;
}

// ===== PARTIAL SPECIALIZATION (class templates only) =====
// Primary template
template<typename T, typename U>
class Pair {
public:
    T first;
    U second;
    void display() const {
        std::cout << "  Generic Pair<T,U>: (" << first << ", " << second << ")\n";
    }
};

// Partial specialization: both types are the same
template<typename T>
class Pair<T, T> {
public:
    T first;
    T second;
    void display() const {
        std::cout << "  Same-type Pair<T,T>: (" << first << ", " << second << ")\n";
    }
    T sum() const { return first + second; }  // only available for same-type pairs
};

// Partial specialization: second type is a pointer
template<typename T, typename U>
class Pair<T, U*> {
public:
    T first;
    U* second;
    void display() const {
        std::cout << "  Pointer Pair<T,U*>: (" << first << ", *" << *second << ")\n";
    }
};

// ===== SFINAE BASICS (Substitution Failure Is Not An Error) =====
// Enable function only for integral types
template<typename T>
typename std::enable_if<std::is_integral<T>::value, T>::type
doubleValue(T val) {
    std::cout << "  [integral] ";
    return val * 2;
}

// Enable function only for floating-point types
template<typename T>
typename std::enable_if<std::is_floating_point<T>::value, T>::type
doubleValue(T val) {
    std::cout << "  [floating] ";
    return val * 2.0;
}

int main() {
    // --- Full specialization ---
    std::cout << "--- Full Specialization ---\n";
    Printer<int> intPrinter;
    Printer<std::string> strPrinter;
    Printer<bool> boolPrinter;

    intPrinter.print(42);
    strPrinter.print("Hello, World!");
    boolPrinter.print(true);

    // --- Function template specialization ---
    std::cout << "\n--- Function Specialization ---\n";
    std::cout << maxOf(10, 20) << "\n";
    std::cout << maxOf(3.14, 2.71) << "\n";
    std::cout << maxOf("apple", "banana") << "\n";  // uses const char* specialization

    // --- Partial specialization ---
    std::cout << "\n--- Partial Specialization ---\n";
    Pair<int, std::string> p1{42, "hello"};
    p1.display();  // generic

    Pair<int, int> p2{10, 20};
    p2.display();  // same-type specialization
    std::cout << "  Sum: " << p2.sum() << "\n";

    int val = 99;
    Pair<std::string, int*> p3{"ptr", &val};
    p3.display();  // pointer specialization

    // --- SFINAE ---
    std::cout << "\n--- SFINAE ---\n";
    std::cout << "double(5): " << doubleValue(5) << "\n";
    std::cout << "double(3.14): " << doubleValue(3.14) << "\n";
    // doubleValue("hello");  // ERROR: no matching function (neither integral nor float)

    return 0;
}
