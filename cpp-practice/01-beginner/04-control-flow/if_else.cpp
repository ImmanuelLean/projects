/**
 * LESSON: If-Else Statements
 */
#include <iostream>

int main() {
    // ===== BASIC IF =====
    int age = 18;
    if (age >= 18) {
        std::cout << "You are an adult.\n";
    }

    // ===== IF-ELSE =====
    int score = 45;
    if (score >= 50) {
        std::cout << "You passed!\n";
    } else {
        std::cout << "You failed. Score: " << score << "\n";
    }

    // ===== IF - ELSE IF - ELSE =====
    int mark = 78;
    std::cout << "\nMark: " << mark << "\n";
    if (mark >= 90)      std::cout << "Grade: A\n";
    else if (mark >= 80) std::cout << "Grade: B\n";
    else if (mark >= 70) std::cout << "Grade: C\n";
    else if (mark >= 60) std::cout << "Grade: D\n";
    else                 std::cout << "Grade: F\n";

    // ===== NESTED IF =====
    bool hasLicense = true;
    int driverAge = 20;
    std::cout << "\n--- Nested If ---\n";
    if (driverAge >= 18) {
        if (hasLicense) {
            std::cout << "You can drive!\n";
        } else {
            std::cout << "You need a license first.\n";
        }
    } else {
        std::cout << "Too young to drive.\n";
    }

    // ===== TERNARY OPERATOR =====
    int num = 15;
    std::string result = (num % 2 == 0) ? "Even" : "Odd";
    std::cout << "\n" << num << " is " << result << "\n";

    // ===== IF WITH INITIALIZER (C++17) =====
    std::cout << "\n--- If with Initializer (C++17) ---\n";
    if (int val = 42; val > 0) {
        std::cout << val << " is positive\n";
    }
    // 'val' doesn't exist outside the if block

    return 0;
}
