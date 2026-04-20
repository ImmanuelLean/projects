/**
 * LESSON: String Methods
 * std::string provides many powerful methods for manipulation.
 *
 * Compile: g++ -std=c++17 -o string_methods string_methods.cpp
 * Run:     ./string_methods
 */
#include <iostream>
#include <string>
#include <algorithm>  // transform, reverse

int main() {
    // ===== LENGTH & SIZE =====
    std::cout << "--- Length & Size ---\n";
    std::string str = "Hello, World!";
    std::cout << "String: \"" << str << "\"\n";
    std::cout << "length(): " << str.length() << "\n";  // 13
    std::cout << "size():   " << str.size() << "\n";     // same as length()
    std::cout << "empty():  " << std::boolalpha << str.empty() << "\n";

    // ===== ACCESSING CHARACTERS =====
    std::cout << "\n--- Accessing Characters ---\n";
    std::cout << "str[0]: '" << str[0] << "'\n";         // no bounds check
    std::cout << "str.at(1): '" << str.at(1) << "'\n";   // bounds checked
    std::cout << "front(): '" << str.front() << "'\n";
    std::cout << "back():  '" << str.back() << "'\n";

    // ===== SUBSTR =====
    std::cout << "\n--- substr(pos, len) ---\n";
    std::cout << "substr(0, 5): \"" << str.substr(0, 5) << "\"\n";   // "Hello"
    std::cout << "substr(7):    \"" << str.substr(7) << "\"\n";      // "World!"

    // ===== FIND & RFIND =====
    std::cout << "\n--- find & rfind ---\n";
    std::string text = "The cat sat on the mat";
    std::cout << "Text: \"" << text << "\"\n";
    std::cout << "find(\"cat\"): pos " << text.find("cat") << "\n";       // 4
    std::cout << "find(\"the\"): pos " << text.find("the") << "\n";       // 15
    std::cout << "rfind(\"at\"): pos " << text.rfind("at") << "\n";       // 20 (last)
    size_t pos = text.find("dog");
    std::cout << "find(\"dog\"): " << (pos == std::string::npos ? "NOT FOUND" : "found") << "\n";

    // find_first_of / find_last_of
    std::cout << "find_first_of(\"aeiou\"): pos " << text.find_first_of("aeiou") << "\n";

    // ===== REPLACE =====
    std::cout << "\n--- replace ---\n";
    std::string s1 = "Hello, World!";
    s1.replace(7, 5, "C++");  // replace 5 chars at pos 7
    std::cout << "replace(7, 5, \"C++\"): \"" << s1 << "\"\n";

    // ===== INSERT =====
    std::cout << "\n--- insert ---\n";
    std::string s2 = "Hello World";
    s2.insert(5, ",");  // insert at position 5
    std::cout << "insert(5, \",\"): \"" << s2 << "\"\n";

    // ===== ERASE =====
    std::cout << "\n--- erase ---\n";
    std::string s3 = "Hello, World!";
    s3.erase(5, 2);  // erase 2 chars at pos 5
    std::cout << "erase(5, 2): \"" << s3 << "\"\n";

    // ===== APPEND & CONCATENATION =====
    std::cout << "\n--- append ---\n";
    std::string s4 = "Hello";
    s4.append(" World");      // or s4 += " World";
    s4.push_back('!');        // append single char
    std::cout << "Result: \"" << s4 << "\"\n";

    // ===== COMPARE =====
    std::cout << "\n--- compare ---\n";
    std::string a = "apple", b = "banana";
    int cmp = a.compare(b);
    std::cout << "\"apple\".compare(\"banana\"): " << cmp
              << (cmp < 0 ? " (less)" : cmp > 0 ? " (greater)" : " (equal)") << "\n";

    // ===== C-STRING CONVERSION =====
    std::cout << "\n--- c_str() ---\n";
    std::string cpp_str = "C++ string";
    const char* c_str = cpp_str.c_str();
    std::cout << "c_str(): " << c_str << "\n";
    printf("printf: %s\n", cpp_str.c_str());

    // ===== STRING <-> NUMBER CONVERSION =====
    std::cout << "\n--- Number Conversions ---\n";
    // String to number
    int num = std::stoi("42");
    double dbl = std::stod("3.14");
    long lng = std::stol("1000000");
    std::cout << "stoi(\"42\") = " << num << "\n";
    std::cout << "stod(\"3.14\") = " << dbl << "\n";
    std::cout << "stol(\"1000000\") = " << lng << "\n";

    // Number to string
    std::string fromInt = std::to_string(42);
    std::string fromDbl = std::to_string(3.14);
    std::cout << "to_string(42) = \"" << fromInt << "\"\n";
    std::cout << "to_string(3.14) = \"" << fromDbl << "\"\n";

    // ===== STRING ITERATION =====
    std::cout << "\n--- Iteration ---\n";
    std::string word = "Hello";
    std::cout << "Characters: ";
    for (char ch : word) std::cout << ch << " ";
    std::cout << "\n";

    // ===== TRANSFORM: uppercase/lowercase =====
    std::cout << "\n--- Transform ---\n";
    std::string lower = "hello world";
    std::transform(lower.begin(), lower.end(), lower.begin(), ::toupper);
    std::cout << "Uppercase: " << lower << "\n";
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);
    std::cout << "Lowercase: " << lower << "\n";

    // ===== REVERSE =====
    std::string rev = "Hello";
    std::reverse(rev.begin(), rev.end());
    std::cout << "Reversed: " << rev << "\n";

    return 0;
}
