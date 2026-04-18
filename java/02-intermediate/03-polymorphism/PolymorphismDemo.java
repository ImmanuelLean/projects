/**
 * LESSON: Polymorphism
 * "Many forms" - same method name behaves differently based on the object.
 *
 * 1. Compile-time (Static) polymorphism  = Method Overloading
 * 2. Runtime (Dynamic) polymorphism      = Method Overriding
 */
public class PolymorphismDemo {
    public static void main(String[] args) {
        // ===== COMPILE-TIME: Method Overloading =====
        System.out.println("--- Compile-Time Polymorphism (Overloading) ---");
        System.out.println("add(2, 3) = " + MathHelper.add(2, 3));
        System.out.println("add(2, 3, 4) = " + MathHelper.add(2, 3, 4));
        System.out.println("add(2.5, 3.5) = " + MathHelper.add(2.5, 3.5));

        // ===== RUNTIME: Method Overriding =====
        System.out.println("\n--- Runtime Polymorphism (Overriding) ---");
        // Parent reference, child object
        Instrument i1 = new Guitar();
        Instrument i2 = new Piano();
        Instrument i3 = new Drums();

        // Same method call, different behavior at runtime!
        i1.play(); // Guitar playing
        i2.play(); // Piano playing
        i3.play(); // Drums playing

        // Useful in arrays/collections
        System.out.println("\n--- Polymorphism with Array ---");
        Instrument[] band = {new Guitar(), new Piano(), new Drums()};
        for (Instrument instrument : band) {
            instrument.play(); // Java decides which version to call at runtime
        }

        // ===== DOWNCASTING =====
        System.out.println("\n--- Downcasting ---");
        Instrument inst = new Guitar(); // upcasting (automatic)

        // Check type before downcasting to avoid ClassCastException
        if (inst instanceof Guitar) {
            Guitar g = (Guitar) inst; // downcasting (manual)
            g.tune(); // now we can access Guitar-specific methods
        }

        // Pattern matching instanceof (Java 16+)
        if (inst instanceof Guitar g) {
            g.tune();
        }
    }
}

class MathHelper {
    static int add(int a, int b) { return a + b; }
    static int add(int a, int b, int c) { return a + b + c; }
    static double add(double a, double b) { return a + b; }
}

class Instrument {
    void play() { System.out.println("Playing an instrument..."); }
}

class Guitar extends Instrument {
    @Override
    void play() { System.out.println("🎸 Guitar strumming!"); }
    void tune() { System.out.println("Tuning the guitar..."); }
}

class Piano extends Instrument {
    @Override
    void play() { System.out.println("🎹 Piano keys playing!"); }
}

class Drums extends Instrument {
    @Override
    void play() { System.out.println("🥁 Drums beating!"); }
}
