/**
 * LESSON: Encapsulation
 * Encapsulation bundles data with the methods that operate on it,
 * and restricts direct access to internal state.
 * This protects object integrity and hides implementation details.
 *
 * Compile: g++ -std=c++17 -o encapsulation encapsulation.cpp
 * Run:     ./encapsulation
 */
#include <iostream>
#include <string>

// ===== BANK ACCOUNT: Encapsulation in Action =====
class BankAccount {
private:
    std::string owner;
    double balance;
    int transactionCount;

    // Private helper - only used internally
    void logTransaction(const std::string& type, double amount) {
        transactionCount++;
        std::cout << "  [#" << transactionCount << "] " << type
                  << ": $" << amount << " | Balance: $" << balance << "\n";
    }

public:
    // Constructor
    BankAccount(const std::string& owner, double initialBalance = 0.0)
        : owner(owner), balance(initialBalance), transactionCount(0) {
        if (initialBalance < 0) balance = 0;  // validation!
    }

    // Getters (read-only access)
    std::string getOwner() const { return owner; }
    double getBalance() const { return balance; }
    int getTransactionCount() const { return transactionCount; }

    // Setter with validation
    bool deposit(double amount) {
        if (amount <= 0) {
            std::cout << "  ERROR: Deposit must be positive\n";
            return false;
        }
        balance += amount;
        logTransaction("Deposit", amount);
        return true;
    }

    bool withdraw(double amount) {
        if (amount <= 0) {
            std::cout << "  ERROR: Withdrawal must be positive\n";
            return false;
        }
        if (amount > balance) {
            std::cout << "  ERROR: Insufficient funds (balance: $" << balance << ")\n";
            return false;
        }
        balance -= amount;
        logTransaction("Withdraw", amount);
        return true;
    }

    void display() const {
        std::cout << "Account{" << owner << ", $" << balance
                  << ", txns=" << transactionCount << "}\n";
    }
};

// ===== FRIEND FUNCTION =====
class Temperature {
private:
    double celsius;

public:
    Temperature(double c) : celsius(c) {}

    // Friend function can access private members
    friend void printDetails(const Temperature& t);

    // Friend class
    friend class TemperatureConverter;
};

void printDetails(const Temperature& t) {
    // Can access private member 'celsius' because we're a friend
    std::cout << "  Celsius: " << t.celsius
              << " | Fahrenheit: " << (t.celsius * 9.0 / 5.0 + 32.0) << "\n";
}

class TemperatureConverter {
public:
    // Can access Temperature's private members
    static double toFahrenheit(const Temperature& t) {
        return t.celsius * 9.0 / 5.0 + 32.0;
    }
    static double toKelvin(const Temperature& t) {
        return t.celsius + 273.15;
    }
};

// ===== WHY ENCAPSULATION MATTERS =====
// BAD: Public fields allow invalid state
struct BadAccount {
    double balance;  // anyone can set to -999!
};

int main() {
    // --- BankAccount (proper encapsulation) ---
    std::cout << "--- BankAccount ---\n";
    BankAccount acc("Emmanuel", 1000.0);
    acc.display();

    acc.deposit(500.0);
    acc.withdraw(200.0);
    acc.withdraw(2000.0);    // rejected: insufficient funds
    acc.deposit(-50.0);       // rejected: negative amount
    acc.display();

    // acc.balance = 999999;  // ERROR: balance is private!

    // --- Friend function ---
    std::cout << "\n--- Friend Function ---\n";
    Temperature temp(37.0);
    printDetails(temp);  // friend can access private celsius

    // --- Friend class ---
    std::cout << "\n--- Friend Class ---\n";
    std::cout << "  Fahrenheit: " << TemperatureConverter::toFahrenheit(temp) << "\n";
    std::cout << "  Kelvin: " << TemperatureConverter::toKelvin(temp) << "\n";

    // --- Why it matters ---
    std::cout << "\n--- Why Encapsulation Matters ---\n";
    BadAccount bad;
    bad.balance = -999;  // no validation, invalid state!
    std::cout << "  BadAccount balance: $" << bad.balance << " (invalid!)\n";

    BankAccount good("Safe", 100);
    good.withdraw(200);  // properly rejected
    good.display();
    std::cout << "  Encapsulation prevents invalid state!\n";

    return 0;
}
