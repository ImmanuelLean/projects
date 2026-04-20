/**
 * LESSON: Enumerations (Enums)
 * Enums define a set of named integer constants.
 * C++11 enum class provides type safety and scoping.
 *
 * Compile: g++ -std=c++17 -o enums enums.cpp
 * Run:     ./enums
 */
#include <iostream>
#include <string>

// ===== TRADITIONAL ENUM (C-style) =====
// Values pollute the enclosing scope
enum Color {
    RED,      // 0
    GREEN,    // 1
    BLUE      // 2
};

// Custom starting values
enum HttpStatus {
    OK = 200,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
};

// ===== ENUM CLASS (C++11, strongly typed) =====
// Scoped: must use ClassName::Value
// Type-safe: no implicit conversion to int
enum class Direction {
    NORTH,
    SOUTH,
    EAST,
    WEST
};

enum class LogLevel {
    DEBUG,
    INFO,
    WARNING,
    ERROR,
    CRITICAL
};

// ===== ENUM WITH UNDERLYING TYPE =====
enum class Permission : unsigned int {
    NONE    = 0,
    READ    = 1,
    WRITE   = 2,
    EXECUTE = 4,
    ALL     = 7   // READ | WRITE | EXECUTE
};

// Helper to convert enum to string
std::string directionToString(Direction dir) {
    switch (dir) {
        case Direction::NORTH: return "North";
        case Direction::SOUTH: return "South";
        case Direction::EAST:  return "East";
        case Direction::WEST:  return "West";
        default: return "Unknown";
    }
}

std::string logLevelToString(LogLevel level) {
    switch (level) {
        case LogLevel::DEBUG:    return "DEBUG";
        case LogLevel::INFO:     return "INFO";
        case LogLevel::WARNING:  return "WARNING";
        case LogLevel::ERROR:    return "ERROR";
        case LogLevel::CRITICAL: return "CRITICAL";
        default: return "UNKNOWN";
    }
}

int main() {
    // --- Traditional enum ---
    std::cout << "--- Traditional Enum ---\n";
    Color c = RED;
    std::cout << "RED = " << RED << "\n";      // 0
    std::cout << "GREEN = " << GREEN << "\n";  // 1
    std::cout << "BLUE = " << BLUE << "\n";    // 2

    // Implicit conversion to int (can cause bugs!)
    int colorVal = c;  // works with traditional enum
    std::cout << "Color as int: " << colorVal << "\n";

    // HTTP status
    std::cout << "\nHTTP OK = " << OK << "\n";
    std::cout << "HTTP NOT_FOUND = " << NOT_FOUND << "\n";

    // --- Enum class (scoped, type-safe) ---
    std::cout << "\n--- Enum Class ---\n";
    Direction dir = Direction::NORTH;
    // int d = dir;  // ERROR! No implicit conversion

    // Must explicitly cast to get int value
    std::cout << "NORTH = " << static_cast<int>(Direction::NORTH) << "\n";
    std::cout << "Direction: " << directionToString(dir) << "\n";

    // --- Switch with enum ---
    std::cout << "\n--- Switch with Enum ---\n";
    LogLevel level = LogLevel::WARNING;
    std::cout << "Log level: " << logLevelToString(level) << "\n";

    switch (level) {
        case LogLevel::DEBUG:
        case LogLevel::INFO:
            std::cout << "  Normal operation\n";
            break;
        case LogLevel::WARNING:
            std::cout << "  Attention needed!\n";
            break;
        case LogLevel::ERROR:
        case LogLevel::CRITICAL:
            std::cout << "  Action required!\n";
            break;
    }

    // --- Enum with underlying type ---
    std::cout << "\n--- Enum with Underlying Type ---\n";
    auto perm = static_cast<unsigned int>(Permission::READ) |
                static_cast<unsigned int>(Permission::WRITE);
    std::cout << "READ | WRITE = " << perm << "\n";
    std::cout << "Has READ? " << std::boolalpha
              << ((perm & static_cast<unsigned int>(Permission::READ)) != 0) << "\n";

    // --- Iterating enums (need manual range) ---
    std::cout << "\n--- Enum Iteration ---\n";
    for (int d = static_cast<int>(Direction::NORTH);
         d <= static_cast<int>(Direction::WEST); d++) {
        std::cout << "  " << directionToString(static_cast<Direction>(d)) << "\n";
    }

    return 0;
}
