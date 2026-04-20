/**
 * LESSON: std::list, std::forward_list, and std::deque
 * Different sequential containers optimized for different use cases.
 *
 * Compile: g++ -std=c++17 -o list_deque list_deque_demo.cpp
 * Run:     ./list_deque
 */
#include <iostream>
#include <list>
#include <forward_list>
#include <deque>
#include <algorithm>

int main() {
    // ===== STD::LIST (doubly-linked list) =====
    std::cout << "--- std::list (doubly-linked) ---\n";
    std::list<int> lst = {3, 1, 4, 1, 5, 9};

    // Insert anywhere in O(1) if you have an iterator
    lst.push_front(0);
    lst.push_back(10);

    auto it = std::find(lst.begin(), lst.end(), 4);
    lst.insert(it, 99);  // insert before 4

    std::cout << "List: ";
    for (int n : lst) std::cout << n << " ";
    std::cout << "\n";

    // Remove elements
    lst.remove(1);  // remove all 1's
    std::cout << "After remove(1): ";
    for (int n : lst) std::cout << n << " ";
    std::cout << "\n";

    // Sort and unique (list has its own sort - can't use std::sort)
    lst.sort();
    std::cout << "Sorted: ";
    for (int n : lst) std::cout << n << " ";
    std::cout << "\n";

    // Splice: move elements between lists
    std::list<int> lst2 = {20, 30, 40};
    lst.splice(lst.end(), lst2);  // move lst2's elements to end of lst
    std::cout << "After splice: ";
    for (int n : lst) std::cout << n << " ";
    std::cout << "\n";
    std::cout << "lst2 size after splice: " << lst2.size() << " (empty!)\n";

    // ===== STD::FORWARD_LIST (singly-linked list) =====
    std::cout << "\n--- std::forward_list (singly-linked) ---\n";
    std::forward_list<int> flist = {10, 20, 30, 40, 50};

    // Can only push to front (no push_back, no size())
    flist.push_front(5);

    // Insert after a position
    auto fit = flist.begin();
    std::advance(fit, 2);
    flist.insert_after(fit, 99);

    std::cout << "Forward list: ";
    for (int n : flist) std::cout << n << " ";
    std::cout << "\n";

    // Remove if (with predicate)
    flist.remove_if([](int n) { return n > 30; });
    std::cout << "After remove_if(>30): ";
    for (int n : flist) std::cout << n << " ";
    std::cout << "\n";

    // ===== STD::DEQUE (double-ended queue) =====
    std::cout << "\n--- std::deque (double-ended queue) ---\n";
    std::deque<std::string> dq;

    // Push to both ends (both O(1))
    dq.push_back("middle");
    dq.push_front("front");
    dq.push_back("back");

    std::cout << "Deque: ";
    for (const auto& s : dq) std::cout << s << " ";
    std::cout << "\n";

    // Random access (like vector)
    std::cout << "dq[0] = " << dq[0] << "\n";
    std::cout << "dq[1] = " << dq[1] << "\n";

    // Pop from both ends
    dq.pop_front();
    dq.pop_back();
    std::cout << "After pop front+back: ";
    for (const auto& s : dq) std::cout << s << " ";
    std::cout << "\n";

    // Deque as a sliding window
    std::cout << "\n--- Deque as Sliding Window ---\n";
    std::deque<int> window;
    int data[] = {1, 2, 3, 4, 5, 6, 7, 8};
    int windowSize = 3;

    for (int val : data) {
        window.push_back(val);
        if (static_cast<int>(window.size()) > windowSize) {
            window.pop_front();
        }
        if (static_cast<int>(window.size()) == windowSize) {
            std::cout << "  Window: [";
            for (int w : window) std::cout << w << " ";
            std::cout << "]\n";
        }
    }

    // ===== WHEN TO USE WHICH =====
    std::cout << "\n--- When to Use Which ---\n";
    std::cout << "vector:       Random access, append. Most common choice.\n";
    std::cout << "list:         Frequent insert/remove in middle. Bidirectional.\n";
    std::cout << "forward_list: Minimal memory. Only forward iteration.\n";
    std::cout << "deque:        Fast push/pop at BOTH ends + random access.\n";

    std::cout << "\n--- Performance ---\n";
    std::cout << "              Access  Insert(mid)  Push_front  Push_back\n";
    std::cout << "vector:       O(1)    O(n)         O(n)        O(1)*\n";
    std::cout << "list:         O(n)    O(1)         O(1)        O(1)\n";
    std::cout << "forward_list: O(n)    O(1)         O(1)        O(n)\n";
    std::cout << "deque:        O(1)    O(n)         O(1)        O(1)\n";

    return 0;
}
