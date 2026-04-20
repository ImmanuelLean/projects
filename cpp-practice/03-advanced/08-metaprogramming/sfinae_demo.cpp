/**
 * LESSON: SFINAE (Substitution Failure Is Not An Error)
 * Conditionally enable/disable template overloads based on type traits.
 * Covers std::enable_if, if constexpr, and C++20 concepts.
 *
 * Compile: g++ -std=c++20 -o sfinae sfinae_demo.cpp
 * Run:     ./sfinae
 */
#include <iostream>
#include <string>
#include <vector>
#include <type_traits>
#include <concepts>

// ===== BASIC SFINAE WITH std::enable_if =====

// Only enabled for integral types
template<typename T,
         typename = std::enable_if_t<std::is_integral_v<T>>>
T doubleValue(T val) {
    std::cout << "  [integral overload] ";
    return val * 2;
}

// Only enabled for floating-point types
template<typename T,
         std::enable_if_t<std::is_floating_point_v<T>, int> = 0>
T doubleValue(T val) {
    std::cout << "  [floating overload] ";
    return val * 2.0;
}

// ===== DETECT MEMBER FUNCTIONS =====

template<typename T, typename = void>
struct has_size : std::false_type {};

template<typename T>
struct has_size<T, std::void_t<decltype(std::declval<T>().size())>>
    : std::true_type {};

template<typename T>
constexpr bool has_size_v = has_size<T>::value;

template<typename T, typename = void>
struct is_iterable : std::false_type {};

template<typename T>
struct is_iterable<T, std::void_t<decltype(std::declval<T>().begin()),
                                   decltype(std::declval<T>().end())>>
    : std::true_type {};

// ===== SMART PRINT USING if constexpr =====
template<typename T>
void smartPrint(const T& val) {
    if constexpr (std::is_arithmetic_v<T>) {
        std::cout << "Number: " << val << "\n";
    } else if constexpr (std::is_same_v<T, std::string>) {
        std::cout << "String(len=" << val.size() << "): \"" << val << "\"\n";
    } else if constexpr (is_iterable<T>::value) {
        std::cout << "Container[" << val.size() << "]: { ";
        for (const auto& elem : val) std::cout << elem << " ";
        std::cout << "}\n";
    } else {
        std::cout << "Unknown type\n";
    }
}

// ===== ENABLE_IF ON RETURN TYPE =====
template<typename T>
auto stringify(T val)
    -> std::enable_if_t<std::is_arithmetic_v<T>, std::string> {
    return std::to_string(val);
}

template<typename T>
auto stringify(T val)
    -> std::enable_if_t<std::is_same_v<T, std::string>, std::string> {
    return "\"" + val + "\"";
}

// ===== C++20 CONCEPTS =====

template<typename T>
concept Numeric = std::is_arithmetic_v<T>;

template<typename T>
concept Printable = requires(T t) {
    { std::cout << t } -> std::same_as<std::ostream&>;
};

template<typename T>
concept Container = requires(T t) {
    t.begin();
    t.end();
    t.size();
    typename T::value_type;
};

template<Numeric T>
T square(T val) {
    return val * val;
}

template<Container C>
void printContainer(const C& c) {
    std::cout << "[ ";
    for (const auto& elem : c) std::cout << elem << " ";
    std::cout << "] (size=" << c.size() << ")\n";
}

template<typename T>
    requires Numeric<T> && (sizeof(T) >= 4)
T safeDivide(T a, T b) {
    if (b == 0) return 0;
    return a / b;
}

// ===== CONSTRAINED AUTO =====
void constrainedAuto() {
    Numeric auto x = 42;
    Numeric auto y = 3.14;
    std::cout << "x = " << x << ", y = " << y << "\n";
}

// ===== TAG DISPATCH =====
namespace detail {
    template<typename T>
    void process(T val, std::true_type) {
        std::cout << "  Processing integer: " << val << " (bits: " << sizeof(T)*8 << ")\n";
    }

    template<typename T>
    void process(T val, std::false_type) {
        std::cout << "  Processing non-integer: " << val << "\n";
    }
}

template<typename T>
void process(T val) {
    detail::process(val, std::is_integral<T>{});
}

int main() {
    // ===== BASIC SFINAE =====
    std::cout << "--- enable_if Overloads ---\n";
    std::cout << "doubleValue(5) = " << doubleValue(5) << "\n";
    std::cout << "doubleValue(3.14) = " << doubleValue(3.14) << "\n";

    // ===== TYPE DETECTION =====
    std::cout << "\n--- Type Trait Detection ---\n";
    std::cout << "vector has .size(): " << std::boolalpha << has_size_v<std::vector<int>> << "\n";
    std::cout << "int has .size():    " << has_size_v<int> << "\n";
    std::cout << "string is iterable: " << is_iterable<std::string>::value << "\n";
    std::cout << "double is iterable: " << is_iterable<double>::value << "\n";

    // ===== SMART PRINT =====
    std::cout << "\n--- smartPrint (if constexpr) ---\n";
    smartPrint(42);
    smartPrint(3.14);
    smartPrint(std::string("hello world"));
    smartPrint(std::vector<int>{1, 2, 3, 4, 5});

    // ===== STRINGIFY =====
    std::cout << "\n--- Stringify ---\n";
    std::cout << "stringify(42) = " << stringify(42) << "\n";
    std::cout << "stringify(3.14) = " << stringify(3.14) << "\n";
    std::cout << "stringify(str) = " << stringify(std::string("hello")) << "\n";

    // ===== CONCEPTS =====
    std::cout << "\n--- C++20 Concepts ---\n";
    std::cout << "square(5) = " << square(5) << "\n";
    std::cout << "square(2.5) = " << square(2.5) << "\n";

    std::vector<int> nums = {10, 20, 30, 40};
    std::cout << "printContainer: ";
    printContainer(nums);

    std::cout << "safeDivide(10, 3) = " << safeDivide(10, 3) << "\n";
    std::cout << "safeDivide(10, 0) = " << safeDivide(10, 0) << "\n";

    // ===== CONSTRAINED AUTO =====
    std::cout << "\n--- Constrained auto ---\n";
    constrainedAuto();

    // ===== TAG DISPATCH =====
    std::cout << "\n--- Tag Dispatch ---\n";
    process(42);
    process(3.14);
    process('A');

    return 0;
}
