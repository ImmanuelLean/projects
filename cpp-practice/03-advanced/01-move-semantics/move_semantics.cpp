/**
 * LESSON: Move Semantics & Rvalue References (C++11)
 * Move semantics transfer resources instead of copying them.
 * Huge performance gain for large objects (vectors, strings, etc.)
 *
 * lvalue  = has a name, addressable (variables)
 * rvalue  = temporary, no name (literals, function returns)
 * T&      = lvalue reference
 * T&&     = rvalue reference (binds to temporaries)
 */
#include <iostream>
#include <string>
#include <vector>
#include <utility> // std::move

class HeavyObject {
    std::string name;
    int* data;
    size_t size;

public:
    // Constructor
    HeavyObject(const std::string& n, size_t sz)
        : name(n), data(new int[sz]), size(sz) {
        for (size_t i = 0; i < sz; i++) data[i] = i;
        std::cout << "  [Constructed: " << name << ", size=" << size << "]\n";
    }

    // Copy constructor (deep copy - expensive!)
    HeavyObject(const HeavyObject& other)
        : name(other.name + "_copy"), data(new int[other.size]), size(other.size) {
        std::copy(other.data, other.data + size, data);
        std::cout << "  [COPIED: " << name << "] (expensive!)\n";
    }

    // Move constructor (steal resources - cheap!)
    HeavyObject(HeavyObject&& other) noexcept
        : name(std::move(other.name)), data(other.data), size(other.size) {
        other.data = nullptr;  // leave source in valid but empty state
        other.size = 0;
        std::cout << "  [MOVED: " << name << "] (fast!)\n";
    }

    // Copy assignment
    HeavyObject& operator=(const HeavyObject& other) {
        if (this != &other) {
            delete[] data;
            size = other.size;
            data = new int[size];
            std::copy(other.data, other.data + size, data);
            name = other.name + "_assigned";
            std::cout << "  [Copy assigned: " << name << "]\n";
        }
        return *this;
    }

    // Move assignment
    HeavyObject& operator=(HeavyObject&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            name = std::move(other.name);
            other.data = nullptr;
            other.size = 0;
            std::cout << "  [Move assigned: " << name << "]\n";
        }
        return *this;
    }

    ~HeavyObject() {
        delete[] data;
    }

    void info() const {
        std::cout << "  " << name << " (size=" << size << ")\n";
    }
};

HeavyObject createHeavy() {
    return HeavyObject("Temporary", 1000); // returned by move (or NRVO)
}

int main() {
    // ===== COPY vs MOVE =====
    std::cout << "--- Copy vs Move ---\n";
    HeavyObject a("Original", 1000);

    HeavyObject b = a;              // COPY constructor
    HeavyObject c = std::move(a);   // MOVE constructor (a is now empty)

    std::cout << "\n--- After move ---\n";
    b.info();
    c.info();

    // ===== STD::MOVE =====
    std::cout << "\n--- std::move with strings ---\n";
    std::string s1 = "Hello, World!";
    std::string s2 = std::move(s1); // s1 is now empty
    std::cout << "s1 (after move): '" << s1 << "'\n";  // empty
    std::cout << "s2: '" << s2 << "'\n";                // "Hello, World!"

    // ===== MOVE IN VECTORS =====
    std::cout << "\n--- Vectors use move ---\n";
    std::vector<HeavyObject> vec;
    vec.reserve(3); // avoid reallocations
    vec.push_back(HeavyObject("Vec1", 100));  // move from temporary
    vec.emplace_back("Vec2", 200);            // construct in place (best)

    // ===== PERFECT FORWARDING CONCEPT =====
    std::cout << "\n--- Return Value ---\n";
    auto obj = createHeavy(); // NRVO or move
    obj.info();

    return 0;
}
