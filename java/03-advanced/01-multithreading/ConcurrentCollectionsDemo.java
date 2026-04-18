import java.util.*;
import java.util.concurrent.*;

/**
 * LESSON: Concurrent Collections
 * Thread-safe collections designed for multithreaded access.
 *
 * Regular collections (ArrayList, HashMap) are NOT thread-safe.
 * Concurrent collections handle synchronization internally and efficiently.
 *
 * ConcurrentHashMap  - thread-safe HashMap (no locking entire map)
 * CopyOnWriteArrayList - thread-safe ArrayList (best for read-heavy workloads)
 * BlockingQueue      - thread-safe queue with blocking operations
 * ConcurrentLinkedQueue - lock-free thread-safe queue
 */
public class ConcurrentCollectionsDemo {
    public static void main(String[] args) throws Exception {
        // ===== CONCURRENTHASHMAP =====
        System.out.println("--- ConcurrentHashMap ---");
        ConcurrentHashMap<String, Integer> scores = new ConcurrentHashMap<>();

        // Basic operations (same as HashMap)
        scores.put("Alice", 95);
        scores.put("Bob", 88);
        scores.put("Charlie", 92);

        // Atomic operations (thread-safe compound actions)
        scores.putIfAbsent("Dave", 85);              // add only if absent
        scores.computeIfPresent("Bob", (k, v) -> v + 5); // update if present
        scores.compute("Alice", (k, v) -> v == null ? 0 : v + 10); // compute new value
        scores.merge("Bob", 10, Integer::sum);        // merge with existing

        System.out.println("Scores: " + scores);

        // Thread-safe iteration (no ConcurrentModificationException)
        scores.forEach((name, score) -> {
            System.out.printf("  %s: %d%n", name, score);
        });

        // Parallel operations
        System.out.println("Total: " + scores.reduceValues(1, Integer::sum));

        // ===== THREAD-SAFETY DEMO =====
        System.out.println("\n--- Thread Safety Demo ---");

        // UNSAFE: Regular HashMap with multiple threads
        Map<String, Integer> unsafeMap = new HashMap<>();
        ConcurrentHashMap<String, Integer> safeMap = new ConcurrentHashMap<>();

        Runnable unsafeTask = () -> {
            for (int i = 0; i < 1000; i++) {
                unsafeMap.merge("count", 1, Integer::sum);
            }
        };

        Runnable safeTask = () -> {
            for (int i = 0; i < 1000; i++) {
                safeMap.merge("count", 1, Integer::sum);
            }
        };

        // Run with 10 threads
        ExecutorService executor = Executors.newFixedThreadPool(10);
        for (int i = 0; i < 10; i++) {
            executor.submit(unsafeTask);
            executor.submit(safeTask);
        }
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);

        System.out.println("HashMap (expected 10000): " + unsafeMap.get("count") + " (may be wrong!)");
        System.out.println("ConcurrentHashMap (expected 10000): " + safeMap.get("count") + " (always correct)");

        // ===== COPYONWRITEARRAYLIST =====
        System.out.println("\n--- CopyOnWriteArrayList ---");
        // Creates a new copy of the array on every write
        // Best for read-heavy, write-rare scenarios
        CopyOnWriteArrayList<String> cowList = new CopyOnWriteArrayList<>();
        cowList.add("Java");
        cowList.add("Python");
        cowList.add("Go");

        // Safe to iterate while modifying (iterates over snapshot)
        for (String lang : cowList) {
            System.out.println("  " + lang);
            // This won't cause ConcurrentModificationException!
            if (lang.equals("Python")) {
                cowList.add("Rust");
            }
        }
        System.out.println("After: " + cowList);

        // ===== BLOCKINGQUEUE =====
        System.out.println("\n--- BlockingQueue (Producer-Consumer) ---");
        BlockingQueue<String> queue = new LinkedBlockingQueue<>(5); // capacity 5

        // Producer thread
        Thread producer = new Thread(() -> {
            String[] items = {"Item-1", "Item-2", "Item-3", "Item-4", "DONE"};
            for (String item : items) {
                try {
                    queue.put(item); // blocks if queue is full
                    System.out.println("  Produced: " + item);
                    Thread.sleep(100);
                } catch (InterruptedException e) { break; }
            }
        });

        // Consumer thread
        Thread consumer = new Thread(() -> {
            while (true) {
                try {
                    String item = queue.take(); // blocks if queue is empty
                    System.out.println("  Consumed: " + item);
                    if (item.equals("DONE")) break;
                } catch (InterruptedException e) { break; }
            }
        });

        producer.start();
        consumer.start();
        producer.join();
        consumer.join();

        System.out.println("\nProducer-Consumer complete!");
    }
}
