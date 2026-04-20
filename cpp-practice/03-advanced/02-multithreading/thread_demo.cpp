/**
 * LESSON: Multithreading (C++11)
 * Compile with: g++ -std=c++17 -pthread thread_demo.cpp -o thread_demo
 */
#include <iostream>
#include <thread>
#include <mutex>
#include <vector>
#include <atomic>
#include <chrono>
#include <future>

std::mutex mtx;
int sharedCounter = 0;
std::atomic<int> atomicCounter{0};

void printTask(const std::string& name, int count) {
    for (int i = 0; i < count; i++) {
        std::lock_guard<std::mutex> lock(mtx); // RAII lock
        std::cout << name << " - " << i << "\n";
    }
}

void unsafeIncrement(int times) {
    for (int i = 0; i < times; i++) sharedCounter++;
}

void safeIncrement(int times) {
    for (int i = 0; i < times; i++) {
        std::lock_guard<std::mutex> lock(mtx);
        sharedCounter++;
    }
}

void atomicIncrement(int times) {
    for (int i = 0; i < times; i++) atomicCounter++;
}

int heavyComputation(int n) {
    std::this_thread::sleep_for(std::chrono::seconds(1));
    return n * n;
}

int main() {
    // ===== BASIC THREADS =====
    std::cout << "--- Basic Threads ---\n";
    std::thread t1(printTask, "Thread-A", 3);
    std::thread t2(printTask, "Thread-B", 3);

    t1.join(); // wait for thread to finish
    t2.join();

    // ===== LAMBDA THREADS =====
    std::cout << "\n--- Lambda Thread ---\n";
    std::thread t3([] {
        std::cout << "Lambda thread on: " << std::this_thread::get_id() << "\n";
    });
    t3.join();

    // ===== RACE CONDITION =====
    std::cout << "\n--- Race Condition ---\n";
    sharedCounter = 0;
    std::vector<std::thread> threads;
    for (int i = 0; i < 10; i++) {
        threads.emplace_back(unsafeIncrement, 10000);
    }
    for (auto& t : threads) t.join();
    std::cout << "Unsafe (expected 100000): " << sharedCounter << "\n";

    // ===== MUTEX FIX =====
    sharedCounter = 0;
    threads.clear();
    for (int i = 0; i < 10; i++) {
        threads.emplace_back(safeIncrement, 10000);
    }
    for (auto& t : threads) t.join();
    std::cout << "With mutex (expected 100000): " << sharedCounter << "\n";

    // ===== ATOMIC =====
    atomicCounter = 0;
    threads.clear();
    for (int i = 0; i < 10; i++) {
        threads.emplace_back(atomicIncrement, 10000);
    }
    for (auto& t : threads) t.join();
    std::cout << "Atomic (expected 100000): " << atomicCounter.load() << "\n";

    // ===== ASYNC & FUTURE =====
    std::cout << "\n--- async & future ---\n";
    auto start = std::chrono::high_resolution_clock::now();

    auto future1 = std::async(std::launch::async, heavyComputation, 5);
    auto future2 = std::async(std::launch::async, heavyComputation, 10);

    std::cout << "5² = " << future1.get() << "\n"; // blocks until ready
    std::cout << "10² = " << future2.get() << "\n";

    auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::high_resolution_clock::now() - start).count();
    std::cout << "Time: " << elapsed << "ms (parallel, not 2000ms!)\n";

    // ===== THREAD INFO =====
    std::cout << "\n--- Thread Info ---\n";
    std::cout << "Hardware threads: " << std::thread::hardware_concurrency() << "\n";
    std::cout << "Main thread ID: " << std::this_thread::get_id() << "\n";

    return 0;
}
