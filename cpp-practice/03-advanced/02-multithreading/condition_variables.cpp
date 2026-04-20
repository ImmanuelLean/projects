/**
 * LESSON: Condition Variables
 * condition_variable lets threads wait for a condition to become true.
 * Essential for producer-consumer patterns and thread coordination.
 *
 * Compile: g++ -std=c++17 -pthread -o condvar condition_variables.cpp
 * Run:     ./condvar
 */
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <chrono>
#include <string>

// ===== BASIC CONDITION VARIABLE =====
std::mutex mtx;
std::condition_variable cv;
bool dataReady = false;
std::string sharedData;

void producer() {
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    {
        std::lock_guard<std::mutex> lock(mtx);
        sharedData = "Hello from producer!";
        dataReady = true;
        std::cout << "[Producer] Data prepared\n";
    }
    cv.notify_one();  // wake up one waiting thread
}

void consumer() {
    std::unique_lock<std::mutex> lock(mtx);
    // Wait until dataReady is true
    // The predicate protects against spurious wakeups
    cv.wait(lock, [] { return dataReady; });
    std::cout << "[Consumer] Received: " << sharedData << "\n";
}

// ===== PRODUCER-CONSUMER QUEUE =====
class ThreadSafeQueue {
    std::queue<int> queue;
    std::mutex mtx;
    std::condition_variable cvNotEmpty;
    bool finished = false;

public:
    void push(int value) {
        {
            std::lock_guard<std::mutex> lock(mtx);
            queue.push(value);
            std::cout << "  [Push] " << value << " (size=" << queue.size() << ")\n";
        }
        cvNotEmpty.notify_one();
    }

    bool pop(int& value) {
        std::unique_lock<std::mutex> lock(mtx);
        cvNotEmpty.wait(lock, [this] {
            return !queue.empty() || finished;
        });

        if (queue.empty()) return false;  // finished and empty

        value = queue.front();
        queue.pop();
        std::cout << "  [Pop]  " << value << " (size=" << queue.size() << ")\n";
        return true;
    }

    void done() {
        {
            std::lock_guard<std::mutex> lock(mtx);
            finished = true;
        }
        cvNotEmpty.notify_all();  // wake ALL waiting consumers
    }
};

int main() {
    // --- Basic condition variable ---
    std::cout << "--- Basic Condition Variable ---\n";
    std::thread prod(producer);
    std::thread cons(consumer);
    prod.join();
    cons.join();

    // --- Producer-Consumer Queue ---
    std::cout << "\n--- Producer-Consumer Queue ---\n";
    ThreadSafeQueue queue;

    // Producer thread
    std::thread producerThread([&queue] {
        for (int i = 1; i <= 5; i++) {
            queue.push(i * 10);
            std::this_thread::sleep_for(std::chrono::milliseconds(50));
        }
        queue.done();  // signal no more items
    });

    // Consumer thread
    std::thread consumerThread([&queue] {
        int value;
        while (queue.pop(value)) {
            // process value
        }
        std::cout << "  [Consumer] Queue finished\n";
    });

    producerThread.join();
    consumerThread.join();

    // --- Multiple consumers ---
    std::cout << "\n--- Multiple Consumers ---\n";
    ThreadSafeQueue mqueue;

    std::thread multiProducer([&mqueue] {
        for (int i = 1; i <= 8; i++) {
            mqueue.push(i);
            std::this_thread::sleep_for(std::chrono::milliseconds(20));
        }
        mqueue.done();
    });

    auto consumerFn = [&mqueue](int id) {
        int value;
        while (mqueue.pop(value)) {
            std::cout << "    Consumer " << id << " processed " << value << "\n";
        }
    };

    std::thread c1(consumerFn, 1);
    std::thread c2(consumerFn, 2);

    multiProducer.join();
    c1.join();
    c2.join();

    // --- Key points ---
    std::cout << "\n--- Key Points ---\n";
    std::cout << "1. Always use a predicate with wait() to handle spurious wakeups\n";
    std::cout << "2. notify_one(): wakes one waiting thread\n";
    std::cout << "3. notify_all(): wakes all waiting threads\n";
    std::cout << "4. Must use unique_lock (not lock_guard) with condition_variable\n";
    std::cout << "5. Lock is released during wait(), reacquired when woken\n";

    return 0;
}
