/**
 * LESSON: Default Parameters
 * Functions can have default values for parameters.
 * If the caller doesn't provide an argument, the default is used.
 *
 * Compile: g++ -std=c++17 -o default_params default_params.cpp
 * Run:     ./default_params
 */
#include <iostream>
#include <string>

// ===== BASIC DEFAULT PARAMETERS =====
// Defaults must be specified from RIGHT to LEFT
void greet(const std::string& name, const std::string& greeting = "Hello") {
    std::cout << greeting << ", " << name << "!\n";
}

// Multiple defaults
double calculatePrice(double base, double tax = 0.08, double discount = 0.0) {
    return base * (1.0 + tax) * (1.0 - discount);
}

// ===== RULES: Defaults must be rightmost =====
// VALID:   void f(int a, int b = 5, int c = 10);
// INVALID: void f(int a = 5, int b, int c = 10);  // gap!

// ===== DEFAULT WITH DIFFERENT TYPES =====
void createUser(const std::string& name,
                int age = 0,
                const std::string& role = "user",
                bool active = true) {
    std::cout << "User{name='" << name << "', age=" << age
              << ", role='" << role << "', active=" << std::boolalpha << active << "}\n";
}

// ===== PRACTICAL: Formatting function =====
void printLine(char ch = '-', int length = 40) {
    for (int i = 0; i < length; i++) std::cout << ch;
    std::cout << "\n";
}

// ===== PRACTICAL: Logging =====
void log(const std::string& message,
         const std::string& level = "INFO",
         bool timestamp = false) {
    if (timestamp) std::cout << "[12:00:00] ";
    std::cout << "[" << level << "] " << message << "\n";
}

int main() {
    // --- Basic defaults ---
    std::cout << "--- Basic Defaults ---\n";
    greet("Emmanuel");              // uses default greeting
    greet("Emmanuel", "Hey");       // overrides default

    // --- Multiple defaults ---
    std::cout << "\n--- Price Calculation ---\n";
    std::cout << "Base $100, defaults:       $" << calculatePrice(100) << "\n";
    std::cout << "Base $100, tax 10%:        $" << calculatePrice(100, 0.10) << "\n";
    std::cout << "Base $100, tax 10%, 20off: $" << calculatePrice(100, 0.10, 0.20) << "\n";

    // --- Skipping defaults (you can't skip middle ones!) ---
    std::cout << "\n--- Creating Users ---\n";
    createUser("Alice");                           // all defaults
    createUser("Bob", 25);                         // default role, active
    createUser("Charlie", 30, "admin");            // default active
    createUser("Dave", 28, "moderator", false);    // no defaults

    // NOTE: Can't do createUser("Eve", , "admin") - must provide age too!

    // --- Formatting ---
    std::cout << "\n--- Print Lines ---\n";
    printLine();            // ----------------------------------------
    printLine('=');         // ========================================
    printLine('*', 20);     // ********************

    // --- Logging ---
    std::cout << "\n--- Logging ---\n";
    log("Server started");
    log("Disk space low", "WARN");
    log("Connection failed", "ERROR", true);

    return 0;
}
