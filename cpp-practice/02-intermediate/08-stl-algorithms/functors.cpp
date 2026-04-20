/**
 * LESSON: Functors (Function Objects)
 * A functor is a class/struct that overloads operator().
 * Unlike functions, functors can hold state between calls.
 *
 * Compile: g++ -std=c++17 -o functors functors.cpp
 * Run:     ./functors
 */
#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>  // std::plus, std::greater, etc.
#include <numeric>

// ===== BASIC FUNCTOR =====
struct Multiplier {
    int factor;
    Multiplier(int f) : factor(f) {}

    int operator()(int x) const {
        return x * factor;
    }
};

// ===== STATEFUL FUNCTOR (tracks state between calls) =====
struct Counter {
    int count = 0;

    void operator()(int x) {
        count++;
        std::cout << "  Call #" << count << ": processing " << x << "\n";
    }
};

// ===== FUNCTOR AS COMPARATOR =====
struct CaseInsensitiveCompare {
    bool operator()(const std::string& a, const std::string& b) const {
        std::string la = a, lb = b;
        std::transform(la.begin(), la.end(), la.begin(), ::tolower);
        std::transform(lb.begin(), lb.end(), lb.begin(), ::tolower);
        return la < lb;
    }
};

// ===== FUNCTOR AS PREDICATE =====
struct InRange {
    int low, high;
    InRange(int lo, int hi) : low(lo), high(hi) {}

    bool operator()(int x) const {
        return x >= low && x <= high;
    }
};

// ===== ACCUMULATOR FUNCTOR =====
struct RunningAverage {
    double sum = 0;
    int count = 0;

    void operator()(double value) {
        sum += value;
        count++;
    }

    double average() const { return count > 0 ? sum / count : 0; }
};

int main() {
    // --- Basic functor ---
    std::cout << "--- Basic Functor ---\n";
    Multiplier times3(3);
    Multiplier times5(5);

    std::cout << "times3(10) = " << times3(10) << "\n";
    std::cout << "times5(10) = " << times5(10) << "\n";

    // Use with transform
    std::vector<int> nums = {1, 2, 3, 4, 5};
    std::vector<int> result(nums.size());
    std::transform(nums.begin(), nums.end(), result.begin(), times3);
    std::cout << "Tripled: ";
    for (int n : result) std::cout << n << " ";
    std::cout << "\n";

    // --- Stateful functor ---
    std::cout << "\n--- Stateful Functor ---\n";
    Counter cnt;
    std::vector<int> data = {10, 20, 30};
    cnt = std::for_each(data.begin(), data.end(), cnt);
    std::cout << "  Total calls: " << cnt.count << "\n";

    // --- Functor as comparator ---
    std::cout << "\n--- Functor as Comparator ---\n";
    std::vector<std::string> words = {"Banana", "apple", "Cherry", "date"};
    std::sort(words.begin(), words.end(), CaseInsensitiveCompare());
    std::cout << "Case-insensitive sort: ";
    for (const auto& w : words) std::cout << w << " ";
    std::cout << "\n";

    // --- Functor as predicate ---
    std::cout << "\n--- Functor as Predicate ---\n";
    std::vector<int> values = {5, 12, 3, 18, 7, 25, 9, 14};
    InRange between10and20(10, 20);

    int count = std::count_if(values.begin(), values.end(), between10and20);
    std::cout << "Numbers in [10, 20]: " << count << "\n";

    // Partition
    std::partition(values.begin(), values.end(), between10and20);
    std::cout << "Partitioned: ";
    for (int n : values) std::cout << n << " ";
    std::cout << "\n";

    // --- Running average ---
    std::cout << "\n--- Accumulator Functor ---\n";
    std::vector<double> scores = {85.5, 92.0, 78.3, 96.1, 88.7};
    RunningAverage avg;
    avg = std::for_each(scores.begin(), scores.end(), avg);
    std::cout << "Average score: " << avg.average() << "\n";

    // --- Predefined functors (std::) ---
    std::cout << "\n--- Predefined Functors ---\n";

    // std::plus, std::minus, std::multiplies
    std::cout << "plus: " << std::plus<int>()(3, 4) << "\n";
    std::cout << "minus: " << std::minus<int>()(10, 3) << "\n";
    std::cout << "multiplies: " << std::multiplies<int>()(3, 4) << "\n";

    // std::greater for descending sort
    std::vector<int> v = {5, 2, 8, 1, 9};
    std::sort(v.begin(), v.end(), std::greater<int>());
    std::cout << "Sorted desc: ";
    for (int n : v) std::cout << n << " ";
    std::cout << "\n";

    // std::negate
    std::vector<int> negated(v.size());
    std::transform(v.begin(), v.end(), negated.begin(), std::negate<int>());
    std::cout << "Negated: ";
    for (int n : negated) std::cout << n << " ";
    std::cout << "\n";

    // Accumulate with multiplies = product
    std::vector<int> factors = {1, 2, 3, 4, 5};
    int product = std::accumulate(factors.begin(), factors.end(), 1,
                                   std::multiplies<int>());
    std::cout << "Product(1..5): " << product << " (= 5!)\n";

    // --- Functor vs Lambda vs Function Pointer ---
    std::cout << "\n--- Comparison ---\n";
    std::cout << "Function pointer: Stateless, simple, C-compatible\n";
    std::cout << "Functor:          Stateful, type-safe, inline-able\n";
    std::cout << "Lambda:           Concise, capture variables, modern\n";
    std::cout << "std::function:    Type-erased, flexible, slight overhead\n";

    return 0;
}
