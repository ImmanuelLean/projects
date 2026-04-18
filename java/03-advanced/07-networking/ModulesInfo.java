/**
 * LESSON: Java Modules System (Java 9+)
 *
 * The Java Module System (Project Jigsaw) organizes code into modules.
 * A module is a group of packages with explicit dependencies and exports.
 *
 * NOTE: This file is a REFERENCE GUIDE. The module system requires a specific
 * project structure with module-info.java files, so this file explains the
 * concepts with examples you can apply to your own projects.
 *
 * ===== WHY MODULES? =====
 * 1. Strong encapsulation - hide internal packages
 * 2. Reliable configuration - explicit dependencies, no classpath hell
 * 3. Smaller runtime - include only needed modules (jlink)
 *
 * ===== PROJECT STRUCTURE =====
 *
 *   my-app/
 *   ├── src/
 *   │   ├── com.myapp.core/
 *   │   │   ├── module-info.java          ← module descriptor
 *   │   │   └── com/myapp/core/
 *   │   │       └── CoreService.java
 *   │   ├── com.myapp.api/
 *   │   │   ├── module-info.java
 *   │   │   └── com/myapp/api/
 *   │   │       └── ApiController.java
 *   │   └── com.myapp.main/
 *   │       ├── module-info.java
 *   │       └── com/myapp/main/
 *   │           └── App.java
 *
 * ===== MODULE-INFO.JAVA SYNTAX =====
 *
 *   // com.myapp.core/module-info.java
 *   module com.myapp.core {
 *       exports com.myapp.core;          // make this package public
 *       exports com.myapp.core.utils;    // make another package public
 *       // internal packages are hidden automatically!
 *   }
 *
 *   // com.myapp.api/module-info.java
 *   module com.myapp.api {
 *       requires com.myapp.core;         // depends on core module
 *       requires java.net.http;          // depends on JDK HTTP module
 *       exports com.myapp.api;
 *   }
 *
 *   // com.myapp.main/module-info.java
 *   module com.myapp.main {
 *       requires com.myapp.core;
 *       requires com.myapp.api;
 *   }
 *
 * ===== KEY DIRECTIVES =====
 *
 *   module my.module {
 *       requires other.module;           // dependency on another module
 *       requires transitive other.module; // transitive dependency
 *       exports com.myapp.api;           // make package accessible
 *       exports com.myapp.spi to         // export to specific modules only
 *           com.myapp.impl;
 *       opens com.myapp.model;           // allow reflection access
 *       opens com.myapp.model to         // reflection for specific modules
 *           com.google.gson;
 *       uses com.myapp.spi.Plugin;       // declares service consumer
 *       provides com.myapp.spi.Plugin    // declares service provider
 *           with com.myapp.impl.MyPlugin;
 *   }
 *
 * ===== COMPILING AND RUNNING =====
 *
 *   # Compile modules
 *   javac -d out --module-source-path src $(find src -name "*.java")
 *
 *   # Run
 *   java --module-path out -m com.myapp.main/com.myapp.main.App
 *
 *   # Create runtime image (only includes needed modules)
 *   jlink --module-path out --add-modules com.myapp.main --output myapp-runtime
 *
 * ===== JDK MODULES =====
 *   java.base      - always available (Object, String, collections, I/O)
 *   java.sql        - JDBC
 *   java.net.http   - HTTP client
 *   java.logging    - Logging
 *   java.desktop    - Swing/AWT
 *   java.xml        - XML processing
 */
public class ModulesInfo {
    public static void main(String[] args) {
        System.out.println("===== Java Module System Reference =====");
        System.out.println();

        // List some JDK modules
        System.out.println("--- Some JDK Modules ---");
        ModuleLayer.boot().modules().stream()
            .map(Module::getName)
            .filter(name -> name.startsWith("java."))
            .sorted()
            .limit(15)
            .forEach(name -> System.out.println("  " + name));

        // Current module info
        System.out.println("\n--- Current Module ---");
        Module currentModule = ModulesInfo.class.getModule();
        System.out.println("Module: " + currentModule.getName());
        System.out.println("Is named? " + currentModule.isNamed());

        // java.base module info
        System.out.println("\n--- java.base Module ---");
        Module baseModule = Object.class.getModule();
        System.out.println("Name: " + baseModule.getName());
        System.out.println("Some exported packages:");
        baseModule.getDescriptor().exports().stream()
            .map(e -> e.source())
            .filter(p -> p.startsWith("java.util") || p.startsWith("java.io"))
            .sorted()
            .limit(8)
            .forEach(p -> System.out.println("  " + p));

        System.out.println("\n(See comments in this file for full module system guide)");
    }
}
