/**
 * LESSON: Vectors (Dynamic Arrays)
 * std::vector is the most-used container in C++.
 * Unlike arrays, vectors resize automatically.
 */
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric> // accumulate

int main() {
    // ===== CREATING VECTORS =====
    std::cout << "--- Creating Vectors ---\n";
    std::vector<int> empty;                     // empty vector
    std::vector<int> nums = {10, 20, 30, 40};  // initializer list
    std::vector<std::string> names(3, "Hello"); // 3 elements, all "Hello"
    std::vector<int> copy(nums);                // copy constructor

    // ===== ADDING ELEMENTS =====
    std::cout << "\n--- Adding Elements ---\n";
    std::vector<int> v;
    v.push_back(10);     // add to end
    v.push_back(20);
    v.push_back(30);
    v.emplace_back(40);  // construct in place (more efficient)
    v.insert(v.begin() + 1, 15); // insert at index 1

    std::cout << "Vector: ";
    for (int n : v) std::cout << n << " ";
    std::cout << "\n";

    // ===== ACCESSING =====
    std::cout << "\n--- Accessing ---\n";
    std::cout << "v[0]: " << v[0] << "\n";          // no bounds check
    std::cout << "v.at(1): " << v.at(1) << "\n";    // bounds checked (throws exception)
    std::cout << "Front: " << v.front() << "\n";
    std::cout << "Back: " << v.back() << "\n";
    std::cout << "Size: " << v.size() << "\n";
    std::cout << "Capacity: " << v.capacity() << "\n";
    std::cout << "Empty? " << std::boolalpha << v.empty() << "\n";

    // ===== REMOVING =====
    std::cout << "\n--- Removing ---\n";
    v.pop_back(); // remove last
    v.erase(v.begin()); // remove first
    v.erase(v.begin() + 1); // remove at index 1
    std::cout << "After removes: ";
    for (int n : v) std::cout << n << " ";
    std::cout << "\n";

    // ===== SORTING =====
    std::cout << "\n--- Sorting ---\n";
    std::vector<int> unsorted = {64, 25, 12, 22, 11};
    std::sort(unsorted.begin(), unsorted.end()); // ascending
    std::cout << "Ascending: ";
    for (int n : unsorted) std::cout << n << " ";
    std::cout << "\n";

    std::sort(unsorted.begin(), unsorted.end(), std::greater<int>()); // descending
    std::cout << "Descending: ";
    for (int n : unsorted) std::cout << n << " ";
    std::cout << "\n";

    // ===== SEARCHING =====
    std::cout << "\n--- Searching ---\n";
    auto it = std::find(unsorted.begin(), unsorted.end(), 25);
    if (it != unsorted.end()) {
        std::cout << "Found 25 at index: " << std::distance(unsorted.begin(), it) << "\n";
    }

    // ===== USEFUL ALGORITHMS =====
    std::cout << "\n--- Algorithms ---\n";
    std::vector<int> data = {3, 1, 4, 1, 5, 9, 2, 6};
    std::cout << "Min: " << *std::min_element(data.begin(), data.end()) << "\n";
    std::cout << "Max: " << *std::max_element(data.begin(), data.end()) << "\n";
    std::cout << "Sum: " << std::accumulate(data.begin(), data.end(), 0) << "\n";
    std::cout << "Count of 1: " << std::count(data.begin(), data.end(), 1) << "\n";

    // Reverse
    std::reverse(data.begin(), data.end());
    std::cout << "Reversed: ";
    for (int n : data) std::cout << n << " ";
    std::cout << "\n";

    // ===== 2D VECTOR =====
    std::cout << "\n--- 2D Vector ---\n";
    std::vector<std::vector<int>> matrix = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    for (const auto& row : matrix) {
        for (int val : row) {
            std::cout << val << "\t";
        }
        std::cout << "\n";
    }

    return 0;
}
