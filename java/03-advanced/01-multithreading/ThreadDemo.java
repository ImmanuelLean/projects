/**
 * LESSON: Multithreading
 * Threads allow concurrent execution of code.
 * Two ways to create: extend Thread class or implement Runnable.
 */
public class ThreadDemo {
    private static int sharedCounter = 0;
    private static final Object lock = new Object();

    public static void main(String[] args) throws InterruptedException {
        // ===== METHOD 1: Extend Thread class =====
        System.out.println("--- Extending Thread ---");
        MyThread t1 = new MyThread("Thread-A");
        MyThread t2 = new MyThread("Thread-B");
        t1.start(); // start() creates a new thread; run() would run in current thread
        t2.start();
        t1.join(); // wait for t1 to finish
        t2.join(); // wait for t2 to finish
        System.out.println("Both threads finished.\n");

        // ===== METHOD 2: Implement Runnable =====
        System.out.println("--- Implementing Runnable ---");
        Thread t3 = new Thread(new MyRunnable(), "Runnable-A");
        Thread t4 = new Thread(new MyRunnable(), "Runnable-B");
        t3.start();
        t4.start();
        t3.join();
        t4.join();
        System.out.println("Runnable threads finished.\n");

        // ===== METHOD 3: Lambda (shortest way) =====
        System.out.println("--- Lambda Thread ---");
        Thread t5 = new Thread(() -> {
            System.out.println("Lambda thread running: " + Thread.currentThread().getName());
        }, "Lambda-Thread");
        t5.start();
        t5.join();

        // ===== RACE CONDITION (Problem) =====
        System.out.println("\n--- Race Condition Demo ---");
        sharedCounter = 0;
        Thread inc1 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) sharedCounter++;
        });
        Thread inc2 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) sharedCounter++;
        });
        inc1.start(); inc2.start();
        inc1.join(); inc2.join();
        System.out.println("Without sync (expected 20000): " + sharedCounter);

        // ===== SYNCHRONIZED (Fix) =====
        sharedCounter = 0;
        Thread sync1 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                synchronized (lock) { sharedCounter++; }
            }
        });
        Thread sync2 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                synchronized (lock) { sharedCounter++; }
            }
        });
        sync1.start(); sync2.start();
        sync1.join(); sync2.join();
        System.out.println("With sync (expected 20000): " + sharedCounter);

        // ===== THREAD SLEEP =====
        System.out.println("\n--- Thread.sleep() ---");
        System.out.println("Sleeping for 1 second...");
        Thread.sleep(1000);
        System.out.println("Awake!");

        // ===== THREAD INFO =====
        System.out.println("\n--- Thread Info ---");
        Thread current = Thread.currentThread();
        System.out.println("Name: " + current.getName());
        System.out.println("ID: " + current.getId());
        System.out.println("Priority: " + current.getPriority());
        System.out.println("State: " + current.getState());
    }
}

// Way 1: Extend Thread
class MyThread extends Thread {
    MyThread(String name) { super(name); }

    @Override
    public void run() {
        for (int i = 1; i <= 3; i++) {
            System.out.println(getName() + " - Count: " + i);
            try { Thread.sleep(100); } catch (InterruptedException e) { e.printStackTrace(); }
        }
    }
}

// Way 2: Implement Runnable (preferred - allows extending another class)
class MyRunnable implements Runnable {
    @Override
    public void run() {
        for (int i = 1; i <= 3; i++) {
            System.out.println(Thread.currentThread().getName() + " - Count: " + i);
            try { Thread.sleep(100); } catch (InterruptedException e) { e.printStackTrace(); }
        }
    }
}
