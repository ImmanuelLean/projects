/**
 * LESSON: Functions
 * Reusable blocks of code. C++ supports overloading, default params, and more.
 */
#include <iostream>
#include <string>

// ===== FUNCTION DECLARATIONS (prototypes) =====
void greet();
void greetPerson(const std::string& name);
int add(int a, int b);
int add(int a, int b, int c);         // overloaded
double add(double a, double b);       // overloaded
int max(int a, int b);
bool isEven(int num);
void printLine(char ch = '-', int len = 20); // default parameters

int main() {
    greet();
    greetPerson("Emmanuel");

    std::cout << "\n--- Return Values ---\n";
    std::cout << "add(10, 20) = " << add(10, 20) << "\n";
    std::cout << "max(25, 30) = " << max(25, 30) << "\n";
    std::cout << "isEven(7) = " << std::boolalpha << isEven(7) << "\n";

    // Method overloading
    std::cout << "\n--- Overloading ---\n";
    std::cout << "add(2, 3) = " << add(2, 3) << "\n";
    std::cout << "add(2, 3, 4) = " << add(2, 3, 4) << "\n";
    std::cout << "add(2.5, 3.5) = " << add(2.5, 3.5) << "\n";

    // Default parameters
    std::cout << "\n--- Default Parameters ---\n";
    printLine();           // uses defaults: '-', 20
    printLine('=');        // override first param
    printLine('*', 10);   // override both

    // ===== INLINE FUNCTIONS =====
    // Small functions can be inlined (hint to compiler to replace call with body)
    // Modern compilers decide this automatically

    // ===== LAMBDA FUNCTIONS (C++11) =====
    std::cout << "\n--- Lambda ---\n";
    auto square = [](int x) { return x * x; };
    auto greeting = [](const std::string& name) {
        std::cout << "Hi, " << name << "!\n";
    };

    std::cout << "square(5) = " << square(5) << "\n";
    greeting("World");

    return 0;
}

// ===== FUNCTION DEFINITIONS =====
void greet() {
    std::cout << "Hello from greet()!\n";
}

void greetPerson(const std::string& name) {
    std::cout << "Hello, " << name << "!\n";
}

int add(int a, int b) { return a + b; }
int add(int a, int b, int c) { return a + b + c; }
double add(double a, double b) { return a + b; }

int max(int a, int b) { return (a > b) ? a : b; }
bool isEven(int num) { return num % 2 == 0; }

void printLine(char ch, int len) {
    for (int i = 0; i < len; i++) std::cout << ch;
    std::cout << "\n";
}
