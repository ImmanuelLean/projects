/**
 * LESSON: Type Erasure
 * Hide concrete types behind a uniform interface without virtual inheritance.
 * Covers std::function, std::any, and custom type erasure patterns.
 *
 * Compile: g++ -std=c++17 -o type_erasure type_erasure.cpp
 * Run:     ./type_erasure
 */
#include <iostream>
#include <string>
#include <vector>
#include <functional>
#include <any>
#include <memory>
#include <typeinfo>

// ===== std::function AS TYPE ERASURE =====
int add(int a, int b) { return a + b; }

struct Multiplier {
    int factor;
    int operator()(int a, int b) const { return a * b * factor; }
};

void stdFunctionDemo() {
    std::cout << "--- std::function Type Erasure ---\n";

    std::vector<std::function<int(int, int)>> ops;
    ops.push_back(add);
    ops.push_back(Multiplier{2});
    ops.push_back([](int a, int b) { return a - b; });

    std::vector<std::string> names = {"add", "multiply*2", "subtract"};
    for (std::size_t i = 0; i < ops.size(); ++i) {
        std::cout << "  " << names[i] << "(10, 3) = " << ops[i](10, 3) << "\n";
    }
}

// ===== std::any AS TYPE ERASURE =====
void stdAnyDemo() {
    std::cout << "\n--- std::any Type Erasure ---\n";

    std::vector<std::any> bag;
    bag.push_back(42);
    bag.push_back(std::string("hello"));
    bag.push_back(3.14);
    bag.push_back(true);

    for (const auto& item : bag) {
        std::cout << "  type: " << item.type().name() << " -> ";
        if (item.type() == typeid(int))
            std::cout << std::any_cast<int>(item);
        else if (item.type() == typeid(std::string))
            std::cout << std::any_cast<std::string>(item);
        else if (item.type() == typeid(double))
            std::cout << std::any_cast<double>(item);
        else if (item.type() == typeid(bool))
            std::cout << std::boolalpha << std::any_cast<bool>(item);
        std::cout << "\n";
    }
}

// ===== CUSTOM TYPE ERASURE (Concept/Model pattern) =====
class Drawable {
    struct Concept {
        virtual ~Concept() = default;
        virtual void draw() const = 0;
        virtual std::string name() const = 0;
        virtual std::unique_ptr<Concept> clone() const = 0;
    };

    template<typename T>
    struct Model : Concept {
        T obj_;
        Model(T obj) : obj_(std::move(obj)) {}
        void draw() const override { obj_.draw(); }
        std::string name() const override { return obj_.name(); }
        std::unique_ptr<Concept> clone() const override {
            return std::make_unique<Model>(obj_);
        }
    };

    std::unique_ptr<Concept> pimpl_;

public:
    template<typename T>
    Drawable(T obj) : pimpl_(std::make_unique<Model<T>>(std::move(obj))) {}

    Drawable(const Drawable& other) : pimpl_(other.pimpl_->clone()) {}
    Drawable& operator=(const Drawable& other) {
        pimpl_ = other.pimpl_->clone();
        return *this;
    }
    Drawable(Drawable&&) = default;
    Drawable& operator=(Drawable&&) = default;

    void draw() const { pimpl_->draw(); }
    std::string name() const { return pimpl_->name(); }
};

// Unrelated types — no shared base class
struct Circle {
    double radius;
    void draw() const { std::cout << "    Drawing circle (r=" << radius << ")\n"; }
    std::string name() const { return "Circle"; }
};

struct Square {
    double side;
    void draw() const { std::cout << "    Drawing square (s=" << side << ")\n"; }
    std::string name() const { return "Square"; }
};

struct Text {
    std::string content;
    void draw() const { std::cout << "    Drawing text: \"" << content << "\"\n"; }
    std::string name() const { return "Text"; }
};

// ===== CUSTOM Function<> IMPLEMENTATION =====
template<typename Signature>
class Function;

template<typename Ret, typename... Args>
class Function<Ret(Args...)> {
    struct Concept {
        virtual ~Concept() = default;
        virtual Ret invoke(Args... args) const = 0;
        virtual std::unique_ptr<Concept> clone() const = 0;
    };

    template<typename F>
    struct Model : Concept {
        F func_;
        Model(F f) : func_(std::move(f)) {}
        Ret invoke(Args... args) const override { return func_(args...); }
        std::unique_ptr<Concept> clone() const override {
            return std::make_unique<Model>(func_);
        }
    };

    std::unique_ptr<Concept> pimpl_;

public:
    Function() = default;

    template<typename F>
    Function(F f) : pimpl_(std::make_unique<Model<F>>(std::move(f))) {}

    Function(const Function& other)
        : pimpl_(other.pimpl_ ? other.pimpl_->clone() : nullptr) {}
    Function(Function&&) = default;

    Function& operator=(const Function& other) {
        pimpl_ = other.pimpl_ ? other.pimpl_->clone() : nullptr;
        return *this;
    }
    Function& operator=(Function&&) = default;

    Ret operator()(Args... args) const { return pimpl_->invoke(args...); }
    explicit operator bool() const { return pimpl_ != nullptr; }
};

int main() {
    stdFunctionDemo();
    stdAnyDemo();

    // ===== CUSTOM TYPE ERASURE =====
    std::cout << "\n--- Custom Type Erasure (Drawable) ---\n";

    std::vector<Drawable> scene;
    scene.push_back(Circle{5.0});
    scene.push_back(Square{3.0});
    scene.push_back(Text{"Hello, type erasure!"});
    scene.push_back(Circle{1.5});

    std::cout << "  Drawing scene (" << scene.size() << " objects):\n";
    for (const auto& obj : scene) {
        std::cout << "  [" << obj.name() << "] ";
        obj.draw();
    }

    Drawable copy = scene[0];
    std::cout << "\n  Copied: ";
    copy.draw();

    // ===== CUSTOM Function =====
    std::cout << "\n--- Custom Function<> ---\n";
    Function<int(int, int)> fn;

    fn = [](int a, int b) { return a + b; };
    std::cout << "  lambda add: " << fn(3, 4) << "\n";

    fn = Multiplier{3};
    std::cout << "  functor mul*3: " << fn(3, 4) << "\n";

    fn = add;
    std::cout << "  free func add: " << fn(3, 4) << "\n";

    // ===== WHY TYPE ERASURE? =====
    std::cout << "\n--- Why Type Erasure? ---\n";
    std::cout << "1. Value semantics (copy, move, store in containers)\n";
    std::cout << "2. No shared base class required\n";
    std::cout << "3. Works with any type that has the right interface\n";
    std::cout << "4. Decouples interface from implementation\n";
    std::cout << "5. Existing types need no modification\n";

    return 0;
}
