/**
 * LESSON: Scope and Lifetime
 * Scope determines where a variable is accessible.
 * Lifetime determines how long a variable exists in memory.
 *
 * Compile: g++ -std=c++17 -o scope scope_and_lifetime.cpp
 * Run:     ./scope
 */
#include <iostream>
#include <string>

// ===== FILE/GLOBAL SCOPE =====
int globalVar = 100;  // accessible everywhere in this file
const std::string APP_NAME = "ScopeDemo";

// ===== FUNCTION WITH STATIC LOCAL =====
int callCounter() {
    static int count = 0;  // initialized ONCE, persists between calls
    count++;
    return count;
}

// Demonstrate scope resolution
namespace MyApp {
    int value = 42;

    namespace Utils {
        int value = 99;  // different from MyApp::value
    }
}

int value = 10;  // global

int main() {
    // --- Block scope ---
    std::cout << "--- Block Scope ---\n";
    {
        int blockVar = 42;  // only exists in this block
        std::cout << "  Inside block: blockVar = " << blockVar << "\n";
    }
    // std::cout << blockVar;  // ERROR: blockVar is out of scope!
    std::cout << "  Outside block: blockVar no longer exists\n";

    // --- Variable shadowing ---
    std::cout << "\n--- Variable Shadowing ---\n";
    int x = 10;
    std::cout << "  Outer x = " << x << "\n";
    {
        int x = 20;  // shadows outer x
        std::cout << "  Inner x = " << x << " (shadows outer)\n";
        {
            int x = 30;  // shadows both
            std::cout << "  Innermost x = " << x << "\n";
        }
        std::cout << "  Back to inner x = " << x << "\n";
    }
    std::cout << "  Back to outer x = " << x << "\n";

    // --- Global scope ---
    std::cout << "\n--- Global Scope ---\n";
    std::cout << "  globalVar = " << globalVar << "\n";
    std::cout << "  APP_NAME = " << APP_NAME << "\n";

    // Local variable shadows global
    int globalVar = 999;  // shadows the global
    std::cout << "  local globalVar = " << globalVar << " (shadowed)\n";
    std::cout << "  ::globalVar = " << ::globalVar << " (scope resolution)\n";

    // --- Scope resolution operator :: ---
    std::cout << "\n--- Scope Resolution (::) ---\n";
    std::cout << "  ::value (global) = " << ::value << "\n";
    std::cout << "  MyApp::value = " << MyApp::value << "\n";
    std::cout << "  MyApp::Utils::value = " << MyApp::Utils::value << "\n";

    // --- Static local variables ---
    std::cout << "\n--- Static Local Variables ---\n";
    std::cout << "  Call 1: count = " << callCounter() << "\n";
    std::cout << "  Call 2: count = " << callCounter() << "\n";
    std::cout << "  Call 3: count = " << callCounter() << "\n";
    // Static var persists between calls (lifetime = program duration)

    // --- Loop scope ---
    std::cout << "\n--- Loop Scope ---\n";
    for (int i = 0; i < 3; i++) {
        int loopLocal = i * 10;
        std::cout << "  i=" << i << ", loopLocal=" << loopLocal << "\n";
    }
    // i and loopLocal don't exist here

    // --- If/else scope ---
    std::cout << "\n--- If/Else Scope ---\n";
    bool condition = true;
    if (condition) {
        std::string msg = "Inside if";
        std::cout << "  " << msg << "\n";
    }
    // msg doesn't exist here

    // C++17: if with initializer
    if (int result = 42; result > 0) {
        std::cout << "  if-init: result = " << result << "\n";
    }
    // result doesn't exist here

    // --- Lifetime summary ---
    std::cout << "\n--- Lifetime Summary ---\n";
    std::cout << "  Automatic (local): created at declaration, destroyed at scope end\n";
    std::cout << "  Static:            created once, lives until program ends\n";
    std::cout << "  Dynamic (new):     lives until explicitly deleted\n";
    std::cout << "  Global:            lives for entire program duration\n";

    return 0;
}
