/**
 * LESSON: Inheritance
 * Derive new classes from existing ones, reusing and extending functionality.
 *
 * Access specifiers for inheritance:
 *   public:    public->public, protected->protected
 *   protected: public->protected, protected->protected
 *   private:   public->private, protected->private
 */
#include <iostream>
#include <string>

// Base (Parent) class
class Animal {
protected:
    std::string name;
    int age;

public:
    Animal(const std::string& name, int age) : name(name), age(age) {
        std::cout << "[Animal constructor: " << name << "]\n";
    }

    virtual ~Animal() {
        std::cout << "[Animal destructor: " << name << "]\n";
    }

    void eat() const {
        std::cout << name << " is eating.\n";
    }

    virtual void makeSound() const {
        std::cout << name << " makes a generic sound.\n";
    }

    std::string getName() const { return name; }
    int getAge() const { return age; }
};

// Derived (Child) class
class Dog : public Animal {
private:
    std::string breed;

public:
    Dog(const std::string& name, int age, const std::string& breed)
        : Animal(name, age), breed(breed) {
        std::cout << "[Dog constructor: " << name << "]\n";
    }

    ~Dog() override {
        std::cout << "[Dog destructor: " << name << "]\n";
    }

    // Override parent method
    void makeSound() const override {
        std::cout << name << " says: Woof! Woof!\n";
    }

    void fetch() const {
        std::cout << name << " is fetching the ball!\n";
    }

    std::string getBreed() const { return breed; }
};

// Multilevel: Animal -> Dog -> Puppy
class Puppy : public Dog {
public:
    Puppy(const std::string& name, const std::string& breed)
        : Dog(name, 0, breed) {}

    void makeSound() const override {
        std::cout << name << " says: Yip! Yip!\n";
    }

    void play() const {
        std::cout << name << " is playing!\n";
    }
};

int main() {
    std::cout << "--- Creating Dog ---\n";
    Dog dog("Buddy", 3, "Golden Retriever");
    dog.eat();       // inherited
    dog.makeSound(); // overridden
    dog.fetch();     // own method

    std::cout << "\n--- Upcasting (polymorphism) ---\n";
    Animal* animalPtr = &dog; // parent pointer to child object
    animalPtr->eat();
    animalPtr->makeSound(); // calls Dog's version (virtual dispatch)
    // animalPtr->fetch();  // ERROR: Animal doesn't know about fetch()

    std::cout << "\n--- Multilevel Inheritance ---\n";
    Puppy puppy("Max", "Labrador");
    puppy.eat();       // from Animal
    puppy.makeSound(); // from Puppy
    puppy.fetch();     // from Dog
    puppy.play();      // own

    std::cout << "\n--- Destructors ---\n";
    return 0;
}
