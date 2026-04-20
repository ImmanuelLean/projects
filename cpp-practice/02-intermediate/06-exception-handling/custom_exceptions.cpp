/**
 * LESSON: Custom Exceptions
 * Create domain-specific exception types by inheriting from std::exception.
 * This allows catching specific error types and providing clear messages.
 *
 * Compile: g++ -std=c++17 -o custom_exc custom_exceptions.cpp
 * Run:     ./custom_exc
 */
#include <iostream>
#include <string>
#include <stdexcept>

// ===== CUSTOM EXCEPTION (inheriting from std::exception) =====
class AppException : public std::exception {
protected:
    std::string message;
public:
    explicit AppException(const std::string& msg) : message(msg) {}
    const char* what() const noexcept override { return message.c_str(); }
};

// ===== EXCEPTION HIERARCHY =====
class ValidationError : public AppException {
public:
    ValidationError(const std::string& field, const std::string& reason)
        : AppException("Validation error on '" + field + "': " + reason) {}
};

class DatabaseError : public AppException {
    int errorCode;
public:
    DatabaseError(const std::string& msg, int code)
        : AppException("DB Error [" + std::to_string(code) + "]: " + msg),
          errorCode(code) {}
    int getErrorCode() const { return errorCode; }
};

class NotFoundError : public DatabaseError {
public:
    NotFoundError(const std::string& entity, int id)
        : DatabaseError(entity + " #" + std::to_string(id) + " not found", 404) {}
};

class ConnectionError : public DatabaseError {
public:
    explicit ConnectionError(const std::string& host)
        : DatabaseError("Cannot connect to " + host, 503) {}
};

// ===== noexcept SPECIFIER =====
// Promises a function won't throw - enables optimizations
int safeDivide(int a, int b) noexcept {
    if (b == 0) return 0;  // handle error without throwing
    return a / b;
}

// noexcept(true/false) - conditional
template<typename T>
T safeAdd(T a, T b) noexcept(std::is_integral<T>::value) {
    return a + b;  // integral types won't overflow-throw, float might
}

// ===== USING CUSTOM EXCEPTIONS =====
class UserService {
public:
    void createUser(const std::string& name, int age, const std::string& email) {
        if (name.empty())
            throw ValidationError("name", "cannot be empty");
        if (age < 0 || age > 150)
            throw ValidationError("age", "must be between 0 and 150");
        if (email.find('@') == std::string::npos)
            throw ValidationError("email", "invalid format");
        std::cout << "  User created: " << name << " (" << email << ")\n";
    }

    void getUser(int id) {
        if (id == 0) throw ConnectionError("db.example.com");
        if (id < 0) throw NotFoundError("User", id);
        std::cout << "  Found user #" << id << "\n";
    }
};

int main() {
    UserService service;

    // --- Catching specific exceptions ---
    std::cout << "--- Custom Exception Hierarchy ---\n";

    // Test 1: Validation error
    try {
        service.createUser("", 25, "test@test.com");
    } catch (const ValidationError& e) {
        std::cout << "  CAUGHT ValidationError: " << e.what() << "\n";
    }

    // Test 2: Another validation
    try {
        service.createUser("Emmanuel", 25, "bad-email");
    } catch (const ValidationError& e) {
        std::cout << "  CAUGHT ValidationError: " << e.what() << "\n";
    }

    // Test 3: Success
    try {
        service.createUser("Emmanuel", 25, "emmanuel@test.com");
    } catch (const AppException& e) {
        std::cout << "  CAUGHT: " << e.what() << "\n";
    }

    // --- Database errors ---
    std::cout << "\n--- Database Errors ---\n";

    try {
        service.getUser(0);  // connection error
    } catch (const ConnectionError& e) {
        std::cout << "  CAUGHT ConnectionError: " << e.what() << "\n";
    }

    try {
        service.getUser(-5);  // not found
    } catch (const NotFoundError& e) {
        std::cout << "  CAUGHT NotFoundError: " << e.what() << "\n";
    }

    // --- Catch by hierarchy level ---
    std::cout << "\n--- Catching by Hierarchy ---\n";
    try {
        service.getUser(-1);
    } catch (const DatabaseError& e) {
        // Catches NotFoundError AND ConnectionError
        std::cout << "  Caught as DatabaseError (code " << e.getErrorCode() << "): "
                  << e.what() << "\n";
    } catch (const AppException& e) {
        std::cout << "  Caught as AppException: " << e.what() << "\n";
    }

    // --- noexcept ---
    std::cout << "\n--- noexcept ---\n";
    std::cout << "  safeDivide(10, 0) = " << safeDivide(10, 0) << "\n";
    std::cout << "  safeDivide(10, 3) = " << safeDivide(10, 3) << "\n";
    std::cout << "  safeAdd noexcept(int): " << std::boolalpha
              << noexcept(safeAdd(1, 2)) << "\n";

    return 0;
}
