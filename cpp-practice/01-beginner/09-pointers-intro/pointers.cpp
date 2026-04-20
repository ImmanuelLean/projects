/**
 * LESSON: Pointers
 * A pointer stores the MEMORY ADDRESS of another variable.
 * Fundamental to C++ - used for dynamic memory, arrays, and more.
 *
 * &  = address-of operator (get address)
 * *  = dereference operator (access value at address)
 */
#include <iostream>

int main() {
    // ===== BASIC POINTERS =====
    std::cout << "--- Basic Pointers ---\n";
    int value = 42;
    int* ptr = &value; // ptr stores the address of value

    std::cout << "value:  " << value << "\n";
    std::cout << "&value: " << &value << "\n";     // address of value
    std::cout << "ptr:    " << ptr << "\n";         // same address
    std::cout << "*ptr:   " << *ptr << "\n";        // dereference: get value at address

    // Modify through pointer
    *ptr = 100;
    std::cout << "\nAfter *ptr = 100:\n";
    std::cout << "value: " << value << "\n"; // 100

    // ===== NULL POINTER =====
    std::cout << "\n--- Null Pointer ---\n";
    int* nullPtr = nullptr; // C++11 null pointer (safer than NULL)
    if (nullPtr == nullptr) {
        std::cout << "Pointer is null\n";
    }
    // *nullPtr = 5; // CRASH! Never dereference null pointer

    // ===== POINTER ARITHMETIC =====
    std::cout << "\n--- Pointer Arithmetic ---\n";
    int arr[] = {10, 20, 30, 40, 50};
    int* p = arr; // pointer to first element

    for (int i = 0; i < 5; i++) {
        std::cout << "*(p + " << i << ") = " << *(p + i) << "\n";
    }

    // ===== POINTERS AND ARRAYS =====
    std::cout << "\n--- Pointers & Arrays ---\n";
    // Array name IS a pointer to its first element
    std::cout << "arr[0] = " << arr[0] << "\n";
    std::cout << "*arr   = " << *arr << "\n";     // same as arr[0]
    std::cout << "arr[2] = " << arr[2] << "\n";
    std::cout << "*(arr+2) = " << *(arr + 2) << "\n"; // same as arr[2]

    // ===== DYNAMIC MEMORY (new / delete) =====
    std::cout << "\n--- Dynamic Memory ---\n";

    // Single variable
    int* dynInt = new int(42);      // allocate on heap
    std::cout << "Dynamic int: " << *dynInt << "\n";
    delete dynInt;                   // free memory!
    dynInt = nullptr;                // good practice

    // Dynamic array
    int size = 5;
    int* dynArr = new int[size]{10, 20, 30, 40, 50};
    std::cout << "Dynamic array: ";
    for (int i = 0; i < size; i++) {
        std::cout << dynArr[i] << " ";
    }
    std::cout << "\n";
    delete[] dynArr; // free array memory (note the [])

    // ===== POINTER TO POINTER =====
    std::cout << "\n--- Pointer to Pointer ---\n";
    int x = 42;
    int* px = &x;
    int** ppx = &px;

    std::cout << "x = " << x << "\n";
    std::cout << "*px = " << *px << "\n";
    std::cout << "**ppx = " << **ppx << "\n"; // double dereference

    // ===== VOID POINTER =====
    std::cout << "\n--- Void Pointer ---\n";
    int num = 10;
    double dbl = 3.14;
    void* vptr;

    vptr = &num;
    std::cout << "void* to int: " << *(static_cast<int*>(vptr)) << "\n";

    vptr = &dbl;
    std::cout << "void* to double: " << *(static_cast<double*>(vptr)) << "\n";

    return 0;
}
