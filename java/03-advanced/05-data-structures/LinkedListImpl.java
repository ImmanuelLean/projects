/**
 * LESSON: Custom Linked List Implementation
 * A singly linked list built from scratch to understand the data structure.
 * Each node holds data and a reference to the next node.
 *
 *   [data|next] -> [data|next] -> [data|next] -> null
 */
public class LinkedListImpl {
    public static void main(String[] args) {
        CustomLinkedList list = new CustomLinkedList();

        // Adding elements
        System.out.println("--- Adding Elements ---");
        list.addLast(10);
        list.addLast(20);
        list.addLast(30);
        list.addFirst(5);
        list.addLast(40);
        list.display(); // 5 -> 10 -> 20 -> 30 -> 40

        System.out.println("Size: " + list.size());

        // Accessing
        System.out.println("\n--- Accessing ---");
        System.out.println("Get index 0: " + list.get(0));
        System.out.println("Get index 2: " + list.get(2));
        System.out.println("Contains 20? " + list.contains(20));
        System.out.println("Contains 99? " + list.contains(99));

        // Removing
        System.out.println("\n--- Removing ---");
        list.removeFirst();
        list.display(); // 10 -> 20 -> 30 -> 40
        list.removeLast();
        list.display(); // 10 -> 20 -> 30
        list.removeValue(20);
        list.display(); // 10 -> 30

        // Rebuilding for reverse demo
        list.addFirst(5);
        list.addLast(40);
        list.addLast(50);
        System.out.println("\n--- Before Reverse ---");
        list.display(); // 5 -> 10 -> 30 -> 40 -> 50

        list.reverse();
        System.out.println("--- After Reverse ---");
        list.display(); // 50 -> 40 -> 30 -> 10 -> 5
    }
}

class CustomLinkedList {
    // Inner Node class
    private class Node {
        int data;
        Node next;

        Node(int data) {
            this.data = data;
            this.next = null;
        }
    }

    private Node head;
    private int size;

    CustomLinkedList() {
        head = null;
        size = 0;
    }

    // Add to beginning - O(1)
    void addFirst(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
        size++;
    }

    // Add to end - O(n)
    void addLast(int data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
        } else {
            Node current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
        size++;
    }

    // Remove first - O(1)
    void removeFirst() {
        if (head == null) throw new RuntimeException("List is empty");
        head = head.next;
        size--;
    }

    // Remove last - O(n)
    void removeLast() {
        if (head == null) throw new RuntimeException("List is empty");
        if (head.next == null) {
            head = null;
        } else {
            Node current = head;
            while (current.next.next != null) {
                current = current.next;
            }
            current.next = null;
        }
        size--;
    }

    // Remove by value - O(n)
    boolean removeValue(int data) {
        if (head == null) return false;
        if (head.data == data) { removeFirst(); return true; }

        Node current = head;
        while (current.next != null) {
            if (current.next.data == data) {
                current.next = current.next.next;
                size--;
                return true;
            }
            current = current.next;
        }
        return false;
    }

    // Get by index - O(n)
    int get(int index) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException("Index: " + index);
        Node current = head;
        for (int i = 0; i < index; i++) {
            current = current.next;
        }
        return current.data;
    }

    // Search - O(n)
    boolean contains(int data) {
        Node current = head;
        while (current != null) {
            if (current.data == data) return true;
            current = current.next;
        }
        return false;
    }

    // Reverse the list - O(n)
    void reverse() {
        Node prev = null;
        Node current = head;
        while (current != null) {
            Node next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        head = prev;
    }

    int size() { return size; }

    void display() {
        Node current = head;
        while (current != null) {
            System.out.print(current.data);
            if (current.next != null) System.out.print(" -> ");
            current = current.next;
        }
        System.out.println();
    }
}
