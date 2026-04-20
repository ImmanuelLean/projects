/**
 * LESSON: RAII & Memory Management
 * RAII = Resource Acquisition Is Initialization
 * Acquire resources in constructor, release in destructor.
 * The foundation of safe C++ programming.
 */
#include <iostream>
#include <memory>
#include <fstream>
#include <mutex>
#include <vector>

// ===== RAII FILE HANDLE =====
class FileHandle {
    std::ofstream file;
    std::string filename;
public:
    FileHandle(const std::string& name) : filename(name) {
        file.open(name);
        if (!file.is_open()) throw std::runtime_error("Cannot open: " + name);
        std::cout << "  [File opened: " << name << "]\n";
    }

    ~FileHandle() {
        if (file.is_open()) {
            file.close();
            std::cout << "  [File closed: " << filename << "]\n";
        }
    }

    // Delete copy (non-copyable resource)
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;

    // Allow move
    FileHandle(FileHandle&& other) noexcept
        : file(std::move(other.file)), filename(std::move(other.filename)) {}

    void write(const std::string& data) {
        file << data;
    }
};

// ===== RAII LOCK GUARD (simplified) =====
class SimpleLockGuard {
    std::mutex& mtx;
public:
    SimpleLockGuard(std::mutex& m) : mtx(m) {
        mtx.lock();
        std::cout << "  [Mutex locked]\n";
    }
    ~SimpleLockGuard() {
        mtx.unlock();
        std::cout << "  [Mutex unlocked]\n";
    }
    SimpleLockGuard(const SimpleLockGuard&) = delete;
    SimpleLockGuard& operator=(const SimpleLockGuard&) = delete;
};

// ===== RULE OF FIVE =====
class Buffer {
    int* data;
    size_t size;
public:
    // 1. Constructor
    Buffer(size_t sz) : data(new int[sz]), size(sz) {
        std::fill(data, data + sz, 0);
        std::cout << "  [Buffer constructed, size=" << sz << "]\n";
    }

    // 2. Destructor
    ~Buffer() {
        delete[] data;
        std::cout << "  [Buffer destroyed]\n";
    }

    // 3. Copy constructor
    Buffer(const Buffer& other) : data(new int[other.size]), size(other.size) {
        std::copy(other.data, other.data + size, data);
        std::cout << "  [Buffer copy constructed]\n";
    }

    // 4. Move constructor
    Buffer(Buffer&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
        std::cout << "  [Buffer move constructed]\n";
    }

    // 5. Copy assignment
    Buffer& operator=(const Buffer& other) {
        if (this != &other) {
            delete[] data;
            size = other.size;
            data = new int[size];
            std::copy(other.data, other.data + size, data);
        }
        return *this;
    }

    // 5b. Move assignment
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }

    size_t getSize() const { return size; }
};

// ===== RULE OF ZERO =====
// If you use smart pointers and standard containers,
// you don't need to write any of the Rule of Five!
class ModernBuffer {
    std::vector<int> data; // handles everything automatically!
public:
    ModernBuffer(size_t sz) : data(sz, 0) {}
    size_t getSize() const { return data.size(); }
    // No destructor, copy, or move needed! Compiler generates correct ones.
};

int main() {
    // ===== RAII IN ACTION =====
    std::cout << "--- RAII File Handle ---\n";
    {
        FileHandle fh("raii_test.txt");
        fh.write("RAII manages resources automatically!\n");
    } // destructor closes file here

    // ===== RAII MUTEX =====
    std::cout << "\n--- RAII Lock Guard ---\n";
    std::mutex mtx;
    {
        SimpleLockGuard guard(mtx);
        std::cout << "  Critical section\n";
    } // destructor unlocks mutex

    // ===== RULE OF FIVE =====
    std::cout << "\n--- Rule of Five ---\n";
    Buffer b1(10);
    Buffer b2 = b1;           // copy
    Buffer b3 = std::move(b1); // move

    // ===== RULE OF ZERO =====
    std::cout << "\n--- Rule of Zero ---\n";
    ModernBuffer mb(10);
    ModernBuffer mb2 = mb;              // works!
    ModernBuffer mb3 = std::move(mb);   // works!
    std::cout << "  ModernBuffer size: " << mb2.getSize() << "\n";

    // ===== BEST PRACTICES =====
    std::cout << "\n--- Best Practices ---\n";
    std::cout << "1. Prefer Rule of Zero (use std containers and smart ptrs)\n";
    std::cout << "2. If you write a destructor, write all 5 special functions\n";
    std::cout << "3. Use make_unique/make_shared, never raw new\n";
    std::cout << "4. RAII for all resources (files, locks, sockets, etc.)\n";

    // Cleanup
    std::remove("raii_test.txt");

    return 0;
}
