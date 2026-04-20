/**
 * LESSON: std::optional, std::variant, std::any (C++17)
 * Type-safe alternatives to null pointers, unions, and void*.
 *
 * Compile: g++ -std=c++17 -o opt_var_any optional_variant_any.cpp
 * Run:     ./opt_var_any
 */
#include <iostream>
#include <optional>
#include <variant>
#include <any>
#include <string>
#include <vector>
#include <map>

// ===== STD::OPTIONAL =====
// Represents a value that may or may not be present
std::optional<int> findIndex(const std::vector<std::string>& vec,
                              const std::string& target) {
    for (size_t i = 0; i < vec.size(); i++) {
        if (vec[i] == target) return static_cast<int>(i);
    }
    return std::nullopt;  // no value
}

std::optional<double> safeSqrt(double x) {
    if (x < 0) return std::nullopt;
    return std::sqrt(x);
}

// ===== STD::VARIANT =====
// Type-safe union: holds exactly one of the listed types
using JsonValue = std::variant<
    std::nullptr_t,
    bool,
    int,
    double,
    std::string
>;

std::string jsonTypeToString(const JsonValue& val) {
    return std::visit([](const auto& v) -> std::string {
        using T = std::decay_t<decltype(v)>;
        if constexpr (std::is_same_v<T, std::nullptr_t>) return "null";
        else if constexpr (std::is_same_v<T, bool>) return "boolean";
        else if constexpr (std::is_same_v<T, int>) return "integer";
        else if constexpr (std::is_same_v<T, double>) return "number";
        else if constexpr (std::is_same_v<T, std::string>) return "string";
        else return "unknown";
    }, val);
}

void printJsonValue(const JsonValue& val) {
    std::visit([](const auto& v) {
        using T = std::decay_t<decltype(v)>;
        if constexpr (std::is_same_v<T, std::nullptr_t>)
            std::cout << "null";
        else if constexpr (std::is_same_v<T, bool>)
            std::cout << std::boolalpha << v;
        else
            std::cout << v;
    }, val);
}

// ===== STD::VARIANT for error handling =====
using Result = std::variant<int, std::string>;  // value or error message

Result divide(int a, int b) {
    if (b == 0) return std::string("Division by zero!");
    return a / b;
}

int main() {
    // ===== std::optional =====
    std::cout << "--- std::optional ---\n";

    // Basic usage
    std::optional<int> opt1 = 42;
    std::optional<int> opt2 = std::nullopt;

    std::cout << "opt1 has value: " << std::boolalpha << opt1.has_value() << "\n";
    std::cout << "opt2 has value: " << opt2.has_value() << "\n";
    std::cout << "opt1 value: " << opt1.value() << "\n";
    std::cout << "opt2 value_or(0): " << opt2.value_or(0) << "\n";

    // With functions
    std::vector<std::string> fruits = {"apple", "banana", "cherry"};
    auto idx = findIndex(fruits, "banana");
    if (idx) {
        std::cout << "Found banana at index: " << *idx << "\n";  // dereference
    }

    auto notFound = findIndex(fruits, "grape");
    std::cout << "Grape index: " << notFound.value_or(-1) << "\n";

    // Chaining
    auto result = safeSqrt(25.0);
    std::cout << "sqrt(25) = " << result.value_or(0) << "\n";
    std::cout << "sqrt(-1) = " << safeSqrt(-1).value_or(-1) << " (no value)\n";

    // ===== std::variant =====
    std::cout << "\n--- std::variant ---\n";

    JsonValue val1 = 42;
    JsonValue val2 = 3.14;
    JsonValue val3 = std::string("hello");
    JsonValue val4 = true;
    JsonValue val5 = nullptr;

    std::vector<JsonValue> values = {val1, val2, val3, val4, val5};
    for (const auto& v : values) {
        std::cout << "  Type: " << jsonTypeToString(v) << ", Value: ";
        printJsonValue(v);
        std::cout << "\n";
    }

    // Check which type is held
    std::cout << "\nval1 holds int: " << std::holds_alternative<int>(val1) << "\n";
    std::cout << "val3 holds string: " << std::holds_alternative<std::string>(val3) << "\n";

    // Get value (throws bad_variant_access if wrong type)
    int intVal = std::get<int>(val1);
    std::cout << "get<int>(val1): " << intVal << "\n";

    // Safe get with get_if (returns pointer or nullptr)
    if (auto* sval = std::get_if<std::string>(&val3)) {
        std::cout << "val3 string: " << *sval << "\n";
    }

    // Variant for error handling
    std::cout << "\n--- Variant as Result ---\n";
    auto res1 = divide(10, 3);
    auto res2 = divide(10, 0);

    for (const auto& r : {res1, res2}) {
        if (auto* val = std::get_if<int>(&r)) {
            std::cout << "  Success: " << *val << "\n";
        } else if (auto* err = std::get_if<std::string>(&r)) {
            std::cout << "  Error: " << *err << "\n";
        }
    }

    // ===== std::any =====
    std::cout << "\n--- std::any ---\n";

    std::any a = 42;
    std::cout << "Type: " << a.type().name() << ", Value: " << std::any_cast<int>(a) << "\n";

    a = std::string("Hello");
    std::cout << "Type: " << a.type().name() << ", Value: " << std::any_cast<std::string>(a) << "\n";

    a = 3.14;
    std::cout << "Type: " << a.type().name() << ", Value: " << std::any_cast<double>(a) << "\n";

    // Safe cast
    try {
        std::any_cast<int>(a);  // wrong type!
    } catch (const std::bad_any_cast& e) {
        std::cout << "Bad cast: " << e.what() << "\n";
    }

    std::cout << "Has value: " << a.has_value() << "\n";
    a.reset();
    std::cout << "After reset: " << a.has_value() << "\n";

    // Heterogeneous container
    std::cout << "\n--- Heterogeneous Container ---\n";
    std::vector<std::any> bag = {42, 3.14, std::string("hello"), true};
    for (const auto& item : bag) {
        std::cout << "  type: " << item.type().name() << "\n";
    }

    // --- When to use which ---
    std::cout << "\n--- When to Use Which ---\n";
    std::cout << "optional: Value that may not exist (replaces nullptr)\n";
    std::cout << "variant:  Value of one-of-N types (type-safe union)\n";
    std::cout << "any:      Any type at all (type-safe void*)\n";
    std::cout << "Prefer optional > variant > any (most to least type-safe)\n";

    return 0;
}
