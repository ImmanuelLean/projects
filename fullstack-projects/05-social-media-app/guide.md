# 📱 Project 5: Social Media Application

> **Level**: Advanced | **Time**: 3-4 weeks
> Build a full social platform with feeds, followers, notifications, and media sharing.

---

## Features

### Core
- [ ] User profiles (bio, avatar, cover photo)
- [ ] Create posts (text, images, multiple images)
- [ ] News feed (algorithmic: following + suggested)
- [ ] Like, comment, share posts
- [ ] Follow/unfollow users
- [ ] User search & discovery

### Social
- [ ] Nested comments (replies)
- [ ] Hashtags (clickable, trending)
- [ ] @mentions in posts/comments
- [ ] Bookmarks/saved posts
- [ ] Share/repost

### Notifications
- [ ] Real-time notifications (Socket.IO)
- [ ] Types: like, comment, follow, mention
- [ ] Mark as read/unread

### Advanced
- [ ] Infinite scroll feed
- [ ] Image optimization (Sharp)
- [ ] Redis caching (feeds, counts)
- [ ] Full-text search
- [ ] Content moderation tools
- [ ] Analytics (post reach, engagement)

---

## Tech Stack

```
Backend:    Node.js + Express + Prisma + PostgreSQL
Frontend:   React + React Router + TanStack Query + Zustand + Tailwind CSS
Real-Time:  Socket.IO
Cache:      Redis
Search:     PostgreSQL full-text search
Images:     Multer + Sharp (or Cloudinary)
```

---

## Database Schema

```prisma
model User {
  id            Int             @id @default(autoincrement())
  username      String          @unique
  email         String          @unique
  password      String
  displayName   String
  bio           String?
  avatar        String?
  coverPhoto    String?
  website       String?
  location      String?
  isVerified    Boolean         @default(false)
  isPrivate     Boolean         @default(false)
  posts         Post[]
  comments      Comment[]
  likes         Like[]
  bookmarks     Bookmark[]
  followers     Follow[]        @relation("Following")
  following     Follow[]        @relation("Followers")
  notifications Notification[]  @relation("NotifRecipient")
  sentNotifs    Notification[]  @relation("NotifActor")
  createdAt     DateTime        @default(now())

  @@index([username])
}

model Post {
  id          Int         @id @default(autoincrement())
  content     String
  images      String[]
  author      User        @relation(fields: [authorId], references: [id])
  authorId    Int
  likes       Like[]
  comments    Comment[]
  bookmarks   Bookmark[]
  hashtags    Hashtag[]
  mentions    Mention[]
  repost      Post?       @relation("Reposts", fields: [repostId], references: [id])
  repostId    Int?
  reposts     Post[]      @relation("Reposts")
  likeCount   Int         @default(0)
  commentCount Int        @default(0)
  repostCount Int         @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([authorId, createdAt])
  @@index([createdAt])
}

model Comment {
  id        Int       @id @default(autoincrement())
  content   String
  author    User      @relation(fields: [authorId], references: [id])
  authorId  Int
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    Int
  parent    Comment?  @relation("CommentThread", fields: [parentId], references: [id])
  parentId  Int?
  replies   Comment[] @relation("CommentThread")
  likes     Like[]
  createdAt DateTime  @default(now())

  @@index([postId, createdAt])
}

model Like {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  post      Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    Int?
  comment   Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)
  commentId Int?
  createdAt DateTime @default(now())

  @@unique([userId, postId])
  @@unique([userId, commentId])
}

model Follow {
  id          Int      @id @default(autoincrement())
  follower    User     @relation("Followers", fields: [followerId], references: [id])
  followerId  Int
  following   User     @relation("Following", fields: [followingId], references: [id])
  followingId Int
  createdAt   DateTime @default(now())

  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}

model Bookmark {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    Int
  createdAt DateTime @default(now())

  @@unique([userId, postId])
}

model Hashtag {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  posts     Post[]
  postCount Int      @default(0)
}

model Mention {
  id         Int    @id @default(autoincrement())
  username   String
  post       Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId     Int
  userId     Int
}

model Notification {
  id          Int              @id @default(autoincrement())
  type        NotificationType
  read        Boolean          @default(false)
  recipient   User             @relation("NotifRecipient", fields: [recipientId], references: [id])
  recipientId Int
  actor       User             @relation("NotifActor", fields: [actorId], references: [id])
  actorId     Int
  postId      Int?
  commentId   Int?
  createdAt   DateTime         @default(now())

  @@index([recipientId, read, createdAt])
}

enum NotificationType { LIKE, COMMENT, FOLLOW, MENTION, REPOST }
```

---

## API Endpoints

```
AUTH
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me

USERS
  GET    /api/users/:username              — User profile
  PUT    /api/users/profile                — Update profile
  GET    /api/users/:username/posts        — User's posts
  GET    /api/users/:username/followers    — Followers list
  GET    /api/users/:username/following    — Following list
  GET    /api/users/search?q=             — Search users
  GET    /api/users/suggestions            — Suggested users to follow

FOLLOW
  POST   /api/users/:id/follow             — Follow user
  DELETE /api/users/:id/follow             — Unfollow user

POSTS
  GET    /api/feed                         — News feed (following + suggested)
  GET    /api/explore                      — Explore/discover posts
  POST   /api/posts                        — Create post (with images)
  GET    /api/posts/:id                    — Post detail
  PUT    /api/posts/:id                    — Edit post
  DELETE /api/posts/:id                    — Delete post
  POST   /api/posts/:id/repost            — Repost

LIKES
  POST   /api/posts/:id/like               — Like post
  DELETE /api/posts/:id/like               — Unlike post

COMMENTS
  GET    /api/posts/:id/comments           — List comments
  POST   /api/posts/:id/comments           — Add comment
  DELETE /api/comments/:id                 — Delete comment
  POST   /api/comments/:id/like            — Like comment

BOOKMARKS
  GET    /api/bookmarks                    — User's bookmarks
  POST   /api/posts/:id/bookmark           — Bookmark post
  DELETE /api/posts/:id/bookmark           — Remove bookmark

HASHTAGS
  GET    /api/hashtags/trending            — Trending hashtags
  GET    /api/hashtags/:name               — Posts with hashtag

NOTIFICATIONS
  GET    /api/notifications                — User's notifications
  PUT    /api/notifications/read-all       — Mark all as read
  PUT    /api/notifications/:id/read       — Mark one as read
  GET    /api/notifications/unread-count   — Unread count

SEARCH
  GET    /api/search?q=&type=             — Search posts, users, hashtags
```

---

## Step-by-Step Build Order

### Phase 1: Core (Week 1)
1. Project setup + Prisma schema + migrations
2. Auth (register, login, JWT)
3. User profiles (view, edit, avatar upload)
4. Post CRUD (create with images, edit, delete)
5. **Frontend**: Auth pages, profile page, create post form

### Phase 2: Social (Week 1-2)
6. Follow/unfollow system
7. News feed algorithm:
   ```javascript
   // Feed: posts from people you follow, sorted by time
   async function getFeed(userId, cursor, limit = 20) {
     const following = await prisma.follow.findMany({
       where: { followerId: userId },
       select: { followingId: true },
     });
     const followingIds = following.map(f => f.followingId);
     followingIds.push(userId); // include own posts

     return prisma.post.findMany({
       where: { authorId: { in: followingIds } },
       take: limit,
       ...(cursor && { skip: 1, cursor: { id: cursor } }),
       orderBy: { createdAt: 'desc' },
       include: {
         author: { select: { id: true, username: true, displayName: true, avatar: true } },
         _count: { select: { likes: true, comments: true, reposts: true } },
         likes: { where: { userId }, select: { id: true } },
         bookmarks: { where: { userId }, select: { id: true } },
       },
     });
   }
   ```
8. Like/unlike posts
9. **Frontend**: Feed (infinite scroll), post cards, like button

### Phase 3: Engagement (Week 2)
10. Comments (nested replies)
11. Bookmarks
12. Hashtag extraction + trending
13. @mentions
14. Repost/share
15. **Frontend**: Comment section, bookmark button, hashtag pages

### Phase 4: Discovery (Week 2-3)
16. Explore page (popular posts)
17. User search
18. Suggested users ("Who to follow")
19. Full-text search (posts + users)
20. **Frontend**: Explore page, search, suggestions sidebar

### Phase 5: Notifications (Week 3)
21. Notification model + creation on events
22. Socket.IO for real-time notifications
23. Unread count in navbar
24. Notification page
25. **Frontend**: Notification bell, notification list

### Phase 6: Polish (Week 3-4)
26. Redis caching (feed, counts, trending)
27. Image optimization (Sharp: resize, compress, WebP)
28. Rate limiting
29. Input validation (Zod)
30. Responsive design
31. Deploy (Docker + CI/CD)

---

## Frontend Pages & Components

```
/                    — Feed (infinite scroll)
/explore             — Explore/discover
/search              — Search results
/:username           — User profile + posts
/:username/followers — Followers list
/:username/following — Following list
/post/:id            — Post detail + comments
/bookmarks           — Saved posts
/notifications       — Notifications
/settings            — Account settings
/hashtag/:name       — Posts with hashtag
```

```
Components:
├── Layout (Navbar + Sidebar + Content)
├── PostCard (content, images, actions, stats)
├── PostComposer (text + image upload)
├── CommentSection (threaded comments)
├── UserCard (avatar, name, follow button)
├── InfiniteScroll (intersection observer)
├── NotificationItem
├── TrendingHashtags
├── WhoToFollow (suggestions)
└── ImageGrid (1-4 images layout)
```

---

## Performance Considerations

```javascript
// Redis caching for feed
const FEED_TTL = 300; // 5 min

async function getCachedFeed(userId, page) {
  const key = `feed:${userId}:${page}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const feed = await getFeedFromDB(userId, page);
  await redis.setEx(key, FEED_TTL, JSON.stringify(feed));
  return feed;
}

// Invalidate on new post from followed user
async function invalidateFollowerFeeds(authorId) {
  const followers = await prisma.follow.findMany({
    where: { followingId: authorId },
    select: { followerId: true },
  });
  const keys = followers.map(f => `feed:${f.followerId}:*`);
  // Delete matching keys
}

// Denormalized counts (update on like/comment/repost)
// Avoids COUNT(*) queries on every post render
```

---

## Stretch Features

- [ ] Stories (24h expiring posts)
- [ ] Polls in posts
- [ ] Private messages (integrate chat from Project 4)
- [ ] Content reporting & moderation
- [ ] Account verification badges
- [ ] Analytics dashboard (impressions, engagement rate)
- [ ] Scheduled posts
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA)
- [ ] Mobile app (React Native)
