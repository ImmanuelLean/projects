/**
 * LESSON: Virtual Functions
 * Virtual functions enable runtime polymorphism via dynamic dispatch.
 * The correct function is called based on the ACTUAL object type, not the pointer type.
 *
 * Compile: g++ -std=c++17 -o virtual virtual_functions.cpp
 * Run:     ./virtual
 */
#include <iostream>
#include <string>
#include <memory>

// ===== WITHOUT virtual (static binding) =====
class AnimalNoVirtual {
public:
    void speak() { std::cout << "  Animal speaks\n"; }
};

class DogNoVirtual : public AnimalNoVirtual {
public:
    void speak() { std::cout << "  Dog barks\n"; }
};

// ===== WITH virtual (dynamic binding) =====
class Animal {
public:
    virtual void speak() const { std::cout << "  Animal speaks\n"; }
    virtual std::string type() const { return "Animal"; }

    // Virtual destructor (ESSENTIAL for polymorphic base classes!)
    virtual ~Animal() {
        std::cout << "  [~Animal]\n";
    }
};

class Dog : public Animal {
public:
    void speak() const override { std::cout << "  Dog barks: Woof!\n"; }
    std::string type() const override { return "Dog"; }

    ~Dog() override { std::cout << "  [~Dog]\n"; }
};

class Cat : public Animal {
public:
    void speak() const override { std::cout << "  Cat meows: Meow!\n"; }
    std::string type() const override { return "Cat"; }

    ~Cat() override { std::cout << "  [~Cat]\n"; }
};

// ===== override and final =====
class Bird : public Animal {
public:
    void speak() const override { std::cout << "  Bird chirps!\n"; }

    // final: no class can further override this method
    std::string type() const override final { return "Bird"; }
};

// final on class: no further inheritance allowed
class Parrot final : public Bird {
public:
    void speak() const override { std::cout << "  Parrot talks: Hello!\n"; }
    // std::string type() const override { }  // ERROR: type() is final in Bird
};

// class SuperParrot : public Parrot {};  // ERROR: Parrot is final

// ===== SLICING PROBLEM =====
void processAnimalByValue(Animal a) {  // COPIES as Animal (slices!)
    a.speak();  // always calls Animal::speak
}

void processAnimalByRef(const Animal& a) {  // reference, no slicing
    a.speak();  // calls correct derived version
}

// ===== WHY VIRTUAL DESTRUCTORS MATTER =====
class Base {
public:
    ~Base() { std::cout << "  [~Base] (non-virtual!)\n"; }
};

class Derived : public Base {
    int* data;
public:
    Derived() : data(new int[100]) {}
    ~Derived() {
        delete[] data;
        std::cout << "  [~Derived] (cleans up data)\n";
    }
};

int main() {
    // --- Without virtual: WRONG behavior ---
    std::cout << "--- Without virtual (static binding) ---\n";
    AnimalNoVirtual* ptr = new DogNoVirtual();
    ptr->speak();  // calls AnimalNoVirtual::speak (wrong!)
    delete ptr;

    // --- With virtual: CORRECT behavior ---
    std::cout << "\n--- With virtual (dynamic binding) ---\n";
    Animal* dog = new Dog();
    Animal* cat = new Cat();
    dog->speak();  // Dog barks
    cat->speak();  // Cat meows
    std::cout << "Types: " << dog->type() << ", " << cat->type() << "\n";

    // --- Polymorphic array ---
    std::cout << "\n--- Polymorphic Array ---\n";
    std::unique_ptr<Animal> animals[] = {
        std::make_unique<Dog>(),
        std::make_unique<Cat>(),
        std::make_unique<Parrot>()
    };
    for (const auto& a : animals) {
        std::cout << "  " << a->type() << ": ";
        a->speak();
    }

    // --- Slicing problem ---
    std::cout << "\n--- Slicing Problem ---\n";
    Dog myDog;
    std::cout << "By value (sliced): ";
    processAnimalByValue(myDog);   // Animal::speak (wrong!)
    std::cout << "By reference (correct): ";
    processAnimalByRef(myDog);     // Dog::speak (correct!)

    // --- Virtual destructor importance ---
    std::cout << "\n--- Virtual Destructor ---\n";
    std::cout << "With virtual destructor:\n";
    delete dog;  // calls ~Dog then ~Animal (correct!)
    delete cat;  // calls ~Cat then ~Animal (correct!)

    std::cout << "\nWithout virtual destructor (DANGER):\n";
    Base* derived = new Derived();
    delete derived;  // only calls ~Base, ~Derived SKIPPED! Memory leak!

    return 0;
}
