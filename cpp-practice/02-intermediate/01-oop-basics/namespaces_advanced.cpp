/**
 * LESSON: Advanced Namespaces
 * Namespaces prevent name collisions and organize code logically.
 * C++17 added nested namespace syntax and inline namespaces.
 *
 * Compile: g++ -std=c++17 -o namespaces namespaces_advanced.cpp
 * Run:     ./namespaces
 */
#include <iostream>
#include <string>

// ===== CUSTOM NAMESPACE =====
namespace Math {
    constexpr double PI = 3.14159265358979;
    constexpr double E  = 2.71828182845905;

    double circleArea(double r) { return PI * r * r; }
    double square(double x) { return x * x; }
}

// ===== NESTED NAMESPACES =====
// Pre-C++17:
namespace Company {
    namespace Department {
        namespace Team {
            void greet() { std::cout << "  Pre-C++17 nested namespace\n"; }
        }
    }
}

// C++17 nested namespace syntax (much cleaner)
namespace App::Config::Database {
    std::string host = "localhost";
    int port = 5432;
    std::string name = "mydb";

    void display() {
        std::cout << "  DB: " << host << ":" << port << "/" << name << "\n";
    }
}

// ===== NAMESPACE ALIAS =====
namespace VeryLongNamespaceName {
    void doSomething() { std::cout << "  Doing something\n"; }
}
namespace VLN = VeryLongNamespaceName;  // alias

// ===== ANONYMOUS/UNNAMED NAMESPACE =====
// Like 'static' for functions - limits scope to this translation unit
namespace {
    int internalCounter = 0;
    void internalHelper() {
        internalCounter++;
        std::cout << "  Internal call #" << internalCounter << "\n";
    }
}

// ===== INLINE NAMESPACE (C++11) =====
// Members are accessible from the parent namespace
namespace Library {
    inline namespace v2 {
        void process() { std::cout << "  Library v2::process()\n"; }
    }

    namespace v1 {
        void process() { std::cout << "  Library v1::process()\n"; }
    }
}
// Library::process() calls v2 (inline version)
// Library::v1::process() calls v1 explicitly

// ===== EXTENDING NAMESPACES =====
namespace Math {
    // Can add to an existing namespace (even across files)
    double cubeVolume(double side) { return side * side * side; }
}

int main() {
    // --- Accessing namespace members ---
    std::cout << "--- Custom Namespace ---\n";
    std::cout << "PI = " << Math::PI << "\n";
    std::cout << "circleArea(5) = " << Math::circleArea(5) << "\n";
    std::cout << "cubeVolume(3) = " << Math::cubeVolume(3) << "\n";

    // --- using declaration (import specific names) ---
    std::cout << "\n--- using Declaration ---\n";
    using Math::PI;
    using Math::square;
    std::cout << "PI = " << PI << "\n";           // no Math:: needed
    std::cout << "square(7) = " << square(7) << "\n";

    // --- using directive (import all names - use carefully) ---
    {
        using namespace Math;
        std::cout << "E = " << E << "\n";         // all Math names available
    }
    // Outside this block, Math names need Math:: again

    // --- Nested namespaces ---
    std::cout << "\n--- Nested Namespaces ---\n";
    Company::Department::Team::greet();
    App::Config::Database::display();

    // --- Namespace alias ---
    std::cout << "\n--- Namespace Alias ---\n";
    VLN::doSomething();  // much shorter!

    // --- Anonymous namespace ---
    std::cout << "\n--- Anonymous Namespace ---\n";
    internalHelper();
    internalHelper();
    std::cout << "  Counter: " << internalCounter << "\n";

    // --- Inline namespace ---
    std::cout << "\n--- Inline Namespace ---\n";
    Library::process();      // calls v2 (inline)
    Library::v1::process();  // explicitly call v1
    Library::v2::process();  // explicitly call v2

    // --- Name collision prevention ---
    std::cout << "\n--- Why Namespaces Matter ---\n";
    std::cout << "  1. Prevent name collisions between libraries\n";
    std::cout << "  2. Organize large codebases logically\n";
    std::cout << "  3. Inline namespaces enable API versioning\n";
    std::cout << "  4. Anonymous namespaces replace static for internal linkage\n";

    return 0;
}
