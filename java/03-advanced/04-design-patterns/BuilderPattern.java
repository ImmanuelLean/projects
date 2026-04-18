/**
 * LESSON: Builder Design Pattern
 * Used to construct complex objects step by step.
 * Especially useful when a class has many optional parameters.
 * Avoids "telescoping constructor" problem.
 */
public class BuilderPattern {
    public static void main(String[] args) {
        // ===== WITHOUT BUILDER (telescoping constructors - ugly!) =====
        // new Pizza("Large", true, true, false, true, false, "thin");
        // What does each boolean mean? Hard to read!

        // ===== WITH BUILDER (clear and readable) =====
        System.out.println("--- Building Pizzas ---");

        Pizza pizza1 = new Pizza.Builder("Large")
            .cheese(true)
            .pepperoni(true)
            .mushrooms(true)
            .crust("thin")
            .build();

        Pizza pizza2 = new Pizza.Builder("Medium")
            .cheese(true)
            .olives(true)
            .crust("stuffed")
            .build();

        // Minimal pizza - only required fields
        Pizza pizza3 = new Pizza.Builder("Small").build();

        System.out.println("Pizza 1: " + pizza1);
        System.out.println("Pizza 2: " + pizza2);
        System.out.println("Pizza 3: " + pizza3);

        // ===== BUILDER FOR HTTP REQUEST (Practical Example) =====
        System.out.println("\n--- Building HTTP Requests ---");

        HttpRequest getRequest = new HttpRequest.Builder("https://api.example.com/users")
            .method("GET")
            .header("Accept", "application/json")
            .header("Authorization", "Bearer token123")
            .timeout(30)
            .build();

        HttpRequest postRequest = new HttpRequest.Builder("https://api.example.com/users")
            .method("POST")
            .header("Content-Type", "application/json")
            .body("{\"name\": \"Emmanuel\", \"age\": 20}")
            .timeout(60)
            .build();

        System.out.println(getRequest);
        System.out.println(postRequest);
    }
}

// Immutable Pizza class with Builder
class Pizza {
    private final String size;        // required
    private final boolean cheese;     // optional
    private final boolean pepperoni;  // optional
    private final boolean mushrooms;  // optional
    private final boolean olives;     // optional
    private final String crust;       // optional

    private Pizza(Builder builder) {
        this.size = builder.size;
        this.cheese = builder.cheese;
        this.pepperoni = builder.pepperoni;
        this.mushrooms = builder.mushrooms;
        this.olives = builder.olives;
        this.crust = builder.crust;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(size).append(" pizza");
        sb.append(" (").append(crust).append(" crust)");
        sb.append(" with:");
        if (cheese) sb.append(" cheese");
        if (pepperoni) sb.append(" pepperoni");
        if (mushrooms) sb.append(" mushrooms");
        if (olives) sb.append(" olives");
        if (!cheese && !pepperoni && !mushrooms && !olives) sb.append(" plain");
        return sb.toString();
    }

    // Static inner Builder class
    static class Builder {
        private final String size;           // required
        private boolean cheese = false;      // optional, default false
        private boolean pepperoni = false;
        private boolean mushrooms = false;
        private boolean olives = false;
        private String crust = "regular";    // optional, default "regular"

        // Required parameters in constructor
        Builder(String size) {
            this.size = size;
        }

        // Each setter returns 'this' for chaining
        Builder cheese(boolean val) { cheese = val; return this; }
        Builder pepperoni(boolean val) { pepperoni = val; return this; }
        Builder mushrooms(boolean val) { mushrooms = val; return this; }
        Builder olives(boolean val) { olives = val; return this; }
        Builder crust(String val) { crust = val; return this; }

        Pizza build() { return new Pizza(this); }
    }
}

// Practical Builder example: HTTP Request
class HttpRequest {
    private final String url;
    private final String method;
    private final java.util.Map<String, String> headers;
    private final String body;
    private final int timeout;

    private HttpRequest(Builder builder) {
        this.url = builder.url;
        this.method = builder.method;
        this.headers = builder.headers;
        this.body = builder.body;
        this.timeout = builder.timeout;
    }

    @Override
    public String toString() {
        return String.format("HttpRequest{%s %s, headers=%s, body=%s, timeout=%ds}",
            method, url, headers, body == null ? "none" : body.substring(0, Math.min(30, body.length())) + "...", timeout);
    }

    static class Builder {
        private final String url;
        private String method = "GET";
        private java.util.Map<String, String> headers = new java.util.LinkedHashMap<>();
        private String body = null;
        private int timeout = 30;

        Builder(String url) { this.url = url; }

        Builder method(String method) { this.method = method; return this; }
        Builder header(String key, String value) { headers.put(key, value); return this; }
        Builder body(String body) { this.body = body; return this; }
        Builder timeout(int seconds) { this.timeout = seconds; return this; }

        HttpRequest build() { return new HttpRequest(this); }
    }
}
