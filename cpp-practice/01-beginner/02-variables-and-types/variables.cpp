/**
 * LESSON: Variables and Data Types
 * C++ is statically typed - every variable must have a declared type.
 */
#include <iostream>
#include <climits>   // INT_MAX, INT_MIN, etc.
#include <cfloat>    // FLT_MAX, DBL_MAX

int main() {
    // ===== FUNDAMENTAL TYPES =====
    std::cout << "--- Fundamental Types ---\n";

    // Integer types
    short myShort = 32000;              // at least 16 bits
    int myInt = 2'000'000;              // at least 16 bits (usually 32)
    long myLong = 2'000'000'000L;       // at least 32 bits
    long long myLongLong = 9'000'000'000'000LL;  // at least 64 bits

    // Unsigned (non-negative only, double the positive range)
    unsigned int positive = 4'000'000'000U;

    // Floating-point types
    float myFloat = 3.14f;              // ~7 decimal digits precision
    double myDouble = 3.14159265358979; // ~15 decimal digits (most used)
    long double myLongDouble = 3.14159265358979323846L; // extended precision

    // Character types
    char myChar = 'A';                  // 1 byte, ASCII value
    char16_t unicode16 = u'€';          // UTF-16 character
    char32_t unicode32 = U'😀';          // UTF-32 character

    // Boolean
    bool isTrue = true;
    bool isFalse = false;

    // Auto (C++11) - compiler deduces the type
    auto autoInt = 42;          // int
    auto autoDouble = 3.14;     // double
    auto autoString = std::string("Hello"); // std::string

    std::cout << "short: " << myShort << "\n";
    std::cout << "int: " << myInt << "\n";
    std::cout << "long: " << myLong << "\n";
    std::cout << "long long: " << myLongLong << "\n";
    std::cout << "unsigned int: " << positive << "\n";
    std::cout << "float: " << myFloat << "\n";
    std::cout << "double: " << myDouble << "\n";
    std::cout << "char: " << myChar << " (ASCII: " << (int)myChar << ")\n";
    std::cout << "bool: " << std::boolalpha << isTrue << "\n"; // prints "true" not "1"

    // ===== TYPE CASTING =====
    std::cout << "\n--- Type Casting ---\n";

    // Implicit (automatic widening)
    int num = 42;
    double widened = num; // int -> double
    std::cout << "Implicit: " << num << " -> " << widened << "\n";

    // Explicit (C-style and C++ style)
    double pi = 3.99;
    int truncated = (int)pi;              // C-style cast
    int truncated2 = static_cast<int>(pi); // C++ style (preferred)
    std::cout << "C-style cast: " << pi << " -> " << truncated << "\n";
    std::cout << "static_cast:  " << pi << " -> " << truncated2 << "\n";

    // ===== SIZE OF TYPES =====
    std::cout << "\n--- sizeof() ---\n";
    std::cout << "char:      " << sizeof(char) << " byte\n";
    std::cout << "short:     " << sizeof(short) << " bytes\n";
    std::cout << "int:       " << sizeof(int) << " bytes\n";
    std::cout << "long:      " << sizeof(long) << " bytes\n";
    std::cout << "long long: " << sizeof(long long) << " bytes\n";
    std::cout << "float:     " << sizeof(float) << " bytes\n";
    std::cout << "double:    " << sizeof(double) << " bytes\n";
    std::cout << "bool:      " << sizeof(bool) << " byte\n";

    // ===== LIMITS =====
    std::cout << "\n--- Limits ---\n";
    std::cout << "INT_MAX: " << INT_MAX << "\n";
    std::cout << "INT_MIN: " << INT_MIN << "\n";
    std::cout << "DBL_MAX: " << DBL_MAX << "\n";

    return 0;
}
