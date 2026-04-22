// ============================================
// MONGOOSE ODM (Object Document Mapper)
// ============================================
// Install: npm install mongoose

const mongoose = require("mongoose");

// ---- 1. CONNECTION ----

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/myapp", {
      // Options are mostly auto-configured in Mongoose 7+
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Connection error:", err.message);
    process.exit(1);
  }
}

// Connection events
mongoose.connection.on("connected", () => console.log("Mongoose connected"));
mongoose.connection.on("error", (err) => console.error("Mongoose error:", err));
mongoose.connection.on("disconnected", () => console.log("Mongoose disconnected"));

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// ---- 2. SCHEMAS AND MODELS ----

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Don't include in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    age: { type: Number, min: 13, max: 120 },
    isActive: { type: Boolean, default: true },
    bio: { type: String, maxlength: 500 },
    avatar: String,
    tags: [String], // Array of strings
    address: {
      street: String,
      city: String,
      country: String,
      zip: String,
    },
    socialLinks: {
      type: Map,
      of: String, // { twitter: "...", github: "..." }
    },
    loginCount: { type: Number, default: 0 },
    lastLogin: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },  // Include virtuals when converting to JSON
    toObject: { virtuals: true },
  }
);

// ---- 3. VIRTUALS ----

// Virtual property (not stored in DB, computed on the fly)
userSchema.virtual("displayName").get(function () {
  return `@${this.username}`;
});

// Virtual populate (reference without storing)
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
});

// ---- 4. METHODS AND STATICS ----

// Instance methods (on a document)
userSchema.methods.comparePassword = async function (candidatePassword) {
  const bcrypt = require("bcrypt");
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.recordLogin = function () {
  this.loginCount++;
  this.lastLogin = new Date();
  return this.save();
};

// Static methods (on the model)
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

// ---- 5. MIDDLEWARE (Hooks) ----

// Pre-save: hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const bcrypt = require("bcrypt");
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Post-save
userSchema.post("save", function (doc) {
  console.log(`User ${doc.username} saved`);
});

// Pre-find: exclude inactive users by default
// userSchema.pre(/^find/, function (next) {
//   this.find({ isActive: { $ne: false } });
//   next();
// });

// ---- 6. INDEXES ----

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ "address.city": 1 });

// Create the model
const User = mongoose.model("User", userSchema);

// ---- 7. POST SCHEMA (with references) ----

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    excerpt: String,
    published: { type: Boolean, default: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    tags: [String],
    comments: [
      {
        // Embedded subdocuments
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title
postSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

const Post = mongoose.model("Post", postSchema);

// ---- 8. CRUD OPERATIONS ----

async function crudExamples() {
  // CREATE
  const user = await User.create({
    username: "alice",
    email: "alice@test.com",
    password: "password123",
    age: 28,
  });

  // READ
  const allUsers = await User.find();
  const admins = await User.find({ role: "admin" }).sort({ createdAt: -1 }).limit(10);
  const oneUser = await User.findById("60d5ec49f1b2c72b9c8e4d3a");
  const byEmail = await User.findByEmail("alice@test.com"); // Custom static

  // With password (since select: false)
  const withPw = await User.findOne({ email: "alice@test.com" }).select("+password");

  // Populate references
  const posts = await Post.find({ published: true })
    .populate("author", "username email avatar") // Only include these fields
    .populate("comments.user", "username avatar")
    .sort({ createdAt: -1 })
    .limit(20);

  // UPDATE
  const updated = await User.findByIdAndUpdate(
    user._id,
    { $set: { bio: "Hello World" }, $inc: { loginCount: 1 } },
    { new: true, runValidators: true } // Return updated doc, run validation
  );

  // DELETE
  await User.findByIdAndDelete(user._id);
  await User.deleteMany({ isActive: false });

  // AGGREGATION
  const statsByRole = await User.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$role", count: { $sum: 1 }, avgAge: { $avg: "$age" } } },
    { $sort: { count: -1 } },
  ]);

  // Query builder pattern
  const query = User.find()
    .where("age").gte(18).lte(65)
    .where("role").equals("user")
    .select("username email age")
    .sort("-createdAt")
    .limit(10);
  const results = await query.exec();
}

// ---- 9. PAGINATION HELPER ----

async function paginate(model, query = {}, options = {}) {
  const { page = 1, limit = 10, sort = "-createdAt", populate } = options;
  const skip = (page - 1) * limit;

  let queryBuilder = model.find(query).sort(sort).skip(skip).limit(limit);
  if (populate) queryBuilder = queryBuilder.populate(populate);

  const [docs, total] = await Promise.all([
    queryBuilder.exec(),
    model.countDocuments(query),
  ]);

  return {
    docs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}

// Usage:
// const result = await paginate(Post, { published: true }, { page: 2, limit: 10, populate: 'author' });

console.log("Mongoose ODM complete!");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create a User schema with validation, pre-save hooks, and instance methods
// 2. Create a Post schema with author reference and embedded comments
// 3. Implement CRUD operations with proper error handling
// 4. Use populate() to fetch posts with author details
// 5. Build a paginated, filtered, sorted API for posts
// 6. Write an aggregation pipeline to get top authors by post count
