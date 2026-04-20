/**
 * LESSON: Variadic Templates
 * Parameter packs, pack expansion, and fold expressions (C++17).
 * Build type-safe functions that accept any number of arguments.
 *
 * Compile: g++ -std=c++17 -o variadic variadic_templates.cpp
 * Run:     ./variadic
 */
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <tuple>
#include <type_traits>

// ===== BASIC: RECURSIVE PARAMETER PACK =====
void print() {
    std::cout << "\n";
}

template<typename T, typename... Args>
void print(T first, Args... rest) {
    std::cout << first;
    if constexpr (sizeof...(rest) > 0) std::cout << ", ";
    print(rest...);
}

// ===== FOLD EXPRESSIONS (C++17) =====

// Unary left fold: (... op pack) => ((a op b) op c) op d
template<typename... Args>
auto sum(Args... args) {
    return (... + args);
}

// Unary right fold: (pack op ...) => a op (b op (c op d))
template<typename... Args>
auto product(Args... args) {
    return (args * ...);
}

// Binary fold with init value
template<typename... Args>
bool allTrue(Args... args) {
    return (true && ... && args);
}

template<typename... Args>
bool anyTrue(Args... args) {
    return (false || ... || args);
}

// Fold with comma operator: apply function to each arg
template<typename F, typename... Args>
void forEach(F func, Args&&... args) {
    (func(std::forward<Args>(args)), ...);
}

// ===== TYPE-SAFE FORMAT =====
template<typename... Args>
std::string format(const std::string& fmt, Args... args) {
    std::ostringstream oss;
    std::size_t argIdx = 0;

    for (std::size_t i = 0; i < fmt.size(); ++i) {
        if (fmt[i] == '{' && i + 1 < fmt.size() && fmt[i + 1] == '}') {
            std::size_t idx = 0;
            auto insertArg = [&](auto&& val) {
                if (idx == argIdx) oss << val;
                ++idx;
            };
            (insertArg(args), ...);
            ++argIdx;
            ++i;
        } else {
            oss << fmt[i];
        }
    }
    return oss.str();
}

// ===== VARIADIC CLASS TEMPLATE =====
template<typename... Types>
struct TypeList {
    static constexpr std::size_t size = sizeof...(Types);
};

template<template<typename> class Pred, typename... Types>
constexpr std::size_t countIf() {
    return (0 + ... + (Pred<Types>::value ? 1 : 0));
}

// ===== PERFECT FORWARDING FACTORY =====
template<typename T, typename... Args>
T create(Args&&... args) {
    return T(std::forward<Args>(args)...);
}

struct Point {
    double x, y, z;
    Point(double x, double y, double z) : x(x), y(y), z(z) {}
    friend std::ostream& operator<<(std::ostream& os, const Point& p) {
        return os << "(" << p.x << ", " << p.y << ", " << p.z << ")";
    }
};

// ===== VARIADIC MIN/MAX =====
template<typename T>
T myMin(T val) { return val; }

template<typename T, typename... Args>
T myMin(T first, Args... rest) {
    T restMin = myMin(rest...);
    return first < restMin ? first : restMin;
}

template<typename T, typename... Args>
T myMax(T first, Args... rest) {
    T result = first;
    ((result = rest > result ? rest : result), ...);
    return result;
}

// ===== TUPLE ITERATION =====
template<typename Tuple, std::size_t... Is>
void printTupleImpl(const Tuple& t, std::index_sequence<Is...>) {
    ((std::cout << (Is == 0 ? "" : ", ") << std::get<Is>(t)), ...);
}

template<typename... Types>
void printTuple(const std::tuple<Types...>& t) {
    std::cout << "(";
    printTupleImpl(t, std::index_sequence_for<Types...>{});
    std::cout << ")";
}

int main() {
    // ===== RECURSIVE PRINT =====
    std::cout << "--- Recursive Print ---\n";
    print(1, 2.5, "hello", 'x', true);
    print("only one");
    print(42, std::string("world"), 3.14);

    // ===== FOLD EXPRESSIONS =====
    std::cout << "\n--- Fold Expressions ---\n";
    std::cout << "sum(1,2,3,4,5) = " << sum(1, 2, 3, 4, 5) << "\n";
    std::cout << "product(2,3,4) = " << product(2, 3, 4) << "\n";
    std::cout << "allTrue(1,1,1) = " << std::boolalpha << allTrue(true, true, true) << "\n";
    std::cout << "allTrue(1,0,1) = " << allTrue(true, false, true) << "\n";
    std::cout << "anyTrue(0,0,1) = " << anyTrue(false, false, true) << "\n";

    std::cout << "\nforEach(print): ";
    forEach([](auto&& x) { std::cout << "[" << x << "] "; },
            1, "hello", 3.14, 'Z');
    std::cout << "\n";

    // ===== FORMAT =====
    std::cout << "\n--- Format ---\n";
    std::cout << format("Name: {}, Age: {}, GPA: {}", "Emmanuel", 20, 3.8) << "\n";
    std::cout << format("{} + {} = {}", 10, 20, 30) << "\n";

    // ===== SIZEOF... =====
    std::cout << "\n--- sizeof... ---\n";
    std::cout << "TypeList<int,double,char>::size = "
              << TypeList<int, double, char>::size << "\n";
    std::cout << "Integral types in <int,double,char,long>: "
              << countIf<std::is_integral, int, double, char, long>() << "\n";

    // ===== FACTORY =====
    std::cout << "\n--- Factory ---\n";
    auto p = create<Point>(1.0, 2.0, 3.0);
    std::cout << "Created point: " << p << "\n";
    auto s = create<std::string>(5, 'x');
    std::cout << "Created string: " << s << "\n";

    // ===== MIN / MAX =====
    std::cout << "\n--- Min/Max ---\n";
    std::cout << "min(5,3,8,1,7) = " << myMin(5, 3, 8, 1, 7) << "\n";
    std::cout << "max(5,3,8,1,7) = " << myMax(5, 3, 8, 1, 7) << "\n";

    // ===== TUPLE PRINT =====
    std::cout << "\n--- Tuple Print ---\n";
    auto t = std::make_tuple(42, "hello", 3.14, true);
    std::cout << "Tuple: ";
    printTuple(t);
    std::cout << "\n";

    return 0;
}
