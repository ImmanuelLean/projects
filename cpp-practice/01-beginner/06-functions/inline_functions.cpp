/**
 * LESSON: Inline and Constexpr Functions
 * inline suggests the compiler replace the function call with the function body.
 * constexpr enables compile-time evaluation.
 *
 * Compile: g++ -std=c++17 -o inline_funcs inline_functions.cpp
 * Run:     ./inline_funcs
 */
#include <iostream>

// ===== INLINE FUNCTIONS =====
// Hint to compiler: replace call with body (avoid function call overhead)
// Best for small, frequently called functions
inline int square(int x) {
    return x * x;
}

inline int max(int a, int b) {
    return (a > b) ? a : b;
}

inline double celsiusToFahrenheit(double c) {
    return c * 9.0 / 5.0 + 32.0;
}

// ===== CONSTEXPR FUNCTIONS (C++11) =====
// Evaluated at COMPILE TIME when possible
// Must have a return value computable from constexpr arguments
constexpr int factorial(int n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

constexpr int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

constexpr double circleArea(double radius) {
    return 3.14159265358979 * radius * radius;
}

// ===== CONSTEXPR vs CONST =====
// const:     value won't change after initialization (can be runtime)
// constexpr: value MUST be known at compile time

int main() {
    // --- Inline functions ---
    std::cout << "--- Inline Functions ---\n";
    std::cout << "square(5) = " << square(5) << "\n";
    std::cout << "square(12) = " << square(12) << "\n";
    std::cout << "max(10, 20) = " << max(10, 20) << "\n";
    std::cout << "37°C = " << celsiusToFahrenheit(37) << "°F\n";

    // --- Constexpr (compile-time) ---
    std::cout << "\n--- Constexpr Functions ---\n";

    // These are computed at COMPILE TIME
    constexpr int fact5 = factorial(5);      // 120
    constexpr int fib10 = fibonacci(10);     // 55
    constexpr double area = circleArea(5.0); // 78.54...

    std::cout << "factorial(5) = " << fact5 << "\n";
    std::cout << "fibonacci(10) = " << fib10 << "\n";
    std::cout << "circleArea(5.0) = " << area << "\n";

    // Can also be used at runtime with non-constexpr args
    int n = 6;
    std::cout << "factorial(" << n << ") = " << factorial(n) << " (runtime)\n";

    // --- constexpr for array sizes ---
    std::cout << "\n--- Constexpr for Array Sizes ---\n";
    constexpr int SIZE = factorial(3);  // 6, computed at compile time
    int arr[SIZE] = {10, 20, 30, 40, 50, 60};
    for (int i = 0; i < SIZE; i++) {
        std::cout << "arr[" << i << "] = " << arr[i] << "\n";
    }

    // --- Constexpr if (C++17) ---
    std::cout << "\n--- Key Differences ---\n";
    std::cout << "inline: suggestion to compiler, may be ignored\n";
    std::cout << "constexpr: guaranteed compile-time if args are constexpr\n";
    std::cout << "Both: best for small, simple functions\n";
    std::cout << "Avoid inline: for large functions, recursive functions\n";

    // --- constexpr variables ---
    constexpr int MAX_STUDENTS = 100;
    constexpr double PI = 3.14159265358979;
    const int runtimeVal = n * 2;  // const but NOT constexpr (depends on runtime n)

    std::cout << "\nMAX_STUDENTS = " << MAX_STUDENTS << " (constexpr)\n";
    std::cout << "PI = " << PI << " (constexpr)\n";
    std::cout << "runtimeVal = " << runtimeVal << " (const, not constexpr)\n";

    return 0;
}
