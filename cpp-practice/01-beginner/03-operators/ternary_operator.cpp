/**
 * LESSON: Ternary (Conditional) Operator
 * Syntax: condition ? value_if_true : value_if_false
 * A compact alternative to if-else for simple conditions.
 *
 * Compile: g++ -std=c++17 -o ternary ternary_operator.cpp
 * Run:     ./ternary
 */
#include <iostream>
#include <string>

int main() {
    // ===== BASIC TERNARY =====
    std::cout << "--- Basic Ternary ---\n";
    int age = 20;
    std::string status = (age >= 18) ? "Adult" : "Minor";
    std::cout << "Age " << age << ": " << status << "\n";

    // Equivalent if-else:
    // std::string status;
    // if (age >= 18) status = "Adult";
    // else status = "Minor";

    // ===== TERNARY IN OUTPUT =====
    std::cout << "\n--- In Output Statements ---\n";
    int score = 85;
    std::cout << "Grade: " << (score >= 90 ? "A" : (score >= 80 ? "B" : "C")) << "\n";

    // ===== TERNARY WITH NUMBERS =====
    std::cout << "\n--- Finding Min/Max ---\n";
    int a = 15, b = 23;
    int maxVal = (a > b) ? a : b;
    int minVal = (a < b) ? a : b;
    std::cout << "Max(" << a << ", " << b << ") = " << maxVal << "\n";
    std::cout << "Min(" << a << ", " << b << ") = " << minVal << "\n";

    // ===== TERNARY FOR ABSOLUTE VALUE =====
    int num = -7;
    int absVal = (num >= 0) ? num : -num;
    std::cout << "Absolute value of " << num << " = " << absVal << "\n";

    // ===== NESTED TERNARY =====
    std::cout << "\n--- Nested Ternary ---\n";
    int x = 0;
    std::string sign = (x > 0) ? "positive"
                     : (x < 0) ? "negative"
                     : "zero";
    std::cout << x << " is " << sign << "\n";
    // Note: deeply nested ternaries are hard to read - prefer if-else

    // ===== TERNARY WITH FUNCTION CALLS =====
    std::cout << "\n--- With Functions ---\n";
    int items = 1;
    std::cout << "You have " << items << " item" << (items == 1 ? "" : "s") << "\n";

    items = 5;
    std::cout << "You have " << items << " item" << (items == 1 ? "" : "s") << "\n";

    // ===== TERNARY AS LVALUE (C++ specific) =====
    std::cout << "\n--- Ternary as Lvalue ---\n";
    int val1 = 10, val2 = 20;
    bool pickFirst = true;
    // Assign to the chosen variable!
    (pickFirst ? val1 : val2) = 99;
    std::cout << "val1 = " << val1 << ", val2 = " << val2 << "\n";

    // ===== WHEN TO USE vs AVOID =====
    std::cout << "\n--- Best Practices ---\n";
    // GOOD: simple, clear conditions
    bool isEven = (42 % 2 == 0) ? true : false;
    // Even simpler: bool isEven = (42 % 2 == 0);

    // AVOID: complex logic, side effects, or deep nesting
    // BAD:  result = (a > b) ? (c > d ? (e > f ? x : y) : z) : w;
    // Use if-else instead for readability!

    std::cout << "42 is even: " << std::boolalpha << isEven << "\n";
    std::cout << "Tip: Keep ternary simple, use if-else for complex logic\n";

    return 0;
}
