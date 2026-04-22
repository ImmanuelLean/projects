// ============================================
// REST API DESIGN PRINCIPLES
// ============================================

// ---- 1. REST PRINCIPLES ----
// REST = Representational State Transfer
// - Client-server architecture
// - Stateless (each request contains all needed info)
// - Uniform interface (consistent URL patterns)
// - Resource-based (URLs represent resources, not actions)

// ---- 2. URL DESIGN ----

const urlPatterns = `
Good (resource-based, nouns):
  GET    /api/users           → List users
  POST   /api/users           → Create user
  GET    /api/users/:id       → Get single user
  PUT    /api/users/:id       → Replace user
  PATCH  /api/users/:id       → Partial update
  DELETE /api/users/:id       → Delete user

  GET    /api/users/:id/posts     → Get user's posts
  POST   /api/users/:id/posts     → Create post for user
  GET    /api/posts/:id/comments  → Get post's comments

Bad (action-based, verbs):
  GET  /api/getUsers          ✗
  POST /api/createUser        ✗
  POST /api/deleteUser/5      ✗
  GET  /api/getAllPostsByUser  ✗

Rules:
  - Use plural nouns: /users not /user
  - Use lowercase with hyphens: /order-items not /orderItems
  - Use nesting for relationships: /users/1/posts
  - Don't nest more than 2 levels deep
  - Version your API: /api/v1/users or via headers
`;

// ---- 3. HTTP METHODS AND STATUS CODES ----

const httpMethods = `
GET     → Read (safe, idempotent)
POST    → Create (not idempotent)
PUT     → Replace entire resource (idempotent)
PATCH   → Partial update (idempotent)
DELETE  → Remove (idempotent)
`;

const statusCodes = `
2xx Success:
  200 OK                  → General success
  201 Created             → Resource created (POST)
  204 No Content          → Success, no body (DELETE)

3xx Redirection:
  301 Moved Permanently
  304 Not Modified        → Cached version is still valid

4xx Client Error:
  400 Bad Request         → Invalid input/validation error
  401 Unauthorized        → Not authenticated
  403 Forbidden           → Authenticated but not authorized
  404 Not Found           → Resource doesn't exist
  409 Conflict            → Duplicate resource
  422 Unprocessable Entity → Valid JSON but semantic error
  429 Too Many Requests   → Rate limited

5xx Server Error:
  500 Internal Server Error → Unexpected server failure
  503 Service Unavailable   → Server down/maintenance
`;

// ---- 4. REQUEST/RESPONSE FORMAT ----

// Consistent response format
const responseExamples = {
  // Success (single resource)
  single: {
    status: "success",
    data: {
      user: { id: 1, name: "Alice", email: "alice@test.com" },
    },
  },

  // Success (collection)
  collection: {
    status: "success",
    data: {
      users: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 42,
      pages: 5,
    },
  },

  // Error
  error: {
    status: "error",
    message: "Validation failed",
    errors: [
      { field: "email", message: "Email is required" },
      { field: "name", message: "Name must be at least 2 characters" },
    ],
  },
};

// ---- 5. QUERY PARAMETERS ----

const queryParams = `
Filtering:    GET /api/products?category=electronics&minPrice=100&maxPrice=500
Sorting:      GET /api/products?sort=-price,name    (- prefix = descending)
Pagination:   GET /api/products?page=2&limit=20
Searching:    GET /api/products?search=laptop
Field select: GET /api/products?fields=name,price,category
`;

// ---- 6. API VERSIONING ----

const versioning = `
URL path (most common):
  /api/v1/users
  /api/v2/users

Header-based:
  Accept: application/vnd.myapi.v1+json

Query parameter:
  /api/users?version=1
`;

// ---- 7. HATEOAS (Hypermedia links) ----

const hateoasExample = {
  data: {
    id: 1,
    name: "Alice",
    email: "alice@test.com",
  },
  links: {
    self: "/api/users/1",
    posts: "/api/users/1/posts",
    avatar: "/api/users/1/avatar",
  },
};

// ---- 8. COMMON PATTERNS ----

// Soft delete (don't actually remove data)
// PATCH /api/users/:id → { isActive: false, deletedAt: new Date() }

// Bulk operations
// POST /api/users/bulk-delete → { ids: [1, 2, 3] }
// PATCH /api/users/bulk-update → { ids: [1, 2], data: { role: "admin" } }

// File uploads
// POST /api/users/:id/avatar (multipart/form-data)

// Search
// GET /api/search?q=keyword&type=posts&sort=relevance

console.log("REST API Design complete!");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Design URL structure for a blog API (users, posts, comments, tags, categories)
// 2. For each endpoint, define the HTTP method, URL, request body, and response format
// 3. Create a consistent error response format for your API
// 4. Design filtering, sorting, and pagination query parameters
// 5. When would you use PUT vs PATCH? Give examples
// 6. Design an API versioning strategy for your app
