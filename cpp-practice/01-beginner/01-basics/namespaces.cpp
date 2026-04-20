/**
 * LESSON: Namespaces
 * Namespaces prevent name conflicts by grouping identifiers.
 * std:: is the standard library namespace.
 */
#include <iostream>
#include <string>

// "using namespace std;" makes everything in std available without std::
// Fine for small programs, but avoid in headers and large projects
// to prevent name conflicts.

namespace Math {
    double PI = 3.14159265;

    double circleArea(double radius) {
        return PI * radius * radius;
    }
}

namespace Physics {
    double PI = 3.14159; // different precision, no conflict!

    double kineticEnergy(double mass, double velocity) {
        return 0.5 * mass * velocity * velocity;
    }
}

// Nested namespace (C++17)
namespace Company::Department::Team {
    std::string name = "Engineering";
}

int main() {
    // ===== THREE WAYS TO USE NAMESPACES =====

    // 1. Fully qualified name (safest)
    std::cout << "--- Fully Qualified ---\n";
    std::cout << "Math PI: " << Math::PI << "\n";
    std::cout << "Physics PI: " << Physics::PI << "\n";

    // 2. Using declaration (import specific names)
    using std::cout;
    using std::endl;
    cout << "\n--- Using Declaration ---" << endl;
    cout << "Circle area (r=5): " << Math::circleArea(5) << endl;

    // 3. Using directive (import entire namespace)
    {
        using namespace Physics;
        std::cout << "\n--- Using Directive ---\n";
        std::cout << "Kinetic energy: " << kineticEnergy(10, 5) << "\n";
    }

    // Nested namespace
    std::cout << "\n--- Nested Namespace ---\n";
    std::cout << "Team: " << Company::Department::Team::name << "\n";

    return 0;
}
