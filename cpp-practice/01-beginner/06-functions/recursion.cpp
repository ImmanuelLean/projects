/**
 * LESSON: Recursion
 * A function that calls itself. Needs a BASE CASE to stop.
 */
#include <iostream>
#include <string>

// Factorial: n! = n × (n-1)!
long long factorial(int n) {
    if (n <= 1) return 1;          // base case
    return n * factorial(n - 1);   // recursive case
}

// Fibonacci: F(n) = F(n-1) + F(n-2)
int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Sum of digits: 1234 -> 1+2+3+4 = 10
int sumOfDigits(int n) {
    if (n == 0) return 0;
    return (n % 10) + sumOfDigits(n / 10);
}

// Power: base^exponent
long long power(int base, int exp) {
    if (exp == 0) return 1;
    return base * power(base, exp - 1);
}

// Reverse a string
std::string reverseStr(const std::string& s) {
    if (s.length() <= 1) return s;
    return reverseStr(s.substr(1)) + s[0];
}

int main() {
    std::cout << "--- Factorial ---\n";
    for (int i = 0; i <= 7; i++) {
        std::cout << i << "! = " << factorial(i) << "\n";
    }

    std::cout << "\n--- Fibonacci ---\n";
    std::cout << "First 10: ";
    for (int i = 0; i < 10; i++) {
        std::cout << fibonacci(i) << " ";
    }
    std::cout << "\n";

    std::cout << "\n--- Sum of Digits ---\n";
    std::cout << "1234 -> " << sumOfDigits(1234) << "\n";
    std::cout << "9876 -> " << sumOfDigits(9876) << "\n";

    std::cout << "\n--- Power ---\n";
    std::cout << "2^10 = " << power(2, 10) << "\n";
    std::cout << "3^4 = " << power(3, 4) << "\n";

    std::cout << "\n--- Reverse String ---\n";
    std::cout << "hello -> " << reverseStr("hello") << "\n";
    std::cout << "C++ -> " << reverseStr("C++") << "\n";

    return 0;
}
