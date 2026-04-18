import java.util.concurrent.*;

/**
 * LESSON: CompletableFuture (Async Programming)
 * CompletableFuture allows non-blocking, async operations with a fluent API.
 * Think of it as Promises/async-await in Java.
 */
public class CompletableFutureDemo {
    public static void main(String[] args) throws Exception {
        // ===== BASIC ASYNC =====
        System.out.println("--- Basic CompletableFuture ---");

        // supplyAsync - runs in background thread, returns a value
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            sleep(1000);
            return "Hello from async!";
        });

        System.out.println("Doing other work while waiting...");
        String result = future.get(); // blocks until complete
        System.out.println("Result: " + result);

        // runAsync - runs in background, no return value
        CompletableFuture<Void> voidFuture = CompletableFuture.runAsync(() -> {
            System.out.println("Running async task on: " + Thread.currentThread().getName());
        });
        voidFuture.get();

        // ===== CHAINING (thenApply, thenAccept, thenRun) =====
        System.out.println("\n--- Chaining ---");

        CompletableFuture<String> chained = CompletableFuture
            .supplyAsync(() -> "  Hello World  ")
            .thenApply(String::trim)           // transform result
            .thenApply(String::toUpperCase)     // transform again
            .thenApply(s -> s + "!");           // transform again

        System.out.println("Chained: " + chained.get()); // HELLO WORLD!

        // thenAccept - consume result (no return)
        CompletableFuture.supplyAsync(() -> 42)
            .thenAccept(n -> System.out.println("The answer is: " + n))
            .get();

        // thenRun - run after completion (no access to result)
        CompletableFuture.supplyAsync(() -> "data")
            .thenRun(() -> System.out.println("Processing complete!"))
            .get();

        // ===== COMBINING FUTURES =====
        System.out.println("\n--- Combining Futures ---");

        CompletableFuture<String> userFuture = CompletableFuture.supplyAsync(() -> {
            sleep(500);
            return "Emmanuel";
        });

        CompletableFuture<Integer> scoreFuture = CompletableFuture.supplyAsync(() -> {
            sleep(300);
            return 95;
        });

        // thenCombine - combine two futures
        CompletableFuture<String> combined = userFuture.thenCombine(scoreFuture,
            (user, score) -> user + " scored " + score);
        System.out.println("Combined: " + combined.get());

        // ===== ALL OF / ANY OF =====
        System.out.println("\n--- allOf / anyOf ---");

        CompletableFuture<String> f1 = CompletableFuture.supplyAsync(() -> { sleep(300); return "Task 1"; });
        CompletableFuture<String> f2 = CompletableFuture.supplyAsync(() -> { sleep(200); return "Task 2"; });
        CompletableFuture<String> f3 = CompletableFuture.supplyAsync(() -> { sleep(100); return "Task 3"; });

        // Wait for ALL to complete
        CompletableFuture<Void> allDone = CompletableFuture.allOf(f1, f2, f3);
        allDone.get();
        System.out.println("All done: " + f1.get() + ", " + f2.get() + ", " + f3.get());

        // Wait for ANY to complete (first one wins)
        CompletableFuture<String> f4 = CompletableFuture.supplyAsync(() -> { sleep(300); return "Slow"; });
        CompletableFuture<String> f5 = CompletableFuture.supplyAsync(() -> { sleep(100); return "Fast"; });
        CompletableFuture<Object> anyDone = CompletableFuture.anyOf(f4, f5);
        System.out.println("First completed: " + anyDone.get()); // Fast

        // ===== ERROR HANDLING =====
        System.out.println("\n--- Error Handling ---");

        // exceptionally - handle errors
        CompletableFuture<Integer> withError = CompletableFuture
            .supplyAsync(() -> {
                if (true) throw new RuntimeException("Something went wrong!");
                return 42;
            })
            .exceptionally(ex -> {
                System.out.println("Error: " + ex.getMessage());
                return -1; // fallback value
            });
        System.out.println("Result with error handling: " + withError.get());

        // handle - handle both success and error
        CompletableFuture<String> handled = CompletableFuture
            .supplyAsync(() -> {
                if (Math.random() > 0.5) throw new RuntimeException("Random failure");
                return "Success!";
            })
            .handle((res, ex) -> {
                if (ex != null) return "Recovered from: " + ex.getMessage();
                return res;
            });
        System.out.println("Handled: " + handled.get());

        // ===== PRACTICAL EXAMPLE: Async API calls =====
        System.out.println("\n--- Practical: Parallel API Calls ---");
        long start = System.currentTimeMillis();

        CompletableFuture<String> userAPI = CompletableFuture.supplyAsync(() -> {
            sleep(500); return "User: Emmanuel";
        });
        CompletableFuture<String> ordersAPI = CompletableFuture.supplyAsync(() -> {
            sleep(400); return "Orders: 5";
        });
        CompletableFuture<String> balanceAPI = CompletableFuture.supplyAsync(() -> {
            sleep(300); return "Balance: $500";
        });

        // All three run in parallel!
        CompletableFuture.allOf(userAPI, ordersAPI, balanceAPI).get();
        long elapsed = System.currentTimeMillis() - start;

        System.out.println(userAPI.get());
        System.out.println(ordersAPI.get());
        System.out.println(balanceAPI.get());
        System.out.println("Total time: " + elapsed + "ms (parallel, not 1200ms sequential!)");
    }

    static void sleep(int ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { }
    }
}
