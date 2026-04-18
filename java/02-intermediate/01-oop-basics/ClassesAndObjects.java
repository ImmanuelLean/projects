/**
 * LESSON: Classes and Objects
 * A class is a blueprint. An object is an instance of that class.
 */
public class ClassesAndObjects {
    public static void main(String[] args) {
        // Creating objects using different constructors
        Student s1 = new Student();                          // default constructor
        Student s2 = new Student("Emmanuel", 20, 3.8);      // parameterized constructor
        Student s3 = new Student(s2);                        // copy constructor

        System.out.println("--- Default ---");
        System.out.println(s1);

        System.out.println("\n--- Parameterized ---");
        System.out.println(s2);

        System.out.println("\n--- Copy ---");
        System.out.println(s3);

        // Using getters and setters
        s1.setName("Alice");
        s1.setAge(22);
        s1.setGpa(3.5);
        System.out.println("\n--- After setting values ---");
        System.out.println("Name: " + s1.getName());
        System.out.println("Age: " + s1.getAge());
        System.out.println("GPA: " + s1.getGpa());
    }
}

class Student {
    // Fields (instance variables)
    private String name;
    private int age;
    private double gpa;

    // Default constructor
    Student() {
        this.name = "Unknown";
        this.age = 0;
        this.gpa = 0.0;
    }

    // Parameterized constructor
    Student(String name, int age, double gpa) {
        this.name = name;   // 'this' refers to the current object
        this.age = age;
        this.gpa = gpa;
    }

    // Copy constructor
    Student(Student other) {
        this.name = other.name;
        this.age = other.age;
        this.gpa = other.gpa;
    }

    // Getters
    String getName() { return name; }
    int getAge() { return age; }
    double getGpa() { return gpa; }

    // Setters
    void setName(String name) { this.name = name; }
    void setAge(int age) { this.age = age; }
    void setGpa(double gpa) { this.gpa = gpa; }

    // toString - called automatically when printing the object
    @Override
    public String toString() {
        return String.format("Student{name='%s', age=%d, gpa=%.1f}", name, age, gpa);
    }
}
