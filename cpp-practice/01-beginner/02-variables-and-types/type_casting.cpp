/**
 * LESSON: Type Casting in C++
 * C++ provides several ways to convert between types.
 * Understanding when and how to cast is crucial for safe code.
 *
 * Compile: g++ -std=c++17 -o type_casting type_casting.cpp
 * Run:     ./type_casting
 */
#include <iostream>
#include <string>

class Base {
public:
    virtual ~Base() {}  // need virtual for dynamic_cast
};

class Derived : public Base {
public:
    void special() { std::cout << "  Derived-only method\n"; }
};

int main() {
    // ===== IMPLICIT CONVERSIONS (Automatic) =====
    std::cout << "--- Implicit Conversions ---\n";

    // Widening (safe - no data loss)
    int i = 42;
    double d = i;  // int -> double
    std::cout << "int " << i << " -> double " << d << "\n";

    // Narrowing (dangerous - possible data loss!)
    double pi = 3.99;
    int truncated = pi;  // double -> int (loses .99)
    std::cout << "double " << pi << " -> int " << truncated << " (truncated!)\n";

    // Bool conversions
    int zero = 0, nonzero = 42;
    bool b1 = zero;     // 0 -> false
    bool b2 = nonzero;  // non-zero -> true
    std::cout << "0 -> bool: " << std::boolalpha << b1 << "\n";
    std::cout << "42 -> bool: " << b2 << "\n";

    // Char to int (ASCII value)
    char ch = 'A';
    int ascii = ch;  // 'A' = 65
    std::cout << "char '" << ch << "' -> int " << ascii << "\n";

    // ===== C-STYLE CAST (avoid in C++) =====
    std::cout << "\n--- C-Style Cast ---\n";
    double val = 9.87;
    int casted = (int)val;  // C-style: works but unsafe
    std::cout << "(int)9.87 = " << casted << "\n";

    // ===== static_cast (compile-time, most common) =====
    std::cout << "\n--- static_cast ---\n";
    double x = 3.14;
    int y = static_cast<int>(x);  // explicit, safe, readable
    std::cout << "static_cast<int>(3.14) = " << y << "\n";

    // Enum to int
    enum Color { RED, GREEN, BLUE };
    int colorVal = static_cast<int>(BLUE);
    std::cout << "BLUE = " << colorVal << "\n";

    // void* to typed pointer
    int num = 100;
    void* vp = &num;
    int* ip = static_cast<int*>(vp);
    std::cout << "void* -> int*: " << *ip << "\n";

    // ===== dynamic_cast (runtime, polymorphic types) =====
    std::cout << "\n--- dynamic_cast ---\n";
    Base* base = new Derived();
    Derived* derived = dynamic_cast<Derived*>(base);
    if (derived) {
        std::cout << "  dynamic_cast succeeded: ";
        derived->special();
    }

    Base* actualBase = new Base();
    Derived* failed = dynamic_cast<Derived*>(actualBase);
    if (!failed) {
        std::cout << "  dynamic_cast returned nullptr (safe fail)\n";
    }
    delete base;
    delete actualBase;

    // ===== const_cast (add/remove const) =====
    std::cout << "\n--- const_cast ---\n";
    const int constant = 50;
    const int* cp = &constant;
    int* mp = const_cast<int*>(cp);  // remove const (use carefully!)
    std::cout << "  const_cast removed const: " << *mp << "\n";
    // WARNING: modifying a truly const object is undefined behavior!

    // ===== reinterpret_cast (dangerous, raw bit reinterpretation) =====
    std::cout << "\n--- reinterpret_cast ---\n";
    int number = 65;
    char* charPtr = reinterpret_cast<char*>(&number);
    std::cout << "  reinterpret int 65 as char: '" << *charPtr << "'\n";

    // ===== CONVERSION FUNCTIONS =====
    std::cout << "\n--- String Conversions ---\n";
    std::string numStr = "12345";
    int fromStr = std::stoi(numStr);      // string -> int
    double fromStr2 = std::stod("3.14");  // string -> double
    std::string back = std::to_string(fromStr);  // int -> string
    std::cout << "stoi(\"12345\") = " << fromStr << "\n";
    std::cout << "stod(\"3.14\") = " << fromStr2 << "\n";
    std::cout << "to_string(12345) = \"" << back << "\"\n";

    return 0;
}
