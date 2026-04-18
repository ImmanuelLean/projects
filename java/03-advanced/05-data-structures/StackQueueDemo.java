import java.util.*;

/**
 * LESSON: Stack, Queue, Deque, PriorityQueue
 * Fundamental data structures for organizing data.
 */
public class StackQueueDemo {
    public static void main(String[] args) {
        // ===== STACK (LIFO - Last In, First Out) =====
        System.out.println("--- Stack (LIFO) ---");
        Stack<String> stack = new Stack<>();
        stack.push("A");
        stack.push("B");
        stack.push("C");
        System.out.println("Stack: " + stack);
        System.out.println("Peek (top): " + stack.peek());     // C (doesn't remove)
        System.out.println("Pop: " + stack.pop());              // C (removes)
        System.out.println("Pop: " + stack.pop());              // B
        System.out.println("After pops: " + stack);             // [A]
        System.out.println("Empty? " + stack.isEmpty());

        // ===== QUEUE (FIFO - First In, First Out) =====
        System.out.println("\n--- Queue (FIFO) ---");
        Queue<String> queue = new LinkedList<>();
        queue.offer("First");   // add to end
        queue.offer("Second");
        queue.offer("Third");
        System.out.println("Queue: " + queue);
        System.out.println("Peek (front): " + queue.peek());   // First
        System.out.println("Poll: " + queue.poll());            // First (removes from front)
        System.out.println("Poll: " + queue.poll());            // Second
        System.out.println("After polls: " + queue);            // [Third]

        // ===== DEQUE (Double-Ended Queue) =====
        System.out.println("\n--- Deque (Double-Ended) ---");
        Deque<String> deque = new ArrayDeque<>();
        deque.addFirst("B");
        deque.addFirst("A");   // add to front
        deque.addLast("C");    // add to back
        deque.addLast("D");
        System.out.println("Deque: " + deque);          // [A, B, C, D]
        System.out.println("First: " + deque.peekFirst());
        System.out.println("Last: " + deque.peekLast());
        deque.removeFirst();
        deque.removeLast();
        System.out.println("After removing ends: " + deque); // [B, C]

        // Using Deque as Stack (preferred over Stack class)
        System.out.println("\n--- Deque as Stack ---");
        Deque<Integer> dequeStack = new ArrayDeque<>();
        dequeStack.push(10);
        dequeStack.push(20);
        dequeStack.push(30);
        System.out.println("Push 10, 20, 30: " + dequeStack);
        System.out.println("Pop: " + dequeStack.pop()); // 30

        // ===== PRIORITY QUEUE (elements ordered by priority) =====
        System.out.println("\n--- PriorityQueue (Min-Heap) ---");
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.offer(30);
        minHeap.offer(10);
        minHeap.offer(20);
        minHeap.offer(5);
        System.out.println("PQ: " + minHeap); // internal order may vary
        System.out.print("Poll order (min first): ");
        while (!minHeap.isEmpty()) {
            System.out.print(minHeap.poll() + " "); // 5 10 20 30
        }
        System.out.println();

        // Max-Heap (reverse order)
        System.out.println("\n--- PriorityQueue (Max-Heap) ---");
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        maxHeap.offer(30);
        maxHeap.offer(10);
        maxHeap.offer(20);
        maxHeap.offer(5);
        System.out.print("Poll order (max first): ");
        while (!maxHeap.isEmpty()) {
            System.out.print(maxHeap.poll() + " "); // 30 20 10 5
        }
        System.out.println();
    }
}
