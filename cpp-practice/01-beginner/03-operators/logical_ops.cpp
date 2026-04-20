/**
 * LESSON: Logical, Comparison, and Bitwise Operators
 */
#include <iostream>

int main() {
    // ===== COMPARISON OPERATORS =====
    int a = 10, b = 20;
    std::cout << "--- Comparison ---\n";
    std::cout << "a = " << a << ", b = " << b << "\n";
    std::cout << "a == b : " << (a == b) << "\n";   // 0 (false)
    std::cout << "a != b : " << (a != b) << "\n";   // 1 (true)
    std::cout << "a > b  : " << (a > b) << "\n";    // 0
    std::cout << "a < b  : " << (a < b) << "\n";    // 1
    std::cout << "a >= b : " << (a >= b) << "\n";    // 0
    std::cout << "a <= b : " << (a <= b) << "\n";    // 1

    // ===== LOGICAL OPERATORS =====
    bool x = true, y = false;
    std::cout << "\n--- Logical ---\n";
    std::cout << std::boolalpha; // print true/false instead of 1/0
    std::cout << "x = " << x << ", y = " << y << "\n";
    std::cout << "x && y : " << (x && y) << "\n";   // false (AND)
    std::cout << "x || y : " << (x || y) << "\n";   // true  (OR)
    std::cout << "!x     : " << (!x) << "\n";       // false (NOT)
    std::cout << "!y     : " << (!y) << "\n";        // true

    // Short-circuit evaluation
    int num = 0;
    if (num != 0 && (10 / num > 2)) {
        std::cout << "This won't print\n";
    }
    std::cout << "Short-circuit prevented division by zero!\n";

    // ===== BITWISE OPERATORS =====
    int p = 5;  // binary: 0101
    int q = 3;  // binary: 0011
    std::cout << "\n--- Bitwise ---\n";
    std::cout << "p = " << p << " (0101), q = " << q << " (0011)\n";
    std::cout << "p & q  = " << (p & q) << "\n";    // AND:  0001 = 1
    std::cout << "p | q  = " << (p | q) << "\n";    // OR:   0111 = 7
    std::cout << "p ^ q  = " << (p ^ q) << "\n";    // XOR:  0110 = 6
    std::cout << "~p     = " << (~p) << "\n";        // NOT:  ...1010
    std::cout << "p << 1 = " << (p << 1) << "\n";   // Left shift:  1010 = 10
    std::cout << "p >> 1 = " << (p >> 1) << "\n";   // Right shift: 0010 = 2

    // ===== TERNARY OPERATOR =====
    std::cout << "\n--- Ternary ---\n";
    int age = 20;
    std::string status = (age >= 18) ? "Adult" : "Minor";
    std::cout << "Age " << age << ": " << status << "\n";

    return 0;
}
