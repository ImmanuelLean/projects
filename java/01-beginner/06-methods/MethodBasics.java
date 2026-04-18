/**
 * LESSON: Methods
 * Methods are reusable blocks of code that perform a specific task.
 * Syntax: accessModifier returnType methodName(parameters) { body }
 */
public class MethodBasics {
    public static void main(String[] args) {
        // Calling methods
        greet();
        greetPerson("Emmanuel");

        int sum = add(10, 20);
        System.out.println("10 + 20 = " + sum);

        System.out.println("Max of 25, 30: " + max(25, 30));
        System.out.println("Is 7 even? " + isEven(7));

        // Method overloading - same name, different parameters
        System.out.println("\n--- Method Overloading ---");
        System.out.println("add(2, 3) = " + add(2, 3));
        System.out.println("add(2, 3, 4) = " + add(2, 3, 4));
        System.out.println("add(2.5, 3.5) = " + add(2.5, 3.5));

        // Pass by value demo
        System.out.println("\n--- Pass by Value ---");
        int x = 10;
        System.out.println("Before modify: x = " + x);
        modify(x);
        System.out.println("After modify: x = " + x); // still 10! Java passes by value
    }

    // Void method - no return value
    static void greet() {
        System.out.println("Hello from greet()!");
    }

    // Method with parameter
    static void greetPerson(String name) {
        System.out.println("Hello, " + name + "!");
    }

    // Method with return value
    static int add(int a, int b) {
        return a + b;
    }

    // Overloaded: 3 parameters
    static int add(int a, int b, int c) {
        return a + b + c;
    }

    // Overloaded: different types
    static double add(double a, double b) {
        return a + b;
    }

    static int max(int a, int b) {
        return (a > b) ? a : b;
    }

    static boolean isEven(int num) {
        return num % 2 == 0;
    }

    static void modify(int value) {
        value = 999; // this only changes the local copy
        System.out.println("Inside modify: value = " + value);
    }
}
