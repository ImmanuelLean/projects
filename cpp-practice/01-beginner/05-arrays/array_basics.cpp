/**
 * LESSON: Arrays (C-style and std::array)
 */
#include <iostream>
#include <array>     // std::array (C++11)
#include <algorithm> // sort, fill, etc.

int main() {
    // ===== C-STYLE ARRAYS =====
    std::cout << "--- C-Style Arrays ---\n";
    int numbers[5] = {10, 20, 30, 40, 50};
    std::string colors[] = {"Red", "Green", "Blue"}; // size inferred

    std::cout << "First: " << numbers[0] << "\n";
    std::cout << "Last: " << numbers[4] << "\n";
    std::cout << "Size: " << sizeof(numbers) / sizeof(numbers[0]) << "\n";

    // Iterating
    std::cout << "\n--- Iteration ---\n";
    for (int i = 0; i < 5; i++) {
        std::cout << "numbers[" << i << "] = " << numbers[i] << "\n";
    }

    // Range-based for
    for (const auto& color : colors) {
        std::cout << "Color: " << color << "\n";
    }

    // ===== STD::ARRAY (C++11 - preferred) =====
    std::cout << "\n--- std::array ---\n";
    std::array<int, 5> arr = {64, 25, 12, 22, 11};

    std::cout << "Size: " << arr.size() << "\n";
    std::cout << "Front: " << arr.front() << "\n";
    std::cout << "Back: " << arr.back() << "\n";
    std::cout << "At(2): " << arr.at(2) << "\n"; // bounds-checked

    // Sorting
    std::sort(arr.begin(), arr.end());
    std::cout << "Sorted: ";
    for (int n : arr) std::cout << n << " ";
    std::cout << "\n";

    // Fill
    std::array<int, 4> filled;
    filled.fill(7);
    std::cout << "Filled: ";
    for (int n : filled) std::cout << n << " ";
    std::cout << "\n";

    // Empty check
    std::cout << "Empty? " << std::boolalpha << arr.empty() << "\n";

    // ===== 2D ARRAY =====
    std::cout << "\n--- 2D Array ---\n";
    int matrix[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            std::cout << matrix[i][j] << "\t";
        }
        std::cout << "\n";
    }

    return 0;
}
