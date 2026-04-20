/**
 * LESSON: Pass by Value, Reference, and Pointer
 * Understanding how arguments are passed is fundamental in C++.
 * Each method has different performance and mutability implications.
 *
 * Compile: g++ -std=c++17 -o pass_by pass_by_value_reference.cpp
 * Run:     ./pass_by
 */
#include <iostream>
#include <string>
#include <vector>

// ===== PASS BY VALUE (copy) =====
// A COPY is made - changes don't affect the original
void passByValue(int x) {
    x = 999;  // modifies the copy only
    std::cout << "  Inside (value): x = " << x << "\n";
}

// ===== PASS BY REFERENCE (&) =====
// NO copy - works directly on the original
void passByReference(int& x) {
    x = 999;  // modifies the original
    std::cout << "  Inside (ref): x = " << x << "\n";
}

// ===== PASS BY CONST REFERENCE (const &) =====
// NO copy, but CANNOT modify (read-only access)
void passByConstRef(const std::string& str) {
    // str = "modified";  // ERROR: can't modify const reference
    std::cout << "  Inside (const ref): " << str << " (length=" << str.size() << ")\n";
}

// ===== PASS BY POINTER (*) =====
// Pass the memory address - can modify via dereferencing
void passByPointer(int* ptr) {
    if (ptr) {  // always check for nullptr
        *ptr = 999;  // modifies the original via pointer
        std::cout << "  Inside (pointer): *ptr = " << *ptr << "\n";
    }
}

// ===== PRACTICAL: Swap functions =====
// Won't work - passes copies
void badSwap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

// Works - passes references
void goodSwap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

// Also works - passes pointers
void pointerSwap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// ===== WHEN TO USE WHICH =====
// Pass by value:       small types (int, double, char, bool)
// Pass by const ref:   large objects you DON'T need to modify (strings, vectors)
// Pass by reference:   when you NEED to modify the original
// Pass by pointer:     when nullptr is a valid argument, or for arrays

// Efficient: pass large objects by const reference
double averageScore(const std::vector<int>& scores) {
    double sum = 0;
    for (int s : scores) sum += s;
    return sum / scores.size();
}

// Return multiple values via reference parameters
void getMinMax(const std::vector<int>& vec, int& minVal, int& maxVal) {
    minVal = vec[0];
    maxVal = vec[0];
    for (int v : vec) {
        if (v < minVal) minVal = v;
        if (v > maxVal) maxVal = v;
    }
}

int main() {
    // --- Pass by Value ---
    std::cout << "--- Pass by Value ---\n";
    int a = 10;
    std::cout << "Before: a = " << a << "\n";
    passByValue(a);
    std::cout << "After:  a = " << a << " (unchanged)\n";

    // --- Pass by Reference ---
    std::cout << "\n--- Pass by Reference ---\n";
    int b = 10;
    std::cout << "Before: b = " << b << "\n";
    passByReference(b);
    std::cout << "After:  b = " << b << " (modified!)\n";

    // --- Pass by Const Reference ---
    std::cout << "\n--- Pass by Const Reference ---\n";
    std::string longStr = "This is a very long string that would be expensive to copy";
    passByConstRef(longStr);  // efficient, no copy

    // --- Pass by Pointer ---
    std::cout << "\n--- Pass by Pointer ---\n";
    int c = 10;
    std::cout << "Before: c = " << c << "\n";
    passByPointer(&c);  // pass address with &
    std::cout << "After:  c = " << c << " (modified!)\n";

    // --- Swap Demo ---
    std::cout << "\n--- Swap Demo ---\n";
    int x = 5, y = 10;
    badSwap(x, y);
    std::cout << "Bad swap:     x=" << x << ", y=" << y << " (unchanged!)\n";

    goodSwap(x, y);
    std::cout << "Good swap:    x=" << x << ", y=" << y << " (swapped!)\n";

    pointerSwap(&x, &y);
    std::cout << "Pointer swap: x=" << x << ", y=" << y << " (swapped back!)\n";

    // --- Practical: Return multiple values ---
    std::cout << "\n--- Return Multiple Values ---\n";
    std::vector<int> scores = {85, 92, 78, 96, 88, 73, 99};
    int minScore, maxScore;
    getMinMax(scores, minScore, maxScore);
    std::cout << "Min: " << minScore << ", Max: " << maxScore << "\n";
    std::cout << "Average: " << averageScore(scores) << "\n";

    return 0;
}
