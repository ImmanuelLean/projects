/**
 * LESSON: Stack, Queue, Deque, Priority Queue
 */
#include <iostream>
#include <stack>
#include <queue>
#include <deque>
#include <vector>
#include <functional> // std::greater

int main() {
    // ===== STACK (LIFO) =====
    std::cout << "--- Stack (LIFO) ---\n";
    std::stack<std::string> stack;
    stack.push("A");
    stack.push("B");
    stack.push("C");
    std::cout << "Top: " << stack.top() << "\n"; // C
    std::cout << "Size: " << stack.size() << "\n";

    std::cout << "Pop order: ";
    while (!stack.empty()) {
        std::cout << stack.top() << " "; // C B A
        stack.pop();
    }
    std::cout << "\n";

    // ===== QUEUE (FIFO) =====
    std::cout << "\n--- Queue (FIFO) ---\n";
    std::queue<std::string> queue;
    queue.push("First");
    queue.push("Second");
    queue.push("Third");
    std::cout << "Front: " << queue.front() << "\n"; // First
    std::cout << "Back: " << queue.back() << "\n";   // Third

    std::cout << "Pop order: ";
    while (!queue.empty()) {
        std::cout << queue.front() << " "; // First Second Third
        queue.pop();
    }
    std::cout << "\n";

    // ===== DEQUE (Double-Ended Queue) =====
    std::cout << "\n--- Deque ---\n";
    std::deque<int> dq;
    dq.push_back(2);
    dq.push_back(3);
    dq.push_front(1);
    dq.push_back(4);
    dq.push_front(0);

    std::cout << "Deque: ";
    for (int n : dq) std::cout << n << " "; // 0 1 2 3 4
    std::cout << "\n";

    dq.pop_front();
    dq.pop_back();
    std::cout << "After pops: ";
    for (int n : dq) std::cout << n << " "; // 1 2 3
    std::cout << "\n";

    // ===== PRIORITY QUEUE (Max-Heap by default) =====
    std::cout << "\n--- Priority Queue (Max-Heap) ---\n";
    std::priority_queue<int> maxHeap;
    maxHeap.push(30);
    maxHeap.push(10);
    maxHeap.push(20);
    maxHeap.push(5);

    std::cout << "Pop order (max first): ";
    while (!maxHeap.empty()) {
        std::cout << maxHeap.top() << " "; // 30 20 10 5
        maxHeap.pop();
    }
    std::cout << "\n";

    // Min-Heap
    std::cout << "\n--- Priority Queue (Min-Heap) ---\n";
    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
    minHeap.push(30);
    minHeap.push(10);
    minHeap.push(20);
    minHeap.push(5);

    std::cout << "Pop order (min first): ";
    while (!minHeap.empty()) {
        std::cout << minHeap.top() << " "; // 5 10 20 30
        minHeap.pop();
    }
    std::cout << "\n";

    return 0;
}
