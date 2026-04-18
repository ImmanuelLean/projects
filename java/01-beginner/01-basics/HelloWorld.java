/**
 * LESSON: Your First Java Program
 * Every Java program needs a class and a main method.
 */
public class HelloWorld {
    public static void main(String[] args) {
        // println prints text and moves to the next line
        System.out.println("Hello, World!");
        System.out.println("Welcome to Java Programming!");

        // print prints text WITHOUT moving to the next line
        System.out.print("Hello ");
        System.out.print("World ");
        System.out.println(); // just prints a new line

        // printf allows formatted output (like C)
        String name = "Emmanuel";
        int age = 20;
        System.out.printf("My name is %s and I am %d years old%n", name, age);
    }
}
