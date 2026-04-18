import java.util.*;
import java.util.concurrent.*;

/**
 * LESSON: ExecutorService & Thread Pools
 * Instead of manually creating threads, use ExecutorService to manage a pool of reusable threads.
 */
public class ExecutorServiceDemo {
    public static void main(String[] args) throws Exception {
        // ===== FIXED THREAD POOL =====
        System.out.println("--- Fixed Thread Pool ---");
        ExecutorService executor = Executors.newFixedThreadPool(3); // 3 threads

        // Submit Runnable tasks (no return value)
        for (int i = 1; i <= 5; i++) {
            final int taskId = i;
            executor.submit(() -> {
                String name = Thread.currentThread().getName();
                System.out.println("Task " + taskId + " running on " + name);
                try { Thread.sleep(500); } catch (InterruptedException e) { }
            });
        }

        executor.shutdown(); // stop accepting new tasks
        executor.awaitTermination(5, TimeUnit.SECONDS); // wait for all tasks to complete
        System.out.println("All tasks completed.\n");

        // ===== CALLABLE + FUTURE (with return values) =====
        System.out.println("--- Callable & Future ---");
        ExecutorService pool = Executors.newFixedThreadPool(3);

        // Callable is like Runnable but returns a value
        Callable<Integer> task = () -> {
            Thread.sleep(1000);
            return 42;
        };

        Future<Integer> future = pool.submit(task);
        System.out.println("Task submitted, doing other work...");
        System.out.println("Result: " + future.get()); // blocks until result is ready
        System.out.println("Is done? " + future.isDone());

        // ===== MULTIPLE CALLABLES =====
        System.out.println("\n--- Multiple Callables ---");
        List<Callable<String>> tasks = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            final int id = i;
            tasks.add(() -> {
                Thread.sleep(500);
                return "Result from task " + id;
            });
        }

        // invokeAll waits for ALL tasks to complete
        List<Future<String>> results = pool.invokeAll(tasks);
        for (Future<String> result : results) {
            System.out.println(result.get());
        }

        // ===== CACHED THREAD POOL =====
        System.out.println("\n--- Cached Thread Pool ---");
        // Creates threads as needed, reuses idle threads
        ExecutorService cached = Executors.newCachedThreadPool();
        for (int i = 1; i <= 3; i++) {
            final int id = i;
            cached.submit(() -> {
                System.out.println("Cached task " + id + " on " + Thread.currentThread().getName());
            });
        }

        // ===== SINGLE THREAD EXECUTOR =====
        System.out.println("\n--- Single Thread Executor ---");
        // Only one thread - tasks execute sequentially
        ExecutorService single = Executors.newSingleThreadExecutor();
        single.submit(() -> System.out.println("Task A on " + Thread.currentThread().getName()));
        single.submit(() -> System.out.println("Task B on " + Thread.currentThread().getName()));

        // Shutdown all
        pool.shutdown();
        cached.shutdown();
        single.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println("\nAll executors shut down.");
    }
}
