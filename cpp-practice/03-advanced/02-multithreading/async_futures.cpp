/**
 * LESSON: Async, Futures, and Promises
 * High-level concurrency primitives for returning values from threads.
 * std::async is the simplest way to run work asynchronously.
 *
 * Compile: g++ -std=c++17 -pthread -o async async_futures.cpp
 * Run:     ./async
 */
#include <iostream>
#include <future>
#include <thread>
#include <chrono>
#include <vector>
#include <numeric>
#include <cmath>

// ===== HELPER: Simulate expensive computation =====
long long factorial(int n) {
    long long result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    return result;
}

double computePi(int terms) {
    double sum = 0;
    for (int i = 0; i < terms; i++) {
        sum += (i % 2 == 0 ? 1.0 : -1.0) / (2 * i + 1);
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(150));
    return 4.0 * sum;
}

int main() {
    // ===== STD::ASYNC =====
    std::cout << "--- std::async ---\n";
    auto start = std::chrono::steady_clock::now();

    // Launch async tasks (may run in new thread)
    std::future<long long> factFuture = std::async(std::launch::async, factorial, 20);
    std::future<double> piFuture = std::async(std::launch::async, computePi, 1000000);

    std::cout << "  Tasks launched, doing other work...\n";

    // get() blocks until result is ready
    long long factResult = factFuture.get();
    double piResult = piFuture.get();

    auto elapsed = std::chrono::steady_clock::now() - start;
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(elapsed).count();

    std::cout << "  factorial(20) = " << factResult << "\n";
    std::cout << "  pi ≈ " << piResult << "\n";
    std::cout << "  Time: " << ms << "ms (ran in parallel!)\n";

    // ===== LAUNCH POLICIES =====
    std::cout << "\n--- Launch Policies ---\n";

    // std::launch::async - guaranteed new thread
    auto f1 = std::async(std::launch::async, [] {
        std::cout << "  [async] Running in thread " << std::this_thread::get_id() << "\n";
        return 42;
    });

    // std::launch::deferred - lazy evaluation, runs when get() is called
    auto f2 = std::async(std::launch::deferred, [] {
        std::cout << "  [deferred] Running lazily\n";
        return 99;
    });

    std::cout << "  f1 = " << f1.get() << "\n";
    std::cout << "  f2 = " << f2.get() << " (computed now)\n";

    // ===== STD::FUTURE - wait() and wait_for() =====
    std::cout << "\n--- Future wait_for ---\n";
    auto slowTask = std::async(std::launch::async, [] {
        std::this_thread::sleep_for(std::chrono::milliseconds(200));
        return std::string("Done!");
    });

    // Poll without blocking
    auto status = slowTask.wait_for(std::chrono::milliseconds(50));
    if (status == std::future_status::ready) {
        std::cout << "  Ready immediately\n";
    } else if (status == std::future_status::timeout) {
        std::cout << "  Not ready yet (timeout), waiting...\n";
    }
    std::cout << "  Result: " << slowTask.get() << "\n";

    // ===== STD::PROMISE =====
    std::cout << "\n--- std::promise ---\n";
    std::promise<int> promise;
    std::future<int> promiseFuture = promise.get_future();

    // Producer thread sets the value
    std::thread producer([&promise] {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        promise.set_value(42);
        std::cout << "  [Promise] Value set\n";
    });

    // Consumer waits for the value
    std::cout << "  [Main] Waiting for promise...\n";
    int val = promiseFuture.get();
    std::cout << "  [Main] Got: " << val << "\n";
    producer.join();

    // ===== EXCEPTION PROPAGATION =====
    std::cout << "\n--- Exception Through Futures ---\n";
    auto failingTask = std::async(std::launch::async, [] {
        throw std::runtime_error("Task failed!");
        return 0;
    });

    try {
        failingTask.get();  // rethrows the exception
    } catch (const std::exception& e) {
        std::cout << "  Caught from future: " << e.what() << "\n";
    }

    // Promise with exception
    std::promise<int> failPromise;
    auto failFuture = failPromise.get_future();
    failPromise.set_exception(std::make_exception_ptr(
        std::runtime_error("Promise broken!")));
    try {
        failFuture.get();
    } catch (const std::exception& e) {
        std::cout << "  Caught from promise: " << e.what() << "\n";
    }

    // ===== STD::PACKAGED_TASK =====
    std::cout << "\n--- std::packaged_task ---\n";
    // Wraps a callable so it can return a future
    std::packaged_task<int(int, int)> task([](int a, int b) {
        return a + b;
    });
    auto taskFuture = task.get_future();

    std::thread taskThread(std::move(task), 30, 12);
    std::cout << "  packaged_task result: " << taskFuture.get() << "\n";
    taskThread.join();

    // ===== PARALLEL COMPUTATION =====
    std::cout << "\n--- Parallel Computation ---\n";
    std::vector<std::future<long long>> futures;
    for (int i = 10; i <= 20; i += 5) {
        futures.push_back(std::async(std::launch::async, factorial, i));
    }

    for (size_t i = 0; i < futures.size(); i++) {
        std::cout << "  Result " << i << ": " << futures[i].get() << "\n";
    }

    return 0;
}
