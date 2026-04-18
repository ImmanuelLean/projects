/**
 * LESSON: Variables and Primitive Data Types
 * Java has 8 primitive types. Variables must be declared with a type.
 */
public class Variables {
    public static void main(String[] args) {
        // ===== 8 PRIMITIVE TYPES =====

        // Integer types (whole numbers)
        byte myByte = 127;              // 8-bit,  range: -128 to 127
        short myShort = 32000;          // 16-bit, range: -32,768 to 32,767
        int myInt = 2_000_000;          // 32-bit, range: ~-2.1 billion to ~2.1 billion (most used)
        long myLong = 9_000_000_000L;   // 64-bit, add 'L' suffix

        // Floating-point types (decimal numbers)
        float myFloat = 3.14f;          // 32-bit, add 'f' suffix
        double myDouble = 3.14159265;   // 64-bit, more precise (most used)

        // Character type
        char myChar = 'A';             // 16-bit, single character in single quotes
        char unicodeChar = '\u0041';   // Unicode representation of 'A'

        // Boolean type
        boolean isJavaFun = true;      // true or false only

        System.out.println("byte: " + myByte);
        System.out.println("short: " + myShort);
        System.out.println("int: " + myInt);
        System.out.println("long: " + myLong);
        System.out.println("float: " + myFloat);
        System.out.println("double: " + myDouble);
        System.out.println("char: " + myChar + " | unicode: " + unicodeChar);
        System.out.println("boolean: " + isJavaFun);

        // ===== TYPE CASTING =====

        // Widening (automatic) - smaller to larger type (no data loss)
        int num = 100;
        double widened = num; // int -> double automatically
        System.out.println("\nWidening: int " + num + " -> double " + widened);

        // Narrowing (manual) - larger to smaller type (possible data loss)
        double pi = 3.99;
        int narrowed = (int) pi; // double -> int (truncates decimal)
        System.out.println("Narrowing: double " + pi + " -> int " + narrowed);

        // var keyword (Java 10+) - compiler infers the type
        var message = "Hello"; // inferred as String
        var count = 42;        // inferred as int
        System.out.println("\nvar message: " + message);
        System.out.println("var count: " + count);
    }
}
