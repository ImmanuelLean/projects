# 🛒 Project 3: E-Commerce Store

> **Level**: Intermediate | **Time**: 2-3 weeks
> Build a complete online store with cart, checkout, payments, and admin dashboard.

---

## Features

### Customer
- [ ] Browse products (grid, list views)
- [ ] Search, filter by category/price/rating
- [ ] Product detail page with images
- [ ] Shopping cart (add, remove, update quantity)
- [ ] Checkout with Stripe payment
- [ ] Order history and tracking
- [ ] User reviews and ratings
- [ ] Wishlist

### Admin
- [ ] Dashboard (revenue, orders, top products)
- [ ] Product management (CRUD + image upload)
- [ ] Order management (update status)
- [ ] User management
- [ ] Category management
- [ ] Inventory tracking

---

## Tech Stack

```
Backend:    Node.js + Express + Prisma + PostgreSQL
Frontend:   React + React Router + Zustand + Tailwind CSS
Payments:   Stripe (test mode)
Images:     Multer + Sharp (or Cloudinary)
Cache:      Redis (optional)
```

---

## Database Schema

```prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  role      Role      @default(CUSTOMER)
  addresses Address[]
  orders    Order[]
  reviews   Review[]
  wishlist  WishlistItem[]
  cart      CartItem[]
  createdAt DateTime  @default(now())
}

model Product {
  id          Int         @id @default(autoincrement())
  name        String
  slug        String      @unique
  description String
  price       Decimal     @db.Decimal(10, 2)
  comparePrice Decimal?   @db.Decimal(10, 2)
  sku         String      @unique
  stock       Int         @default(0)
  images      String[]
  featured    Boolean     @default(false)
  active      Boolean     @default(true)
  category    Category    @relation(fields: [categoryId], references: [id])
  categoryId  Int
  reviews     Review[]
  cartItems   CartItem[]
  orderItems  OrderItem[]
  wishlist    WishlistItem[]
  avgRating   Float       @default(0)
  reviewCount Int         @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([categoryId])
  @@index([active, featured])
  @@index([price])
}

model Category {
  id       Int        @id @default(autoincrement())
  name     String     @unique
  slug     String     @unique
  image    String?
  products Product[]
}

model CartItem {
  id        Int     @id @default(autoincrement())
  user      User    @relation(fields: [userId], references: [id])
  userId    Int
  product   Product @relation(fields: [productId], references: [id])
  productId Int
  quantity  Int     @default(1)

  @@unique([userId, productId])
}

model Order {
  id              Int         @id @default(autoincrement())
  orderNumber     String      @unique
  user            User        @relation(fields: [userId], references: [id])
  userId          Int
  items           OrderItem[]
  subtotal        Decimal     @db.Decimal(10, 2)
  tax             Decimal     @db.Decimal(10, 2)
  shipping        Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  status          OrderStatus @default(PENDING)
  paymentIntent   String?
  paymentStatus   PaymentStatus @default(UNPAID)
  shippingAddress Json
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([userId])
  @@index([status])
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   Int
  product   Product @relation(fields: [productId], references: [id])
  productId Int
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
  name      String  // snapshot at time of order
}

model Review {
  id        Int      @id @default(autoincrement())
  rating    Int      // 1-5
  comment   String?
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  product   Product  @relation(fields: [productId], references: [id])
  productId Int
  createdAt DateTime @default(now())

  @@unique([userId, productId])
}

model Address {
  id      Int    @id @default(autoincrement())
  user    User   @relation(fields: [userId], references: [id])
  userId  Int
  name    String
  street  String
  city    String
  state   String
  zip     String
  country String @default("US")
  isDefault Boolean @default(false)
}

model WishlistItem {
  id        Int     @id @default(autoincrement())
  user      User    @relation(fields: [userId], references: [id])
  userId    Int
  product   Product @relation(fields: [productId], references: [id])
  productId Int
  @@unique([userId, productId])
}

enum Role { CUSTOMER, ADMIN }
enum OrderStatus { PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED }
enum PaymentStatus { UNPAID, PAID, REFUNDED }
```

---

## API Endpoints

```
PRODUCTS (Public)
  GET    /api/products                        — List (search, filter, sort, paginate)
  GET    /api/products/:slug                  — Product detail
  GET    /api/products/:id/reviews            — Product reviews
  GET    /api/categories                      — List categories

CART (Auth Required)
  GET    /api/cart                            — Get user's cart
  POST   /api/cart                            — Add item { productId, quantity }
  PUT    /api/cart/:itemId                    — Update quantity
  DELETE /api/cart/:itemId                    — Remove item
  DELETE /api/cart                            — Clear cart

ORDERS (Auth Required)
  POST   /api/orders/checkout                 — Create order + Stripe payment
  GET    /api/orders                          — User's order history
  GET    /api/orders/:id                      — Order detail

REVIEWS (Auth Required)
  POST   /api/products/:id/reviews            — Add review
  PUT    /api/reviews/:id                     — Update review
  DELETE /api/reviews/:id                     — Delete review

WISHLIST (Auth Required)
  GET    /api/wishlist                        — Get wishlist
  POST   /api/wishlist                        — Add to wishlist
  DELETE /api/wishlist/:productId             — Remove from wishlist

ADMIN (Admin Only)
  GET    /api/admin/dashboard                 — Stats
  GET    /api/admin/orders                    — All orders
  PATCH  /api/admin/orders/:id/status         — Update order status
  POST   /api/admin/products                  — Create product
  PUT    /api/admin/products/:id              — Update product
  DELETE /api/admin/products/:id              — Delete product
  GET    /api/admin/users                     — List users

PAYMENTS (Webhook)
  POST   /api/webhooks/stripe                 — Stripe webhook
```

---

## Step-by-Step Build Order

### Phase 1: Products & Categories
1. Set up project + Prisma schema
2. Seed database with sample products and categories
3. Build product listing endpoint (search, filter, paginate)
4. Build product detail endpoint
5. Build category listing
6. **Frontend**: Product grid, search bar, category sidebar, product detail page

### Phase 2: Auth & Cart
7. User registration and login
8. Cart CRUD (add, update quantity, remove, clear)
9. **Frontend**: Cart page, add-to-cart buttons, cart badge in navbar

### Phase 3: Checkout & Payments
10. Stripe setup (npm install stripe)
11. Create checkout endpoint (creates PaymentIntent)
12. Stripe webhook to confirm payment
13. Order creation after payment success
14. **Frontend**: Checkout form (address + Stripe Elements), order confirmation

### Phase 4: User Features
15. Order history
16. Reviews and ratings
17. Wishlist
18. User profile / address management

### Phase 5: Admin Dashboard
19. Admin middleware (role check)
20. Dashboard stats (total revenue, orders, products, users)
21. Product management (CRUD with image upload)
22. Order management (list, update status)

---

## Stripe Integration

```javascript
// Checkout endpoint
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.checkout = async (req, res) => {
  const cart = await prisma.cartItem.findMany({
    where: { userId: req.userId },
    include: { product: true },
  });

  if (cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),  // cents
    currency: 'usd',
    metadata: { userId: String(req.userId) },
  });

  // Create order
  const order = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}`,
      userId: req.userId,
      subtotal, tax, shipping, total,
      paymentIntent: paymentIntent.id,
      shippingAddress: req.body.address,
      items: {
        create: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name,
        })),
      },
    },
  });

  // Clear cart
  await prisma.cartItem.deleteMany({ where: { userId: req.userId } });

  res.json({ clientSecret: paymentIntent.client_secret, orderId: order.id });
};
```

---

## Frontend Pages

```
/                         — Home (featured products, categories)
/products                 — Product listing (grid + filters)
/products/:slug           — Product detail
/cart                     — Shopping cart
/checkout                 — Checkout (address + payment)
/orders                   — Order history
/orders/:id               — Order detail
/wishlist                 — Wishlist
/profile                  — User settings
/admin                    — Admin dashboard
/admin/products           — Manage products
/admin/orders             — Manage orders
```

---

## Stretch Features

- [ ] Product variants (size, color)
- [ ] Discount codes / coupons
- [ ] Email order confirmation (Nodemailer)
- [ ] Product recommendations ("You might also like")
- [ ] Inventory alerts (low stock)
- [ ] Sales analytics charts
- [ ] PDF invoice generation
- [ ] Guest checkout (no account needed)
