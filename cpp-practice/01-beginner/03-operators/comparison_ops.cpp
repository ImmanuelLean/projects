/**
 * LESSON: Comparison Operators
 * Comparison operators compare two values and return a boolean (true/false).
 * Understanding their pitfalls prevents subtle bugs.
 *
 * Compile: g++ -std=c++17 -o comparison_ops comparison_ops.cpp
 * Run:     ./comparison_ops
 */
#include <iostream>
#include <cmath>    // for fabs
#include <string>

int main() {
    // ===== BASIC COMPARISONS =====
    std::cout << "--- Basic Comparisons ---\n";
    int a = 10, b = 20;

    std::cout << std::boolalpha;  // print true/false instead of 1/0
    std::cout << "a == b: " << (a == b) << "\n";  // equal to
    std::cout << "a != b: " << (a != b) << "\n";  // not equal to
    std::cout << "a < b:  " << (a < b)  << "\n";  // less than
    std::cout << "a > b:  " << (a > b)  << "\n";  // greater than
    std::cout << "a <= b: " << (a <= b) << "\n";  // less than or equal
    std::cout << "a >= b: " << (a >= b) << "\n";  // greater than or equal

    // ===== COMPARING DIFFERENT TYPES =====
    std::cout << "\n--- Comparing Different Types ---\n";

    // int vs double (int gets promoted to double)
    int i = 5;
    double d = 5.0;
    std::cout << "5 == 5.0: " << (i == d) << "\n";  // true

    // char comparison (uses ASCII values)
    char c1 = 'A';  // ASCII 65
    char c2 = 'B';  // ASCII 66
    std::cout << "'A' < 'B': " << (c1 < c2) << "\n";
    std::cout << "'A' == 65: " << (c1 == 65) << "\n";

    // bool comparison
    std::cout << "true == 1: " << (true == 1) << "\n";
    std::cout << "false == 0: " << (false == 0) << "\n";

    // ===== STRING COMPARISONS =====
    std::cout << "\n--- String Comparisons ---\n";
    std::string s1 = "apple";
    std::string s2 = "banana";
    std::string s3 = "apple";

    std::cout << "\"apple\" == \"apple\":  " << (s1 == s3) << "\n";
    std::cout << "\"apple\" < \"banana\": " << (s1 < s2) << "\n";  // lexicographic
    std::cout << "\"apple\" != \"banana\": " << (s1 != s2) << "\n";

    // ===== COMMON PITFALL: = vs == =====
    std::cout << "\n--- Pitfall: = vs == ---\n";
    int x = 5;
    // WRONG: if (x = 10) assigns 10 to x, then evaluates as true (non-zero)
    // RIGHT: if (x == 10) compares x with 10
    if (x == 10) {
        std::cout << "x is 10\n";
    } else {
        std::cout << "x is NOT 10 (x = " << x << ")\n";
    }

    // ===== PITFALL: FLOATING POINT COMPARISON =====
    std::cout << "\n--- Pitfall: Floating Point ---\n";
    double result = 0.1 + 0.2;
    std::cout << "0.1 + 0.2 = " << result << "\n";
    std::cout << "0.1 + 0.2 == 0.3? " << (result == 0.3) << " (surprise!)\n";

    // SOLUTION: use epsilon comparison
    double epsilon = 1e-9;
    bool closeEnough = std::fabs(result - 0.3) < epsilon;
    std::cout << "Using epsilon: " << closeEnough << " (correct!)\n";

    // ===== CHAINED COMPARISONS (C++ gotcha) =====
    std::cout << "\n--- Chained Comparison ---\n";
    int val = 5;
    // WRONG in C++: (1 < val < 3) does NOT mean "val between 1 and 3"
    // It evaluates as: (1 < val) < 3 -> true < 3 -> 1 < 3 -> true
    std::cout << "1 < 5 < 3 (wrong way): " << (1 < val && val < 3) << "\n";
    // RIGHT: use logical AND
    std::cout << "1 < 5 && 5 < 10: " << (1 < val && val < 10) << "\n";

    // ===== COMPARING POINTERS =====
    std::cout << "\n--- Pointer Comparison ---\n";
    int arr[] = {10, 20, 30};
    int* p1 = &arr[0];
    int* p2 = &arr[2];
    int* p3 = &arr[0];
    std::cout << "p1 == p3 (same address): " << (p1 == p3) << "\n";
    std::cout << "p1 < p2 (lower address): " << (p1 < p2) << "\n";
    std::cout << "p1 == nullptr: " << (p1 == nullptr) << "\n";

    return 0;
}
