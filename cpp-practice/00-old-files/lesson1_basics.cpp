// ===========================
// LESSON 1: C++ Basics
// ===========================
#include <iostream>
#include <string>
using namespace std;

int main() {

    // --- 1. Variables & Data Types ---
    string name = "Emmanuel";       // Text
    int age = 25;                   // Whole number
    double height = 5.9;            // Decimal number
    char grade = 'A';               // Single character
    bool is_student = true;         // True/False

    cout << "--- Variables ---" << endl;
    cout << "Name: " << name << endl;
    cout << "Age: " << age << endl;
    cout << "Height: " << height << endl;
    cout << "Grade: " << grade << endl;
    cout << "Student: " << is_student << endl;

    // --- 2. User Input ---
    cout << "\n--- User Input ---" << endl;
    string color;
    cout << "What is your favorite color? ";
    cin >> color;
    cout << "Cool! " << color << " is a great color!" << endl;

    // --- 3. Math Operations ---
    cout << "\n--- Math ---" << endl;
    int a = 10, b = 3;
    cout << a << " + " << b << " = " << a + b << endl;
    cout << a << " - " << b << " = " << a - b << endl;
    cout << a << " * " << b << " = " << a * b << endl;
    cout << a << " / " << b << " = " << a / b << " (integer division)" << endl;
    cout << a << " % " << b << " = " << a % b << " (remainder)" << endl;

    // --- 4. If/Else (Conditions) ---
    cout << "\n--- Conditions ---" << endl;
    int score;
    cout << "Enter your test score (0-100): ";
    cin >> score;

    if (score >= 90) {
        cout << "Grade: A - Excellent!" << endl;
    } else if (score >= 80) {
        cout << "Grade: B - Great job!" << endl;
    } else if (score >= 70) {
        cout << "Grade: C - Good, keep going!" << endl;
    } else if (score >= 60) {
        cout << "Grade: D - You can do better!" << endl;
    } else {
        cout << "Grade: F - Study harder next time!" << endl;
    }

    // --- 5. Loops ---
    cout << "\n--- For Loop ---" << endl;
    for (int i = 1; i <= 5; i++) {
        cout << "Count: " << i << endl;
    }

    cout << "\n--- While Loop ---" << endl;
    int countdown = 5;
    while (countdown > 0) {
        cout << "Countdown: " << countdown << endl;
        countdown--;
    }
    cout << "Liftoff!" << endl;

    // --- 6. Arrays ---
    cout << "\n--- Arrays ---" << endl;
    string fruits[] = {"apple", "banana", "mango", "orange"};
    int size = 4;

    cout << "First fruit: " << fruits[0] << endl;
    cout << "Last fruit: " << fruits[size - 1] << endl;

    cout << "\n--- Loop through array ---" << endl;
    for (int i = 0; i < size; i++) {
        cout << "I like " << fruits[i] << endl;
    }

    cout << "\n--- Lesson 1 Complete! You learned: ---" << endl;
    cout << "- Variables & data types" << endl;
    cout << "- User input (cin)" << endl;
    cout << "- Math operations" << endl;
    cout << "- If/else conditions" << endl;
    cout << "- For & while loops" << endl;
    cout << "- Arrays" << endl;

    return 0;
}
