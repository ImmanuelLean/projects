/**
 * LESSON: Your First C++ Program
 * Every C++ program needs a main() function as the entry point.
 * #include brings in library headers.
 *
 * Compile: g++ -o hello hello_world.cpp
 * Run:     ./hello
 */
#include <iostream>  // for cout, cin, endl

int main() {
    // cout (character output) prints to the console
    // << is the insertion operator
    std::cout << "Hello, World!" << std::endl;

    // endl flushes the buffer and adds newline
    // '\n' is faster (no flush) and usually preferred
    std::cout << "Using endl" << std::endl;
    std::cout << "Using \\n\n";

    // Printing multiple values
    std::string name = "Emmanuel";
    int age = 20;
    std::cout << "Name: " << name << ", Age: " << age << "\n";

    // printf-style formatting (from C)
    printf("Formatted: %s is %d years old\n", name.c_str(), age);

    // return 0 means the program ran successfully
    return 0;
}
