/**
 * LESSON: Error Handling Patterns
 * C++ offers multiple approaches: exceptions, error codes, std::optional.
 * Each has trade-offs in performance, readability, and safety.
 *
 * Compile: g++ -std=c++17 -o error_patterns error_handling_patterns.cpp
 * Run:     ./error_patterns
 */
#include <iostream>
#include <optional>   // C++17
#include <string>
#include <variant>    // C++17 (for expected-like pattern)
#include <vector>
#include <fstream>
#include <memory>

// ===== PATTERN 1: ERROR CODES (C-style) =====
enum class ErrorCode { OK, NOT_FOUND, INVALID_INPUT, PERMISSION_DENIED };

ErrorCode findUserAge(int userId, int& outAge) {
    if (userId < 0) return ErrorCode::INVALID_INPUT;
    if (userId > 100) return ErrorCode::NOT_FOUND;
    outAge = 20 + (userId % 30);
    return ErrorCode::OK;
}

// ===== PATTERN 2: std::optional (may-fail operations) =====
std::optional<double> safeDivide(double a, double b) {
    if (b == 0.0) return std::nullopt;  // no value
    return a / b;                        // has value
}

std::optional<std::string> findConfig(const std::string& key) {
    if (key == "host") return "localhost";
    if (key == "port") return "8080";
    return std::nullopt;
}

// ===== PATTERN 3: std::variant as Expected<T, E> =====
// (C++23 has std::expected, we simulate it with variant)
template<typename T, typename E>
using Expected = std::variant<T, E>;

struct ParseError {
    std::string message;
    int position;
};

Expected<int, ParseError> parseInt(const std::string& str) {
    try {
        size_t pos;
        int result = std::stoi(str, &pos);
        if (pos != str.size()) {
            return ParseError{"Trailing characters", static_cast<int>(pos)};
        }
        return result;
    } catch (...) {
        return ParseError{"Invalid number", 0};
    }
}

// ===== PATTERN 4: RAII FOR EXCEPTION SAFETY =====
class FileWriter {
    std::ofstream file;
    std::string filename;
public:
    FileWriter(const std::string& fname) : filename(fname) {
        file.open(fname);
        if (!file.is_open()) throw std::runtime_error("Cannot open: " + fname);
        std::cout << "  [File opened: " << fname << "]\n";
    }

    void write(const std::string& data) {
        file << data;
    }

    // Destructor automatically closes file - even if exception is thrown!
    ~FileWriter() {
        if (file.is_open()) {
            file.close();
            std::cout << "  [File closed: " << filename << "]\n";
            std::remove(filename.c_str());
        }
    }
};

// ===== EXCEPTION GUARANTEES =====
class SafeVector {
    std::vector<int> data;
public:
    // BASIC guarantee: valid state after exception, but may be different
    void addBasic(int val) {
        data.push_back(val);  // may throw bad_alloc
    }

    // STRONG guarantee: if exception, state is unchanged (rollback)
    void addStrong(int val) {
        std::vector<int> copy = data;  // copy first
        copy.push_back(val);           // modify copy
        std::swap(data, copy);         // swap (noexcept)
    }

    // NOTHROW guarantee: will never throw
    int getSize() const noexcept {
        return static_cast<int>(data.size());
    }

    void display() const {
        for (int n : data) std::cout << n << " ";
        std::cout << "\n";
    }
};

int main() {
    // --- Error codes ---
    std::cout << "--- Pattern 1: Error Codes ---\n";
    int age;
    ErrorCode err = findUserAge(5, age);
    if (err == ErrorCode::OK) {
        std::cout << "  User age: " << age << "\n";
    }

    err = findUserAge(999, age);
    if (err == ErrorCode::NOT_FOUND) {
        std::cout << "  User not found\n";
    }

    // --- std::optional ---
    std::cout << "\n--- Pattern 2: std::optional ---\n";
    auto result = safeDivide(10.0, 3.0);
    if (result.has_value()) {
        std::cout << "  10 / 3 = " << result.value() << "\n";
    }

    auto bad = safeDivide(10.0, 0.0);
    std::cout << "  10 / 0 = " << bad.value_or(-1.0) << " (default)\n";

    // Using with value_or
    std::cout << "  host: " << findConfig("host").value_or("N/A") << "\n";
    std::cout << "  db:   " << findConfig("db").value_or("N/A") << "\n";

    // --- Expected pattern (variant) ---
    std::cout << "\n--- Pattern 3: Expected (variant) ---\n";
    auto parsed1 = parseInt("42");
    if (auto* val = std::get_if<int>(&parsed1)) {
        std::cout << "  Parsed: " << *val << "\n";
    }

    auto parsed2 = parseInt("12abc");
    if (auto* error = std::get_if<ParseError>(&parsed2)) {
        std::cout << "  Error: " << error->message << " at pos " << error->position << "\n";
    }

    auto parsed3 = parseInt("hello");
    if (auto* error = std::get_if<ParseError>(&parsed3)) {
        std::cout << "  Error: " << error->message << "\n";
    }

    // --- RAII ---
    std::cout << "\n--- Pattern 4: RAII ---\n";
    try {
        FileWriter writer("temp_test.txt");
        writer.write("Hello RAII!\n");
        // Even if exception thrown here, file is closed by destructor
    } catch (const std::exception& e) {
        std::cout << "  Error: " << e.what() << "\n";
    }

    // --- Exception guarantees ---
    std::cout << "\n--- Exception Guarantees ---\n";
    std::cout << "  Basic:   State valid but may differ after exception\n";
    std::cout << "  Strong:  State unchanged if exception (rollback)\n";
    std::cout << "  Nothrow: Never throws (noexcept)\n";

    // --- When to use which ---
    std::cout << "\n--- When to Use Which ---\n";
    std::cout << "  Exceptions:   Truly exceptional errors, constructors\n";
    std::cout << "  Error codes:  Performance-critical, C interop\n";
    std::cout << "  optional:     May-return-nothing operations\n";
    std::cout << "  expected:     Rich error info without exceptions (C++23)\n";

    return 0;
}
