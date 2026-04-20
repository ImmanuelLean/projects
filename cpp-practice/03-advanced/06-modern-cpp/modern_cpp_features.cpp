/**
 * LESSON: Modern C++ Features (C++11/14/17/20)
 * Compile with: g++ -std=c++20 modern_cpp_features.cpp
 */
#include <iostream>
#include <vector>
#include <string>
#include <optional>     // C++17
#include <variant>      // C++17
#include <any>          // C++17
#include <tuple>
#include <algorithm>
#include <functional>
#include <numeric>

// ===== STRUCTURED BINDINGS (C++17) =====
std::tuple<std::string, int, double> getStudent() {
    return {"Emmanuel", 20, 3.8};
}

// ===== OPTIONAL (C++17) =====
std::optional<int> findIndex(const std::vector<int>& v, int target) {
    for (int i = 0; i < (int)v.size(); i++) {
        if (v[i] == target) return i;
    }
    return std::nullopt; // no value
}

// ===== IF CONSTEXPR (C++17) =====
template <typename T>
std::string typeInfo(const T& val) {
    if constexpr (std::is_integral_v<T>) {
        return "integer: " + std::to_string(val);
    } else if constexpr (std::is_floating_point_v<T>) {
        return "float: " + std::to_string(val);
    } else {
        return "other type";
    }
}

// ===== CONCEPTS (C++20) - if supported =====
// template <typename T>
// concept Numeric = std::is_arithmetic_v<T>;
// template <Numeric T> T add(T a, T b) { return a + b; }

int main() {
    // ===== AUTO =====
    std::cout << "--- auto (C++11) ---\n";
    auto x = 42;
    auto pi = 3.14;
    auto name = std::string("Hello");
    auto vec = std::vector<int>{1, 2, 3};
    std::cout << "auto deduces types automatically\n";

    // ===== RANGE-BASED FOR =====
    std::cout << "\n--- Range-based for (C++11) ---\n";
    for (const auto& n : vec) std::cout << n << " ";
    std::cout << "\n";

    // ===== LAMBDA CAPTURES =====
    std::cout << "\n--- Lambda Captures (C++11) ---\n";
    int multiplier = 3;
    auto multiply = [multiplier](int x) { return x * multiplier; };  // capture by value
    auto addTo = [&multiplier](int x) { multiplier += x; };          // capture by reference
    auto captureAll = [=]() { return multiplier; };                    // capture all by value
    // [&] captures all by reference
    // [this] captures this pointer

    std::cout << "multiply(5): " << multiply(5) << "\n";
    std::cout << "Generic lambda: ";
    auto print = [](const auto& val) { std::cout << val << " "; };  // C++14 generic lambda
    print(42);
    print(3.14);
    print("hello");
    std::cout << "\n";

    // ===== STRUCTURED BINDINGS (C++17) =====
    std::cout << "\n--- Structured Bindings (C++17) ---\n";
    auto [sName, sAge, sGpa] = getStudent();
    std::cout << sName << ", age " << sAge << ", GPA " << sGpa << "\n";

    // With maps
    std::vector<std::pair<std::string, int>> scores = {{"Alice", 90}, {"Bob", 85}};
    for (const auto& [person, score] : scores) {
        std::cout << person << ": " << score << "\n";
    }

    // ===== OPTIONAL (C++17) =====
    std::cout << "\n--- std::optional (C++17) ---\n";
    std::vector<int> data = {10, 20, 30, 40};
    auto idx = findIndex(data, 30);
    if (idx.has_value()) {
        std::cout << "Found at index: " << idx.value() << "\n";
    }

    auto missing = findIndex(data, 99);
    std::cout << "Found 99? " << missing.value_or(-1) << "\n"; // -1

    // ===== VARIANT (C++17) - type-safe union =====
    std::cout << "\n--- std::variant (C++17) ---\n";
    std::variant<int, double, std::string> var;
    var = 42;
    std::cout << "int: " << std::get<int>(var) << "\n";
    var = 3.14;
    std::cout << "double: " << std::get<double>(var) << "\n";
    var = std::string("hello");
    std::cout << "string: " << std::get<std::string>(var) << "\n";

    // Visit pattern
    var = 42;
    std::visit([](const auto& val) {
        std::cout << "Visited: " << val << "\n";
    }, var);

    // ===== ANY (C++17) =====
    std::cout << "\n--- std::any (C++17) ---\n";
    std::any a = 42;
    std::cout << "any int: " << std::any_cast<int>(a) << "\n";
    a = std::string("hello");
    std::cout << "any string: " << std::any_cast<std::string>(a) << "\n";

    // ===== IF CONSTEXPR (C++17) =====
    std::cout << "\n--- if constexpr (C++17) ---\n";
    std::cout << typeInfo(42) << "\n";
    std::cout << typeInfo(3.14) << "\n";

    // ===== FOLD EXPRESSIONS (C++17) =====
    std::cout << "\n--- Fold Expressions (C++17) ---\n";
    auto sum = [](auto... args) { return (args + ...); };
    std::cout << "sum(1,2,3,4,5) = " << sum(1, 2, 3, 4, 5) << "\n";

    auto printAll = [](const auto&... args) {
        ((std::cout << args << " "), ...);
        std::cout << "\n";
    };
    printAll(1, 2.5, "hello", 'A');

    // ===== STRING_VIEW (C++17) - non-owning string reference =====
    std::cout << "\n--- std::string_view (C++17) ---\n";
    std::string_view sv = "Hello, string_view!";
    std::cout << sv << " (length: " << sv.length() << ")\n";
    std::cout << "substr: " << sv.substr(0, 5) << "\n";

    return 0;
}
