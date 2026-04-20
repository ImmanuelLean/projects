/**
 * LESSON: Smart Pointers (C++11)
 * Automatic memory management - no manual new/delete needed.
 *
 * unique_ptr - exclusive ownership (cannot be copied, only moved)
 * shared_ptr - shared ownership (reference counted)
 * weak_ptr   - non-owning observer (breaks circular references)
 *
 * RULE: Prefer smart pointers over raw new/delete.
 */
#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Resource {
    std::string name;
public:
    Resource(const std::string& n) : name(n) {
        std::cout << "  [Resource '" << name << "' created]\n";
    }
    ~Resource() {
        std::cout << "  [Resource '" << name << "' destroyed]\n";
    }
    void use() const { std::cout << "  Using resource: " << name << "\n"; }
    std::string getName() const { return name; }
};

int main() {
    // ===== UNIQUE_PTR (exclusive ownership) =====
    std::cout << "--- unique_ptr ---\n";
    {
        // Create with make_unique (preferred)
        auto uptr = std::make_unique<Resource>("Unique");
        uptr->use();

        // Cannot copy unique_ptr
        // auto copy = uptr; // ERROR!

        // Can MOVE ownership
        auto moved = std::move(uptr);
        moved->use();
        // uptr is now nullptr
        std::cout << "  Original is null? " << (uptr == nullptr ? "Yes" : "No") << "\n";
    } // automatically deleted here

    // ===== UNIQUE_PTR WITH ARRAYS =====
    std::cout << "\n--- unique_ptr with array ---\n";
    {
        auto arr = std::make_unique<int[]>(5);
        for (int i = 0; i < 5; i++) arr[i] = (i + 1) * 10;
        for (int i = 0; i < 5; i++) std::cout << arr[i] << " ";
        std::cout << "\n";
    }

    // ===== SHARED_PTR (shared ownership) =====
    std::cout << "\n--- shared_ptr ---\n";
    {
        auto sptr1 = std::make_shared<Resource>("Shared");
        std::cout << "  Count after create: " << sptr1.use_count() << "\n"; // 1

        {
            auto sptr2 = sptr1; // copy - shares ownership
            std::cout << "  Count after copy: " << sptr1.use_count() << "\n"; // 2
            sptr2->use();
        } // sptr2 destroyed, count decreases

        std::cout << "  Count after inner scope: " << sptr1.use_count() << "\n"; // 1
    } // sptr1 destroyed, resource deleted (count reaches 0)

    // ===== WEAK_PTR (non-owning observer) =====
    std::cout << "\n--- weak_ptr ---\n";
    {
        std::weak_ptr<Resource> wptr;
        {
            auto sptr = std::make_shared<Resource>("Observed");
            wptr = sptr; // weak_ptr doesn't increase count

            std::cout << "  Expired? " << std::boolalpha << wptr.expired() << "\n"; // false
            std::cout << "  Count: " << wptr.use_count() << "\n"; // 1

            // Lock to get shared_ptr (may fail if expired)
            if (auto locked = wptr.lock()) {
                locked->use();
            }
        } // sptr destroyed, resource deleted

        std::cout << "  Expired after scope? " << wptr.expired() << "\n"; // true
        auto locked = wptr.lock();
        std::cout << "  Lock returns null? " << (locked == nullptr ? "Yes" : "No") << "\n";
    }

    // ===== PRACTICAL: Smart pointers in collections =====
    std::cout << "\n--- Smart Pointers in Vectors ---\n";
    {
        std::vector<std::unique_ptr<Resource>> resources;
        resources.push_back(std::make_unique<Resource>("DB Connection"));
        resources.push_back(std::make_unique<Resource>("File Handle"));
        resources.push_back(std::make_unique<Resource>("Network Socket"));

        for (const auto& r : resources) {
            r->use();
        }
        std::cout << "  All resources auto-deleted when vector goes out of scope.\n";
    }

    return 0;
}
