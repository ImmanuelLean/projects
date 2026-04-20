/**
 * LESSON: Observer Pattern
 * Defines a one-to-many dependency: when one object (Subject) changes state,
 * all its dependents (Observers) are notified automatically.
 *
 * Compile: g++ -std=c++17 -o observer observer_pattern.cpp
 * Run:     ./observer
 */
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <memory>
#include <functional>

// ===== CLASSIC OBSERVER PATTERN =====

// Observer interface
class IObserver {
public:
    virtual ~IObserver() = default;
    virtual void update(const std::string& event, const std::string& data) = 0;
};

// Subject (Observable) base class
class Subject {
    std::vector<IObserver*> observers;

public:
    virtual ~Subject() = default;

    void subscribe(IObserver* obs) {
        observers.push_back(obs);
    }

    void unsubscribe(IObserver* obs) {
        observers.erase(
            std::remove(observers.begin(), observers.end(), obs),
            observers.end());
    }

    void notify(const std::string& event, const std::string& data) {
        for (auto* obs : observers) {
            obs->update(event, data);
        }
    }
};

// ===== WEATHER STATION EXAMPLE =====
class WeatherStation : public Subject {
    double temperature = 0;
    double humidity = 0;

public:
    void setMeasurements(double temp, double hum) {
        temperature = temp;
        humidity = hum;
        std::cout << "\n[WeatherStation] New data: " << temp << "°C, "
                  << hum << "% humidity\n";
        notify("weather_update", std::to_string(temp) + "," + std::to_string(hum));
    }
};

class PhoneDisplay : public IObserver {
    std::string owner;
public:
    PhoneDisplay(const std::string& o) : owner(o) {}
    void update(const std::string& event, const std::string& data) override {
        std::cout << "  [" << owner << "'s Phone] " << event << ": " << data << "\n";
    }
};

class WebDashboard : public IObserver {
public:
    void update(const std::string& event, const std::string& data) override {
        std::cout << "  [WebDashboard] Updating chart with: " << data << "\n";
    }
};

class AlertSystem : public IObserver {
public:
    void update(const std::string& event, const std::string& data) override {
        double temp = std::stod(data.substr(0, data.find(',')));
        if (temp > 35.0) {
            std::cout << "  [ALERT] High temperature warning: " << temp << "°C!\n";
        }
    }
};

// ===== MODERN APPROACH: Callback-based =====
class EventEmitter {
    using Callback = std::function<void(const std::string&)>;
    std::vector<std::pair<std::string, Callback>> listeners;
    int nextId = 0;

public:
    int on(const std::string& event, Callback cb) {
        listeners.push_back({event, std::move(cb)});
        return nextId++;
    }

    void emit(const std::string& event, const std::string& data) {
        for (const auto& [evt, cb] : listeners) {
            if (evt == event) cb(data);
        }
    }
};

int main() {
    // --- Classic Observer ---
    std::cout << "=== Classic Observer Pattern ===\n";
    WeatherStation station;

    PhoneDisplay phone1("Emmanuel");
    PhoneDisplay phone2("Alice");
    WebDashboard dashboard;
    AlertSystem alert;

    station.subscribe(&phone1);
    station.subscribe(&phone2);
    station.subscribe(&dashboard);
    station.subscribe(&alert);

    station.setMeasurements(28.5, 65.0);
    station.setMeasurements(36.2, 70.0);  // triggers alert!

    // Unsubscribe Alice
    std::cout << "\n[Unsubscribing Alice...]\n";
    station.unsubscribe(&phone2);
    station.setMeasurements(22.0, 55.0);

    // --- Modern callback-based ---
    std::cout << "\n=== Modern Callback-Based ===\n";
    EventEmitter emitter;

    emitter.on("click", [](const std::string& data) {
        std::cout << "  Button clicked: " << data << "\n";
    });

    emitter.on("click", [](const std::string& data) {
        std::cout << "  Analytics: click on " << data << "\n";
    });

    emitter.on("hover", [](const std::string& data) {
        std::cout << "  Tooltip for: " << data << "\n";
    });

    emitter.emit("click", "Submit Button");
    emitter.emit("hover", "Help Icon");
    emitter.emit("click", "Cancel Button");

    return 0;
}
