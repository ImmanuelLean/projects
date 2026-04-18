/**
 * LESSON: Singleton Design Pattern
 * Ensures only ONE instance of a class exists throughout the application.
 * Use cases: Database connections, Logger, Configuration manager.
 */
public class SingletonPattern {
    public static void main(String[] args) {
        // ===== EAGER SINGLETON =====
        System.out.println("--- Eager Singleton ---");
        EagerSingleton e1 = EagerSingleton.getInstance();
        EagerSingleton e2 = EagerSingleton.getInstance();
        System.out.println("Same instance? " + (e1 == e2)); // true

        // ===== LAZY SINGLETON =====
        System.out.println("\n--- Lazy Singleton ---");
        LazySingleton l1 = LazySingleton.getInstance();
        LazySingleton l2 = LazySingleton.getInstance();
        System.out.println("Same instance? " + (l1 == l2)); // true

        // ===== THREAD-SAFE SINGLETON =====
        System.out.println("\n--- Thread-Safe Singleton ---");
        ThreadSafeSingleton ts1 = ThreadSafeSingleton.getInstance();
        ThreadSafeSingleton ts2 = ThreadSafeSingleton.getInstance();
        System.out.println("Same instance? " + (ts1 == ts2));

        // ===== ENUM SINGLETON (Recommended) =====
        System.out.println("\n--- Enum Singleton ---");
        EnumSingleton.INSTANCE.setData("Hello from Enum Singleton!");
        System.out.println(EnumSingleton.INSTANCE.getData());
    }
}

// 1. Eager initialization - instance created at class loading
class EagerSingleton {
    private static final EagerSingleton INSTANCE = new EagerSingleton();

    private EagerSingleton() {
        System.out.println("EagerSingleton created");
    }

    static EagerSingleton getInstance() { return INSTANCE; }
}

// 2. Lazy initialization - instance created on first request
class LazySingleton {
    private static LazySingleton instance;

    private LazySingleton() {
        System.out.println("LazySingleton created");
    }

    // NOT thread-safe!
    static LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton();
        }
        return instance;
    }
}

// 3. Thread-safe with double-checked locking
class ThreadSafeSingleton {
    private static volatile ThreadSafeSingleton instance;

    private ThreadSafeSingleton() {
        System.out.println("ThreadSafeSingleton created");
    }

    static ThreadSafeSingleton getInstance() {
        if (instance == null) {                    // first check (no locking)
            synchronized (ThreadSafeSingleton.class) {
                if (instance == null) {            // second check (with lock)
                    instance = new ThreadSafeSingleton();
                }
            }
        }
        return instance;
    }
}

// 4. Enum Singleton (recommended by Joshua Bloch)
// Thread-safe, serialization-safe, and simple
enum EnumSingleton {
    INSTANCE;

    private String data;
    String getData() { return data; }
    void setData(String data) { this.data = data; }
}
