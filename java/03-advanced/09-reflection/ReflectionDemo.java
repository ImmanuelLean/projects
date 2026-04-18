import java.lang.reflect.*;

/**
 * LESSON: Reflection
 * Reflection allows inspecting and modifying classes, methods, and fields at RUNTIME.
 * Powerful but use sparingly - it bypasses compile-time checks.
 */
public class ReflectionDemo {
    public static void main(String[] args) throws Exception {
        // ===== GETTING CLASS OBJECT =====
        System.out.println("--- Getting Class Object ---");
        // Three ways to get the Class object
        Class<?> cls1 = Person.class;                          // from class literal
        Class<?> cls2 = new Person("Test", 0).getClass();      // from instance
        Class<?> cls3 = Class.forName("Person");               // from string name

        System.out.println("Class name: " + cls1.getName());
        System.out.println("Simple name: " + cls1.getSimpleName());
        System.out.println("All three same? " + (cls1 == cls2 && cls2 == cls3));

        // ===== INSPECTING FIELDS =====
        System.out.println("\n--- Fields ---");
        Field[] fields = cls1.getDeclaredFields();
        for (Field field : fields) {
            System.out.printf("  %s %s %s%n",
                Modifier.toString(field.getModifiers()),
                field.getType().getSimpleName(),
                field.getName());
        }

        // ===== INSPECTING METHODS =====
        System.out.println("\n--- Methods ---");
        Method[] methods = cls1.getDeclaredMethods();
        for (Method method : methods) {
            System.out.printf("  %s %s %s(%s)%n",
                Modifier.toString(method.getModifiers()),
                method.getReturnType().getSimpleName(),
                method.getName(),
                getParamTypes(method));
        }

        // ===== INSPECTING CONSTRUCTORS =====
        System.out.println("\n--- Constructors ---");
        Constructor<?>[] constructors = cls1.getDeclaredConstructors();
        for (Constructor<?> constructor : constructors) {
            System.out.printf("  %s(%s)%n",
                constructor.getName(),
                getConstructorParamTypes(constructor));
        }

        // ===== CREATING INSTANCE DYNAMICALLY =====
        System.out.println("\n--- Creating Instance via Reflection ---");
        Constructor<?> ctor = cls1.getDeclaredConstructor(String.class, int.class);
        Object person = ctor.newInstance("Emmanuel", 20);
        System.out.println("Created: " + person);

        // ===== ACCESSING PRIVATE FIELDS =====
        System.out.println("\n--- Accessing Private Fields ---");
        Field nameField = cls1.getDeclaredField("name");
        nameField.setAccessible(true); // bypass private access
        System.out.println("Private name: " + nameField.get(person));
        nameField.set(person, "Alice"); // modify private field!
        System.out.println("Modified name: " + nameField.get(person));

        // ===== INVOKING METHODS DYNAMICALLY =====
        System.out.println("\n--- Invoking Methods ---");
        Method greetMethod = cls1.getDeclaredMethod("greet");
        greetMethod.setAccessible(true);
        String result = (String) greetMethod.invoke(person);
        System.out.println("greet() returned: " + result);

        Method setAgeMethod = cls1.getDeclaredMethod("setAge", int.class);
        setAgeMethod.invoke(person, 25);
        System.out.println("After setAge(25): " + person);
    }

    private static String getParamTypes(Method method) {
        Class<?>[] params = method.getParameterTypes();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < params.length; i++) {
            if (i > 0) sb.append(", ");
            sb.append(params[i].getSimpleName());
        }
        return sb.toString();
    }

    private static String getConstructorParamTypes(Constructor<?> ctor) {
        Class<?>[] params = ctor.getParameterTypes();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < params.length; i++) {
            if (i > 0) sb.append(", ");
            sb.append(params[i].getSimpleName());
        }
        return sb.toString();
    }
}

// Sample class to inspect with reflection
class Person {
    private String name;
    private int age;

    Person() { this("Unknown", 0); }

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    private String greet() {
        return "Hello, I'm " + name + "!";
    }

    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }
}
