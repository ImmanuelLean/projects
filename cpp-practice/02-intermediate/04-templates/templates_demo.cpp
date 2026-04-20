/**
 * LESSON: Templates
 * Write generic code that works with any type.
 * Compile-time polymorphism - the compiler generates specific versions.
 */
#include <iostream>
#include <string>
#include <vector>

// ===== FUNCTION TEMPLATE =====
template <typename T>
T maxOf(T a, T b) {
    return (a > b) ? a : b;
}

// Template with multiple type parameters
template <typename T, typename U>
void printPair(const T& first, const U& second) {
    std::cout << "(" << first << ", " << second << ")\n";
}

// Template specialization for a specific type
template <typename T>
void printType(const T& val) {
    std::cout << "Generic: " << val << "\n";
}

template <>
void printType<bool>(const bool& val) {
    std::cout << "Boolean: " << (val ? "true" : "false") << "\n";
}

// ===== CLASS TEMPLATE =====
template <typename T>
class Box {
    T value;
public:
    Box(const T& val) : value(val) {}
    T getValue() const { return value; }
    void setValue(const T& val) { value = val; }
    void display() const {
        std::cout << "Box<" << typeid(T).name() << ">: " << value << "\n";
    }
};

// Class template with multiple types
template <typename K, typename V>
class Pair {
    K key;
    V val;
public:
    Pair(const K& k, const V& v) : key(k), val(v) {}
    K getKey() const { return key; }
    V getVal() const { return val; }
    void display() const {
        std::cout << key << " -> " << val << "\n";
    }
};

// Template with non-type parameter
template <typename T, int SIZE>
class StaticArray {
    T data[SIZE];
public:
    void set(int index, const T& val) { data[index] = val; }
    T get(int index) const { return data[index]; }
    constexpr int size() const { return SIZE; }
    void display() const {
        for (int i = 0; i < SIZE; i++) {
            std::cout << data[i] << " ";
        }
        std::cout << "\n";
    }
};

// ===== VARIADIC TEMPLATE (C++11) =====
// Base case
void printAll() { std::cout << "\n"; }

// Recursive case
template <typename T, typename... Args>
void printAll(const T& first, const Args&... rest) {
    std::cout << first << " ";
    printAll(rest...);
}

int main() {
    // ===== FUNCTION TEMPLATES =====
    std::cout << "--- Function Templates ---\n";
    std::cout << "max(3, 7) = " << maxOf(3, 7) << "\n";
    std::cout << "max(3.14, 2.72) = " << maxOf(3.14, 2.72) << "\n";
    std::cout << "max('a', 'z') = " << maxOf('a', 'z') << "\n";

    std::cout << "\n--- Multiple Types ---\n";
    printPair(1, "hello");
    printPair(3.14, 42);

    std::cout << "\n--- Specialization ---\n";
    printType(42);
    printType(std::string("hello"));
    printType(true); // uses specialized version

    // ===== CLASS TEMPLATES =====
    std::cout << "\n--- Class Templates ---\n";
    Box<int> intBox(42);
    Box<std::string> strBox("Hello Templates!");
    Box<double> dblBox(3.14);

    intBox.display();
    strBox.display();
    dblBox.display();

    std::cout << "\n--- Pair ---\n";
    Pair<std::string, int> student("Emmanuel", 95);
    student.display();

    std::cout << "\n--- Static Array ---\n";
    StaticArray<int, 5> arr;
    for (int i = 0; i < 5; i++) arr.set(i, (i + 1) * 10);
    arr.display();

    // ===== VARIADIC TEMPLATES =====
    std::cout << "\n--- Variadic Template ---\n";
    printAll(1, 2.5, "hello", 'A', true);
    printAll("just", "strings");

    return 0;
}
