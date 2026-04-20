/**
 * LESSON: File I/O
 * Reading from and writing to files using fstream.
 */
#include <iostream>
#include <fstream>    // ifstream, ofstream, fstream
#include <string>
#include <vector>
#include <sstream>
#include <filesystem> // C++17

int main() {
    // ===== WRITING TO FILE =====
    std::cout << "--- Writing to File ---\n";
    {
        std::ofstream outFile("sample.txt");
        if (outFile.is_open()) {
            outFile << "Line 1: Hello, File I/O!\n";
            outFile << "Line 2: C++ makes file handling easy.\n";
            outFile << "Line 3: This is the last line.\n";
            std::cout << "File written successfully!\n";
        } else {
            std::cout << "Error opening file for writing\n";
        }
        // File automatically closed when outFile goes out of scope
    }

    // ===== READING ENTIRE FILE =====
    std::cout << "\n--- Reading Line by Line ---\n";
    {
        std::ifstream inFile("sample.txt");
        if (inFile.is_open()) {
            std::string line;
            while (std::getline(inFile, line)) {
                std::cout << line << "\n";
            }
        }
    }

    // ===== APPEND MODE =====
    std::cout << "\n--- Appending ---\n";
    {
        std::ofstream appendFile("sample.txt", std::ios::app);
        appendFile << "Line 4: Appended line!\n";
        std::cout << "Line appended!\n";
    }

    // ===== READ ENTIRE FILE INTO STRING =====
    std::cout << "\n--- Read Entire File ---\n";
    {
        std::ifstream file("sample.txt");
        std::string content((std::istreambuf_iterator<char>(file)),
                             std::istreambuf_iterator<char>());
        std::cout << "File size: " << content.size() << " chars\n";
    }

    // ===== WRITE/READ STRUCTURED DATA =====
    std::cout << "\n--- Structured Data (CSV) ---\n";
    {
        // Write CSV
        std::ofstream csv("students.csv");
        csv << "Name,Age,GPA\n";
        csv << "Emmanuel,20,3.8\n";
        csv << "Alice,22,3.5\n";
        csv << "Bob,21,3.2\n";
        std::cout << "CSV written!\n";
    }

    {
        // Read CSV
        std::ifstream csv("students.csv");
        std::string line;
        std::getline(csv, line); // skip header
        std::cout << "Students:\n";

        while (std::getline(csv, line)) {
            std::stringstream ss(line);
            std::string name, ageStr, gpaStr;
            std::getline(ss, name, ',');
            std::getline(ss, ageStr, ',');
            std::getline(ss, gpaStr, ',');
            std::cout << "  " << name << " (age " << ageStr << ", GPA " << gpaStr << ")\n";
        }
    }

    // ===== BINARY FILE I/O =====
    std::cout << "\n--- Binary I/O ---\n";
    {
        int numbers[] = {10, 20, 30, 40, 50};
        std::ofstream binOut("data.bin", std::ios::binary);
        binOut.write(reinterpret_cast<char*>(numbers), sizeof(numbers));
        std::cout << "Binary data written!\n";
    }

    {
        int loaded[5];
        std::ifstream binIn("data.bin", std::ios::binary);
        binIn.read(reinterpret_cast<char*>(loaded), sizeof(loaded));
        std::cout << "Binary data read: ";
        for (int n : loaded) std::cout << n << " ";
        std::cout << "\n";
    }

    // ===== FILESYSTEM (C++17) =====
    std::cout << "\n--- Filesystem ---\n";
    namespace fs = std::filesystem;
    std::cout << "sample.txt exists? " << std::boolalpha << fs::exists("sample.txt") << "\n";
    std::cout << "sample.txt size: " << fs::file_size("sample.txt") << " bytes\n";

    // Cleanup
    fs::remove("sample.txt");
    fs::remove("students.csv");
    fs::remove("data.bin");
    std::cout << "Temp files cleaned up.\n";

    return 0;
}
