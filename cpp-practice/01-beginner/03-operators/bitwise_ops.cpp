/**
 * LESSON: Bitwise Operators
 * Bitwise operators work directly on the binary representation of integers.
 * Essential for low-level programming, flags, and optimization tricks.
 *
 * Compile: g++ -std=c++17 -o bitwise_ops bitwise_ops.cpp
 * Run:     ./bitwise_ops
 */
#include <iostream>
#include <bitset>  // for binary display

int main() {
    // ===== BASIC BITWISE OPERATORS =====
    std::cout << "--- Basic Bitwise Operators ---\n";
    unsigned int a = 0b1100;  // 12 in binary: 1100
    unsigned int b = 0b1010;  // 10 in binary: 1010

    std::cout << "a        = " << std::bitset<4>(a) << " (" << a << ")\n";
    std::cout << "b        = " << std::bitset<4>(b) << " (" << b << ")\n";

    // AND (&) - both bits must be 1
    std::cout << "a & b    = " << std::bitset<4>(a & b) << " (" << (a & b) << ")\n";

    // OR (|) - at least one bit must be 1
    std::cout << "a | b    = " << std::bitset<4>(a | b) << " (" << (a | b) << ")\n";

    // XOR (^) - bits must differ
    std::cout << "a ^ b    = " << std::bitset<4>(a ^ b) << " (" << (a ^ b) << ")\n";

    // NOT (~) - flip all bits
    unsigned char c = 0b00001111;
    std::cout << "~c       = " << std::bitset<8>(static_cast<unsigned char>(~c))
              << " (" << static_cast<int>(static_cast<unsigned char>(~c)) << ")\n";

    // ===== SHIFT OPERATORS =====
    std::cout << "\n--- Shift Operators ---\n";
    unsigned int val = 1;  // 0001

    // Left shift (<<) - multiply by 2^n
    std::cout << "1 << 1 = " << (val << 1) << " (multiply by 2)\n";
    std::cout << "1 << 3 = " << (val << 3) << " (multiply by 8)\n";
    std::cout << "5 << 2 = " << (5 << 2) << " (5 * 4 = 20)\n";

    // Right shift (>>) - divide by 2^n
    unsigned int big = 16;
    std::cout << "16 >> 1 = " << (big >> 1) << " (divide by 2)\n";
    std::cout << "16 >> 3 = " << (big >> 3) << " (divide by 8)\n";

    // ===== PRACTICAL: CHECK ODD/EVEN =====
    std::cout << "\n--- Check Odd/Even ---\n";
    for (int n = 0; n <= 5; n++) {
        // Last bit is 1 for odd, 0 for even
        std::cout << n << " is " << ((n & 1) ? "odd" : "even") << "\n";
    }

    // ===== PRACTICAL: SWAP WITHOUT TEMP =====
    std::cout << "\n--- Swap with XOR ---\n";
    int x = 15, y = 27;
    std::cout << "Before: x=" << x << ", y=" << y << "\n";
    x ^= y;  // x = x ^ y
    y ^= x;  // y = y ^ (x ^ y) = original x
    x ^= y;  // x = (x ^ y) ^ original x = original y
    std::cout << "After:  x=" << x << ", y=" << y << "\n";

    // ===== PRACTICAL: BIT FLAGS =====
    std::cout << "\n--- Bit Flags ---\n";
    const unsigned int READ    = 1 << 0;  // 0001 = 1
    const unsigned int WRITE   = 1 << 1;  // 0010 = 2
    const unsigned int EXECUTE = 1 << 2;  // 0100 = 4

    unsigned int permissions = 0;

    // Set flags
    permissions |= READ;              // turn on READ
    permissions |= WRITE;             // turn on WRITE
    std::cout << "Permissions: " << std::bitset<4>(permissions) << "\n";

    // Check flag
    if (permissions & READ)  std::cout << "  Has READ\n";
    if (permissions & WRITE) std::cout << "  Has WRITE\n";
    if (!(permissions & EXECUTE)) std::cout << "  No EXECUTE\n";

    // Clear a flag
    permissions &= ~WRITE;  // turn off WRITE
    std::cout << "After removing WRITE: " << std::bitset<4>(permissions) << "\n";

    // Toggle a flag
    permissions ^= EXECUTE;  // flip EXECUTE on
    std::cout << "After toggling EXECUTE: " << std::bitset<4>(permissions) << "\n";

    // ===== PRACTICAL: MASKING =====
    std::cout << "\n--- Bit Masking ---\n";
    unsigned int rgb = 0xFF5733;  // RGB color
    unsigned int red   = (rgb >> 16) & 0xFF;
    unsigned int green = (rgb >> 8) & 0xFF;
    unsigned int blue  = rgb & 0xFF;
    std::cout << "Color 0xFF5733 -> R=" << red << " G=" << green << " B=" << blue << "\n";

    // ===== POWER OF 2 CHECK =====
    std::cout << "\n--- Power of 2 Check ---\n";
    for (int n : {1, 2, 3, 4, 5, 8, 16, 15}) {
        bool isPow2 = (n > 0) && ((n & (n - 1)) == 0);
        std::cout << n << " is " << (isPow2 ? "" : "NOT ") << "a power of 2\n";
    }

    return 0;
}
