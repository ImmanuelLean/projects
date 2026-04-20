/**
 * LESSON: Comments in C++
 * Comments are ignored by the compiler and help explain code.
 */
#include <iostream>

int main() {
    // This is a single-line comment

    /*
     * This is a multi-line comment.
     * It can span multiple lines.
     * Useful for longer explanations.
     */

    /**
     * This is a documentation comment (Doxygen style).
     * @brief Demonstrates comments in C++.
     * @param None
     * @return 0 on success
     */

    std::cout << "Comments help make code readable!\n";

    // TIP: Use comments to explain WHY, not WHAT
    // Bad:  i++; // increment i by 1
    // Good: i++; // move to the next student in the list

    return 0;
}
