/**
 * LESSON: Range-Based For Loop (C++11)
 * A cleaner, safer way to iterate over collections.
 * Syntax: for (type element : collection) { ... }
 *
 * Compile: g++ -std=c++17 -o range_for range_for.cpp
 * Run:     ./range_for
 */
#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <array>

int main() {
    // ===== WITH C-STYLE ARRAYS =====
    std::cout << "--- With Arrays ---\n";
    int nums[] = {10, 20, 30, 40, 50};
    for (int n : nums) {
        std::cout << n << " ";
    }
    std::cout << "\n";

    // ===== WITH VECTORS =====
    std::cout << "\n--- With Vectors ---\n";
    std::vector<std::string> fruits = {"Apple", "Banana", "Cherry", "Date"};
    for (const std::string& fruit : fruits) {
        std::cout << fruit << "\n";
    }

    // ===== WITH auto KEYWORD =====
    std::cout << "\n--- Using auto ---\n";
    std::vector<double> prices = {9.99, 19.99, 29.99, 39.99};
    for (auto price : prices) {  // auto deduces double
        std::cout << "$" << price << " ";
    }
    std::cout << "\n";

    // ===== BY VALUE vs BY REFERENCE =====
    std::cout << "\n--- By Value (copy, can't modify original) ---\n";
    std::vector<int> values = {1, 2, 3, 4, 5};
    for (int v : values) {
        v *= 10;  // modifies copy only
    }
    std::cout << "After by-value multiply: ";
    for (int v : values) std::cout << v << " ";  // unchanged: 1 2 3 4 5
    std::cout << "\n";

    std::cout << "\n--- By Reference (modifies original) ---\n";
    for (int& v : values) {
        v *= 10;  // modifies actual element
    }
    std::cout << "After by-ref multiply: ";
    for (int v : values) std::cout << v << " ";  // changed: 10 20 30 40 50
    std::cout << "\n";

    std::cout << "\n--- By Const Reference (read-only, no copy) ---\n";
    for (const int& v : values) {
        // v *= 2;  // ERROR: can't modify const reference
        std::cout << v << " ";
    }
    std::cout << "(safe, efficient)\n";

    // ===== WITH STRINGS (iterate characters) =====
    std::cout << "\n--- Iterating String Characters ---\n";
    std::string word = "Hello";
    for (char ch : word) {
        std::cout << ch << " ";
    }
    std::cout << "\n";

    // Modify string in-place
    for (char& ch : word) {
        ch = std::toupper(ch);
    }
    std::cout << "Uppercased: " << word << "\n";

    // ===== WITH std::array (C++11) =====
    std::cout << "\n--- With std::array ---\n";
    std::array<int, 4> arr = {100, 200, 300, 400};
    for (const auto& val : arr) {
        std::cout << val << " ";
    }
    std::cout << "\n";

    // ===== WITH MAPS - Structured Bindings (C++17) =====
    std::cout << "\n--- With Maps (Structured Bindings C++17) ---\n";
    std::map<std::string, int> ages = {
        {"Alice", 25}, {"Bob", 30}, {"Charlie", 35}
    };

    // C++17 structured bindings
    for (const auto& [name, age] : ages) {
        std::cout << name << " is " << age << " years old\n";
    }

    // Before C++17:
    // for (const auto& pair : ages) {
    //     std::cout << pair.first << " is " << pair.second << "\n";
    // }

    // ===== WITH INITIALIZER LIST =====
    std::cout << "\n--- With Initializer List ---\n";
    for (int n : {2, 4, 6, 8, 10}) {
        std::cout << n << " ";
    }
    std::cout << "\n";

    // ===== NESTED RANGE-FOR =====
    std::cout << "\n--- Nested Range-For (2D Vector) ---\n";
    std::vector<std::vector<int>> matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    for (const auto& row : matrix) {
        for (const auto& elem : row) {
            std::cout << elem << " ";
        }
        std::cout << "\n";
    }

    return 0;
}
