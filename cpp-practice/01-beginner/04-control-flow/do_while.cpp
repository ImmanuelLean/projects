/**
 * LESSON: Do-While Loop
 * The do-while loop executes the body AT LEAST ONCE before checking the condition.
 * Useful for input validation and menu-driven programs.
 *
 * Compile: g++ -std=c++17 -o do_while do_while.cpp
 * Run:     ./do_while
 */
#include <iostream>

int main() {
    // ===== BASIC DO-WHILE =====
    std::cout << "--- Basic Do-While ---\n";
    int count = 1;
    do {
        std::cout << "Count: " << count << "\n";
        count++;
    } while (count <= 5);

    // ===== DIFFERENCE FROM WHILE =====
    std::cout << "\n--- Do-While vs While (condition false from start) ---\n";

    // while: body never executes if condition is false
    int x = 10;
    while (x < 5) {
        std::cout << "while: " << x << "\n";  // never prints
    }
    std::cout << "while loop: skipped entirely\n";

    // do-while: body executes once even if condition is false
    x = 10;
    do {
        std::cout << "do-while: " << x << " (runs once!)\n";
    } while (x < 5);

    // ===== SUMMING NUMBERS =====
    std::cout << "\n--- Sum Until Zero ---\n";
    int sum = 0;
    int numbers[] = {5, 3, 8, 2, 0, 7};  // simulate input
    int idx = 0;
    do {
        sum += numbers[idx];
        std::cout << "Added " << numbers[idx] << ", sum = " << sum << "\n";
        idx++;
    } while (numbers[idx - 1] != 0 && idx < 6);
    std::cout << "Final sum: " << sum << "\n";

    // ===== MENU-DRIVEN PROGRAM (simulated) =====
    std::cout << "\n--- Menu-Driven Program (simulated) ---\n";
    int choices[] = {1, 2, 3};  // simulate user choosing 1, 2, then 3 (exit)
    int choiceIdx = 0;
    int choice;

    do {
        std::cout << "\n=== MENU ===\n";
        std::cout << "1. Say Hello\n";
        std::cout << "2. Show Date\n";
        std::cout << "3. Exit\n";

        choice = choices[choiceIdx++];
        std::cout << "Choice: " << choice << "\n";

        switch (choice) {
            case 1:
                std::cout << "Hello, Emmanuel!\n";
                break;
            case 2:
                std::cout << "Today is a great day!\n";
                break;
            case 3:
                std::cout << "Goodbye!\n";
                break;
            default:
                std::cout << "Invalid choice!\n";
        }
    } while (choice != 3 && choiceIdx < 3);

    // ===== INPUT VALIDATION PATTERN =====
    std::cout << "\n--- Input Validation Pattern ---\n";
    // Simulating: keep asking until valid input (1-10)
    int inputs[] = {-5, 0, 15, 7};  // simulate bad, bad, bad, good
    int inputIdx = 0;
    int value;

    do {
        value = inputs[inputIdx++];
        std::cout << "Input: " << value;
        if (value < 1 || value > 10) {
            std::cout << " (invalid, must be 1-10)\n";
        }
    } while ((value < 1 || value > 10) && inputIdx < 4);
    std::cout << " (valid!)\n";

    // ===== REVERSE DIGITS =====
    std::cout << "\n--- Reverse Digits ---\n";
    int number = 12345;
    int original = number;
    std::cout << "Original: " << number << "\n";
    std::cout << "Reversed: ";
    do {
        std::cout << (number % 10);
        number /= 10;
    } while (number > 0);
    std::cout << "\n";

    return 0;
}
