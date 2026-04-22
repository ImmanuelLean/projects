// ============================================
// MONGODB FUNDAMENTALS
// ============================================
// MongoDB is a NoSQL document database. Data is stored as JSON-like documents (BSON).
// No fixed schema — documents in a collection can have different fields.

// ---- 1. KEY CONCEPTS ----
// Database → Collection (≈ table) → Document (≈ row)
// Documents are BSON (Binary JSON) with flexible schemas
// _id field is automatically added (ObjectId)

// ---- 2. MONGO SHELL / MONGOSH COMMANDS ----

const shellCommands = `
// Show databases
show dbs

// Use/create database
use myapp

// Show collections
show collections

// ---- INSERT ----
db.users.insertOne({
  name: "Alice",
  email: "alice@test.com",
  age: 28,
  roles: ["user"],
  address: { city: "New York", country: "USA" },
  createdAt: new Date()
})

db.users.insertMany([
  { name: "Bob", email: "bob@test.com", age: 32 },
  { name: "Charlie", email: "charlie@test.com", age: 25 }
])

// ---- FIND (READ) ----
db.users.find()                              // All documents
db.users.find({ age: { $gt: 25 } })          // Age > 25
db.users.findOne({ email: "alice@test.com" }) // First match
db.users.find({ name: "Alice" }, { name: 1, email: 1 }) // Projection (select fields)

// Query operators
db.users.find({ age: { $gte: 18, $lte: 65 } })      // >= 18 AND <= 65
db.users.find({ roles: { $in: ["admin", "moderator"] } }) // Role is admin or moderator
db.users.find({ email: { $exists: true } })            // Has email field
db.users.find({ name: { $regex: /^ali/i } })           // Name starts with "ali"
db.users.find({ $or: [{ age: { $lt: 18 } }, { age: { $gt: 65 } }] }) // OR
db.users.find({ "address.city": "New York" })           // Nested field
db.users.find({ roles: "admin" })                       // Array contains "admin"
db.users.find({ roles: { $size: 2 } })                  // Array has exactly 2 elements

// Sorting, limiting, skipping
db.users.find().sort({ createdAt: -1 })                 // Sort descending
db.users.find().sort({ age: 1 }).limit(10).skip(20)     // Pagination

// Count
db.users.countDocuments({ age: { $gt: 25 } })

// Distinct values
db.users.distinct("role")

// ---- UPDATE ----
db.users.updateOne(
  { email: "alice@test.com" },           // Filter
  { $set: { age: 29, role: "admin" } }   // Update
)

// Update operators
db.users.updateOne({ _id: id }, {
  $set: { name: "New Name" },            // Set field value
  $unset: { tempField: "" },             // Remove field
  $inc: { loginCount: 1 },              // Increment by 1
  $push: { roles: "moderator" },         // Add to array
  $pull: { roles: "user" },             // Remove from array
  $addToSet: { tags: "new" },           // Add to array if not exists
  $rename: { oldField: "newField" },     // Rename field
  $currentDate: { updatedAt: true }      // Set to current date
})

db.users.updateMany(
  { isActive: false },
  { $set: { archived: true } }
)

// Upsert (create if not exists)
db.users.updateOne(
  { email: "new@test.com" },
  { $set: { name: "New User", email: "new@test.com" } },
  { upsert: true }
)

// ---- DELETE ----
db.users.deleteOne({ _id: ObjectId("...") })
db.users.deleteMany({ isActive: false })

// ---- INDEXES ----
db.users.createIndex({ email: 1 })                  // Single field
db.users.createIndex({ email: 1 }, { unique: true }) // Unique index
db.users.createIndex({ name: 1, age: -1 })           // Compound index
db.users.createIndex({ bio: "text" })                // Text search index
db.users.getIndexes()                                 // List indexes
db.users.dropIndex("email_1")                         // Remove index

// ---- AGGREGATION PIPELINE ----
db.orders.aggregate([
  { $match: { status: "completed" } },                // Filter
  { $group: {                                          // Group
      _id: "$customerId",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 },
      avgOrder: { $avg: "$total" }
  }},
  { $sort: { totalSpent: -1 } },                      // Sort
  { $limit: 10 },                                     // Limit
  { $lookup: {                                         // Join
      from: "customers",
      localField: "_id",
      foreignField: "_id",
      as: "customer"
  }},
  { $unwind: "$customer" },                            // Flatten array
  { $project: {                                        // Select fields
      customerName: "$customer.name",
      totalSpent: 1,
      orderCount: 1
  }}
])
`;

// ---- 3. WHEN TO USE MONGODB VS SQL ----

// Use MongoDB when:
// - Flexible/evolving schemas
// - Hierarchical/nested data (e.g., blog posts with embedded comments)
// - Rapid prototyping
// - Horizontal scaling needed
// - Document-oriented data (logs, product catalogs, content management)

// Use PostgreSQL when:
// - Complex relationships and joins
// - ACID transactions are critical
// - Data integrity is paramount
// - Structured, well-defined schemas
// - Reporting and analytics

console.log("MongoDB Fundamentals complete!");
console.log("Key: insertOne, find, updateOne, deleteOne, aggregate");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Insert 10 user documents with nested address objects and role arrays
// 2. Query users by city (nested field) and sort by age
// 3. Update a user to add a new role to their roles array
// 4. Write an aggregation to find the average age per city
// 5. Create appropriate indexes for email (unique) and a compound index on city + age
// 6. Delete all users who haven't logged in for 90 days
