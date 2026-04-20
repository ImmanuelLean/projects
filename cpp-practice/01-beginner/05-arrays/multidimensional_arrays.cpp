/**
 * LESSON: Multidimensional Arrays
 * Arrays can have 2 or more dimensions - useful for grids, matrices, tables.
 *
 * Compile: g++ -std=c++17 -o multidim multidimensional_arrays.cpp
 * Run:     ./multidim
 */
#include <iostream>
#include <vector>
#include <iomanip>  // for setw

int main() {
    // ===== 2D ARRAY DECLARATION =====
    std::cout << "--- 2D Array Declaration ---\n";

    // Method 1: Fully specified
    int matrix[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };

    // Method 2: Partial initialization (rest are 0)
    int sparse[3][3] = {{1}, {0, 2}, {0, 0, 3}};

    // Method 3: All zeros
    int zeros[2][2] = {};

    // ===== ACCESSING ELEMENTS =====
    std::cout << "\n--- Accessing Elements ---\n";
    std::cout << "matrix[0][0] = " << matrix[0][0] << "\n";  // 1
    std::cout << "matrix[1][2] = " << matrix[1][2] << "\n";  // 7
    std::cout << "matrix[2][3] = " << matrix[2][3] << "\n";  // 12

    // Modify element
    matrix[0][0] = 99;
    std::cout << "After matrix[0][0] = 99: " << matrix[0][0] << "\n";
    matrix[0][0] = 1;  // restore

    // ===== LOOPING THROUGH 2D ARRAY =====
    std::cout << "\n--- Print 2D Array ---\n";
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            std::cout << std::setw(4) << matrix[i][j];
        }
        std::cout << "\n";
    }

    // Range-based for with 2D array
    std::cout << "\n--- Range-Based For ---\n";
    for (const auto& row : matrix) {
        for (int elem : row) {
            std::cout << std::setw(4) << elem;
        }
        std::cout << "\n";
    }

    // ===== 2D VECTORS (dynamic, preferred in modern C++) =====
    std::cout << "\n--- 2D Vectors ---\n";
    std::vector<std::vector<int>> grid = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    // Add a row
    grid.push_back({10, 11, 12});

    // Add element to a row
    grid[0].push_back(99);

    std::cout << "Rows: " << grid.size() << "\n";
    for (const auto& row : grid) {
        for (int val : row) {
            std::cout << std::setw(4) << val;
        }
        std::cout << "\n";
    }

    // Create NxM grid filled with zeros
    int N = 3, M = 4;
    std::vector<std::vector<int>> table(N, std::vector<int>(M, 0));
    table[1][2] = 42;
    std::cout << "\n3x4 grid (one element set to 42):\n";
    for (const auto& row : table) {
        for (int val : row) std::cout << std::setw(4) << val;
        std::cout << "\n";
    }

    // ===== MATRIX OPERATIONS =====
    std::cout << "\n--- Matrix Addition ---\n";
    std::vector<std::vector<int>> A = {{1, 2}, {3, 4}};
    std::vector<std::vector<int>> B = {{5, 6}, {7, 8}};
    std::vector<std::vector<int>> C(2, std::vector<int>(2));

    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2; j++)
            C[i][j] = A[i][j] + B[i][j];

    for (const auto& row : C) {
        for (int v : row) std::cout << std::setw(4) << v;
        std::cout << "\n";
    }

    // ===== MATRIX TRANSPOSE =====
    std::cout << "\n--- Matrix Transpose ---\n";
    std::vector<std::vector<int>> original = {{1, 2, 3}, {4, 5, 6}};  // 2x3
    int rows = original.size(), cols = original[0].size();
    std::vector<std::vector<int>> transposed(cols, std::vector<int>(rows));

    for (int i = 0; i < rows; i++)
        for (int j = 0; j < cols; j++)
            transposed[j][i] = original[i][j];

    std::cout << "Original (2x3):\n";
    for (const auto& row : original) {
        for (int v : row) std::cout << std::setw(4) << v;
        std::cout << "\n";
    }
    std::cout << "Transposed (3x2):\n";
    for (const auto& row : transposed) {
        for (int v : row) std::cout << std::setw(4) << v;
        std::cout << "\n";
    }

    // ===== 3D ARRAY =====
    std::cout << "\n--- 3D Array ---\n";
    int cube[2][2][2] = {{{1, 2}, {3, 4}}, {{5, 6}, {7, 8}}};
    for (int i = 0; i < 2; i++) {
        std::cout << "Layer " << i << ":\n";
        for (int j = 0; j < 2; j++) {
            for (int k = 0; k < 2; k++)
                std::cout << std::setw(4) << cube[i][j][k];
            std::cout << "\n";
        }
    }

    return 0;
}
