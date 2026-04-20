/**
 * LESSON: Structured Bindings (C++17)
 * Decompose objects into individual named variables.
 * Works with pairs, tuples, arrays, and structs.
 *
 * Compile: g++ -std=c++17 -o struct_bind structured_bindings.cpp
 * Run:     ./struct_bind
 */
#include <iostream>
#include <tuple>
#include <map>
#include <string>
#include <vector>
#include <array>

// ===== FUNCTION RETURNING MULTIPLE VALUES =====
struct Result {
    bool success;
    std::string message;
    int code;
};

Result processRequest(int id) {
    if (id > 0) return {true, "OK", 200};
    return {false, "Not Found", 404};
}

std::tuple<double, double, double> getStats(const std::vector<int>& data) {
    double sum = 0, min = data[0], max = data[0];
    for (int v : data) {
        sum += v;
        if (v < min) min = v;
        if (v > max) max = v;
    }
    return {sum / data.size(), min, max};
}

std::pair<bool, std::string> validate(const std::string& email) {
    if (email.find('@') != std::string::npos)
        return {true, "Valid"};
    return {false, "Missing @"};
}

int main() {
    // ===== WITH PAIRS =====
    std::cout << "--- With Pairs ---\n";
    auto [valid, message] = validate("test@email.com");
    std::cout << "Valid: " << std::boolalpha << valid << ", " << message << "\n";

    auto [valid2, msg2] = validate("bad-email");
    std::cout << "Valid: " << valid2 << ", " << msg2 << "\n";

    // ===== WITH TUPLES =====
    std::cout << "\n--- With Tuples ---\n";
    std::vector<int> data = {5, 2, 8, 1, 9, 3, 7};
    auto [avg, min, max] = getStats(data);
    std::cout << "Avg: " << avg << ", Min: " << min << ", Max: " << max << "\n";

    // Creating and decomposing a tuple
    auto [name, age, gpa] = std::make_tuple("Emmanuel", 20, 3.8);
    std::cout << name << ", age " << age << ", GPA " << gpa << "\n";

    // ===== WITH STRUCTS =====
    std::cout << "\n--- With Structs ---\n";
    auto [success, msg, code] = processRequest(1);
    std::cout << "Success: " << success << ", Code: " << code << ", " << msg << "\n";

    auto [s2, m2, c2] = processRequest(-1);
    std::cout << "Success: " << s2 << ", Code: " << c2 << ", " << m2 << "\n";

    // ===== WITH ARRAYS =====
    std::cout << "\n--- With Arrays ---\n";
    int arr[] = {10, 20, 30};
    auto [a, b, c] = arr;
    std::cout << "a=" << a << ", b=" << b << ", c=" << c << "\n";

    std::array<std::string, 3> colors = {"red", "green", "blue"};
    auto [r, g, bl] = colors;
    std::cout << r << ", " << g << ", " << bl << "\n";

    // ===== WITH MAPS =====
    std::cout << "\n--- With Maps ---\n";
    std::map<std::string, int> scores = {
        {"Alice", 95}, {"Bob", 87}, {"Charlie", 92}
    };

    // Iterate with structured bindings
    for (const auto& [student, score] : scores) {
        std::cout << "  " << student << ": " << score << "\n";
    }

    // Insert with structured binding on result
    auto [iter, inserted] = scores.insert({"Diana", 88});
    std::cout << "\nInserted Diana: " << inserted
              << " (score=" << iter->second << ")\n";

    auto [iter2, inserted2] = scores.insert({"Alice", 100});  // already exists
    std::cout << "Insert Alice again: " << inserted2
              << " (existing score=" << iter2->second << ")\n";

    // ===== BY REFERENCE (modify originals) =====
    std::cout << "\n--- By Reference ---\n";
    std::pair<int, int> point = {3, 4};
    auto& [x, y] = point;  // reference binding
    x = 10;
    y = 20;
    std::cout << "Modified point: (" << point.first << ", " << point.second << ")\n";

    // ===== CONST REFERENCE =====
    const auto& [cx, cy] = point;
    std::cout << "Const ref: (" << cx << ", " << cy << ")\n";
    // cx = 99;  // ERROR: can't modify const

    // ===== PRACTICAL: Multiple return values =====
    std::cout << "\n--- Practical: Parsing ---\n";
    auto parseKeyValue = [](const std::string& line) -> std::pair<std::string, std::string> {
        auto pos = line.find('=');
        if (pos == std::string::npos) return {"", ""};
        return {line.substr(0, pos), line.substr(pos + 1)};
    };

    for (const auto& line : {"host=localhost", "port=8080", "debug=true"}) {
        auto [key, value] = parseKeyValue(line);
        std::cout << "  Key: '" << key << "', Value: '" << value << "'\n";
    }

    return 0;
}
