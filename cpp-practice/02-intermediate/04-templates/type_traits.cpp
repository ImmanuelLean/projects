/**
 * LESSON: Type Traits (C++11/14/17)
 * Type traits inspect and transform types at compile time.
 * Part of <type_traits> header - essential for template metaprogramming.
 *
 * Compile: g++ -std=c++17 -o type_traits type_traits.cpp
 * Run:     ./type_traits
 */
#include <iostream>
#include <type_traits>
#include <string>
#include <vector>

// ===== USING TYPE TRAITS FOR COMPILE-TIME CHECKS =====
template<typename T>
void printTypeInfo(const std::string& name) {
    std::cout << "  " << name << ":\n";
    std::cout << "    is_integral:       " << std::is_integral<T>::value << "\n";
    std::cout << "    is_floating_point: " << std::is_floating_point<T>::value << "\n";
    std::cout << "    is_arithmetic:     " << std::is_arithmetic<T>::value << "\n";
    std::cout << "    is_pointer:        " << std::is_pointer<T>::value << "\n";
    std::cout << "    is_class:          " << std::is_class<T>::value << "\n";
    std::cout << "    is_const:          " << std::is_const<T>::value << "\n";
}

// ===== std::is_same =====
template<typename T, typename U>
void checkSame() {
    if constexpr (std::is_same_v<T, U>) {
        std::cout << "  Types are the SAME\n";
    } else {
        std::cout << "  Types are DIFFERENT\n";
    }
}

// ===== std::enable_if (conditional function availability) =====
// Only enable for integral types
template<typename T>
typename std::enable_if<std::is_integral<T>::value, T>::type
safeMultiply(T a, T b) {
    std::cout << "  [integral multiply] ";
    return a * b;
}

// Only enable for floating-point types
template<typename T>
typename std::enable_if<std::is_floating_point<T>::value, T>::type
safeMultiply(T a, T b) {
    std::cout << "  [float multiply] ";
    return a * b;
}

// ===== if constexpr (C++17 - cleaner than enable_if) =====
template<typename T>
auto smartProcess(T value) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "  Integer: " << value << " (hex: 0x" << std::hex << value << std::dec << ")\n";
        return value * 2;
    } else if constexpr (std::is_floating_point_v<T>) {
        std::cout << "  Float: " << value << " (rounded: " << static_cast<int>(value) << ")\n";
        return value * 2.0;
    } else if constexpr (std::is_same_v<T, std::string>) {
        std::cout << "  String: \"" << value << "\" (length: " << value.size() << ")\n";
        return value + value;
    } else {
        std::cout << "  Unknown type\n";
        return value;
    }
}

// ===== std::conditional (compile-time if for types) =====
template<bool UseDouble>
void demonstrateConditional() {
    using NumberType = std::conditional_t<UseDouble, double, int>;
    NumberType val = 42;
    std::cout << "  Type: " << (UseDouble ? "double" : "int")
              << ", value: " << val << "\n";
}

// ===== CUSTOM TYPE TRAIT =====
template<typename T>
struct is_string : std::false_type {};

template<>
struct is_string<std::string> : std::true_type {};

template<>
struct is_string<const char*> : std::true_type {};

// Shorthand (C++14 style)
template<typename T>
constexpr bool is_string_v = is_string<T>::value;

// ===== std::decay =====
template<typename T>
void showDecay() {
    using Decayed = std::decay_t<T>;
    std::cout << "  same after decay: "
              << std::is_same_v<T, Decayed> << "\n";
}

int main() {
    // --- Type inspection ---
    std::cout << "--- Type Traits Inspection ---\n";
    printTypeInfo<int>("int");
    printTypeInfo<double>("double");
    printTypeInfo<std::string>("string");
    printTypeInfo<int*>("int*");
    printTypeInfo<const int>("const int");

    // --- is_same ---
    std::cout << "\n--- std::is_same ---\n";
    std::cout << "int vs int: "; checkSame<int, int>();
    std::cout << "int vs double: "; checkSame<int, double>();
    std::cout << "int vs int32_t: "; checkSame<int, int32_t>();

    // --- enable_if ---
    std::cout << "\n--- std::enable_if ---\n";
    std::cout << safeMultiply(3, 4) << "\n";
    std::cout << safeMultiply(3.14, 2.0) << "\n";
    // safeMultiply("a", "b");  // ERROR: no matching function

    // --- if constexpr (C++17) ---
    std::cout << "\n--- if constexpr ---\n";
    smartProcess(42);
    smartProcess(3.14);
    smartProcess(std::string("Hello"));

    // --- conditional ---
    std::cout << "\n--- std::conditional ---\n";
    demonstrateConditional<true>();
    demonstrateConditional<false>();

    // --- Custom type trait ---
    std::cout << "\n--- Custom Type Trait ---\n";
    std::cout << "  is_string<string>:      " << is_string_v<std::string> << "\n";
    std::cout << "  is_string<const char*>: " << is_string_v<const char*> << "\n";
    std::cout << "  is_string<int>:         " << is_string_v<int> << "\n";

    // --- Type transformations ---
    std::cout << "\n--- Type Transformations ---\n";
    std::cout << "  remove_const<const int>: is int? "
              << std::is_same_v<std::remove_const_t<const int>, int> << "\n";
    std::cout << "  remove_reference<int&>: is int? "
              << std::is_same_v<std::remove_reference_t<int&>, int> << "\n";
    std::cout << "  add_pointer<int>: is int*? "
              << std::is_same_v<std::add_pointer_t<int>, int*> << "\n";

    return 0;
}
