/**
 * LESSON: Constants in Java
 * Use 'final' to create values that cannot be changed after assignment.
 */
public class Constants {
    // Class-level constants: use static final + UPPER_SNAKE_CASE
    static final double PI = 3.14159265;
    static final int MAX_STUDENTS = 30;
    static final String SCHOOL_NAME = "Java Academy";

    public static void main(String[] args) {
        // Local constant
        final int DAYS_IN_WEEK = 7;

        System.out.println("PI = " + PI);
        System.out.println("Max students: " + MAX_STUDENTS);
        System.out.println("School: " + SCHOOL_NAME);
        System.out.println("Days in week: " + DAYS_IN_WEEK);

        // This would cause a compile error:
        // PI = 3.14; // ERROR: cannot assign a value to final variable

        // Using constants in calculations
        double radius = 5.0;
        double area = PI * radius * radius;
        System.out.printf("Area of circle with radius %.1f = %.2f%n", radius, area);
    }
}
