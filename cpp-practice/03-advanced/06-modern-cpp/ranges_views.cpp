/**
 * LESSON: Ranges and Views (C++20)
 * Composable, lazy transformations on sequences using ranges, views, and pipe operators.
 *
 * Compile: g++ -std=c++20 -o ranges_views ranges_views.cpp
 * Run:     ./ranges_views
 */
#include <iostream>
#include <vector>
#include <string>
#include <ranges>
#include <algorithm>
#include <numeric>

// ===== HELPER =====
void printRange(auto&& rng, const std::string& label) {
    std::cout << label << ": ";
    for (const auto& val : rng) std::cout << val << " ";
    std::cout << "\n";
}

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    // ===== BASIC VIEWS =====
    std::cout << "--- Basic Views ---\n";

    // filter: keep only even numbers
    auto evens = nums | std::views::filter([](int n) { return n % 2 == 0; });
    printRange(evens, "Evens");

    // transform: square each element
    auto squares = nums | std::views::transform([](int n) { return n * n; });
    printRange(squares, "Squares");

    // take: first N elements
    auto firstFive = nums | std::views::take(5);
    printRange(firstFive, "First 5");

    // drop: skip first N elements
    auto lastFive = nums | std::views::drop(5);
    printRange(lastFive, "Last 5");

    // reverse
    auto reversed = nums | std::views::reverse;
    printRange(reversed, "Reversed");

    // ===== CHAINING (PIPE OPERATOR) =====
    std::cout << "\n--- Chained Pipelines ---\n";

    // Even numbers, squared, first 3
    auto pipeline = nums
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return n * n; })
        | std::views::take(3);
    printRange(pipeline, "Even->Squared->Take3");

    // Numbers > 5, doubled, reversed
    auto pipeline2 = nums
        | std::views::filter([](int n) { return n > 5; })
        | std::views::transform([](int n) { return n * 2; })
        | std::views::reverse;
    printRange(pipeline2, "GT5->Double->Reverse");

    // ===== IOTA VIEW (range generator) =====
    std::cout << "\n--- iota View ---\n";

    auto oneToTwenty = std::views::iota(1, 21);
    printRange(oneToTwenty, "1 to 20");

    // FizzBuzz with ranges
    std::cout << "FizzBuzz(1-15): ";
    for (int n : std::views::iota(1, 16)) {
        if (n % 15 == 0) std::cout << "FizzBuzz ";
        else if (n % 3 == 0) std::cout << "Fizz ";
        else if (n % 5 == 0) std::cout << "Buzz ";
        else std::cout << n << " ";
    }
    std::cout << "\n";

    // ===== VIEWS ARE LAZY =====
    std::cout << "\n--- Laziness Demo ---\n";
    int evalCount = 0;
    auto lazy = nums
        | std::views::filter([&](int n) { ++evalCount; return n % 2 == 0; })
        | std::views::transform([&](int n) { ++evalCount; return n * 10; })
        | std::views::take(2);

    std::cout << "Before iterating: evalCount = " << evalCount << "\n";
    for (auto v : lazy) {
        std::cout << "  Got: " << v << "\n";
    }
    std::cout << "After iterating:  evalCount = " << evalCount << "\n";

    // ===== KEYS / VALUES VIEWS =====
    std::cout << "\n--- keys/values Views ---\n";
    std::vector<std::pair<std::string, int>> scores = {
        {"Alice", 95}, {"Bob", 87}, {"Charlie", 92}, {"Diana", 78}
    };

    auto names = scores | std::views::keys;
    auto vals  = scores | std::views::values;
    printRange(names, "Names");
    printRange(vals, "Scores");

    auto highScorers = scores
        | std::views::filter([](const auto& p) { return p.second >= 90; })
        | std::views::keys;
    printRange(highScorers, "High scorers");

    // ===== MATERIALIZE VIEW INTO CONTAINER =====
    std::cout << "\n--- Materialize View ---\n";
    auto evenSquares = nums
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return n * n; });

    std::vector<int> result(std::ranges::begin(evenSquares),
                            std::ranges::end(evenSquares));
    printRange(result, "Materialized");

    // ===== RANGES ALGORITHMS =====
    std::cout << "\n--- Ranges Algorithms ---\n";
    std::vector<int> data = {5, 3, 8, 1, 9, 2, 7};

    std::ranges::sort(data);
    printRange(data, "Sorted");

    auto it = std::ranges::find(data, 7);
    std::cout << "Found 7 at index " << std::distance(data.begin(), it) << "\n";

    bool allPositive = std::ranges::all_of(data, [](int n) { return n > 0; });
    std::cout << "All positive: " << std::boolalpha << allPositive << "\n";

    auto [minIt, maxIt] = std::ranges::minmax_element(data);
    std::cout << "Min: " << *minIt << ", Max: " << *maxIt << "\n";

    return 0;
}
