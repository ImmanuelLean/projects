/**
 * LESSON: Compile-Time Programming & Type Traits
 * constexpr, type_traits, SFINAE, and concepts (C++20).
 * Compile with: g++ -std=c++20 constexpr_concepts.cpp
 */
#include <iostream>
#include <type_traits>
#include <array>
#include <string>
#include <vector>

// ===== CONSTEXPR (compile-time computation) =====
constexpr int factorial(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}

constexpr int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}

constexpr bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

// ===== TYPE TRAITS =====
template <typename T>
void analyzeType(const T& val) {
    std::cout << "  Value: " << val << "\n";
    std::cout << "  is_integral:       " << std::is_integral_v<T> << "\n";
    std::cout << "  is_floating_point: " << std::is_floating_point_v<T> << "\n";
    std::cout << "  is_arithmetic:     " << std::is_arithmetic_v<T> << "\n";
    std::cout << "  is_pointer:        " << std::is_pointer_v<T> << "\n";
    std::cout << "  is_const:          " << std::is_const_v<T> << "\n";
    std::cout << "  sizeof:            " << sizeof(T) << "\n\n";
}

// ===== SFINAE (Substitution Failure Is Not An Error) =====
// Enable function only for arithmetic types
template <typename T>
typename std::enable_if_t<std::is_arithmetic_v<T>, T>
safeAdd(T a, T b) {
    return a + b;
}

// ===== IF CONSTEXPR (C++17) =====
template <typename T>
auto serialize(const T& val) {
    if constexpr (std::is_arithmetic_v<T>) {
        return std::to_string(val);
    } else if constexpr (std::is_same_v<T, std::string>) {
        return "\"" + val + "\"";
    } else {
        return std::string("[unsupported]");
    }
}

// ===== CONSTEXPR IF WITH COMPILE-TIME BRANCHING =====
template <typename Container>
void printContainer(const Container& c) {
    if constexpr (requires { c.size(); }) {
        std::cout << "  Size: " << c.size() << " -> ";
    }
    for (const auto& item : c) {
        std::cout << item << " ";
    }
    std::cout << "\n";
}

int main() {
    // ===== CONSTEXPR =====
    std::cout << "--- constexpr ---\n";

    // These are computed at compile time!
    constexpr int f5 = factorial(5);     // 120
    constexpr int fib10 = fibonacci(10); // 55
    constexpr bool p7 = isPrime(7);      // true
    constexpr bool p8 = isPrime(8);      // false

    std::cout << "5! = " << f5 << "\n";
    std::cout << "fib(10) = " << fib10 << "\n";
    std::cout << "isPrime(7) = " << std::boolalpha << p7 << "\n";
    std::cout << "isPrime(8) = " << p8 << "\n";

    // constexpr array (computed at compile time)
    constexpr std::array<int, 5> fibs = {
        fibonacci(1), fibonacci(2), fibonacci(3), fibonacci(4), fibonacci(5)
    };
    std::cout << "Compile-time fibs: ";
    for (int f : fibs) std::cout << f << " ";
    std::cout << "\n";

    // ===== TYPE TRAITS =====
    std::cout << "\n--- Type Traits ---\n";
    analyzeType(42);
    analyzeType(3.14);

    // ===== SFINAE =====
    std::cout << "--- SFINAE ---\n";
    std::cout << "safeAdd(3, 4) = " << safeAdd(3, 4) << "\n";
    std::cout << "safeAdd(1.5, 2.5) = " << safeAdd(1.5, 2.5) << "\n";
    // safeAdd(std::string("a"), std::string("b")); // would not compile

    // ===== IF CONSTEXPR =====
    std::cout << "\n--- if constexpr serialization ---\n";
    std::cout << serialize(42) << "\n";
    std::cout << serialize(3.14) << "\n";
    std::cout << serialize(std::string("hello")) << "\n";

    // ===== CONTAINER PRINTING =====
    std::cout << "\n--- Compile-time container check ---\n";
    printContainer(std::vector<int>{1, 2, 3});
    printContainer(std::array<int, 4>{10, 20, 30, 40});

    // ===== STATIC_ASSERT =====
    std::cout << "\n--- static_assert ---\n";
    static_assert(sizeof(int) >= 4, "int must be at least 4 bytes");
    static_assert(factorial(5) == 120, "factorial(5) must be 120");
    std::cout << "All static assertions passed!\n";

    return 0;
}
