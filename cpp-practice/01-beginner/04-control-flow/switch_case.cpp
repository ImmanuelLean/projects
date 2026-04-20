/**
 * LESSON: Switch Statement
 */
#include <iostream>
#include <string>

int main() {
    // ===== TRADITIONAL SWITCH =====
    int day = 3;
    std::cout << "Day number: " << day << "\n";
    switch (day) {
        case 1: std::cout << "Monday\n"; break;
        case 2: std::cout << "Tuesday\n"; break;
        case 3: std::cout << "Wednesday\n"; break;
        case 4: std::cout << "Thursday\n"; break;
        case 5: std::cout << "Friday\n"; break;
        case 6:
        case 7:
            std::cout << "Weekend!\n"; break;
        default:
            std::cout << "Invalid day\n";
    }

    // ===== SWITCH WITH ENUM =====
    std::cout << "\n--- Switch with Enum ---\n";
    enum class Color { RED, GREEN, BLUE };
    Color c = Color::GREEN;

    switch (c) {
        case Color::RED:   std::cout << "Red\n"; break;
        case Color::GREEN: std::cout << "Green\n"; break;
        case Color::BLUE:  std::cout << "Blue\n"; break;
    }

    // ===== FALLTHROUGH (intentional) =====
    std::cout << "\n--- Fallthrough ---\n";
    int month = 2;
    switch (month) {
        case 1: case 3: case 5: case 7: case 8: case 10: case 12:
            std::cout << "31 days\n"; break;
        case 4: case 6: case 9: case 11:
            std::cout << "30 days\n"; break;
        case 2:
            std::cout << "28 or 29 days\n"; break;
    }

    // ===== SWITCH WITH INIT (C++17) =====
    std::cout << "\n--- Switch with Init (C++17) ---\n";
    switch (int val = 42 % 3; val) {
        case 0: std::cout << "Divisible by 3\n"; break;
        case 1: std::cout << "Remainder 1\n"; break;
        case 2: std::cout << "Remainder 2\n"; break;
    }

    return 0;
}
