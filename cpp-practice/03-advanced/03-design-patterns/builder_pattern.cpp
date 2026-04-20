/**
 * LESSON: Builder Pattern
 * Construct complex objects step-by-step with a fluent interface.
 * Separates construction from representation.
 *
 * Compile: g++ -std=c++17 -o builder builder_pattern.cpp
 * Run:     ./builder
 */
#include <iostream>
#include <string>
#include <vector>
#include <sstream>

// ===== PRODUCT: Complex object to build =====
class Pizza {
    std::string size;
    std::string crust;
    std::string sauce;
    std::vector<std::string> toppings;
    bool extraCheese = false;

    friend class PizzaBuilder;  // only builder can construct

public:
    void display() const {
        std::cout << "Pizza: " << size << ", " << crust << " crust, " << sauce << " sauce\n";
        std::cout << "  Toppings: ";
        for (const auto& t : toppings) std::cout << t << " ";
        if (extraCheese) std::cout << "(+extra cheese)";
        std::cout << "\n";
    }
};

// ===== BUILDER with method chaining =====
class PizzaBuilder {
    Pizza pizza;

public:
    PizzaBuilder& setSize(const std::string& size) {
        pizza.size = size;
        return *this;  // return *this for chaining
    }

    PizzaBuilder& setCrust(const std::string& crust) {
        pizza.crust = crust;
        return *this;
    }

    PizzaBuilder& setSauce(const std::string& sauce) {
        pizza.sauce = sauce;
        return *this;
    }

    PizzaBuilder& addTopping(const std::string& topping) {
        pizza.toppings.push_back(topping);
        return *this;
    }

    PizzaBuilder& withExtraCheese() {
        pizza.extraCheese = true;
        return *this;
    }

    Pizza build() {
        return pizza;
    }
};

// ===== HTML BUILDER =====
class HtmlBuilder {
    std::ostringstream html;
    int indent = 0;

    std::string indentStr() const {
        return std::string(indent * 2, ' ');
    }

public:
    HtmlBuilder& doctype() {
        html << "<!DOCTYPE html>\n";
        return *this;
    }

    HtmlBuilder& open(const std::string& tag, const std::string& attrs = "") {
        html << indentStr() << "<" << tag;
        if (!attrs.empty()) html << " " << attrs;
        html << ">\n";
        indent++;
        return *this;
    }

    HtmlBuilder& close(const std::string& tag) {
        indent--;
        html << indentStr() << "</" << tag << ">\n";
        return *this;
    }

    HtmlBuilder& text(const std::string& content) {
        html << indentStr() << content << "\n";
        return *this;
    }

    HtmlBuilder& selfClose(const std::string& tag, const std::string& attrs = "") {
        html << indentStr() << "<" << tag;
        if (!attrs.empty()) html << " " << attrs;
        html << " />\n";
        return *this;
    }

    std::string build() const {
        return html.str();
    }
};

// ===== QUERY BUILDER =====
class QueryBuilder {
    std::string table;
    std::vector<std::string> columns;
    std::vector<std::string> conditions;
    std::string orderBy;
    int limitVal = -1;

public:
    QueryBuilder& select(const std::vector<std::string>& cols) {
        columns = cols;
        return *this;
    }

    QueryBuilder& from(const std::string& t) {
        table = t;
        return *this;
    }

    QueryBuilder& where(const std::string& condition) {
        conditions.push_back(condition);
        return *this;
    }

    QueryBuilder& order(const std::string& col) {
        orderBy = col;
        return *this;
    }

    QueryBuilder& limit(int n) {
        limitVal = n;
        return *this;
    }

    std::string build() const {
        std::ostringstream sql;
        sql << "SELECT ";
        if (columns.empty()) {
            sql << "*";
        } else {
            for (size_t i = 0; i < columns.size(); i++) {
                if (i > 0) sql << ", ";
                sql << columns[i];
            }
        }
        sql << " FROM " << table;
        for (size_t i = 0; i < conditions.size(); i++) {
            sql << (i == 0 ? " WHERE " : " AND ") << conditions[i];
        }
        if (!orderBy.empty()) sql << " ORDER BY " << orderBy;
        if (limitVal > 0) sql << " LIMIT " << limitVal;
        return sql.str();
    }
};

int main() {
    // --- Pizza Builder ---
    std::cout << "--- Pizza Builder ---\n";
    Pizza margherita = PizzaBuilder()
        .setSize("Large")
        .setCrust("Thin")
        .setSauce("Tomato")
        .addTopping("Mozzarella")
        .addTopping("Basil")
        .build();
    margherita.display();

    Pizza supreme = PizzaBuilder()
        .setSize("XL")
        .setCrust("Stuffed")
        .setSauce("BBQ")
        .addTopping("Pepperoni")
        .addTopping("Mushrooms")
        .addTopping("Peppers")
        .addTopping("Onions")
        .withExtraCheese()
        .build();
    supreme.display();

    // --- HTML Builder ---
    std::cout << "\n--- HTML Builder ---\n";
    std::string page = HtmlBuilder()
        .doctype()
        .open("html", "lang=\"en\"")
          .open("head")
            .open("title").text("My Page").close("title")
          .close("head")
          .open("body")
            .open("h1").text("Hello, World!").close("h1")
            .open("p").text("Built with the builder pattern.").close("p")
            .selfClose("img", "src=\"logo.png\" alt=\"Logo\"")
          .close("body")
        .close("html")
        .build();
    std::cout << page;

    // --- Query Builder ---
    std::cout << "--- Query Builder ---\n";
    std::string query1 = QueryBuilder()
        .select({"name", "age", "email"})
        .from("users")
        .where("age > 18")
        .where("active = true")
        .order("name")
        .limit(10)
        .build();
    std::cout << query1 << "\n";

    std::string query2 = QueryBuilder()
        .from("products")
        .where("price < 100")
        .build();
    std::cout << query2 << "\n";

    return 0;
}
