import java.util.*;

/**
 * LESSON: Observer Design Pattern
 * Defines a one-to-many dependency. When the subject changes state,
 * all registered observers are notified automatically.
 * Use cases: Event systems, UI updates, notifications.
 */
public class ObserverPattern {
    public static void main(String[] args) {
        // Create the subject (event manager)
        EventManager eventManager = new EventManager();

        // Create observers (listeners)
        EmailNotifier emailNotifier = new EmailNotifier("admin@example.com");
        LogNotifier logNotifier = new LogNotifier("app.log");
        SMSNotifier smsNotifier = new SMSNotifier("+1234567890");

        // Register observers for events
        eventManager.subscribe("order_placed", emailNotifier);
        eventManager.subscribe("order_placed", logNotifier);
        eventManager.subscribe("payment_received", emailNotifier);
        eventManager.subscribe("payment_received", smsNotifier);

        // Trigger events - all registered observers get notified
        System.out.println("===== Order Placed =====");
        eventManager.notify("order_placed", "Order #1234 placed by Emmanuel");

        System.out.println("\n===== Payment Received =====");
        eventManager.notify("payment_received", "Payment of $99.99 received");

        // Unsubscribe
        System.out.println("\n===== After unsubscribing email from order_placed =====");
        eventManager.unsubscribe("order_placed", emailNotifier);
        eventManager.notify("order_placed", "Order #1235 placed by Alice");
    }
}

// Observer interface
interface EventListener {
    void onEvent(String eventType, String data);
}

// Subject (Publisher) - manages observers
class EventManager {
    private final Map<String, List<EventListener>> listeners = new HashMap<>();

    void subscribe(String eventType, EventListener listener) {
        listeners.computeIfAbsent(eventType, k -> new ArrayList<>()).add(listener);
    }

    void unsubscribe(String eventType, EventListener listener) {
        List<EventListener> list = listeners.get(eventType);
        if (list != null) list.remove(listener);
    }

    void notify(String eventType, String data) {
        List<EventListener> list = listeners.get(eventType);
        if (list != null) {
            for (EventListener listener : list) {
                listener.onEvent(eventType, data);
            }
        }
    }
}

// Concrete Observers
class EmailNotifier implements EventListener {
    private final String email;
    EmailNotifier(String email) { this.email = email; }

    @Override
    public void onEvent(String eventType, String data) {
        System.out.printf("[EMAIL -> %s] Event: %s | Data: %s%n", email, eventType, data);
    }
}

class LogNotifier implements EventListener {
    private final String logFile;
    LogNotifier(String logFile) { this.logFile = logFile; }

    @Override
    public void onEvent(String eventType, String data) {
        System.out.printf("[LOG -> %s] Event: %s | Data: %s%n", logFile, eventType, data);
    }
}

class SMSNotifier implements EventListener {
    private final String phone;
    SMSNotifier(String phone) { this.phone = phone; }

    @Override
    public void onEvent(String eventType, String data) {
        System.out.printf("[SMS -> %s] Event: %s | Data: %s%n", phone, eventType, data);
    }
}
