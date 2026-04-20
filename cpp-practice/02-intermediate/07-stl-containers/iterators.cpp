/**
 * LESSON: Iterators
 * Iterators are the bridge between containers and algorithms.
 * They provide a uniform way to traverse any container.
 *
 * Compile: g++ -std=c++17 -o iterators iterators.cpp
 * Run:     ./iterators
 */
#include <iostream>
#include <vector>
#include <list>
#include <map>
#include <set>
#include <iterator>  // std::advance, std::distance, std::next, std::prev

int main() {
    // ===== BASIC ITERATOR USAGE =====
    std::cout << "--- Basic Iterators ---\n";
    std::vector<int> vec = {10, 20, 30, 40, 50};

    // begin() and end()
    std::cout << "Forward: ";
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        std::cout << *it << " ";  // dereference to get value
    }
    std::cout << "\n";

    // Modify through iterator
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        *it *= 2;
    }
    std::cout << "Doubled: ";
    for (int n : vec) std::cout << n << " ";
    std::cout << "\n";

    // ===== CONST ITERATORS =====
    std::cout << "\n--- Const Iterators ---\n";
    const std::vector<int>& constRef = vec;
    for (auto it = constRef.cbegin(); it != constRef.cend(); ++it) {
        // *it = 999;  // ERROR: can't modify through const_iterator
        std::cout << *it << " ";
    }
    std::cout << "(read-only)\n";

    // ===== REVERSE ITERATORS =====
    std::cout << "\n--- Reverse Iterators ---\n";
    std::cout << "Reverse: ";
    for (auto it = vec.rbegin(); it != vec.rend(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << "\n";

    // const reverse iterator
    std::cout << "Const reverse: ";
    for (auto it = vec.crbegin(); it != vec.crend(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << "\n";

    // ===== ITERATOR ARITHMETIC (Random Access) =====
    std::cout << "\n--- Iterator Arithmetic ---\n";
    auto start = vec.begin();
    auto third = start + 2;  // random access: jump to 3rd element
    std::cout << "start: " << *start << "\n";
    std::cout << "start + 2: " << *third << "\n";
    std::cout << "*(end - 1): " << *(vec.end() - 1) << "\n";

    // ===== STD::ADVANCE (works with all iterator types) =====
    std::cout << "\n--- std::advance ---\n";
    std::list<int> lst = {100, 200, 300, 400, 500};
    auto lit = lst.begin();
    std::advance(lit, 3);  // move forward 3 positions
    std::cout << "advance(begin, 3): " << *lit << "\n";
    std::advance(lit, -1);  // bidirectional: can go back
    std::cout << "advance(-1): " << *lit << "\n";

    // ===== STD::NEXT and STD::PREV =====
    std::cout << "\n--- std::next & std::prev ---\n";
    auto it = lst.begin();
    auto nextIt = std::next(it, 2);    // returns new iterator, doesn't modify it
    std::cout << "begin: " << *it << "\n";
    std::cout << "next(begin, 2): " << *nextIt << "\n";

    auto endIt = lst.end();
    auto prevIt = std::prev(endIt);    // one before end
    std::cout << "prev(end): " << *prevIt << "\n";
    auto prevIt2 = std::prev(endIt, 2);
    std::cout << "prev(end, 2): " << *prevIt2 << "\n";

    // ===== STD::DISTANCE =====
    std::cout << "\n--- std::distance ---\n";
    auto first = lst.begin();
    auto last = lst.end();
    std::cout << "distance(begin, end): " << std::distance(first, last) << "\n";

    auto mid = std::next(first, 2);
    std::cout << "distance(begin, mid): " << std::distance(first, mid) << "\n";

    // ===== ITERATORS WITH MAP =====
    std::cout << "\n--- Map Iterators ---\n";
    std::map<std::string, int> ages = {
        {"Alice", 25}, {"Bob", 30}, {"Charlie", 35}
    };

    for (auto it = ages.begin(); it != ages.end(); ++it) {
        std::cout << "  " << it->first << ": " << it->second << "\n";
    }

    // Find with iterator
    auto found = ages.find("Bob");
    if (found != ages.end()) {
        std::cout << "Found Bob, age: " << found->second << "\n";
    }

    // ===== ITERATORS WITH SET =====
    std::cout << "\n--- Set Iterators ---\n";
    std::set<int> s = {50, 10, 30, 20, 40};
    std::cout << "Set (sorted): ";
    for (auto it = s.begin(); it != s.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << "\n";

    // ===== INSERT ITERATORS =====
    std::cout << "\n--- Insert Iterators ---\n";
    std::vector<int> dest;
    auto backInserter = std::back_inserter(dest);
    *backInserter = 1;
    *backInserter = 2;
    *backInserter = 3;
    std::cout << "back_inserter: ";
    for (int n : dest) std::cout << n << " ";
    std::cout << "\n";

    // ===== ITERATOR CATEGORIES =====
    std::cout << "\n--- Iterator Categories ---\n";
    std::cout << "Input:         Read forward once (istream_iterator)\n";
    std::cout << "Output:        Write forward once (ostream_iterator)\n";
    std::cout << "Forward:       Read/write, multi-pass (forward_list)\n";
    std::cout << "Bidirectional: Forward + backward (list, map, set)\n";
    std::cout << "Random Access: Jump anywhere (vector, deque, array)\n";

    return 0;
}
