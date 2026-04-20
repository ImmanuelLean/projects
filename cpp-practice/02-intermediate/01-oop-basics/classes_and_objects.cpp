/**
 * LESSON: Classes and Objects
 * A class is a blueprint. An object is an instance of a class.
 * C++ has constructors, destructors, access modifiers, and the 'this' pointer.
 */
#include <iostream>
#include <string>

class Student {
private:
    std::string name;
    int age;
    double gpa;

public:
    // Default constructor
    Student() : name("Unknown"), age(0), gpa(0.0) {
        std::cout << "[Default constructor called]\n";
    }

    // Parameterized constructor (using initializer list - preferred)
    Student(const std::string& name, int age, double gpa)
        : name(name), age(age), gpa(gpa) {
        std::cout << "[Parameterized constructor called]\n";
    }

    // Copy constructor
    Student(const Student& other)
        : name(other.name), age(other.age), gpa(other.gpa) {
        std::cout << "[Copy constructor called]\n";
    }

    // Destructor - called when object goes out of scope
    ~Student() {
        std::cout << "[Destructor called for " << name << "]\n";
    }

    // Getters
    std::string getName() const { return name; }
    int getAge() const { return age; }
    double getGpa() const { return gpa; }

    // Setters
    void setName(const std::string& name) { this->name = name; }
    void setAge(int age) { this->age = age; }
    void setGpa(double gpa) { this->gpa = gpa; }

    // Method
    void display() const {
        std::cout << "Student{name='" << name << "', age=" << age
                  << ", gpa=" << gpa << "}\n";
    }

    // Static member
    static int totalStudents;
    static int getTotalStudents() { return totalStudents; }
};

int Student::totalStudents = 0; // initialize static member outside class

int main() {
    std::cout << "--- Creating Objects ---\n";
    Student s1;                             // default
    Student s2("Emmanuel", 20, 3.8);        // parameterized
    Student s3(s2);                         // copy

    std::cout << "\n--- Display ---\n";
    s1.display();
    s2.display();
    s3.display();

    std::cout << "\n--- Setters ---\n";
    s1.setName("Alice");
    s1.setAge(22);
    s1.setGpa(3.5);
    s1.display();

    std::cout << "\n--- Destructors will be called ---\n";
    return 0;
}
