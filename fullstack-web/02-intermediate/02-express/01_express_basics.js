// ============================================
// EXPRESS.JS BASICS
// ============================================
// Express is a minimal, flexible web framework for Node.js.
// Install: npm install express

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// ---- 1. BASIC SERVER ----

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ---- 2. HTTP METHODS / ROUTES ----

// GET — retrieve data
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// GET with JSON response
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// POST — create data
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  console.log("Creating user:", name, email);
  res.status(201).json({ id: 1, name, email });
});

// PUT — update entire resource
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  res.json({ id: Number(id), name, email, updated: true });
});

// PATCH — partial update
app.patch("/api/users/:id", (req, res) => {
  const { id } = req.params;
  res.json({ id: Number(id), ...req.body, patched: true });
});

// DELETE — remove data
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  res.status(204).send(); // No content
});

// ---- 3. REQUEST OBJECT ----

app.get("/api/demo", (req, res) => {
  console.log("Method:", req.method);         // "GET"
  console.log("URL:", req.url);               // "/api/demo?page=1"
  console.log("Path:", req.path);             // "/api/demo"
  console.log("Query:", req.query);           // { page: "1" }
  console.log("Headers:", req.headers);       // { host: ..., ... }
  console.log("IP:", req.ip);                 // Client IP
  console.log("Protocol:", req.protocol);     // "http" or "https"

  res.json({ received: true });
});

// Route parameters
app.get("/api/users/:userId/posts/:postId", (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});

// Query strings: /api/search?q=hello&page=2&limit=10
app.get("/api/search", (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;
  res.json({ query: q, page: Number(page), limit: Number(limit) });
});

// ---- 4. RESPONSE OBJECT ----

app.get("/api/response-demo", (req, res) => {
  // Status code
  // res.status(200)           // OK (default)
  // res.status(201)           // Created
  // res.status(400)           // Bad Request
  // res.status(404)           // Not Found
  // res.status(500)           // Server Error

  // Send responses
  // res.send("text");           // Send text (sets Content-Type automatically)
  // res.json({ key: "value" }); // Send JSON
  // res.sendFile('/path/to/file.html'); // Send file

  // Set headers
  // res.set('X-Custom-Header', 'value');
  // res.set('Cache-Control', 'no-store');

  // Redirect
  // res.redirect('/new-url');
  // res.redirect(301, '/permanent-new-url');

  // Chaining
  res.status(200).json({ message: "Response demo" });
});

// ---- 5. SERVING STATIC FILES ----

// Serve files from "public" directory
// app.use(express.static('public'));
// Files: public/style.css → http://localhost:3000/style.css
// Files: public/images/logo.png → http://localhost:3000/images/logo.png

// With prefix
// app.use('/assets', express.static('public'));
// → http://localhost:3000/assets/style.css

// ---- 6. BASIC ERROR HANDLING ----

// 404 handler (must be after all routes)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler (must have 4 params)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ---- 7. START SERVER ----

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create a basic Express server that responds "Hello World" on GET /
// 2. Add routes for GET /api/products and GET /api/products/:id
// 3. Create a POST /api/products route that accepts JSON body
// 4. Add query string support: GET /api/products?category=electronics&sort=price
// 5. Serve a static HTML file from a public/ directory
// 6. Add a 404 handler for undefined routes
