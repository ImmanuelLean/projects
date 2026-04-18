/**
 * LESSON: Inner and Nested Classes
 * Java supports 4 types of nested classes:
 *   1. Static Nested Class  - declared static, doesn't need outer instance
 *   2. Inner Class          - non-static, has access to outer class members
 *   3. Local Class          - defined inside a method
 *   4. Anonymous Class      - no name, defined and instantiated in one expression
 */
public class InnerClasses {
    private String outerField = "Outer field value";
    private static String staticField = "Static outer field";

    public static void main(String[] args) {
        InnerClasses outer = new InnerClasses();

        // ===== 1. STATIC NESTED CLASS =====
        System.out.println("--- Static Nested Class ---");
        // No outer instance needed
        StaticNested staticNested = new StaticNested();
        staticNested.display();

        // ===== 2. INNER CLASS =====
        System.out.println("\n--- Inner Class ---");
        // Requires outer instance
        InnerClasses.Inner inner = outer.new Inner();
        inner.display();

        // ===== 3. LOCAL CLASS =====
        System.out.println("\n--- Local Class ---");
        outer.demonstrateLocalClass();

        // ===== 4. ANONYMOUS CLASS =====
        System.out.println("\n--- Anonymous Class ---");
        outer.demonstrateAnonymousClass();

        // ===== PRACTICAL EXAMPLE =====
        System.out.println("\n--- Practical: Iterator Pattern ---");
        NumberList list = new NumberList(new int[]{10, 20, 30, 40, 50});
        NumberList.NumberIterator it = list.iterator();
        while (it.hasNext()) {
            System.out.print(it.next() + " ");
        }
        System.out.println();
    }

    // 1. Static Nested Class - belongs to the outer class, not instances
    static class StaticNested {
        void display() {
            System.out.println("Static nested class");
            System.out.println("Can access static field: " + staticField);
            // Cannot access outerField (non-static) without an instance
        }
    }

    // 2. Inner Class - belongs to an instance of the outer class
    class Inner {
        void display() {
            System.out.println("Inner class");
            System.out.println("Can access outer field: " + outerField);
            System.out.println("Can access static field: " + staticField);
        }
    }

    // 3. Local Class - defined inside a method
    void demonstrateLocalClass() {
        String localVar = "local variable"; // effectively final

        class LocalClass {
            void display() {
                System.out.println("Local class inside method");
                System.out.println("Can access: " + outerField);
                System.out.println("Can access: " + localVar);
            }
        }

        LocalClass local = new LocalClass();
        local.display();
    }

    // 4. Anonymous Class - class without a name
    void demonstrateAnonymousClass() {
        // Anonymous implementation of Greeting interface
        Greeting formal = new Greeting() {
            @Override
            public void sayHello(String name) {
                System.out.println("Good day, " + name + ".");
            }
        };

        Greeting casual = new Greeting() {
            @Override
            public void sayHello(String name) {
                System.out.println("Hey, " + name + "!");
            }
        };

        formal.sayHello("Professor");
        casual.sayHello("Buddy");

        // Lambda is a shorter alternative for single-method interfaces
        Greeting lambda = name -> System.out.println("Hi, " + name + "! (lambda)");
        lambda.sayHello("World");
    }

    interface Greeting {
        void sayHello(String name);
    }
}

// Practical example: Inner class used for Iterator pattern
class NumberList {
    private int[] numbers;

    NumberList(int[] numbers) {
        this.numbers = numbers;
    }

    NumberIterator iterator() {
        return new NumberIterator();
    }

    // Inner class has access to outer class's private fields
    class NumberIterator {
        private int index = 0;

        boolean hasNext() { return index < numbers.length; }
        int next() { return numbers[index++]; }
    }
}
