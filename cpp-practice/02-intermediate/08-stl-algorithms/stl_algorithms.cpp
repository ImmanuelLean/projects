/**
 * LESSON: STL Algorithms
 * Powerful generic algorithms that work on iterators.
 * #include <algorithm> and <numeric>
 */
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <functional>

void printVec(const std::string& label, const std::vector<int>& v) {
    std::cout << label << ": ";
    for (int n : v) std::cout << n << " ";
    std::cout << "\n";
}

int main() {
    std::vector<int> v = {5, 2, 8, 1, 9, 3, 7, 4, 6, 2};

    // ===== SORTING =====
    std::cout << "--- Sorting ---\n";
    printVec("Original", v);

    std::sort(v.begin(), v.end());
    printVec("Ascending", v);

    std::sort(v.begin(), v.end(), std::greater<int>());
    printVec("Descending", v);

    // Partial sort (only first 3)
    std::vector<int> ps = {5, 2, 8, 1, 9};
    std::partial_sort(ps.begin(), ps.begin() + 3, ps.end());
    printVec("Partial sort (3)", ps);

    // ===== SEARCHING =====
    std::cout << "\n--- Searching ---\n";
    std::sort(v.begin(), v.end());
    std::cout << "Binary search 7: " << std::boolalpha
              << std::binary_search(v.begin(), v.end(), 7) << "\n";

    auto it = std::find(v.begin(), v.end(), 7);
    if (it != v.end())
        std::cout << "Found 7 at index: " << std::distance(v.begin(), it) << "\n";

    auto it2 = std::find_if(v.begin(), v.end(), [](int n) { return n > 5; });
    std::cout << "First > 5: " << *it2 << "\n";

    // ===== COUNTING =====
    std::cout << "\n--- Counting ---\n";
    std::cout << "Count of 2: " << std::count(v.begin(), v.end(), 2) << "\n";
    std::cout << "Count > 5: " << std::count_if(v.begin(), v.end(),
        [](int n) { return n > 5; }) << "\n";

    // ===== MIN / MAX =====
    std::cout << "\n--- Min/Max ---\n";
    std::cout << "Min: " << *std::min_element(v.begin(), v.end()) << "\n";
    std::cout << "Max: " << *std::max_element(v.begin(), v.end()) << "\n";
    auto [mn, mx] = std::minmax_element(v.begin(), v.end());
    std::cout << "Minmax: " << *mn << ", " << *mx << "\n";

    // ===== NUMERIC =====
    std::cout << "\n--- Numeric ---\n";
    std::cout << "Sum: " << std::accumulate(v.begin(), v.end(), 0) << "\n";

    // ===== TRANSFORM =====
    std::cout << "\n--- Transform ---\n";
    std::vector<int> doubled(v.size());
    std::transform(v.begin(), v.end(), doubled.begin(), [](int n) { return n * 2; });
    printVec("Doubled", doubled);

    // ===== REMOVE / ERASE =====
    std::cout << "\n--- Remove/Erase ---\n";
    std::vector<int> rem = {1, 2, 3, 2, 4, 2, 5};
    // remove moves unwanted elements to end, returns new "end"
    auto newEnd = std::remove(rem.begin(), rem.end(), 2);
    rem.erase(newEnd, rem.end()); // actually remove them
    printVec("After remove 2", rem);

    // Remove if
    std::vector<int> rem2 = {1, 2, 3, 4, 5, 6, 7, 8};
    rem2.erase(std::remove_if(rem2.begin(), rem2.end(),
        [](int n) { return n % 2 == 0; }), rem2.end());
    printVec("Remove evens", rem2);

    // ===== UNIQUE =====
    std::cout << "\n--- Unique ---\n";
    std::vector<int> dups = {1, 1, 2, 2, 3, 3, 3, 4};
    dups.erase(std::unique(dups.begin(), dups.end()), dups.end());
    printVec("Unique", dups);

    // ===== REVERSE / ROTATE =====
    std::cout << "\n--- Reverse/Rotate ---\n";
    std::vector<int> rv = {1, 2, 3, 4, 5};
    std::reverse(rv.begin(), rv.end());
    printVec("Reversed", rv);

    std::rotate(rv.begin(), rv.begin() + 2, rv.end());
    printVec("Rotated by 2", rv);

    // ===== ALL_OF / ANY_OF / NONE_OF =====
    std::cout << "\n--- Predicates ---\n";
    std::vector<int> pos = {1, 2, 3, 4, 5};
    std::cout << "All positive? " << std::all_of(pos.begin(), pos.end(),
        [](int n) { return n > 0; }) << "\n";
    std::cout << "Any > 3? " << std::any_of(pos.begin(), pos.end(),
        [](int n) { return n > 3; }) << "\n";
    std::cout << "None negative? " << std::none_of(pos.begin(), pos.end(),
        [](int n) { return n < 0; }) << "\n";

    // ===== FOR_EACH =====
    std::cout << "\n--- for_each ---\n";
    std::cout << "Squares: ";
    std::for_each(pos.begin(), pos.end(), [](int n) {
        std::cout << n * n << " ";
    });
    std::cout << "\n";

    return 0;
}
