import java.util.*;

/**
 * LESSON: Object Class Methods
 * Every class in Java inherits from java.lang.Object.
 * Key methods to override: equals(), hashCode(), toString(), clone().
 *
 * CONTRACT: If two objects are equal (equals() returns true),
 * they MUST have the same hashCode(). Always override both together.
 */
public class ObjectClassMethods {
    public static void main(String[] args) {
        // ===== equals() and hashCode() =====
        System.out.println("--- equals() and hashCode() ---");
        Product p1 = new Product("Laptop", 999.99);
        Product p2 = new Product("Laptop", 999.99);
        Product p3 = new Product("Phone", 699.99);

        // Without overriding equals(), == and equals() compare references
        System.out.println("p1 == p2: " + (p1 == p2));           // false (different objects)
        System.out.println("p1.equals(p2): " + p1.equals(p2));   // true (same content)
        System.out.println("p1.equals(p3): " + p1.equals(p3));   // false

        System.out.println("p1 hashCode: " + p1.hashCode());
        System.out.println("p2 hashCode: " + p2.hashCode());
        System.out.println("Same hash? " + (p1.hashCode() == p2.hashCode())); // true

        // ===== WHY hashCode MATTERS (for HashMap/HashSet) =====
        System.out.println("\n--- hashCode with Collections ---");
        Set<Product> productSet = new HashSet<>();
        productSet.add(p1);
        productSet.add(p2); // same as p1, won't be added
        productSet.add(p3);
        System.out.println("Set size (should be 2): " + productSet.size());

        Map<Product, Integer> inventory = new HashMap<>();
        inventory.put(p1, 10);
        inventory.put(p2, 20); // overwrites p1's value since they're equal
        System.out.println("Inventory size (should be 1): " + inventory.size());
        System.out.println("Laptop stock: " + inventory.get(p1)); // 20

        // ===== toString() =====
        System.out.println("\n--- toString() ---");
        System.out.println("p1: " + p1); // calls toString() automatically
        System.out.println("p3: " + p3);

        // ===== clone() =====
        System.out.println("\n--- clone() ---");
        Product p4 = p1.clone();
        System.out.println("Original: " + p1);
        System.out.println("Clone: " + p4);
        System.out.println("p1 == p4: " + (p1 == p4));         // false (different object)
        System.out.println("p1.equals(p4): " + p1.equals(p4)); // true (same content)

        // ===== getClass() =====
        System.out.println("\n--- getClass() ---");
        System.out.println("p1 class: " + p1.getClass().getName());
        System.out.println("p1 simple name: " + p1.getClass().getSimpleName());
        System.out.println("Same class? " + (p1.getClass() == p3.getClass())); // true
    }
}

class Product implements Cloneable {
    private String name;
    private double price;

    Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    // Override equals() - compare by content, not reference
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;                    // same reference
        if (obj == null || getClass() != obj.getClass()) return false; // null or different class
        Product other = (Product) obj;
        return Double.compare(other.price, price) == 0
            && Objects.equals(name, other.name);
    }

    // Override hashCode() - MUST be consistent with equals()
    @Override
    public int hashCode() {
        return Objects.hash(name, price);
    }

    // Override toString() - readable representation
    @Override
    public String toString() {
        return String.format("Product{name='%s', price=$%.2f}", name, price);
    }

    // Override clone() - create a copy
    @Override
    public Product clone() {
        try {
            return (Product) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }
}
