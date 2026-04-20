/**
 * LESSON: Function Overloading
 * C++ allows multiple functions with the same name but different parameters.
 * The compiler picks the right version based on argument types/count.
 *
 * Compile: g++ -std=c++17 -o overloading function_overloading.cpp
 * Run:     ./overloading
 */
#include <iostream>
#include <string>

// ===== OVERLOADING BY PARAMETER TYPE =====
int add(int a, int b) {
    std::cout << "  [int version] ";
    return a + b;
}

double add(double a, double b) {
    std::cout << "  [double version] ";
    return a + b;
}

std::string add(const std::string& a, const std::string& b) {
    std::cout << "  [string version] ";
    return a + b;
}

// ===== OVERLOADING BY NUMBER OF PARAMETERS =====
void print(int a) {
    std::cout << "  One param: " << a << "\n";
}

void print(int a, int b) {
    std::cout << "  Two params: " << a << ", " << b << "\n";
}

void print(int a, int b, int c) {
    std::cout << "  Three params: " << a << ", " << b << ", " << c << "\n";
}

// ===== OVERLOADING WITH const =====
class MyClass {
    int value;
public:
    MyClass(int v) : value(v) {}

    // Non-const version (called on non-const objects)
    int& getValue() {
        std::cout << "  [non-const getValue] ";
        return value;
    }

    // Const version (called on const objects)
    const int& getValue() const {
        std::cout << "  [const getValue] ";
        return value;
    }
};

// ===== OVERLOADING WITH REFERENCE TYPES =====
void process(int& val) {
    std::cout << "  lvalue reference: " << val << "\n";
}

void process(int&& val) {
    std::cout << "  rvalue reference: " << val << "\n";
}

int main() {
    // --- By Type ---
    std::cout << "--- Overload by Type ---\n";
    std::cout << add(3, 5) << "\n";
    std::cout << add(3.14, 2.71) << "\n";
    std::cout << add(std::string("Hello, "), std::string("World!")) << "\n";

    // --- By Number of Params ---
    std::cout << "\n--- Overload by Parameter Count ---\n";
    print(10);
    print(10, 20);
    print(10, 20, 30);

    // --- Const Overloading ---
    std::cout << "\n--- Const Overloading ---\n";
    MyClass obj(42);
    const MyClass constObj(99);
    std::cout << obj.getValue() << "\n";       // calls non-const
    std::cout << constObj.getValue() << "\n";   // calls const

    // --- Reference Overloading ---
    std::cout << "\n--- Reference Overloading ---\n";
    int x = 10;
    process(x);             // lvalue
    process(42);            // rvalue
    process(std::move(x));  // forced rvalue

    // --- NOTE: Return type does NOT count ---
    std::cout << "\n--- Important Rules ---\n";
    std::cout << "1. Return type alone can't distinguish overloads\n";
    std::cout << "2. Compiler chooses best match at compile time\n";
    std::cout << "3. Ambiguous calls cause compile errors\n";

    // Example of potential ambiguity:
    // void foo(int x) { }
    // void foo(double x) { }
    // foo(5L);  // long - could match int or double = ambiguous!

    return 0;
}
