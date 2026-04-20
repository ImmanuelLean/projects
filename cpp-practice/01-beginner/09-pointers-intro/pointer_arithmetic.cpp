/**
 * LESSON: Pointer Arithmetic
 * Pointers can be incremented, decremented, and compared.
 * Arithmetic is scaled by the size of the pointed-to type.
 *
 * Compile: g++ -std=c++17 -o ptr_arith pointer_arithmetic.cpp
 * Run:     ./ptr_arith
 */
#include <iostream>

int main() {
    // ===== POINTER INCREMENT/DECREMENT =====
    std::cout << "--- Pointer Increment ---\n";
    int arr[] = {10, 20, 30, 40, 50};
    int* ptr = arr;  // points to arr[0]

    std::cout << "*ptr:     " << *ptr << " (arr[0])\n";
    ptr++;  // moves to next int (advances by sizeof(int) bytes)
    std::cout << "*(ptr++): " << *ptr << " (arr[1])\n";
    ptr++;
    std::cout << "*(ptr++): " << *ptr << " (arr[2])\n";

    ptr--;  // go back
    std::cout << "*(ptr--): " << *ptr << " (arr[1] again)\n";

    // ===== POINTER ADDITION/SUBTRACTION =====
    std::cout << "\n--- Pointer Addition ---\n";
    ptr = arr;  // reset to beginning
    std::cout << "*(ptr + 0) = " << *(ptr + 0) << "\n";  // arr[0]
    std::cout << "*(ptr + 1) = " << *(ptr + 1) << "\n";  // arr[1]
    std::cout << "*(ptr + 4) = " << *(ptr + 4) << "\n";  // arr[4]

    // ===== ITERATING WITH POINTERS =====
    std::cout << "\n--- Iterating with Pointers ---\n";
    int* begin = arr;
    int* end = arr + 5;  // one past the last element

    std::cout << "Array: ";
    for (int* p = begin; p != end; p++) {
        std::cout << *p << " ";
    }
    std::cout << "\n";

    // ===== POINTER DIFFERENCE =====
    std::cout << "\n--- Pointer Difference ---\n";
    int* p1 = &arr[0];
    int* p2 = &arr[4];
    std::ptrdiff_t diff = p2 - p1;  // number of elements between
    std::cout << "p2 - p1 = " << diff << " elements\n";

    // ===== ADDRESS DISPLAY =====
    std::cout << "\n--- Addresses (scaled by sizeof) ---\n";
    for (int i = 0; i < 5; i++) {
        std::cout << "  arr[" << i << "] at " << &arr[i]
                  << " = " << arr[i] << "\n";
    }
    std::cout << "  sizeof(int) = " << sizeof(int) << " bytes\n";
    std::cout << "  Each pointer step = " << sizeof(int) << " bytes\n";

    // ===== POINTER TO ARRAYS =====
    std::cout << "\n--- Pointer to Array ---\n";
    // arr and &arr[0] are the same
    std::cout << "arr      = " << arr << "\n";
    std::cout << "&arr[0]  = " << &arr[0] << "\n";
    std::cout << "arr[2]   = " << arr[2] << "\n";
    std::cout << "*(arr+2) = " << *(arr + 2) << " (same!)\n";

    // ===== VOID POINTER =====
    std::cout << "\n--- Void Pointer ---\n";
    int intVal = 42;
    double dblVal = 3.14;

    void* vp;
    vp = &intVal;
    std::cout << "void* -> int: " << *static_cast<int*>(vp) << "\n";
    vp = &dblVal;
    std::cout << "void* -> double: " << *static_cast<double*>(vp) << "\n";
    // void* can point to any type but must be cast before dereferencing

    // ===== NULLPTR =====
    std::cout << "\n--- nullptr ---\n";
    int* nullPtr = nullptr;  // modern C++ null pointer
    if (nullPtr == nullptr) {
        std::cout << "Pointer is null\n";
    }
    // Always check before dereferencing:
    // if (ptr != nullptr) { use *ptr; }

    // ===== POINTER TO DIFFERENT TYPES =====
    std::cout << "\n--- Different Type Sizes ---\n";
    char charArr[] = {'A', 'B', 'C', 'D'};
    double dblArr[] = {1.1, 2.2, 3.3};

    char* cp = charArr;
    double* dp = dblArr;

    std::cout << "char* +1 moves " << sizeof(char) << " byte\n";
    std::cout << "int*  +1 moves " << sizeof(int) << " bytes\n";
    std::cout << "double* +1 moves " << sizeof(double) << " bytes\n";

    // Pointer arithmetic is always scaled by element size
    std::cout << "charArr[0]=" << *cp << ", charArr[1]=" << *(cp + 1) << "\n";
    std::cout << "dblArr[0]=" << *dp << ", dblArr[1]=" << *(dp + 1) << "\n";

    return 0;
}
