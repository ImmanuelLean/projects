import java.util.*;

/**
 * LESSON: Strategy Design Pattern
 * Defines a family of algorithms, encapsulates each one, and makes them interchangeable.
 * The algorithm can be selected at runtime without modifying the client code.
 *
 * Use cases: Payment processing, sorting strategies, compression, authentication.
 */
public class StrategyPattern {
    public static void main(String[] args) {
        // ===== PAYMENT STRATEGIES =====
        System.out.println("--- Payment Strategies ---");
        ShoppingCart cart = new ShoppingCart();
        cart.addItem("Laptop", 999.99);
        cart.addItem("Mouse", 29.99);
        cart.addItem("Keyboard", 79.99);

        System.out.println("Cart total: $" + cart.getTotal());

        // Pay with different strategies at runtime
        cart.setPaymentStrategy(new CreditCardPayment("1234-5678-9012-3456", "Emmanuel"));
        cart.checkout();

        cart.setPaymentStrategy(new PayPalPayment("emmanuel@email.com"));
        cart.checkout();

        cart.setPaymentStrategy(new CryptoPayment("0xABC123DEF456"));
        cart.checkout();

        // ===== STRATEGY WITH LAMBDA (modern approach) =====
        System.out.println("\n--- Strategy with Lambda ---");

        // Sorting strategies
        List<String> names = new ArrayList<>(Arrays.asList("Charlie", "Alice", "Bob", "David"));

        System.out.println("Original: " + names);

        SortStrategy<String> alphabetical = (list) -> { Collections.sort(list); };
        SortStrategy<String> reverseAlpha = (list) -> { list.sort(Comparator.reverseOrder()); };
        SortStrategy<String> byLength = (list) -> { list.sort(Comparator.comparingInt(String::length)); };

        alphabetical.sort(new ArrayList<>(names));
        System.out.println("Alphabetical: " + sorted(names, alphabetical));
        System.out.println("Reverse: " + sorted(names, reverseAlpha));
        System.out.println("By length: " + sorted(names, byLength));

        // ===== DISCOUNT STRATEGIES =====
        System.out.println("\n--- Discount Strategies ---");
        double price = 100.0;

        DiscountStrategy noDiscount = p -> p;
        DiscountStrategy tenPercent = p -> p * 0.9;
        DiscountStrategy twentyPercent = p -> p * 0.8;
        DiscountStrategy flatTen = p -> p - 10;

        System.out.printf("No discount: $%.2f%n", noDiscount.apply(price));
        System.out.printf("10%% off: $%.2f%n", tenPercent.apply(price));
        System.out.printf("20%% off: $%.2f%n", twentyPercent.apply(price));
        System.out.printf("$10 off: $%.2f%n", flatTen.apply(price));
    }

    static <T> List<T> sorted(List<T> original, SortStrategy<T> strategy) {
        List<T> copy = new ArrayList<>(original);
        strategy.sort(copy);
        return copy;
    }
}

// Strategy interface
interface PaymentStrategy {
    void pay(double amount);
}

// Concrete strategies
class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    private String name;

    CreditCardPayment(String cardNumber, String name) {
        this.cardNumber = cardNumber;
        this.name = name;
    }

    @Override
    public void pay(double amount) {
        String masked = "****-****-****-" + cardNumber.substring(cardNumber.length() - 4);
        System.out.printf("Paid $%.2f with Credit Card %s (%s)%n", amount, masked, name);
    }
}

class PayPalPayment implements PaymentStrategy {
    private String email;

    PayPalPayment(String email) { this.email = email; }

    @Override
    public void pay(double amount) {
        System.out.printf("Paid $%.2f via PayPal (%s)%n", amount, email);
    }
}

class CryptoPayment implements PaymentStrategy {
    private String walletAddress;

    CryptoPayment(String walletAddress) { this.walletAddress = walletAddress; }

    @Override
    public void pay(double amount) {
        System.out.printf("Paid $%.2f with Crypto (wallet: %s)%n", amount, walletAddress);
    }
}

// Context class
class ShoppingCart {
    private List<String[]> items = new ArrayList<>();
    private PaymentStrategy paymentStrategy;

    void addItem(String name, double price) {
        items.add(new String[]{name, String.valueOf(price)});
    }

    double getTotal() {
        return items.stream().mapToDouble(item -> Double.parseDouble(item[1])).sum();
    }

    void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }

    void checkout() {
        paymentStrategy.pay(getTotal());
    }
}

// Functional interface for lambda-based strategies
@FunctionalInterface
interface SortStrategy<T> {
    void sort(List<T> list);
}

@FunctionalInterface
interface DiscountStrategy {
    double apply(double price);
}
