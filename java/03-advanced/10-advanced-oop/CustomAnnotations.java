import java.lang.annotation.*;
import java.lang.reflect.*;

/**
 * LESSON: Custom Annotations
 * Annotations provide metadata about code. You can create your own!
 *
 * Built-in annotations: @Override, @Deprecated, @SuppressWarnings, @FunctionalInterface
 * Meta-annotations: @Target, @Retention, @Documented, @Inherited, @Repeatable
 *
 * Retention policies:
 *   SOURCE  - discarded by compiler (e.g., @Override)
 *   CLASS   - stored in .class file but not available at runtime
 *   RUNTIME - available at runtime via reflection
 */
public class CustomAnnotations {
    public static void main(String[] args) throws Exception {
        // ===== BUILT-IN ANNOTATIONS =====
        System.out.println("--- Built-in Annotations ---");

        // @Deprecated marks something as outdated
        OldClass old = new OldClass();
        old.oldMethod(); // IDE shows strikethrough warning

        // ===== READING CUSTOM ANNOTATIONS AT RUNTIME =====
        System.out.println("\n--- Custom Annotations ---");

        // Read class-level annotation
        Class<?> cls = UserService.class;
        if (cls.isAnnotationPresent(Service.class)) {
            Service service = cls.getAnnotation(Service.class);
            System.out.println("Service: " + service.name());
            System.out.println("Version: " + service.version());
        }

        // Read method-level annotations
        System.out.println("\n--- Method Annotations ---");
        for (Method method : cls.getDeclaredMethods()) {
            if (method.isAnnotationPresent(Route.class)) {
                Route route = method.getAnnotation(Route.class);
                System.out.printf("%-15s -> %s %s%n",
                    method.getName(), route.method(), route.path());
            }

            if (method.isAnnotationPresent(Validate.class)) {
                Validate validate = method.getAnnotation(Validate.class);
                System.out.printf("  Validation: min=%d, max=%d, notNull=%s%n",
                    validate.min(), validate.max(), validate.notNull());
            }
        }

        // ===== SIMPLE TEST FRAMEWORK =====
        System.out.println("\n--- Simple Test Framework ---");
        runTests(TestExample.class);
    }

    // Mini test runner using annotations
    static void runTests(Class<?> testClass) throws Exception {
        Object instance = testClass.getDeclaredConstructor().newInstance();
        int passed = 0, failed = 0;

        for (Method method : testClass.getDeclaredMethods()) {
            if (method.isAnnotationPresent(Test.class)) {
                try {
                    method.invoke(instance);
                    System.out.println("  ✓ " + method.getName());
                    passed++;
                } catch (Exception e) {
                    System.out.println("  ✗ " + method.getName() + " - " +
                        e.getCause().getMessage());
                    failed++;
                }
            }
        }
        System.out.printf("Results: %d passed, %d failed%n", passed, failed);
    }
}

// ===== CUSTOM ANNOTATION DEFINITIONS =====

// @Service - marks a class as a service
@Target(ElementType.TYPE) // can only be used on classes
@Retention(RetentionPolicy.RUNTIME) // available at runtime
@interface Service {
    String name();
    String version() default "1.0"; // default value
}

// @Route - marks a method as an API endpoint
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@interface Route {
    String path();
    String method() default "GET";
}

// @Validate - validation rules
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@interface Validate {
    int min() default 0;
    int max() default Integer.MAX_VALUE;
    boolean notNull() default true;
}

// @Test - marks a method as a test
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@interface Test {}

// ===== USING ANNOTATIONS =====

@Service(name = "UserService", version = "2.0")
class UserService {
    @Route(path = "/users", method = "GET")
    void getUsers() {
        System.out.println("Getting all users");
    }

    @Route(path = "/users", method = "POST")
    @Validate(min = 1, max = 100, notNull = true)
    void createUser() {
        System.out.println("Creating user");
    }

    @Route(path = "/users/{id}", method = "DELETE")
    void deleteUser() {
        System.out.println("Deleting user");
    }
}

// Built-in @Deprecated example
class OldClass {
    @Deprecated(since = "2.0", forRemoval = true)
    void oldMethod() {
        System.out.println("This method is deprecated!");
    }
}

// Test class
class TestExample {
    @Test
    void testAddition() {
        assert 2 + 2 == 4;
    }

    @Test
    void testString() {
        assert "hello".length() == 5;
    }

    @Test
    void testFailing() {
        throw new RuntimeException("This test intentionally fails");
    }
}
