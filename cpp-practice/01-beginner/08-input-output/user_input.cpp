/**
 * LESSON: User Input with cin and getline
 */
#include <iostream>
#include <string>
#include <limits> // numeric_limits

int main() {
    // ===== BASIC INPUT =====
    std::cout << "--- Basic Input ---\n";

    std::cout << "Enter your name (one word): ";
    std::string firstName;
    std::cin >> firstName; // reads one word (stops at whitespace)
    std::cout << "Hello, " << firstName << "!\n";

    // ===== GETLINE (read entire line) =====
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // clear leftover newline

    std::cout << "\nEnter your full name: ";
    std::string fullName;
    std::getline(std::cin, fullName); // reads entire line including spaces
    std::cout << "Full name: " << fullName << "\n";

    // ===== READING NUMBERS =====
    std::cout << "\nEnter your age: ";
    int age;
    std::cin >> age;

    std::cout << "Enter your GPA: ";
    double gpa;
    std::cin >> gpa;

    std::cout << "Age: " << age << ", GPA: " << gpa << "\n";

    // ===== IMPORTANT: cin >> leaves newline in buffer =====
    // After cin >>, always do cin.ignore() before getline()
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

    std::cout << "\nEnter your city: ";
    std::string city;
    std::getline(std::cin, city);
    std::cout << "City: " << city << "\n";

    // ===== INPUT VALIDATION =====
    std::cout << "\n--- Input Validation ---\n";
    int number;
    std::cout << "Enter a number: ";
    while (!(std::cin >> number)) {
        std::cout << "Invalid input! Try again: ";
        std::cin.clear(); // clear error flag
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // discard bad input
    }
    std::cout << "You entered: " << number << "\n";

    // ===== FORMATTED OUTPUT =====
    std::cout << "\n--- Formatted Output ---\n";
    double pi = 3.14159265;

    // printf style
    printf("printf: %.2f\n", pi);

    // cout with iomanip
    std::cout << std::fixed;
    std::cout.precision(2);
    std::cout << "cout fixed: " << pi << "\n";

    return 0;
}
