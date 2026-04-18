/**
 * LESSON: Inheritance
 * A class can inherit fields and methods from another class using 'extends'.
 * Promotes code reuse and establishes an IS-A relationship.
 */
public class InheritanceDemo {
    public static void main(String[] args) {
        Dog dog = new Dog("Buddy", 3, "Golden Retriever");

        System.out.println("--- Dog Info ---");
        System.out.println("Name: " + dog.getName());
        System.out.println("Age: " + dog.getAge());
        System.out.println("Breed: " + dog.getBreed());

        // Inherited method
        dog.eat();

        // Overridden method
        dog.makeSound();

        // Dog's own method
        dog.fetch();

        // Parent reference can hold child object (upcasting)
        System.out.println("\n--- Upcasting ---");
        Animal animal = new Dog("Rex", 5, "Labrador");
        animal.eat();       // inherited method
        animal.makeSound(); // calls DOG's version (runtime polymorphism)
        // animal.fetch();  // ERROR: Animal reference can't see Dog-specific methods
    }
}

// Parent (Super) class
class Animal {
    private String name;
    private int age;

    Animal(String name, int age) {
        this.name = name;
        this.age = age;
        System.out.println("[Animal constructor called]");
    }

    void eat() {
        System.out.println(name + " is eating.");
    }

    void makeSound() {
        System.out.println(name + " makes a sound.");
    }

    String getName() { return name; }
    int getAge() { return age; }
}

// Child (Sub) class
class Dog extends Animal {
    private String breed;

    Dog(String name, int age, String breed) {
        super(name, age); // call parent constructor FIRST
        this.breed = breed;
        System.out.println("[Dog constructor called]");
    }

    // Method overriding - providing a specific implementation
    @Override
    void makeSound() {
        System.out.println(getName() + " says: Woof! Woof!");
    }

    void fetch() {
        System.out.println(getName() + " is fetching the ball!");
    }

    String getBreed() { return breed; }
}
