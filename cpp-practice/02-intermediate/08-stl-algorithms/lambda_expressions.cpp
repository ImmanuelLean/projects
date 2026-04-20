/**
 * LESSON: Lambda Expressions (C++11)
 * Lambdas are anonymous functions defined inline.
 * Syntax: [capture](params) -> return_type { body }
 *
 * Compile: g++ -std=c++17 -o lambda lambda_expressions.cpp
 * Run:     ./lambda
 */
#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>  // std::function
#include <string>
#include <numeric>     // std::accumulate

int main() {
    // ===== BASIC LAMBDA =====
    std::cout << "--- Basic Lambda ---\n";
    auto greet = []() {
        std::cout << "  Hello from lambda!\n";
    };
    greet();

    // Lambda with parameters
    auto add = [](int a, int b) { return a + b; };
    std::cout << "  add(3, 5) = " << add(3, 5) << "\n";

    // Explicit return type
    auto divide = [](double a, double b) -> double {
        if (b == 0) return 0.0;
        return a / b;
    };
    std::cout << "  divide(10, 3) = " << divide(10, 3) << "\n";

    // ===== CAPTURE MODES =====
    std::cout << "\n--- Capture Modes ---\n";
    int x = 10, y = 20;
    std::string name = "Emmanuel";

    // Capture by value [=] (copies)
    auto byValue = [=]() {
        std::cout << "  [=] x=" << x << ", y=" << y << "\n";
        // x = 99;  // ERROR: captured by value is const by default
    };
    byValue();

    // Capture by reference [&] (modifies original)
    auto byRef = [&]() {
        x = 99;
        std::cout << "  [&] modified x to " << x << "\n";
    };
    byRef();
    std::cout << "  x is now: " << x << "\n";
    x = 10;  // reset

    // Mixed capture
    auto mixed = [x, &y]() {
        // x is by value (copy), y is by reference
        y = x * 2;
    };
    mixed();
    std::cout << "  [x, &y] y is now: " << y << "\n";

    // Capture specific variables
    auto specific = [&name]() {
        std::cout << "  [&name] Hello, " << name << "\n";
    };
    specific();

    // ===== MUTABLE LAMBDA =====
    std::cout << "\n--- Mutable Lambda ---\n";
    int count = 0;
    auto counter = [count]() mutable {
        count++;  // modifies the lambda's COPY (not the original)
        return count;
    };
    std::cout << "  Call 1: " << counter() << "\n";
    std::cout << "  Call 2: " << counter() << "\n";
    std::cout << "  Original count: " << count << " (unchanged)\n";

    // ===== GENERIC LAMBDA (C++14) =====
    std::cout << "\n--- Generic Lambda (auto params) ---\n";
    auto print = [](const auto& val) {
        std::cout << "  " << val << "\n";
    };
    print(42);
    print(3.14);
    print(std::string("Hello"));

    auto multiply = [](auto a, auto b) { return a * b; };
    std::cout << "  int * int: " << multiply(3, 4) << "\n";
    std::cout << "  double * int: " << multiply(2.5, 4) << "\n";

    // ===== LAMBDAS WITH STL ALGORITHMS =====
    std::cout << "\n--- Lambdas with STL ---\n";
    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6};

    // std::sort with custom comparator
    std::sort(nums.begin(), nums.end(), [](int a, int b) { return a > b; });
    std::cout << "Sorted desc: ";
    for (int n : nums) std::cout << n << " ";
    std::cout << "\n";

    // std::find_if
    auto it = std::find_if(nums.begin(), nums.end(), [](int n) { return n < 5; });
    std::cout << "First < 5: " << *it << "\n";

    // std::count_if
    int evenCount = std::count_if(nums.begin(), nums.end(),
                                   [](int n) { return n % 2 == 0; });
    std::cout << "Even count: " << evenCount << "\n";

    // std::for_each
    std::cout << "Squared: ";
    std::for_each(nums.begin(), nums.end(), [](int n) {
        std::cout << n * n << " ";
    });
    std::cout << "\n";

    // std::transform
    std::vector<int> doubled(nums.size());
    std::transform(nums.begin(), nums.end(), doubled.begin(),
                   [](int n) { return n * 2; });
    std::cout << "Doubled: ";
    for (int n : doubled) std::cout << n << " ";
    std::cout << "\n";

    // std::accumulate with lambda
    int sum = std::accumulate(nums.begin(), nums.end(), 0,
                              [](int acc, int n) { return acc + n; });
    std::cout << "Sum: " << sum << "\n";

    // std::remove_if + erase
    nums.erase(std::remove_if(nums.begin(), nums.end(),
               [](int n) { return n > 7; }), nums.end());
    std::cout << "After remove > 7: ";
    for (int n : nums) std::cout << n << " ";
    std::cout << "\n";

    // ===== STD::FUNCTION (store lambdas) =====
    std::cout << "\n--- std::function ---\n";
    std::function<int(int, int)> op;

    op = [](int a, int b) { return a + b; };
    std::cout << "add: " << op(3, 4) << "\n";

    op = [](int a, int b) { return a * b; };
    std::cout << "multiply: " << op(3, 4) << "\n";

    // Vector of functions
    std::vector<std::function<int(int)>> transforms = {
        [](int n) { return n * 2; },
        [](int n) { return n + 10; },
        [](int n) { return n * n; }
    };
    int val = 5;
    for (const auto& fn : transforms) {
        std::cout << "  transform(" << val << ") = " << fn(val) << "\n";
    }

    return 0;
}
