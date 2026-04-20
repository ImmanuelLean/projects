/**
 * LESSON: References
 * A reference is an ALIAS (another name) for an existing variable.
 * Unlike pointers, references must be initialized and cannot be reassigned.
 *
 * Syntax: Type& refName = variable;
 */
#include <iostream>
#include <string>

// Pass by value: function gets a COPY (original unchanged)
void incrementByValue(int x) {
    x++;
    std::cout << "Inside (value): " << x << "\n";
}

// Pass by reference: function works on the ORIGINAL
void incrementByRef(int& x) {
    x++;
    std::cout << "Inside (ref): " << x << "\n";
}

// Pass by const reference: read-only access, no copying
void printName(const std::string& name) {
    std::cout << "Name: " << name << "\n";
    // name = "test"; // ERROR: const reference
}

// Swap using references
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    // ===== BASIC REFERENCE =====
    std::cout << "--- Basic Reference ---\n";
    int original = 42;
    int& ref = original; // ref is an alias for original

    std::cout << "original: " << original << "\n";
    std::cout << "ref:      " << ref << "\n";

    ref = 100; // modifies original through the alias
    std::cout << "After ref = 100:\n";
    std::cout << "original: " << original << "\n"; // 100
    std::cout << "ref:      " << ref << "\n";       // 100

    // Both share the same address
    std::cout << "Same address? " << (&original == &ref ? "Yes" : "No") << "\n";

    // ===== PASS BY VALUE vs REFERENCE =====
    std::cout << "\n--- Pass by Value vs Reference ---\n";
    int num = 10;

    incrementByValue(num);
    std::cout << "After byValue: " << num << "\n"; // still 10

    incrementByRef(num);
    std::cout << "After byRef:   " << num << "\n"; // now 11

    // ===== CONST REFERENCE =====
    std::cout << "\n--- Const Reference ---\n";
    std::string myName = "Emmanuel";
    printName(myName); // no copy made, but can't modify

    // ===== SWAP EXAMPLE =====
    std::cout << "\n--- Swap ---\n";
    int a = 5, b = 10;
    std::cout << "Before: a=" << a << ", b=" << b << "\n";
    swap(a, b);
    std::cout << "After:  a=" << a << ", b=" << b << "\n";

    // ===== REFERENCE vs POINTER =====
    std::cout << "\n--- Reference vs Pointer ---\n";
    std::cout << "Reference: must init, can't be null, can't reassign, cleaner syntax\n";
    std::cout << "Pointer:   can be null, can reassign, needs * and &, more flexible\n";

    return 0;
}
