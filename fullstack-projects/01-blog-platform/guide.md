# 📝 Project 1: Blog Platform

> **Level**: Beginner | **Time**: 1-2 weeks
> Build a full-stack blog with user auth, posts, comments, and categories.

---

## Features

- [ ] User registration & login (JWT)
- [ ] Create, edit, delete blog posts (Markdown support)
- [ ] Rich text / Markdown editor
- [ ] Categories and tags
- [ ] Comments on posts
- [ ] Image upload for post covers
- [ ] Search and filter posts
- [ ] User profile page
- [ ] Responsive design
- [ ] Pagination

---

## Tech Stack

```
Backend:  Node.js + Express + Prisma + PostgreSQL
Frontend: React + React Router + Tailwind CSS
Auth:     JWT + bcrypt
Upload:   Multer + Sharp
```

---

## Step 1: Project Setup

```bash
mkdir blog-platform && cd blog-platform

# Backend
mkdir server && cd server
npm init -y
npm install express prisma @prisma/client cors helmet morgan
npm install bcrypt jsonwebtoken multer sharp
npm install -D nodemon jest supertest
npx prisma init

# Frontend
cd ..
npm create vite@latest client -- --template react
cd client
npm install react-router-dom axios react-markdown
npm install -D tailwindcss @tailwindcss/typography
```

### Folder Structure
```
blog-platform/
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── postController.js
│   │   │   └── commentController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   └── commentRoutes.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   └── asyncHandler.js
│   │   └── app.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── PostCard.jsx
    │   │   ├── PostForm.jsx
    │   │   ├── CommentSection.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── PostDetail.jsx
    │   │   ├── CreatePost.jsx
    │   │   ├── EditPost.jsx
    │   │   └── Profile.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   └── useFetch.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── api/
    │   │   └── client.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## Step 2: Database Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  bio       String?
  avatar    String?
  role      Role      @default(USER)
  posts     Post[]
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Post {
  id          Int       @id @default(autoincrement())
  title       String
  slug        String    @unique
  content     String
  excerpt     String?
  coverImage  String?
  published   Boolean   @default(false)
  author      User      @relation(fields: [authorId], references: [id])
  authorId    Int
  category    Category? @relation(fields: [categoryId], references: [id])
  categoryId  Int?
  tags        Tag[]
  comments    Comment[]
  views       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([authorId])
  @@index([slug])
  @@index([published, createdAt])
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  slug  String @unique
  posts Post[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    Int
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  parentId  Int?
  replies   Comment[] @relation("CommentReplies")
  createdAt DateTime @default(now())

  @@index([postId])
}

enum Role {
  USER
  ADMIN
}
```

```bash
npx prisma migrate dev --name init
```

---

## Step 3: Backend API

### 3.1 — App Setup (src/app.js)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

module.exports = app;
```

### 3.2 — Auth Controller
```javascript
// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ user, token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
};

exports.me = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, bio: true, avatar: true },
  });
  res.json(user);
};
```

### 3.3 — Post Controller
```javascript
// controllers/postController.js
const prisma = require('../config/prisma');

exports.getPosts = async (req, res) => {
  const { page = 1, limit = 10, search, category } = req.query;

  const where = {
    published: true,
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(category && { category: { slug: category } }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { name: true, slug: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  res.json({
    posts,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
  });
};

exports.getPost = async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { slug: req.params.slug },
    include: {
      author: { select: { id: true, name: true, avatar: true, bio: true } },
      category: true,
      tags: true,
      comments: {
        where: { parentId: null },
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          replies: { include: { author: { select: { id: true, name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!post) return res.status(404).json({ error: 'Post not found' });

  // Increment views
  await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });

  res.json(post);
};

exports.createPost = async (req, res) => {
  const { title, content, excerpt, categoryId, tags, published } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const post = await prisma.post.create({
    data: {
      title, slug: `${slug}-${Date.now()}`, content, excerpt,
      published: published || false,
      authorId: req.userId,
      categoryId: categoryId || null,
      coverImage: req.file?.filename || null,
      ...(tags && { tags: { connectOrCreate: tags.map(t => ({
        where: { name: t }, create: { name: t },
      })) } }),
    },
    include: { author: { select: { id: true, name: true } }, category: true, tags: true },
  });

  res.status(201).json(post);
};

exports.updatePost = async (req, res) => {
  const post = await prisma.post.findUnique({ where: { id: Number(req.params.id) } });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.authorId !== req.userId) return res.status(403).json({ error: 'Not authorized' });

  const updated = await prisma.post.update({
    where: { id: post.id },
    data: req.body,
    include: { category: true, tags: true },
  });

  res.json(updated);
};

exports.deletePost = async (req, res) => {
  const post = await prisma.post.findUnique({ where: { id: Number(req.params.id) } });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.authorId !== req.userId) return res.status(403).json({ error: 'Not authorized' });

  await prisma.post.delete({ where: { id: post.id } });
  res.status(204).send();
};
```

### 3.4 — API Routes
```
POST   /api/auth/register       — Register
POST   /api/auth/login          — Login
GET    /api/auth/me             — Get current user (protected)

GET    /api/posts               — List posts (pagination, search, filter)
GET    /api/posts/:slug         — Get single post
POST   /api/posts               — Create post (protected)
PUT    /api/posts/:id           — Update post (protected, owner only)
DELETE /api/posts/:id           — Delete post (protected, owner only)

POST   /api/comments            — Add comment (protected)
DELETE /api/comments/:id        — Delete comment (protected, owner only)

GET    /api/categories          — List categories
```

---

## Step 4: Frontend (React)

### 4.1 — Auth Context
```jsx
// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 4.2 — Key Pages to Build
1. **Home** — Post list with search, category filter, pagination
2. **Post Detail** — Full post with markdown rendering, comments
3. **Create/Edit Post** — Form with markdown editor, image upload
4. **Login/Register** — Auth forms
5. **Profile** — User info, their posts

### 4.3 — API Client
```javascript
// api/client.js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## Step 5: Deploy

```bash
# Dockerize
docker compose up -d  # PostgreSQL + API + React

# Or deploy to:
# Backend: Railway / Render
# Frontend: Vercel / Netlify
# Database: Railway PostgreSQL / Supabase
```

---

## Stretch Features (Add After)

- [ ] Like/bookmark posts
- [ ] Email notifications for new comments
- [ ] RSS feed
- [ ] Social sharing buttons
- [ ] Reading time estimate
- [ ] Related posts
- [ ] Admin dashboard (manage users, moderate comments)
- [ ] Dark mode toggle
