/**
 * LESSON: Loops in C++
 */
#include <iostream>
#include <vector>

int main() {
    // ===== FOR LOOP =====
    std::cout << "--- For Loop ---\n";
    for (int i = 1; i <= 5; i++) {
        std::cout << "Count: " << i << "\n";
    }

    // ===== WHILE LOOP =====
    std::cout << "\n--- While Loop ---\n";
    int n = 5;
    while (n > 0) {
        std::cout << "Countdown: " << n << "\n";
        n--;
    }

    // ===== DO-WHILE LOOP =====
    std::cout << "\n--- Do-While Loop ---\n";
    int num = 1;
    do {
        std::cout << "Number: " << num << "\n";
        num++;
    } while (num <= 3);

    // ===== RANGE-BASED FOR LOOP (C++11) =====
    std::cout << "\n--- Range-Based For ---\n";
    std::vector<std::string> fruits = {"Apple", "Banana", "Cherry", "Mango"};
    for (const auto& fruit : fruits) {
        std::cout << "Fruit: " << fruit << "\n";
    }

    // With arrays
    int numbers[] = {10, 20, 30, 40, 50};
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << "\n";

    // ===== NESTED LOOPS =====
    std::cout << "\n--- Nested Loops (Multiplication Table) ---\n";
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            std::cout << i << "x" << j << "=" << i * j << "\t";
        }
        std::cout << "\n";
    }

    // ===== BREAK =====
    std::cout << "\n--- Break ---\n";
    for (int i = 1; i <= 10; i++) {
        if (i == 5) {
            std::cout << "Breaking at " << i << "\n";
            break;
        }
        std::cout << "i = " << i << "\n";
    }

    // ===== CONTINUE =====
    std::cout << "\n--- Continue (skip even) ---\n";
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) continue;
        std::cout << "Odd: " << i << "\n";
    }

    return 0;
}
