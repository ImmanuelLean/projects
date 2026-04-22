// ============================================
// BUILDING A FULL CRUD REST API
// ============================================
// A complete Express + Prisma REST API example

const express = require("express");
const app = express();

// ---- MIDDLEWARE ----
app.use(express.json());

// ---- SIMULATED DATABASE ----
let products = [
  { id: 1, name: "Laptop", price: 999.99, category: "electronics", stock: 50, createdAt: new Date() },
  { id: 2, name: "Mouse", price: 29.99, category: "electronics", stock: 200, createdAt: new Date() },
  { id: 3, name: "Desk Chair", price: 249.99, category: "furniture", stock: 30, createdAt: new Date() },
  { id: 4, name: "Notebook", price: 4.99, category: "stationery", stock: 500, createdAt: new Date() },
];
let nextId = 5;

// ---- HELPER: Response formatter ----
const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({ status: "success", data });
};

const sendError = (res, message, statusCode = 400, errors = null) => {
  const response = { status: "error", message };
  if (errors) response.errors = errors;
  res.status(statusCode).json(response);
};

// ---- HELPER: Validate product ----
function validateProduct(body, isUpdate = false) {
  const errors = [];
  const { name, price, category, stock } = body;

  if (!isUpdate || name !== undefined) {
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.push({ field: "name", message: "Name must be at least 2 characters" });
    }
  }
  if (!isUpdate || price !== undefined) {
    if (price === undefined || typeof price !== "number" || price < 0) {
      errors.push({ field: "price", message: "Price must be a non-negative number" });
    }
  }
  if (!isUpdate || category !== undefined) {
    const validCategories = ["electronics", "furniture", "stationery", "clothing"];
    if (!category || !validCategories.includes(category)) {
      errors.push({ field: "category", message: `Category must be one of: ${validCategories.join(", ")}` });
    }
  }
  if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
    errors.push({ field: "stock", message: "Stock must be a non-negative number" });
  }

  return errors;
}

// ---- 1. GET ALL PRODUCTS (with filtering, sorting, pagination) ----

app.get("/api/products", (req, res) => {
  let result = [...products];

  // Filtering
  const { category, minPrice, maxPrice, search, inStock } = req.query;

  if (category) {
    result = result.filter((p) => p.category === category);
  }
  if (minPrice) {
    result = result.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (inStock === "true") {
    result = result.filter((p) => p.stock > 0);
  }

  // Sorting: ?sort=-price,name
  const sort = req.query.sort;
  if (sort) {
    const sortFields = sort.split(",");
    result.sort((a, b) => {
      for (const field of sortFields) {
        const desc = field.startsWith("-");
        const key = desc ? field.slice(1) : field;
        if (a[key] < b[key]) return desc ? 1 : -1;
        if (a[key] > b[key]) return desc ? -1 : 1;
      }
      return 0;
    });
  }

  // Pagination
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const total = result.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  result = result.slice(start, start + limit);

  // Field selection: ?fields=name,price
  if (req.query.fields) {
    const fields = req.query.fields.split(",");
    result = result.map((item) => {
      const selected = { id: item.id };
      fields.forEach((f) => {
        if (item[f] !== undefined) selected[f] = item[f];
      });
      return selected;
    });
  }

  sendSuccess(res, {
    products: result,
    pagination: { page, limit, total, pages },
  });
});

// ---- 2. GET SINGLE PRODUCT ----

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) {
    return sendError(res, "Product not found", 404);
  }
  sendSuccess(res, { product });
});

// ---- 3. CREATE PRODUCT ----

app.post("/api/products", (req, res) => {
  const errors = validateProduct(req.body);
  if (errors.length) {
    return sendError(res, "Validation failed", 400, errors);
  }

  const { name, price, category, stock = 0 } = req.body;
  const product = {
    id: nextId++,
    name: name.trim(),
    price,
    category,
    stock,
    createdAt: new Date(),
  };
  products.push(product);

  sendSuccess(res, { product }, 201);
});

// ---- 4. UPDATE PRODUCT (PUT — full replace) ----

app.put("/api/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) {
    return sendError(res, "Product not found", 404);
  }

  const errors = validateProduct(req.body);
  if (errors.length) {
    return sendError(res, "Validation failed", 400, errors);
  }

  const { name, price, category, stock = 0 } = req.body;
  products[index] = {
    ...products[index],
    name: name.trim(),
    price,
    category,
    stock,
    updatedAt: new Date(),
  };

  sendSuccess(res, { product: products[index] });
});

// ---- 5. PARTIAL UPDATE (PATCH) ----

app.patch("/api/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) {
    return sendError(res, "Product not found", 404);
  }

  const errors = validateProduct(req.body, true);
  if (errors.length) {
    return sendError(res, "Validation failed", 400, errors);
  }

  const allowedFields = ["name", "price", "category", "stock"];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = field === "name" ? req.body[field].trim() : req.body[field];
    }
  }

  products[index] = { ...products[index], ...updates, updatedAt: new Date() };
  sendSuccess(res, { product: products[index] });
});

// ---- 6. DELETE PRODUCT ----

app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) {
    return sendError(res, "Product not found", 404);
  }
  products.splice(index, 1);
  res.status(204).send();
});

// ---- 7. BULK OPERATIONS ----

app.post("/api/products/bulk-delete", (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return sendError(res, "ids must be a non-empty array");
  }

  const before = products.length;
  products = products.filter((p) => !ids.includes(p.id));
  const deleted = before - products.length;

  sendSuccess(res, { deleted });
});

// ---- 8. STATS ENDPOINT ----

app.get("/api/products/stats", (req, res) => {
  const stats = {
    total: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    avgPrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
    byCategory: products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {}),
    outOfStock: products.filter((p) => p.stock === 0).length,
  };
  sendSuccess(res, { stats });
});

// ---- ERROR HANDLING ----

app.use((req, res) => {
  sendError(res, `Route ${req.method} ${req.url} not found`, 404);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  sendError(res, "Internal server error", 500);
});

app.listen(3000, () => console.log("CRUD API running on port 3000"));

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Add a GET /api/products/stats endpoint that returns product statistics
// 2. Implement search across name AND category fields
// 3. Add sorting by multiple fields: ?sort=-price,name
// 4. Implement field selection: ?fields=name,price
// 5. Add bulk update endpoint: PATCH /api/products/bulk-update
// 6. Connect to a real database (Prisma or Mongoose) instead of the in-memory array
