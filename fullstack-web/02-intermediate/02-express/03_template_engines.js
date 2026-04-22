// ============================================
// TEMPLATE ENGINES (EJS)
// ============================================
// Template engines let you generate HTML dynamically with server-side data.
// Install: npm install ejs

const express = require("express");
const path = require("path");
const app = express();

// ---- 1. SETUP ----

// Set view engine
app.set("view engine", "ejs");

// Set views directory (default: ./views)
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// ---- 2. BASIC RENDERING ----

app.get("/", (req, res) => {
  // Renders views/index.ejs with data
  res.render("index", {
    title: "Home Page",
    message: "Welcome to our site!",
    user: { name: "Alice", role: "admin" },
  });
});

// ---- 3. EJS SYNTAX ----

const ejsSyntax = `
<!-- views/index.ejs -->
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>    <!-- Output escaped HTML (safe) -->
</head>
<body>
  <h1><%= message %></h1>

  <!-- Output unescaped HTML (careful with user input!) -->
  <%- '<strong>Bold</strong>' %>

  <!-- JavaScript logic (no output) -->
  <% if (user) { %>
    <p>Welcome, <%= user.name %>!</p>
  <% } else { %>
    <p>Please log in</p>
  <% } %>

  <!-- Loops -->
  <ul>
    <% items.forEach(item => { %>
      <li><%= item.name %> - $<%= item.price.toFixed(2) %></li>
    <% }) %>
  </ul>

  <!-- Comments (not rendered in HTML) -->
  <%# This is an EJS comment %>
</body>
</html>
`;

// ---- 4. PARTIALS (Reusable Components) ----

const partialExample = `
<!-- views/partials/header.ejs -->
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <% if (user) { %>
      <span>Hello, <%= user.name %></span>
      <a href="/logout">Logout</a>
    <% } else { %>
      <a href="/login">Login</a>
    <% } %>
  </nav>
</header>

<!-- views/partials/footer.ejs -->
<footer>
  <p>&copy; <%= new Date().getFullYear() %> My App</p>
</footer>

<!-- Include partials in main template -->
<!-- views/index.ejs -->
<!DOCTYPE html>
<html>
<head><title><%= title %></title></head>
<body>
  <%- include('partials/header', { user }) %>

  <main>
    <h1><%= title %></h1>
    <p><%= message %></p>
  </main>

  <%- include('partials/footer') %>
</body>
</html>
`;

// ---- 5. LAYOUT PATTERN ----

const layoutPattern = `
<!-- views/layout.ejs -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %> | My App</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <%- include('partials/header', { user }) %>
  <main class="container">
    <%- body %>
  </main>
  <%- include('partials/footer') %>
  <script src="/js/main.js"></script>
</body>
</html>
`;

// ---- 6. PRACTICAL ROUTES ----

// Product listing
app.get("/products", (req, res) => {
  const products = [
    { id: 1, name: "Laptop", price: 999.99, inStock: true },
    { id: 2, name: "Mouse", price: 29.99, inStock: true },
    { id: 3, name: "Keyboard", price: 79.99, inStock: false },
  ];
  res.render("products/index", { title: "Products", products });
});

// Product detail
app.get("/products/:id", (req, res) => {
  const product = { id: req.params.id, name: "Laptop", price: 999.99 };
  res.render("products/show", { title: product.name, product });
});

// Form — new product
app.get("/products/new", (req, res) => {
  res.render("products/new", { title: "New Product", errors: [] });
});

// Handle form submission
app.post("/products", (req, res) => {
  const { name, price } = req.body;
  const errors = [];
  if (!name) errors.push("Name is required");
  if (!price || isNaN(price)) errors.push("Valid price is required");

  if (errors.length) {
    return res.render("products/new", { title: "New Product", errors, name, price });
  }

  // Save to database...
  res.redirect("/products");
});

// Flash messages (using query params for simplicity)
app.get("/dashboard", (req, res) => {
  const { success, error } = req.query;
  res.render("dashboard", {
    title: "Dashboard",
    flash: { success, error },
    user: { name: "Alice" },
  });
});

// ---- 7. WHEN TO USE TEMPLATE ENGINES ----

// Use template engines for:
// - Multi-page apps (MPA) with server-side rendering
// - Admin dashboards
// - Email templates
// - Simple websites without complex interactivity

// Use React/Vue for:
// - Single-page apps (SPA) with rich interactivity
// - Real-time applications
// - Complex state management

// Many modern apps use BOTH:
// - API routes (Express) return JSON for React frontend
// - Template engine for admin panel or server-rendered pages

app.listen(3000, () => console.log("Template engine demo on port 3000"));

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create a views/ folder with index.ejs, about.ejs, and partials (header, footer)
// 2. Build a product listing page that displays data from an array
// 3. Create a form with validation that re-renders with error messages
// 4. Implement a layout system with reusable header, nav, and footer partials
// 5. Display flash messages (success/error) after form submissions
