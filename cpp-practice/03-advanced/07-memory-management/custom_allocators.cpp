/**
 * LESSON: Custom Allocators
 * Arena (bump) allocators, pool allocators, and placement new.
 * Shows how to control memory layout for performance.
 *
 * Compile: g++ -std=c++17 -o custom_alloc custom_allocators.cpp
 * Run:     ./custom_alloc
 */
#include <iostream>
#include <vector>
#include <memory>
#include <cstring>
#include <new>
#include <cassert>

// ===== ARENA (BUMP) ALLOCATOR =====
class Arena {
    char* buffer_;
    std::size_t capacity_;
    std::size_t offset_ = 0;

public:
    explicit Arena(std::size_t bytes)
        : buffer_(new char[bytes]), capacity_(bytes) {}

    ~Arena() { delete[] buffer_; }

    Arena(const Arena&) = delete;
    Arena& operator=(const Arena&) = delete;

    void* allocate(std::size_t bytes, std::size_t alignment = alignof(std::max_align_t)) {
        std::size_t aligned = (offset_ + alignment - 1) & ~(alignment - 1);
        if (aligned + bytes > capacity_) throw std::bad_alloc();
        void* ptr = buffer_ + aligned;
        offset_ = aligned + bytes;
        return ptr;
    }

    void reset() { offset_ = 0; }
    std::size_t used() const { return offset_; }
    std::size_t remaining() const { return capacity_ - offset_; }
};

// ===== PLACEMENT NEW =====
struct Sensor {
    int id;
    double reading;

    Sensor(int i, double r) : id(i), reading(r) {
        std::cout << "  Sensor(" << id << ", " << reading << ") constructed\n";
    }
    ~Sensor() {
        std::cout << "  Sensor(" << id << ") destroyed\n";
    }
};

void demonstratePlacementNew() {
    std::cout << "--- Placement New ---\n";

    // Allocate raw memory (no constructors called)
    alignas(Sensor) char buffer[sizeof(Sensor) * 3];

    // Construct objects in-place
    Sensor* s1 = new (buffer) Sensor(1, 23.5);
    Sensor* s2 = new (buffer + sizeof(Sensor)) Sensor(2, 18.7);
    Sensor* s3 = new (buffer + 2 * sizeof(Sensor)) Sensor(3, 42.1);

    std::cout << "Readings: " << s1->reading << ", "
              << s2->reading << ", " << s3->reading << "\n";

    // Must manually call destructors (no delete!)
    s3->~Sensor();
    s2->~Sensor();
    s1->~Sensor();
}

// ===== POOL ALLOCATOR =====
template<std::size_t BlockSize, std::size_t BlockCount>
class PoolAllocator {
    union Block {
        char data[BlockSize];
        Block* next;
    };

    Block blocks_[BlockCount];
    Block* freeList_ = nullptr;

public:
    PoolAllocator() {
        for (std::size_t i = 0; i < BlockCount; ++i) {
            blocks_[i].next = freeList_;
            freeList_ = &blocks_[i];
        }
    }

    void* allocate() {
        if (!freeList_) throw std::bad_alloc();
        Block* block = freeList_;
        freeList_ = block->next;
        return block->data;
    }

    void deallocate(void* ptr) {
        Block* block = reinterpret_cast<Block*>(ptr);
        block->next = freeList_;
        freeList_ = block;
    }

    std::size_t freeCount() const {
        std::size_t count = 0;
        for (Block* b = freeList_; b; b = b->next) ++count;
        return count;
    }
};

// ===== STL-COMPATIBLE ALLOCATOR =====
template<typename T>
class ArenaAllocator {
    Arena* arena_;

public:
    using value_type = T;

    explicit ArenaAllocator(Arena* a) : arena_(a) {}

    template<typename U>
    ArenaAllocator(const ArenaAllocator<U>& other) : arena_(other.arena()) {}

    T* allocate(std::size_t n) {
        return static_cast<T*>(arena_->allocate(n * sizeof(T), alignof(T)));
    }

    void deallocate(T*, std::size_t) {}

    Arena* arena() const { return arena_; }

    template<typename U>
    bool operator==(const ArenaAllocator<U>& other) const {
        return arena_ == other.arena();
    }

    template<typename U>
    bool operator!=(const ArenaAllocator<U>& other) const {
        return !(*this == other);
    }
};

int main() {
    // ===== ARENA ALLOCATOR =====
    std::cout << "--- Arena Allocator ---\n";
    Arena arena(1024);

    int* a = static_cast<int*>(arena.allocate(sizeof(int)));
    *a = 42;
    std::cout << "Allocated int: " << *a << "\n";

    double* b = static_cast<double*>(arena.allocate(sizeof(double)));
    *b = 3.14;
    std::cout << "Allocated double: " << *b << "\n";
    std::cout << "Used: " << arena.used() << " / 1024 bytes\n";

    arena.reset();
    std::cout << "After reset, used: " << arena.used() << "\n\n";

    // ===== PLACEMENT NEW =====
    demonstratePlacementNew();

    // ===== POOL ALLOCATOR =====
    std::cout << "\n--- Pool Allocator ---\n";
    PoolAllocator<64, 8> pool;
    std::cout << "Free blocks: " << pool.freeCount() << "\n";

    void* p1 = pool.allocate();
    void* p2 = pool.allocate();
    void* p3 = pool.allocate();
    std::cout << "After 3 allocs, free: " << pool.freeCount() << "\n";

    pool.deallocate(p2);
    std::cout << "After 1 dealloc, free: " << pool.freeCount() << "\n";

    void* p4 = pool.allocate();
    std::cout << "p2 == p4 (reused): " << std::boolalpha << (p2 == p4) << "\n";

    pool.deallocate(p1);
    pool.deallocate(p3);
    pool.deallocate(p4);

    // ===== POOL + PLACEMENT NEW =====
    std::cout << "\n--- Pool + Placement New ---\n";
    PoolAllocator<sizeof(Sensor), 4> sensorPool;
    Sensor* s = new (sensorPool.allocate()) Sensor(10, 99.9);
    std::cout << "Pooled sensor: id=" << s->id << " reading=" << s->reading << "\n";
    s->~Sensor();
    sensorPool.deallocate(s);

    // ===== STL-COMPATIBLE ALLOCATOR =====
    std::cout << "\n--- STL Arena Allocator ---\n";
    Arena stlArena(4096);
    ArenaAllocator<int> alloc(&stlArena);

    std::vector<int, ArenaAllocator<int>> vec(alloc);
    for (int i = 1; i <= 10; ++i) vec.push_back(i * 10);

    std::cout << "Vector contents: ";
    for (int v : vec) std::cout << v << " ";
    std::cout << "\nArena used: " << stlArena.used() << " bytes\n";

    return 0;
}
