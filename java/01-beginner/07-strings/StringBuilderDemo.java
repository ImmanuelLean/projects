/**
 * LESSON: StringBuilder
 * Unlike String, StringBuilder is MUTABLE - it modifies the same object.
 * Use StringBuilder when building strings in loops (much faster).
 */
public class StringBuilderDemo {
    public static void main(String[] args) {
        // ===== CREATING STRINGBUILDER =====
        StringBuilder sb = new StringBuilder("Hello");
        System.out.println("Initial: " + sb);
        System.out.println("Length: " + sb.length());
        System.out.println("Capacity: " + sb.capacity()); // default 16 + initial string length

        // ===== COMMON METHODS =====
        System.out.println("\n--- Methods ---");

        sb.append(" World");             // add to end
        System.out.println("append: " + sb);

        sb.append("!").append(" Java");  // chaining
        System.out.println("chained append: " + sb);

        sb.insert(5, ",");              // insert at index
        System.out.println("insert: " + sb);

        sb.delete(12, 17);             // delete range [start, end)
        System.out.println("delete: " + sb);

        sb.replace(0, 5, "Hi");        // replace range
        System.out.println("replace: " + sb);

        sb.reverse();                   // reverse entire string
        System.out.println("reverse: " + sb);

        sb.reverse();                   // reverse back
        System.out.println("reverse back: " + sb);

        String result = sb.toString();  // convert to String
        System.out.println("toString: " + result);

        // ===== WHY STRINGBUILDER IS FASTER =====
        System.out.println("\n--- Performance Comparison ---");

        // SLOW: String concatenation in loop creates a new String each time
        long start = System.currentTimeMillis();
        String s = "";
        for (int i = 0; i < 50000; i++) {
            s += "a"; // creates new String object each time!
        }
        long stringTime = System.currentTimeMillis() - start;

        // FAST: StringBuilder modifies same object
        start = System.currentTimeMillis();
        StringBuilder sb2 = new StringBuilder();
        for (int i = 0; i < 50000; i++) {
            sb2.append("a"); // modifies same object
        }
        long builderTime = System.currentTimeMillis() - start;

        System.out.println("String concat: " + stringTime + "ms");
        System.out.println("StringBuilder: " + builderTime + "ms");
        System.out.println("StringBuilder is ~" + (stringTime / Math.max(builderTime, 1)) + "x faster!");
    }
}
