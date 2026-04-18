/**
 * LESSON: Access Modifiers and Static Keyword
 *
 * Access Modifiers:
 *   public    - accessible from everywhere
 *   private   - accessible only within the same class
 *   protected - accessible within package + subclasses
 *   (default) - accessible within the same package only
 */
public class AccessModifiers {
    public static void main(String[] args) {
        // Static variable is shared across ALL instances
        System.out.println("--- Static Variables ---");
        Counter c1 = new Counter("A");
        Counter c2 = new Counter("B");
        Counter c3 = new Counter("C");
        System.out.println("Total objects created: " + Counter.getCount()); // 3

        // Each instance has its own 'name'
        System.out.println("\n--- Instance vs Static ---");
        c1.display();
        c2.display();

        // Static method called on the class, not an object
        Counter.showInfo();

        // Static block runs once when class is first loaded
        System.out.println("\n--- Static Block ---");
        System.out.println("App name: " + Config.APP_NAME);
        System.out.println("Version: " + Config.VERSION);
    }
}

class Counter {
    // Instance variable - each object gets its own copy
    private String name;

    // Static variable - shared by ALL objects of this class
    private static int count = 0;

    Counter(String name) {
        this.name = name;
        count++; // incremented for every new object
    }

    void display() {
        System.out.println("I am " + name + ", total count: " + count);
    }

    // Static method - can only access static variables directly
    static int getCount() {
        return count;
    }

    static void showInfo() {
        System.out.println("\nStatic method called. Count = " + count);
        // Cannot use 'this' or access instance variables here
        // System.out.println(name); // ERROR!
    }
}

class Config {
    // Static constants
    static final String APP_NAME;
    static final String VERSION;

    // Static block - runs once when the class is first loaded
    static {
        System.out.println("[Static block executed - class loaded]");
        APP_NAME = "JavaLearner";
        VERSION = "1.0.0";
    }
}
