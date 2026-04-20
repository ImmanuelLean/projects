/**
 * LESSON: Hash Table Implementation
 * Hash tables provide O(1) average lookup, insert, and delete.
 * Uses a hash function to map keys to bucket indices.
 *
 * Compile: g++ -std=c++17 -o hashtable hash_table.cpp
 * Run:     ./hashtable
 */
#include <iostream>
#include <vector>
#include <list>
#include <string>
#include <functional>

// ===== CUSTOM HASH TABLE with Separate Chaining =====
template<typename K, typename V>
class HashTable {
    struct Entry {
        K key;
        V value;
        Entry(const K& k, const V& v) : key(k), value(v) {}
    };

    std::vector<std::list<Entry>> buckets;
    size_t count;
    static constexpr double MAX_LOAD_FACTOR = 0.75;

    // Hash function
    size_t hash(const K& key) const {
        return std::hash<K>{}(key) % buckets.size();
    }

    // Rehash when load factor exceeds threshold
    void rehash() {
        auto oldBuckets = std::move(buckets);
        buckets.resize(oldBuckets.size() * 2);
        count = 0;

        for (auto& chain : oldBuckets) {
            for (auto& entry : chain) {
                insert(entry.key, entry.value);
            }
        }
        std::cout << "  [Rehashed to " << buckets.size() << " buckets]\n";
    }

public:
    HashTable(size_t initialSize = 8) : buckets(initialSize), count(0) {}

    // ===== INSERT =====
    void insert(const K& key, const V& value) {
        size_t idx = hash(key);

        // Update if key exists
        for (auto& entry : buckets[idx]) {
            if (entry.key == key) {
                entry.value = value;
                return;
            }
        }

        // Insert new
        buckets[idx].emplace_back(key, value);
        count++;

        // Check load factor
        if (loadFactor() > MAX_LOAD_FACTOR) {
            rehash();
        }
    }

    // ===== SEARCH =====
    bool find(const K& key, V& outValue) const {
        size_t idx = hash(key);
        for (const auto& entry : buckets[idx]) {
            if (entry.key == key) {
                outValue = entry.value;
                return true;
            }
        }
        return false;
    }

    // ===== DELETE =====
    bool remove(const K& key) {
        size_t idx = hash(key);
        auto& chain = buckets[idx];
        for (auto it = chain.begin(); it != chain.end(); ++it) {
            if (it->key == key) {
                chain.erase(it);
                count--;
                return true;
            }
        }
        return false;
    }

    // ===== UTILITIES =====
    size_t size() const { return count; }
    size_t bucketCount() const { return buckets.size(); }
    double loadFactor() const { return static_cast<double>(count) / buckets.size(); }

    bool contains(const K& key) const {
        V dummy;
        return find(key, dummy);
    }

    V& operator[](const K& key) {
        size_t idx = hash(key);
        for (auto& entry : buckets[idx]) {
            if (entry.key == key) return entry.value;
        }
        // Insert default value
        buckets[idx].emplace_back(key, V{});
        count++;
        return buckets[idx].back().value;
    }

    void display() const {
        for (size_t i = 0; i < buckets.size(); i++) {
            if (!buckets[i].empty()) {
                std::cout << "  Bucket " << i << ": ";
                for (const auto& entry : buckets[i]) {
                    std::cout << "[" << entry.key << "=" << entry.value << "] ";
                }
                std::cout << "\n";
            }
        }
    }
};

int main() {
    // --- Basic operations ---
    std::cout << "--- Hash Table Operations ---\n";
    HashTable<std::string, int> ht;

    ht.insert("Alice", 25);
    ht.insert("Bob", 30);
    ht.insert("Charlie", 35);
    ht.insert("Diana", 28);
    ht.insert("Eve", 22);

    std::cout << "After insertions:\n";
    ht.display();
    std::cout << "Size: " << ht.size() << ", Buckets: " << ht.bucketCount()
              << ", Load: " << ht.loadFactor() << "\n";

    // --- Search ---
    std::cout << "\n--- Search ---\n";
    int age;
    if (ht.find("Bob", age)) {
        std::cout << "Bob's age: " << age << "\n";
    }
    std::cout << "Contains 'Eve': " << std::boolalpha << ht.contains("Eve") << "\n";
    std::cout << "Contains 'Zach': " << ht.contains("Zach") << "\n";

    // --- Update ---
    std::cout << "\n--- Update ---\n";
    ht.insert("Bob", 31);  // update existing
    ht.find("Bob", age);
    std::cout << "Bob's updated age: " << age << "\n";

    // --- Delete ---
    std::cout << "\n--- Delete ---\n";
    std::cout << "Remove Charlie: " << ht.remove("Charlie") << "\n";
    std::cout << "Remove Unknown: " << ht.remove("Unknown") << "\n";
    std::cout << "Size after delete: " << ht.size() << "\n";

    // --- operator[] ---
    std::cout << "\n--- operator[] ---\n";
    ht["Frank"] = 40;  // insert via []
    std::cout << "Frank: " << ht["Frank"] << "\n";

    // --- Rehashing demo ---
    std::cout << "\n--- Rehashing (adding many items) ---\n";
    HashTable<int, int> numbers(4);  // small initial size
    for (int i = 0; i < 20; i++) {
        numbers.insert(i, i * i);
    }
    std::cout << "Final size: " << numbers.size()
              << ", Buckets: " << numbers.bucketCount()
              << ", Load: " << numbers.loadFactor() << "\n";

    // --- Collision handling ---
    std::cout << "\n--- How Collisions Work ---\n";
    std::cout << "Separate chaining: each bucket is a linked list\n";
    std::cout << "When hash(key1) == hash(key2), both go in same bucket\n";
    std::cout << "Load factor = items/buckets. Rehash when > 0.75\n";

    return 0;
}
