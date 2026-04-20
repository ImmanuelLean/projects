/**
 * LESSON: STL Associative Containers - map, set, unordered_map, unordered_set
 */
#include <iostream>
#include <map>
#include <unordered_map>
#include <set>
#include <unordered_set>
#include <string>

int main() {
    // ===== MAP (sorted by key, O(log n)) =====
    std::cout << "--- std::map ---\n";
    std::map<std::string, int> scores;
    scores["Emmanuel"] = 95;
    scores["Alice"] = 88;
    scores["Bob"] = 72;
    scores.insert({"Charlie", 91});
    scores.emplace("Dave", 85);

    for (const auto& [name, score] : scores) { // structured bindings (C++17)
        std::cout << "  " << name << ": " << score << "\n";
    }
    // Output is sorted by key (alphabetical)

    std::cout << "Contains 'Bob'? " << (scores.count("Bob") > 0 ? "Yes" : "No") << "\n";
    std::cout << "Bob's score: " << scores["Bob"] << "\n";
    scores.erase("Bob");
    std::cout << "After erase: " << scores.size() << " entries\n";

    // ===== UNORDERED_MAP (hash table, O(1) average) =====
    std::cout << "\n--- std::unordered_map ---\n";
    std::unordered_map<std::string, std::string> capitals;
    capitals["Nigeria"] = "Abuja";
    capitals["Ghana"] = "Accra";
    capitals["Kenya"] = "Nairobi";

    for (const auto& [country, capital] : capitals) {
        std::cout << "  " << country << " -> " << capital << "\n";
    }

    // find
    auto it = capitals.find("Kenya");
    if (it != capitals.end()) {
        std::cout << "Found: " << it->second << "\n";
    }

    // ===== SET (sorted unique values, O(log n)) =====
    std::cout << "\n--- std::set ---\n";
    std::set<int> numbers = {50, 10, 30, 20, 40, 10, 30}; // duplicates removed
    std::cout << "Set: ";
    for (int n : numbers) std::cout << n << " "; // sorted output
    std::cout << "\n";

    numbers.insert(25);
    numbers.erase(30);
    std::cout << "Contains 25? " << (numbers.count(25) ? "Yes" : "No") << "\n";
    std::cout << "Size: " << numbers.size() << "\n";

    // ===== UNORDERED_SET (hash set, O(1) average) =====
    std::cout << "\n--- std::unordered_set ---\n";
    std::unordered_set<std::string> languages = {"C++", "Python", "Java", "C++"}; // dup removed
    languages.insert("Go");
    std::cout << "Languages: ";
    for (const auto& lang : languages) std::cout << lang << " ";
    std::cout << "\n";
    std::cout << "Size: " << languages.size() << "\n";

    // ===== MULTIMAP (allows duplicate keys) =====
    std::cout << "\n--- std::multimap ---\n";
    std::multimap<std::string, int> grades;
    grades.insert({"Alice", 90});
    grades.insert({"Alice", 85});
    grades.insert({"Bob", 92});

    auto range = grades.equal_range("Alice");
    std::cout << "Alice's grades: ";
    for (auto it = range.first; it != range.second; ++it) {
        std::cout << it->second << " ";
    }
    std::cout << "\n";

    return 0;
}
