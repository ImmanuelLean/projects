/**
 * LESSON: Strings in C++
 * C++ has two types: C-style strings (char[]) and std::string (preferred).
 */
#include <iostream>
#include <string>
#include <algorithm>
#include <sstream>   // stringstream
#include <cctype>    // toupper, tolower, isalpha, isdigit

int main() {
    // ===== CREATING STRINGS =====
    std::cout << "--- Creating Strings ---\n";
    std::string s1 = "Hello";
    std::string s2("World");
    std::string s3(5, '*');    // "*****" (5 copies of '*')
    std::string s4 = s1;      // copy

    std::cout << "s1: " << s1 << "\n";
    std::cout << "s3: " << s3 << "\n";

    // ===== BASIC PROPERTIES =====
    std::cout << "\n--- Properties ---\n";
    std::string name = "Emmanuel";
    std::cout << "Length: " << name.length() << "\n";     // or .size()
    std::cout << "Empty: " << std::boolalpha << name.empty() << "\n";
    std::cout << "First char: " << name[0] << "\n";        // no bounds check
    std::cout << "At(3): " << name.at(3) << "\n";          // bounds checked
    std::cout << "Front: " << name.front() << "\n";
    std::cout << "Back: " << name.back() << "\n";

    // ===== MODIFYING =====
    std::cout << "\n--- Modifying ---\n";
    std::string str = "Hello";
    str += " World";                          // append
    std::cout << "Append: " << str << "\n";
    str.append("!");
    std::cout << "Append: " << str << "\n";
    str.insert(5, ",");                       // insert at index
    std::cout << "Insert: " << str << "\n";
    str.erase(5, 1);                          // erase 1 char at index 5
    std::cout << "Erase: " << str << "\n";
    str.replace(0, 5, "Hi");                  // replace range
    std::cout << "Replace: " << str << "\n";

    // ===== SEARCHING =====
    std::cout << "\n--- Searching ---\n";
    std::string text = "Hello, World! Hello, C++!";
    std::cout << "find 'World': " << text.find("World") << "\n";       // 7
    std::cout << "rfind 'Hello': " << text.rfind("Hello") << "\n";     // 14
    std::cout << "find 'xyz': " << (text.find("xyz") == std::string::npos ? "not found" : "found") << "\n";

    // ===== SUBSTRINGS =====
    std::cout << "\n--- Substring ---\n";
    std::cout << "substr(0, 5): " << text.substr(0, 5) << "\n";   // "Hello"
    std::cout << "substr(7): " << text.substr(7) << "\n";         // "World! Hello, C++!"

    // ===== COMPARISON =====
    std::cout << "\n--- Comparison ---\n";
    std::string a = "apple", b = "banana";
    std::cout << "a == b: " << (a == b) << "\n";
    std::cout << "a < b:  " << (a < b) << "\n";  // lexicographic
    std::cout << "compare: " << a.compare(b) << "\n"; // negative = a < b

    // ===== CASE CONVERSION =====
    std::cout << "\n--- Case Conversion ---\n";
    std::string mixed = "Hello World";
    std::string upper = mixed, lower = mixed;
    std::transform(upper.begin(), upper.end(), upper.begin(), ::toupper);
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);
    std::cout << "Upper: " << upper << "\n";
    std::cout << "Lower: " << lower << "\n";

    // ===== STRING <-> NUMBER =====
    std::cout << "\n--- Conversions ---\n";
    int num = std::stoi("123");          // string to int
    double dbl = std::stod("3.14");      // string to double
    std::string numStr = std::to_string(42); // number to string

    std::cout << "stoi(\"123\"): " << num << "\n";
    std::cout << "stod(\"3.14\"): " << dbl << "\n";
    std::cout << "to_string(42): " << numStr << "\n";

    // ===== SPLITTING (using stringstream) =====
    std::cout << "\n--- Splitting ---\n";
    std::string csv = "apple,banana,cherry,mango";
    std::stringstream ss(csv);
    std::string token;
    while (std::getline(ss, token, ',')) {
        std::cout << "  - " << token << "\n";
    }

    // ===== C-STRING vs STD::STRING =====
    std::cout << "\n--- C-string ---\n";
    const char* cstr = "C-style string";
    std::string cppstr = cstr;                // C -> C++
    const char* back = cppstr.c_str();        // C++ -> C
    std::cout << "C-string: " << cstr << "\n";
    std::cout << "C++ string: " << cppstr << "\n";

    return 0;
}
