/**
 * LESSON: Preprocessor Directives
 * The preprocessor runs BEFORE compilation, performing text substitution.
 * Directives start with # and are not C++ statements.
 *
 * Compile: g++ -std=c++17 -o preprocessor preprocessor.cpp
 * Run:     ./preprocessor
 *
 * To see preprocessor output: g++ -E preprocessor.cpp
 * With debug defined: g++ -std=c++17 -DDEBUG_MODE -o preprocessor preprocessor.cpp
 */
#include <iostream>
#include <string>

// ===== #define MACROS =====
#define PI 3.14159265358979
#define MAX_STUDENTS 100
#define APP_NAME "CppLearning"
#define SQUARE(x) ((x) * (x))
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define PRINT_VAR(var) std::cout << #var << " = " << (var) << "\n"

// NOTE: prefer constexpr/const over #define for values in modern C++
// constexpr double PI = 3.14159;  // better!

// ===== INCLUDE GUARDS =====
// In header files, prevent double-inclusion:
// #ifndef MY_HEADER_H
// #define MY_HEADER_H
// ... declarations ...
// #endif
//
// Or simpler (non-standard but widely supported):
// #pragma once

// ===== CONDITIONAL COMPILATION =====
#define PLATFORM_LINUX

// #define DEBUG_MODE   // uncomment to enable, or compile with -DDEBUG_MODE

#ifdef DEBUG_MODE
    #define LOG(msg) std::cout << "[DEBUG] " << msg << "\n"
#else
    #define LOG(msg)  // expands to nothing in release
#endif

// ===== PREDEFINED MACROS =====
void showPredefinedMacros() {
    std::cout << "--- Predefined Macros ---\n";
    std::cout << "  __FILE__:     " << __FILE__ << "\n";
    std::cout << "  __LINE__:     " << __LINE__ << "\n";
    std::cout << "  __func__:     " << __func__ << "\n";
    std::cout << "  __DATE__:     " << __DATE__ << "\n";
    std::cout << "  __TIME__:     " << __TIME__ << "\n";
    std::cout << "  __cplusplus:  " << __cplusplus << "\n";
}

// ===== PRAGMA DIRECTIVES =====
#pragma message("Compiling preprocessor.cpp...")  // compiler message

int main() {
    // --- Object-like macros ---
    std::cout << "--- #define Constants ---\n";
    std::cout << "PI = " << PI << "\n";
    std::cout << "MAX_STUDENTS = " << MAX_STUDENTS << "\n";
    std::cout << "APP_NAME = " << APP_NAME << "\n";

    // --- Function-like macros ---
    std::cout << "\n--- Function-like Macros ---\n";
    std::cout << "SQUARE(5) = " << SQUARE(5) << "\n";
    std::cout << "MAX(10, 20) = " << MAX(10, 20) << "\n";

    // DANGER: macros are text substitution!
    int x = 3;
    std::cout << "SQUARE(x+1) = " << SQUARE(x + 1) << "\n";  // ((x+1)*(x+1)) = 16 ✓
    // Without parens: x+1*x+1 = 3+3+1 = 7 ✗

    // Stringify operator (#)
    int score = 95;
    PRINT_VAR(score);     // prints: score = 95
    PRINT_VAR(x + 10);   // prints: x + 10 = 13

    // --- Conditional compilation ---
    std::cout << "\n--- Conditional Compilation ---\n";
    LOG("This is a debug message");  // only prints if DEBUG_MODE is defined

    #ifdef DEBUG_MODE
        std::cout << "  DEBUG mode is ON\n";
    #else
        std::cout << "  DEBUG mode is OFF (compile with -DDEBUG_MODE to enable)\n";
    #endif

    #ifdef PLATFORM_LINUX
        std::cout << "  Compiling for Linux\n";
    #elif defined(PLATFORM_WINDOWS)
        std::cout << "  Compiling for Windows\n";
    #else
        std::cout << "  Unknown platform\n";
    #endif

    // Compile-time C++ version check
    #if __cplusplus >= 202002L
        std::cout << "  C++20 or later\n";
    #elif __cplusplus >= 201703L
        std::cout << "  C++17\n";
    #elif __cplusplus >= 201402L
        std::cout << "  C++14\n";
    #elif __cplusplus >= 201103L
        std::cout << "  C++11\n";
    #else
        std::cout << "  Pre-C++11\n";
    #endif

    // --- Predefined macros ---
    std::cout << "\n";
    showPredefinedMacros();

    // --- Undefine ---
    std::cout << "\n--- #undef ---\n";
    #define TEMP_VALUE 42
    std::cout << "  TEMP_VALUE = " << TEMP_VALUE << "\n";
    #undef TEMP_VALUE
    // std::cout << TEMP_VALUE;  // ERROR: no longer defined

    // --- Best practices ---
    std::cout << "\n--- Best Practices ---\n";
    std::cout << "  1. Use constexpr/const instead of #define for values\n";
    std::cout << "  2. Use inline functions instead of macro functions\n";
    std::cout << "  3. Use #pragma once for include guards\n";
    std::cout << "  4. Conditional compilation for platform-specific code\n";
    std::cout << "  5. Minimize macro usage in modern C++\n";

    return 0;
}
