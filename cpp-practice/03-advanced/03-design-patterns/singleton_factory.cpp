/**
 * LESSON: Design Patterns - Singleton, Factory, Observer
 */
#include <iostream>
#include <string>
#include <memory>
#include <vector>
#include <functional>
#include <cmath>

// ===== SINGLETON =====
class Logger {
    Logger() { std::cout << "[Logger created]\n"; }
    std::vector<std::string> logs;
public:
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;

    static Logger& getInstance() {
        static Logger instance; // thread-safe in C++11+
        return instance;
    }

    void log(const std::string& msg) {
        logs.push_back(msg);
        std::cout << "[LOG] " << msg << "\n";
    }

    size_t count() const { return logs.size(); }
};

// ===== FACTORY =====
class Shape {
public:
    virtual ~Shape() = default;
    virtual void draw() const = 0;
    virtual double area() const = 0;
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    void draw() const override { std::cout << "Drawing Circle (r=" << r << ")\n"; }
    double area() const override { return M_PI * r * r; }
};

class Rect : public Shape {
    double w, h;
public:
    Rect(double w, double h) : w(w), h(h) {}
    void draw() const override { std::cout << "Drawing Rectangle (" << w << "x" << h << ")\n"; }
    double area() const override { return w * h; }
};

class ShapeFactory {
public:
    static std::unique_ptr<Shape> create(const std::string& type) {
        if (type == "circle") return std::make_unique<Circle>(5);
        if (type == "rectangle") return std::make_unique<Rect>(4, 6);
        throw std::invalid_argument("Unknown shape: " + type);
    }
};

// ===== OBSERVER =====
class EventManager {
    std::map<std::string, std::vector<std::function<void(const std::string&)>>> listeners;
public:
    void subscribe(const std::string& event, std::function<void(const std::string&)> fn) {
        listeners[event].push_back(fn);
    }

    void notify(const std::string& event, const std::string& data) {
        if (listeners.count(event)) {
            for (auto& fn : listeners[event]) fn(data);
        }
    }
};

#include <map>

int main() {
    // ===== SINGLETON =====
    std::cout << "--- Singleton ---\n";
    Logger::getInstance().log("App started");
    Logger::getInstance().log("Processing data");
    std::cout << "Total logs: " << Logger::getInstance().count() << "\n";

    // ===== FACTORY =====
    std::cout << "\n--- Factory ---\n";
    auto circle = ShapeFactory::create("circle");
    auto rect = ShapeFactory::create("rectangle");
    circle->draw();
    rect->draw();
    std::cout << "Circle area: " << circle->area() << "\n";

    // ===== OBSERVER =====
    std::cout << "\n--- Observer ---\n";
    EventManager events;

    events.subscribe("order", [](const std::string& data) {
        std::cout << "[Email] Order notification: " << data << "\n";
    });
    events.subscribe("order", [](const std::string& data) {
        std::cout << "[SMS] Order notification: " << data << "\n";
    });
    events.subscribe("payment", [](const std::string& data) {
        std::cout << "[Log] Payment received: " << data << "\n";
    });

    events.notify("order", "Order #1234 placed");
    events.notify("payment", "$99.99");

    return 0;
}
