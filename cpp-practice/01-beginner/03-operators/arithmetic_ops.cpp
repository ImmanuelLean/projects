/**
 * LESSON: Arithmetic Operators
 * Basic math operations in C++.
 */
#include <iostream>
#include <cmath> // for pow, sqrt, abs, etc.

int main() {
    int a = 17, b = 5;

    // ===== BASIC ARITHMETIC =====
    std::cout << "--- Basic Arithmetic ---\n";
    std::cout << "a = " << a << ", b = " << b << "\n";
    std::cout << "a + b = " << (a + b) << "\n";   // 22
    std::cout << "a - b = " << (a - b) << "\n";   // 12
    std::cout << "a * b = " << (a * b) << "\n";   // 85
    std::cout << "a / b = " << (a / b) << "\n";   // 3 (integer division!)
    std::cout << "a % b = " << (a % b) << "\n";   // 2 (modulus)

    // For decimal division, use double
    std::cout << "a / (double)b = " << (a / (double)b) << "\n"; // 3.4

    // ===== INCREMENT & DECREMENT =====
    std::cout << "\n--- Increment/Decrement ---\n";
    int x = 10;
    std::cout << "x = " << x << "\n";
    std::cout << "x++ = " << x++ << "\n";  // prints 10, then x becomes 11
    std::cout << "x is now: " << x << "\n"; // 11
    std::cout << "++x = " << ++x << "\n";  // x becomes 12, then prints 12
    std::cout << "x-- = " << x-- << "\n";  // prints 12, then x becomes 11
    std::cout << "--x = " << --x << "\n";  // x becomes 10, then prints 10

    // ===== COMPOUND ASSIGNMENT =====
    std::cout << "\n--- Compound Assignment ---\n";
    int score = 100;
    score += 10;  std::cout << "score += 10 -> " << score << "\n";  // 110
    score -= 20;  std::cout << "score -= 20 -> " << score << "\n";  // 90
    score *= 2;   std::cout << "score *= 2  -> " << score << "\n";  // 180
    score /= 3;   std::cout << "score /= 3  -> " << score << "\n";  // 60
    score %= 7;   std::cout << "score %= 7  -> " << score << "\n";  // 4

    // ===== CMATH FUNCTIONS =====
    std::cout << "\n--- cmath Functions ---\n";
    std::cout << "pow(2, 10) = " << pow(2, 10) << "\n";     // 1024
    std::cout << "sqrt(144)  = " << sqrt(144) << "\n";       // 12
    std::cout << "abs(-42)   = " << abs(-42) << "\n";        // 42
    std::cout << "ceil(3.2)  = " << ceil(3.2) << "\n";       // 4
    std::cout << "floor(3.9) = " << floor(3.9) << "\n";      // 3
    std::cout << "round(3.5) = " << round(3.5) << "\n";      // 4
    std::cout << "log(100)   = " << log(100) << "\n";         // natural log
    std::cout << "log10(100) = " << log10(100) << "\n";       // 2

    return 0;
}
