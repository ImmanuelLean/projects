/**
 * LESSON: Mutex and Locks
 * Mutexes protect shared data from race conditions in multithreaded programs.
 * RAII lock guards ensure mutexes are always released.
 *
 * Compile: g++ -std=c++17 -pthread -o mutex mutex_locks.cpp
 * Run:     ./mutex
 */
#include <iostream>
#include <thread>
#include <mutex>
#include <vector>
#include <string>

// ===== RACE CONDITION (without mutex) =====
int unsafeCounter = 0;

void unsafeIncrement(int iterations) {
    for (int i = 0; i < iterations; i++) {
        unsafeCounter++;  // NOT thread-safe! Read-modify-write is not atomic
    }
}

// ===== FIX: Using std::mutex =====
int safeCounter = 0;
std::mutex counterMutex;

void safeIncrement(int iterations) {
    for (int i = 0; i < iterations; i++) {
        counterMutex.lock();
        safeCounter++;
        counterMutex.unlock();
    }
}

// ===== BETTER: std::lock_guard (RAII) =====
int guardedCounter = 0;
std::mutex guardMutex;

void guardedIncrement(int iterations) {
    for (int i = 0; i < iterations; i++) {
        std::lock_guard<std::mutex> lock(guardMutex);  // auto-unlocks
        guardedCounter++;
    }
    // mutex automatically released when lock goes out of scope
}

// ===== std::unique_lock (flexible locking) =====
int uniqueCounter = 0;
std::mutex uniqueMutex;

void flexibleIncrement(int iterations) {
    for (int i = 0; i < iterations; i++) {
        std::unique_lock<std::mutex> lock(uniqueMutex);
        uniqueCounter++;
        lock.unlock();  // can manually unlock early
        // ... do other work without holding the lock ...
    }
}

// ===== std::scoped_lock (C++17, multiple mutexes) =====
struct BankAccount {
    std::string name;
    double balance;
    std::mutex mtx;
    BankAccount(const std::string& n, double b) : name(n), balance(b) {}
};

void transfer(BankAccount& from, BankAccount& to, double amount) {
    // Lock BOTH mutexes without deadlock risk
    std::scoped_lock lock(from.mtx, to.mtx);
    if (from.balance >= amount) {
        from.balance -= amount;
        to.balance += amount;
        std::cout << "  Transferred $" << amount << " from "
                  << from.name << " to " << to.name << "\n";
    }
}

int main() {
    const int ITERATIONS = 100000;

    // --- Race condition ---
    std::cout << "--- Race Condition (no mutex) ---\n";
    {
        std::thread t1(unsafeIncrement, ITERATIONS);
        std::thread t2(unsafeIncrement, ITERATIONS);
        t1.join();
        t2.join();
        std::cout << "  Expected: " << ITERATIONS * 2
                  << ", Got: " << unsafeCounter << " (likely wrong!)\n";
    }

    // --- std::mutex ---
    std::cout << "\n--- std::mutex ---\n";
    {
        std::thread t1(safeIncrement, ITERATIONS);
        std::thread t2(safeIncrement, ITERATIONS);
        t1.join();
        t2.join();
        std::cout << "  Expected: " << ITERATIONS * 2
                  << ", Got: " << safeCounter << " (correct!)\n";
    }

    // --- lock_guard ---
    std::cout << "\n--- std::lock_guard (RAII) ---\n";
    {
        std::thread t1(guardedIncrement, ITERATIONS);
        std::thread t2(guardedIncrement, ITERATIONS);
        t1.join();
        t2.join();
        std::cout << "  Expected: " << ITERATIONS * 2
                  << ", Got: " << guardedCounter << " (correct!)\n";
    }

    // --- unique_lock ---
    std::cout << "\n--- std::unique_lock (flexible) ---\n";
    {
        std::thread t1(flexibleIncrement, ITERATIONS);
        std::thread t2(flexibleIncrement, ITERATIONS);
        t1.join();
        t2.join();
        std::cout << "  Expected: " << ITERATIONS * 2
                  << ", Got: " << uniqueCounter << " (correct!)\n";
    }

    // --- scoped_lock (deadlock-free multiple mutex) ---
    std::cout << "\n--- std::scoped_lock (C++17) ---\n";
    {
        BankAccount alice("Alice", 1000);
        BankAccount bob("Bob", 1000);

        // These could deadlock without scoped_lock!
        std::thread t1(transfer, std::ref(alice), std::ref(bob), 100);
        std::thread t2(transfer, std::ref(bob), std::ref(alice), 50);
        t1.join();
        t2.join();

        std::cout << "  Alice: $" << alice.balance << "\n";
        std::cout << "  Bob:   $" << bob.balance << "\n";
        std::cout << "  Total: $" << (alice.balance + bob.balance) << " (should be 2000)\n";
    }

    // --- Summary ---
    std::cout << "\n--- When to Use Which ---\n";
    std::cout << "  lock_guard:  Simple scope-based locking (most common)\n";
    std::cout << "  unique_lock: Need to unlock early, or use with condition_variable\n";
    std::cout << "  scoped_lock: Lock multiple mutexes (C++17, deadlock-free)\n";

    return 0;
}
