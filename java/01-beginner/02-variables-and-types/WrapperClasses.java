/**
 * LESSON: Wrapper Classes & Autoboxing
 * Wrapper classes convert primitives into objects.
 * Each primitive has a corresponding wrapper: int->Integer, double->Double, etc.
 * Needed for collections (ArrayList<Integer>) since they can't hold primitives.
 */
public class WrapperClasses {
    public static void main(String[] args) {
        // ===== WRAPPER CLASSES =====
        // Primitive -> Wrapper
        System.out.println("--- Wrapper Classes ---");
        Integer intObj = Integer.valueOf(42);       // explicit boxing
        Double doubleObj = Double.valueOf(3.14);
        Boolean boolObj = Boolean.valueOf(true);
        Character charObj = Character.valueOf('A');
        Long longObj = Long.valueOf(100L);
        Float floatObj = Float.valueOf(2.5f);
        Byte byteObj = Byte.valueOf((byte) 10);
        Short shortObj = Short.valueOf((short) 200);

        System.out.println("Integer: " + intObj);
        System.out.println("Double: " + doubleObj);
        System.out.println("Boolean: " + boolObj);
        System.out.println("Character: " + charObj);

        // ===== AUTOBOXING (automatic primitive -> wrapper) =====
        System.out.println("\n--- Autoboxing ---");
        Integer autoBoxed = 100;     // int -> Integer automatically
        Double autoDouble = 9.99;    // double -> Double automatically
        System.out.println("Autoboxed Integer: " + autoBoxed);
        System.out.println("Autoboxed Double: " + autoDouble);

        // ===== UNBOXING (automatic wrapper -> primitive) =====
        System.out.println("\n--- Unboxing ---");
        int unboxed = autoBoxed;         // Integer -> int automatically
        double unboxedDouble = autoDouble; // Double -> double automatically
        System.out.println("Unboxed int: " + unboxed);
        System.out.println("Unboxed double: " + unboxedDouble);

        // ===== USEFUL METHODS =====
        System.out.println("\n--- Useful Methods ---");

        // Parsing strings to numbers
        int parsed = Integer.parseInt("123");
        double parsedDouble = Double.parseDouble("3.14");
        boolean parsedBool = Boolean.parseBoolean("true");
        System.out.println("parseInt(\"123\"): " + parsed);
        System.out.println("parseDouble(\"3.14\"): " + parsedDouble);
        System.out.println("parseBoolean(\"true\"): " + parsedBool);

        // Number to string
        String intStr = Integer.toString(42);
        String hexStr = Integer.toHexString(255);    // "ff"
        String binStr = Integer.toBinaryString(10);  // "1010"
        System.out.println("toString(42): " + intStr);
        System.out.println("toHexString(255): " + hexStr);
        System.out.println("toBinaryString(10): " + binStr);

        // Min, Max values
        System.out.println("\nInteger.MAX_VALUE: " + Integer.MAX_VALUE);
        System.out.println("Integer.MIN_VALUE: " + Integer.MIN_VALUE);
        System.out.println("Double.MAX_VALUE: " + Double.MAX_VALUE);

        // Comparing
        System.out.println("\nInteger.compare(10, 20): " + Integer.compare(10, 20)); // -1
        System.out.println("Integer.max(10, 20): " + Integer.max(10, 20));           // 20
        System.out.println("Integer.min(10, 20): " + Integer.min(10, 20));           // 10

        // ===== CAUTION: == vs .equals() =====
        System.out.println("\n--- == vs .equals() ---");
        Integer a = 127;
        Integer b = 127;
        System.out.println("127 == 127: " + (a == b));         // true (cached range: -128 to 127)
        System.out.println("127 .equals(127): " + a.equals(b)); // true

        Integer c = 200;
        Integer d = 200;
        System.out.println("200 == 200: " + (c == d));         // false! (outside cache range)
        System.out.println("200 .equals(200): " + c.equals(d)); // true (always use .equals()!)
    }
}
