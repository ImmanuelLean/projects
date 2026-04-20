/**
 * LESSON: Custom Linked List Implementation
 * Singly linked list built from scratch with templates.
 */
#include <iostream>
#include <stdexcept>

template <typename T>
class LinkedList {
    struct Node {
        T data;
        Node* next;
        Node(const T& d) : data(d), next(nullptr) {}
    };

    Node* head = nullptr;
    int count = 0;

public:
    ~LinkedList() {
        while (head) {
            Node* temp = head;
            head = head->next;
            delete temp;
        }
    }

    void addFirst(const T& data) {
        Node* newNode = new Node(data);
        newNode->next = head;
        head = newNode;
        count++;
    }

    void addLast(const T& data) {
        Node* newNode = new Node(data);
        if (!head) { head = newNode; }
        else {
            Node* curr = head;
            while (curr->next) curr = curr->next;
            curr->next = newNode;
        }
        count++;
    }

    void removeFirst() {
        if (!head) throw std::runtime_error("List is empty");
        Node* temp = head;
        head = head->next;
        delete temp;
        count--;
    }

    void removeLast() {
        if (!head) throw std::runtime_error("List is empty");
        if (!head->next) { delete head; head = nullptr; }
        else {
            Node* curr = head;
            while (curr->next->next) curr = curr->next;
            delete curr->next;
            curr->next = nullptr;
        }
        count--;
    }

    bool contains(const T& data) const {
        Node* curr = head;
        while (curr) {
            if (curr->data == data) return true;
            curr = curr->next;
        }
        return false;
    }

    T get(int index) const {
        if (index < 0 || index >= count) throw std::out_of_range("Index out of range");
        Node* curr = head;
        for (int i = 0; i < index; i++) curr = curr->next;
        return curr->data;
    }

    void reverse() {
        Node* prev = nullptr;
        Node* curr = head;
        while (curr) {
            Node* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        head = prev;
    }

    int size() const { return count; }
    bool empty() const { return head == nullptr; }

    void display() const {
        Node* curr = head;
        while (curr) {
            std::cout << curr->data;
            if (curr->next) std::cout << " -> ";
            curr = curr->next;
        }
        std::cout << "\n";
    }
};

int main() {
    LinkedList<int> list;

    std::cout << "--- Adding ---\n";
    list.addLast(10);
    list.addLast(20);
    list.addLast(30);
    list.addFirst(5);
    list.addLast(40);
    list.display(); // 5 -> 10 -> 20 -> 30 -> 40

    std::cout << "\n--- Accessing ---\n";
    std::cout << "Size: " << list.size() << "\n";
    std::cout << "get(0): " << list.get(0) << "\n";
    std::cout << "get(2): " << list.get(2) << "\n";
    std::cout << "Contains 20? " << std::boolalpha << list.contains(20) << "\n";

    std::cout << "\n--- Removing ---\n";
    list.removeFirst();
    list.display();
    list.removeLast();
    list.display();

    std::cout << "\n--- Reverse ---\n";
    list.addFirst(5);
    list.addLast(40);
    list.display();
    list.reverse();
    list.display();

    // String list
    std::cout << "\n--- String List ---\n";
    LinkedList<std::string> names;
    names.addLast("Alice");
    names.addLast("Bob");
    names.addLast("Charlie");
    names.display();

    return 0;
}
