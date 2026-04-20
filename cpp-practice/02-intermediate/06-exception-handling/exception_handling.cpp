/**
 * LESSON: Exception Handling
 * Handle runtime errors gracefully with try-catch-throw.
 */
#include <iostream>
#include <string>
#include <stdexcept> // standard exception classes
#include <vector>

// Custom exception class
class InsufficientFundsException : public std::runtime_error {
    double shortage;
public:
    InsufficientFundsException(double shortage)
        : std::runtime_error("Insufficient funds"), shortage(shortage) {}
    double getShortage() const { return shortage; }
};

class NegativeValueException : public std::invalid_argument {
public:
    NegativeValueException(const std::string& msg)
        : std::invalid_argument(msg) {}
};

double divide(double a, double b) {
    if (b == 0) throw std::runtime_error("Division by zero!");
    return a / b;
}

void withdraw(double balance, double amount) {
    if (amount < 0) throw NegativeValueException("Amount cannot be negative");
    if (amount > balance) throw InsufficientFundsException(amount - balance);
    std::cout << "Withdrawal successful. Remaining: $" << (balance - amount) << "\n";
}

int main() {
    // ===== BASIC TRY-CATCH =====
    std::cout << "--- Basic Try-Catch ---\n";
    try {
        double result = divide(10, 0);
        std::cout << result << "\n"; // never reached
    } catch (const std::runtime_error& e) {
        std::cout << "Error: " << e.what() << "\n";
    }

    // ===== MULTIPLE CATCH BLOCKS =====
    std::cout << "\n--- Multiple Catch ---\n";
    try {
        std::vector<int> v = {1, 2, 3};
        std::cout << v.at(10) << "\n"; // throws std::out_of_range
    } catch (const std::out_of_range& e) {
        std::cout << "Out of range: " << e.what() << "\n";
    } catch (const std::exception& e) {
        std::cout << "General error: " << e.what() << "\n";
    }

    // ===== CUSTOM EXCEPTIONS =====
    std::cout << "\n--- Custom Exceptions ---\n";
    try {
        withdraw(100, 500);
    } catch (const InsufficientFundsException& e) {
        std::cout << "Bank error: " << e.what() << "\n";
        std::cout << "Short by: $" << e.getShortage() << "\n";
    }

    try {
        withdraw(100, -50);
    } catch (const NegativeValueException& e) {
        std::cout << "Validation error: " << e.what() << "\n";
    }

    // ===== CATCH ALL =====
    std::cout << "\n--- Catch All ---\n";
    try {
        throw 42; // throwing a non-standard type
    } catch (...) { // catches anything
        std::cout << "Caught unknown exception\n";
    }

    // ===== NESTED TRY-CATCH =====
    std::cout << "\n--- Nested Try-Catch ---\n";
    try {
        try {
            throw std::runtime_error("Inner error");
        } catch (const std::runtime_error& e) {
            std::cout << "Inner catch: " << e.what() << "\n";
            throw; // re-throw to outer handler
        }
    } catch (const std::exception& e) {
        std::cout << "Outer catch: " << e.what() << "\n";
    }

    // ===== STANDARD EXCEPTION HIERARCHY =====
    std::cout << "\n--- Standard Exceptions ---\n";
    std::cout << "std::exception\n";
    std::cout << "  ├── std::runtime_error\n";
    std::cout << "  │   ├── std::overflow_error\n";
    std::cout << "  │   ├── std::underflow_error\n";
    std::cout << "  │   └── std::range_error\n";
    std::cout << "  ├── std::logic_error\n";
    std::cout << "  │   ├── std::invalid_argument\n";
    std::cout << "  │   ├── std::out_of_range\n";
    std::cout << "  │   └── std::domain_error\n";
    std::cout << "  └── std::bad_alloc (new fails)\n";

    // ===== NOEXCEPT =====
    std::cout << "\n--- noexcept ---\n";
    // Mark functions that won't throw (helps compiler optimize)
    auto safeAdd = [](int a, int b) noexcept { return a + b; };
    std::cout << "safeAdd: " << safeAdd(3, 4) << "\n";

    return 0;
}
