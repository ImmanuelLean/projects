/**
 * LESSON: Strategy Pattern
 * Define a family of algorithms, encapsulate each one, and make them
 * interchangeable at runtime. The strategy lets the algorithm vary
 * independently from clients that use it.
 *
 * Compile: g++ -std=c++17 -o strategy strategy_pattern.cpp
 * Run:     ./strategy
 */
#include <iostream>
#include <vector>
#include <string>
#include <memory>
#include <algorithm>
#include <functional>

// ===== STRATEGY INTERFACE =====
class SortStrategy {
public:
    virtual ~SortStrategy() = default;
    virtual void sort(std::vector<int>& data) = 0;
    virtual std::string name() const = 0;
};

// ===== CONCRETE STRATEGIES =====
class BubbleSort : public SortStrategy {
public:
    void sort(std::vector<int>& data) override {
        for (size_t i = 0; i < data.size(); i++)
            for (size_t j = 0; j < data.size() - i - 1; j++)
                if (data[j] > data[j + 1])
                    std::swap(data[j], data[j + 1]);
    }
    std::string name() const override { return "BubbleSort"; }
};

class SelectionSort : public SortStrategy {
public:
    void sort(std::vector<int>& data) override {
        for (size_t i = 0; i < data.size(); i++) {
            size_t minIdx = i;
            for (size_t j = i + 1; j < data.size(); j++)
                if (data[j] < data[minIdx]) minIdx = j;
            std::swap(data[i], data[minIdx]);
        }
    }
    std::string name() const override { return "SelectionSort"; }
};

class QuickSort : public SortStrategy {
    void qsort(std::vector<int>& data, int lo, int hi) {
        if (lo >= hi) return;
        int pivot = data[hi], i = lo;
        for (int j = lo; j < hi; j++)
            if (data[j] < pivot) std::swap(data[i++], data[j]);
        std::swap(data[i], data[hi]);
        qsort(data, lo, i - 1);
        qsort(data, i + 1, hi);
    }
public:
    void sort(std::vector<int>& data) override {
        if (!data.empty()) qsort(data, 0, data.size() - 1);
    }
    std::string name() const override { return "QuickSort"; }
};

// ===== CONTEXT (uses a strategy) =====
class Sorter {
    std::unique_ptr<SortStrategy> strategy;

public:
    void setStrategy(std::unique_ptr<SortStrategy> s) {
        strategy = std::move(s);
    }

    void sort(std::vector<int>& data) {
        if (strategy) {
            std::cout << "  Sorting with " << strategy->name() << ": ";
            strategy->sort(data);
            for (int n : data) std::cout << n << " ";
            std::cout << "\n";
        }
    }
};

// ===== PRACTICAL: Payment Processing =====
class PaymentStrategy {
public:
    virtual ~PaymentStrategy() = default;
    virtual bool pay(double amount) = 0;
};

class CreditCard : public PaymentStrategy {
    std::string number;
public:
    CreditCard(const std::string& n) : number(n) {}
    bool pay(double amount) override {
        std::cout << "  Paid $" << amount << " with Credit Card ****"
                  << number.substr(number.size() - 4) << "\n";
        return true;
    }
};

class PayPal : public PaymentStrategy {
    std::string email;
public:
    PayPal(const std::string& e) : email(e) {}
    bool pay(double amount) override {
        std::cout << "  Paid $" << amount << " via PayPal (" << email << ")\n";
        return true;
    }
};

class Crypto : public PaymentStrategy {
    std::string wallet;
public:
    Crypto(const std::string& w) : wallet(w) {}
    bool pay(double amount) override {
        std::cout << "  Paid $" << amount << " in crypto to " << wallet << "\n";
        return true;
    }
};

class ShoppingCart {
    std::vector<std::pair<std::string, double>> items;

public:
    void addItem(const std::string& name, double price) {
        items.push_back({name, price});
    }

    double total() const {
        double sum = 0;
        for (const auto& [name, price] : items) sum += price;
        return sum;
    }

    void checkout(PaymentStrategy& payment) {
        std::cout << "  Cart items:\n";
        for (const auto& [name, price] : items)
            std::cout << "    - " << name << ": $" << price << "\n";
        payment.pay(total());
    }
};

// ===== MODERN: Lambda-based strategy =====
void sortWith(std::vector<int>& data,
              std::function<bool(int, int)> comparator,
              const std::string& desc) {
    std::sort(data.begin(), data.end(), comparator);
    std::cout << "  " << desc << ": ";
    for (int n : data) std::cout << n << " ";
    std::cout << "\n";
}

int main() {
    // --- Sorting strategies ---
    std::cout << "--- Sorting Strategies ---\n";
    Sorter sorter;
    std::vector<int> data = {64, 25, 12, 22, 11};

    sorter.setStrategy(std::make_unique<BubbleSort>());
    auto d1 = data;
    sorter.sort(d1);

    sorter.setStrategy(std::make_unique<SelectionSort>());
    auto d2 = data;
    sorter.sort(d2);

    sorter.setStrategy(std::make_unique<QuickSort>());
    auto d3 = data;
    sorter.sort(d3);

    // --- Payment strategies ---
    std::cout << "\n--- Payment Strategies ---\n";
    ShoppingCart cart;
    cart.addItem("Laptop", 999.99);
    cart.addItem("Mouse", 29.99);

    CreditCard cc("4111111111111111");
    cart.checkout(cc);

    PayPal pp("emmanuel@email.com");
    cart.checkout(pp);

    // --- Lambda-based strategies ---
    std::cout << "\n--- Lambda Strategies ---\n";
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};

    sortWith(nums, [](int a, int b) { return a < b; }, "Ascending");
    sortWith(nums, [](int a, int b) { return a > b; }, "Descending");
    sortWith(nums, [](int a, int b) { return (a % 2) < (b % 2); }, "Evens first");

    return 0;
}
