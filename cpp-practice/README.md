# 🔧 C++ Learning Path — Beginner to Advanced

A comprehensive collection of C++ programs organized from beginner to advanced level. Each file is self-contained with detailed comments explaining the concepts.

## 📁 Structure

### 🟢 01-Beginner
| Topic | File | Concepts |
|-------|------|----------|
| Basics | `hello_world.cpp` | main(), cout, endl, printf |
| Basics | `comments.cpp` | Single-line, multi-line, Doxygen comments |
| Basics | `namespaces.cpp` | std::, using, custom namespaces, nested namespaces |
| Variables | `variables.cpp` | All data types, sizeof, auto, type casting |
| Variables | `constants.cpp` | const, constexpr, #define, const pointers |
| Variables | `references.cpp` | References, pass by value/reference, const ref |
| Operators | `arithmetic_ops.cpp` | +, -, *, /, %, ++, --, cmath functions |
| Operators | `logical_ops.cpp` | &&, \|\|, !, comparison, bitwise, ternary |
| Control Flow | `if_else.cpp` | if/else, nested if, ternary, if with init (C++17) |
| Control Flow | `switch_case.cpp` | switch, enum switch, fallthrough, switch with init |
| Control Flow | `loops.cpp` | for, while, do-while, range-based for, break, continue |
| Arrays | `array_basics.cpp` | C-arrays, std::array, sorting, 2D arrays |
| Arrays | `vectors.cpp` | std::vector, push_back, sort, find, 2D vectors |
| Functions | `function_basics.cpp` | Parameters, overloading, default params, lambdas |
| Functions | `recursion.cpp` | Factorial, Fibonacci, power, reverse string |
| Strings | `string_basics.cpp` | std::string methods, conversions, splitting |
| Input/Output | `user_input.cpp` | cin, getline, input validation, formatted output |
| Pointers | `pointers.cpp` | &, *, new/delete, pointer arithmetic, void pointer |

### 🟡 02-Intermediate
| Topic | File | Concepts |
|-------|------|----------|
| OOP | `classes_and_objects.cpp` | Classes, constructors, destructors, this pointer |
| Inheritance | `inheritance_demo.cpp` | extends, virtual, override, upcasting, multilevel |
| Polymorphism | `polymorphism_demo.cpp` | Virtual functions, abstract classes, dynamic_cast |
| Templates | `templates_demo.cpp` | Function/class templates, specialization, variadic |
| Operators | `operator_overloading.cpp` | +, -, ==, <<, [], (), friend functions |
| Exceptions | `exception_handling.cpp` | try-catch, throw, custom exceptions, noexcept |
| STL Containers | `map_set_demo.cpp` | map, unordered_map, set, multimap |
| STL Algorithms | `stl_algorithms.cpp` | sort, find, count, transform, remove, all_of |
| File I/O | `file_read_write.cpp` | ifstream, ofstream, binary I/O, filesystem (C++17) |
| Smart Pointers | `smart_pointers.cpp` | unique_ptr, shared_ptr, weak_ptr, make_unique |

### 🔴 03-Advanced
| Topic | File | Concepts |
|-------|------|----------|
| Move Semantics | `move_semantics.cpp` | Rvalue refs, std::move, move constructor/assignment |
| Multithreading | `thread_demo.cpp` | std::thread, mutex, atomic, async/future |
| Design Patterns | `singleton_factory.cpp` | Singleton, Factory, Observer patterns |
| Data Structures | `linked_list_impl.cpp` | Custom templated linked list from scratch |
| Data Structures | `stack_queue_demo.cpp` | stack, queue, deque, priority_queue |
| Algorithms | `sorting_algorithms.cpp` | Bubble, selection, insertion, merge, quick sort |
| Algorithms | `search_algorithms.cpp` | Linear search, binary search |
| Modern C++ | `modern_cpp_features.cpp` | auto, optional, variant, any, structured bindings, fold expressions |
| Memory | `raii_memory.cpp` | RAII pattern, Rule of Five, Rule of Zero |
| Metaprogramming | `constexpr_concepts.cpp` | constexpr, type_traits, SFINAE, if constexpr, static_assert |
| Advanced OOP | `crtp_mixins.cpp` | CRTP, mixins, multiple inheritance, diamond problem |

## 🚀 How to Compile & Run

```bash
# Navigate to any topic folder
cd 01-beginner/01-basics

# Compile (C++17 recommended)
g++ -std=c++17 -o hello hello_world.cpp

# For threading programs, add -pthread
g++ -std=c++17 -pthread -o thread thread_demo.cpp

# Run
./hello
```

## 📝 Author
Emmanuel — Learning C++ one program at a time! 🚀
