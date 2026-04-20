/**
 * LESSON: Constants in C++
 * Values that cannot change after initialization.
 * Three ways: const, constexpr, #define (avoid #define in modern C++)
 */
#include <iostream>
#include <cmath>

// ===== #define (preprocessor macro - OLD way, avoid) =====
#define MAX_SIZE 100  // simple text replacement, no type checking

// ===== constexpr (C++11) - evaluated at COMPILE TIME =====
constexpr double PI = 3.14159265358979;
constexpr int DAYS_IN_WEEK = 7;

// constexpr function - computed at compile time if possible
constexpr int square(int x) {
    return x * x;
}

constexpr int factorial(int n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

int main() {
    // ===== const - cannot be modified after initialization =====
    std::cout << "--- const ---\n";
    const int MAX_STUDENTS = 30;
    const std::string SCHOOL_NAME = "C++ Academy";

    std::cout << "Max students: " << MAX_STUDENTS << "\n";
    std::cout << "School: " << SCHOOL_NAME << "\n";
    // MAX_STUDENTS = 40; // ERROR: assignment of read-only variable

    // ===== constexpr =====
    std::cout << "\n--- constexpr ---\n";
    std::cout << "PI: " << PI << "\n";
    std::cout << "Days in week: " << DAYS_IN_WEEK << "\n";

    // Computed at compile time!
    constexpr int sq = square(5);
    constexpr int fact5 = factorial(5);
    std::cout << "5² = " << sq << "\n";
    std::cout << "5! = " << fact5 << "\n";

    // Can be used for array sizes (must be compile-time constant)
    constexpr int SIZE = 10;
    int arr[SIZE]; // OK because SIZE is constexpr

    // ===== const with pointers =====
    std::cout << "\n--- const with Pointers ---\n";

    int value = 42;
    int other = 100;

    // Pointer to const: can't modify the VALUE through the pointer
    const int* ptrToConst = &value;
    // *ptrToConst = 50; // ERROR
    ptrToConst = &other; // OK: pointer itself can change
    std::cout << "Pointer to const: " << *ptrToConst << "\n";

    // Const pointer: pointer itself can't change, but value can
    int* const constPtr = &value;
    *constPtr = 50;      // OK: can modify value
    // constPtr = &other; // ERROR: can't change pointer
    std::cout << "Const pointer: " << *constPtr << "\n";

    // Const pointer to const: nothing can change
    const int* const bothConst = &value;
    // *bothConst = 60;    // ERROR
    // bothConst = &other;  // ERROR
    std::cout << "Const ptr to const: " << *bothConst << "\n";

    // ===== const vs constexpr =====
    std::cout << "\n--- const vs constexpr ---\n";
    std::cout << "const: value set at runtime or compile time\n";
    std::cout << "constexpr: value MUST be set at compile time\n";
    std::cout << "Prefer constexpr when possible for better optimization\n";

    return 0;
}
