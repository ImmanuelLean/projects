/**
 * LESSON: String Streams
 * stringstream lets you use stream operations on strings.
 * Great for parsing, formatting, and type conversions.
 *
 * Compile: g++ -std=c++17 -o sstream string_streams.cpp
 * Run:     ./sstream
 */
#include <iostream>
#include <sstream>   // stringstream, istringstream, ostringstream
#include <string>
#include <vector>
#include <iomanip>   // setw, setprecision, fixed

int main() {
    // ===== BASIC STRINGSTREAM =====
    std::cout << "--- Basic stringstream ---\n";
    std::stringstream ss;
    ss << "Hello " << "World " << 42 << " " << 3.14;
    std::cout << "  Contents: " << ss.str() << "\n";

    // Read back from stringstream
    std::string word1, word2;
    int num;
    double dbl;
    ss >> word1 >> word2 >> num >> dbl;
    std::cout << "  Parsed: " << word1 << ", " << word2
              << ", " << num << ", " << dbl << "\n";

    // ===== ISTRINGSTREAM (input/read only) =====
    std::cout << "\n--- istringstream (Parsing) ---\n";

    // Parse CSV-like data
    std::string csvLine = "Emmanuel,20,3.8,Computer Science";
    std::istringstream csvStream(csvLine);
    std::string name, field;
    int age;
    double gpa;
    char comma;

    std::getline(csvStream, name, ',');
    csvStream >> age >> comma >> gpa >> comma;
    std::getline(csvStream, field);
    std::cout << "  Name: " << name << "\n";
    std::cout << "  Age: " << age << "\n";
    std::cout << "  GPA: " << gpa << "\n";
    std::cout << "  Field: " << field << "\n";

    // ===== SPLIT STRING BY SPACE =====
    std::cout << "\n--- Split by Space ---\n";
    std::string sentence = "The quick brown fox jumps over";
    std::istringstream splitter(sentence);
    std::vector<std::string> words;
    std::string token;
    while (splitter >> token) {
        words.push_back(token);
    }
    std::cout << "  Words: " << words.size() << "\n";
    for (const auto& w : words) std::cout << "  -> " << w << "\n";

    // ===== SPLIT BY DELIMITER =====
    std::cout << "\n--- Split by Delimiter ---\n";
    std::string path = "/home/emmanuel/projects/cpp-practice";
    std::istringstream pathStream(path);
    std::string part;
    std::vector<std::string> parts;
    while (std::getline(pathStream, part, '/')) {
        if (!part.empty()) parts.push_back(part);
    }
    std::cout << "  Path parts:\n";
    for (const auto& p : parts) std::cout << "    " << p << "\n";

    // ===== OSTRINGSTREAM (output/write only) =====
    std::cout << "\n--- ostringstream (Building Strings) ---\n";
    std::ostringstream oss;
    oss << "Name: " << "Emmanuel" << "\n";
    oss << "Score: " << std::fixed << std::setprecision(1) << 95.678 << "\n";
    oss << "ID: " << std::setw(8) << std::setfill('0') << 42 << "\n";
    std::cout << oss.str();

    // ===== TYPE CONVERSION WITH STRINGSTREAM =====
    std::cout << "\n--- Type Conversion ---\n";

    // String to int
    std::istringstream intStream("12345");
    int converted;
    intStream >> converted;
    std::cout << "  \"12345\" -> int: " << converted << "\n";

    // Int to string
    std::ostringstream intToStr;
    intToStr << 42;
    std::cout << "  42 -> string: \"" << intToStr.str() << "\"\n";

    // Multiple conversions
    std::istringstream multi("100 3.14 true");
    int i; double d; bool b;
    multi >> i >> d >> std::boolalpha >> b;
    std::cout << "  Parsed: int=" << i << ", double=" << d
              << ", bool=" << std::boolalpha << b << "\n";

    // ===== BUILDING HTML/XML =====
    std::cout << "\n--- Building Formatted Output ---\n";
    std::ostringstream html;
    std::vector<std::string> items = {"Apple", "Banana", "Cherry"};
    html << "<ul>\n";
    for (const auto& item : items) {
        html << "  <li>" << item << "</li>\n";
    }
    html << "</ul>";
    std::cout << html.str() << "\n";

    // ===== CLEARING/REUSING STRINGSTREAM =====
    std::cout << "\n--- Reusing stringstream ---\n";
    std::stringstream reusable;
    reusable << "First use";
    std::cout << "  1st: " << reusable.str() << "\n";

    reusable.str("");     // clear contents
    reusable.clear();     // clear error flags
    reusable << "Second use";
    std::cout << "  2nd: " << reusable.str() << "\n";

    return 0;
}
