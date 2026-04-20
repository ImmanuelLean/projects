/**
 * LESSON: File I/O Basics
 * C++ uses fstream library for file operations.
 * ofstream = write, ifstream = read, fstream = both.
 *
 * Compile: g++ -std=c++17 -o file_io file_io_basics.cpp
 * Run:     ./file_io
 */
#include <iostream>
#include <fstream>   // ofstream, ifstream, fstream
#include <string>
#include <vector>

int main() {
    // ===== WRITING TO A FILE =====
    std::cout << "--- Writing to File ---\n";
    std::ofstream outFile("sample.txt");  // creates or overwrites
    if (outFile.is_open()) {
        outFile << "Line 1: Hello, File I/O!\n";
        outFile << "Line 2: C++ is powerful.\n";
        outFile << "Line 3: Number: " << 42 << "\n";
        outFile << "Line 4: Pi = " << 3.14159 << "\n";
        outFile.close();
        std::cout << "  Written to sample.txt\n";
    } else {
        std::cout << "  ERROR: Could not open file for writing!\n";
    }

    // ===== READING LINE BY LINE =====
    std::cout << "\n--- Reading Line by Line ---\n";
    std::ifstream inFile("sample.txt");
    if (inFile.is_open()) {
        std::string line;
        int lineNum = 1;
        while (std::getline(inFile, line)) {
            std::cout << "  [" << lineNum++ << "] " << line << "\n";
        }
        inFile.close();
    } else {
        std::cout << "  ERROR: Could not open file for reading!\n";
    }

    // ===== READING WORD BY WORD =====
    std::cout << "\n--- Reading Word by Word ---\n";
    std::ifstream wordFile("sample.txt");
    if (wordFile.is_open()) {
        std::string word;
        int count = 0;
        while (wordFile >> word) {
            count++;
        }
        std::cout << "  Total words: " << count << "\n";
        wordFile.close();
    }

    // ===== READING ALL LINES INTO A VECTOR =====
    std::cout << "\n--- Reading into Vector ---\n";
    std::ifstream vecFile("sample.txt");
    std::vector<std::string> lines;
    std::string tempLine;
    while (std::getline(vecFile, tempLine)) {
        lines.push_back(tempLine);
    }
    vecFile.close();
    std::cout << "  Stored " << lines.size() << " lines\n";
    for (const auto& l : lines) {
        std::cout << "  -> " << l << "\n";
    }

    // ===== APPENDING TO A FILE =====
    std::cout << "\n--- Appending to File ---\n";
    std::ofstream appendFile("sample.txt", std::ios::app);  // append mode
    if (appendFile.is_open()) {
        appendFile << "Line 5: Appended line!\n";
        appendFile.close();
        std::cout << "  Appended to sample.txt\n";
    }

    // Verify append
    std::ifstream verifyFile("sample.txt");
    std::string vLine;
    while (std::getline(verifyFile, vLine)) {
        std::cout << "  " << vLine << "\n";
    }
    verifyFile.close();

    // ===== CHECKING FILE STATE =====
    std::cout << "\n--- File State Checks ---\n";
    std::ifstream badFile("nonexistent.txt");
    std::cout << "  is_open(): " << std::boolalpha << badFile.is_open() << "\n";
    std::cout << "  good():    " << badFile.good() << "\n";
    std::cout << "  fail():    " << badFile.fail() << "\n";
    badFile.close();

    // ===== BINARY FILE I/O =====
    std::cout << "\n--- Binary File I/O ---\n";
    // Write binary
    int numbers[] = {10, 20, 30, 40, 50};
    std::ofstream binOut("data.bin", std::ios::binary);
    binOut.write(reinterpret_cast<char*>(numbers), sizeof(numbers));
    binOut.close();
    std::cout << "  Wrote 5 ints to data.bin\n";

    // Read binary
    int readNums[5];
    std::ifstream binIn("data.bin", std::ios::binary);
    binIn.read(reinterpret_cast<char*>(readNums), sizeof(readNums));
    binIn.close();
    std::cout << "  Read back: ";
    for (int n : readNums) std::cout << n << " ";
    std::cout << "\n";

    // ===== fstream (read AND write) =====
    std::cout << "\n--- fstream (read/write) ---\n";
    std::fstream rw("rw_test.txt", std::ios::out);
    rw << "Test data\n";
    rw.close();

    rw.open("rw_test.txt", std::ios::in);
    std::string content;
    std::getline(rw, content);
    std::cout << "  Read: " << content << "\n";
    rw.close();

    // Cleanup temp files
    std::remove("sample.txt");
    std::remove("data.bin");
    std::remove("rw_test.txt");
    std::cout << "\n  Cleaned up temp files.\n";

    return 0;
}
