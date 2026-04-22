# 💬 Project 4: Real-Time Chat Application

> **Level**: Intermediate+ | **Time**: 1-2 weeks
> Build a Slack/Discord-like chat with rooms, DMs, online status, and file sharing.

---

## Features

- [ ] Real-time messaging (Socket.IO)
- [ ] Chat rooms (create, join, leave)
- [ ] Direct messages (1:1)
- [ ] Online/offline status
- [ ] Typing indicators
- [ ] Message history (pagination)
- [ ] File/image sharing
- [ ] Emoji reactions
- [ ] Read receipts
- [ ] User profiles
- [ ] Responsive design

---

## Tech Stack

```
Backend:    Node.js + Express + Socket.IO + Prisma + PostgreSQL
Frontend:   React + Socket.IO-client + Zustand + Tailwind CSS
Files:      Multer + Cloudinary (or local)
Cache:      Redis (online status, typing indicators)
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
  avatar        String?
  status        String?         // custom status message
  lastSeen      DateTime        @default(now())
  messages      Message[]
  rooms         RoomMember[]
  createdAt     DateTime        @default(now())
}

model Room {
  id          Int          @id @default(autoincrement())
  name        String?
  type        RoomType     @default(GROUP)
  avatar      String?
  members     RoomMember[]
  messages    Message[]
  createdBy   Int
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([type])
}

model RoomMember {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  room      Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
  roomId    Int
  role      MemberRole @default(MEMBER)
  joinedAt  DateTime @default(now())
  lastRead  DateTime @default(now())

  @@unique([userId, roomId])
}

model Message {
  id        Int           @id @default(autoincrement())
  content   String?
  type      MessageType   @default(TEXT)
  fileUrl   String?
  fileName  String?
  sender    User          @relation(fields: [senderId], references: [id])
  senderId  Int
  room      Room          @relation(fields: [roomId], references: [id], onDelete: Cascade)
  roomId    Int
  reactions Reaction[]
  replyTo   Message?      @relation("MessageReplies", fields: [replyToId], references: [id])
  replyToId Int?
  replies   Message[]     @relation("MessageReplies")
  edited    Boolean       @default(false)
  deleted   Boolean       @default(false)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  @@index([roomId, createdAt])
}

model Reaction {
  id        Int     @id @default(autoincrement())
  emoji     String
  userId    Int
  message   Message @relation(fields: [messageId], references: [id], onDelete: Cascade)
  messageId Int

  @@unique([userId, messageId, emoji])
}

enum RoomType { DIRECT, GROUP }
enum MemberRole { MEMBER, ADMIN, OWNER }
enum MessageType { TEXT, IMAGE, FILE, SYSTEM }
```

---

## Architecture

```
Client (React)
  ├── HTTP: Auth, user profiles, room CRUD, message history
  └── WebSocket: Real-time messages, typing, online status

Server (Express + Socket.IO)
  ├── REST API: /api/auth, /api/rooms, /api/messages, /api/users
  ├── WebSocket Events:
  │   ├── connection / disconnect
  │   ├── message:send / message:received
  │   ├── typing:start / typing:stop
  │   ├── room:join / room:leave
  │   ├── user:online / user:offline
  │   └── message:reaction
  └── Redis: online users set, typing state
```

---

## Socket Events

```javascript
// ===== SERVER SOCKET EVENTS =====
io.on('connection', (socket) => {
  const userId = socket.user.id;

  // Join all user's rooms
  joinUserRooms(socket, userId);

  // Broadcast online status
  io.emit('user:online', { userId });
  redis.sadd('online_users', userId);

  // ===== Messaging =====
  socket.on('message:send', async ({ roomId, content, type, replyToId }) => {
    const message = await prisma.message.create({
      data: { content, type, senderId: userId, roomId, replyToId },
      include: { sender: { select: { id: true, username: true, avatar: true } } },
    });

    io.to(`room:${roomId}`).emit('message:received', message);
  });

  // ===== Typing =====
  socket.on('typing:start', ({ roomId }) => {
    socket.to(`room:${roomId}`).emit('typing:start', {
      userId, roomId, username: socket.user.username,
    });
  });

  socket.on('typing:stop', ({ roomId }) => {
    socket.to(`room:${roomId}`).emit('typing:stop', { userId, roomId });
  });

  // ===== Read Receipt =====
  socket.on('message:read', async ({ roomId }) => {
    await prisma.roomMember.update({
      where: { userId_roomId: { userId, roomId } },
      data: { lastRead: new Date() },
    });
    socket.to(`room:${roomId}`).emit('message:read', { userId, roomId });
  });

  // ===== Reactions =====
  socket.on('message:reaction', async ({ messageId, emoji }) => {
    const existing = await prisma.reaction.findUnique({
      where: { userId_messageId_emoji: { userId, messageId, emoji } },
    });

    if (existing) {
      await prisma.reaction.delete({ where: { id: existing.id } });
    } else {
      await prisma.reaction.create({ data: { emoji, userId, messageId } });
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { reactions: true },
    });

    io.to(`room:${message.roomId}`).emit('message:updated', message);
  });

  // ===== Disconnect =====
  socket.on('disconnect', async () => {
    redis.srem('online_users', userId);
    await prisma.user.update({ where: { id: userId }, data: { lastSeen: new Date() } });
    io.emit('user:offline', { userId });
  });
});
```

---

## Step-by-Step Build Order

### Phase 1: Foundation
1. Project setup (Express + Prisma + Socket.IO)
2. Auth system (register, login, JWT)
3. Socket.IO auth middleware (verify JWT on connection)
4. Basic room CRUD via REST API

### Phase 2: Core Chat
5. Message sending via Socket.IO
6. Message history endpoint (paginated, cursor-based)
7. Join/leave rooms
8. **Frontend**: Room list sidebar, message area, input box

### Phase 3: Real-Time Features
9. Online/offline status (Redis set)
10. Typing indicators
11. Read receipts
12. **Frontend**: Online dots, "user is typing...", unread badges

### Phase 4: Rich Features
13. Direct messages (auto-create DM room)
14. File/image upload in messages
15. Emoji reactions
16. Reply to messages
17. Edit/delete messages

### Phase 5: Polish
18. Message search
19. User profiles
20. Notification sounds
21. Responsive design (mobile sidebar drawer)
22. Unread message count per room

---

## Frontend Components

```
App
├── Sidebar
│   ├── UserInfo (avatar, status, online dot)
│   ├── RoomList
│   │   ├── RoomItem (name, last message, unread badge)
│   │   └── CreateRoomButton
│   └── DirectMessageList
├── ChatArea
│   ├── ChatHeader (room name, members, online count)
│   ├── MessageList
│   │   ├── MessageBubble
│   │   │   ├── Avatar
│   │   │   ├── Content (text / image / file)
│   │   │   ├── Reactions
│   │   │   └── ReplyPreview
│   │   ├── DateDivider
│   │   └── TypingIndicator
│   └── MessageInput
│       ├── TextArea
│       ├── FileUploadButton
│       ├── EmojiPicker
│       └── SendButton
└── Modals
    ├── CreateRoomModal
    ├── RoomSettingsModal
    └── UserProfileModal
```

---

## Stretch Features

- [ ] Voice messages (MediaRecorder API)
- [ ] Message pinning
- [ ] Thread replies
- [ ] @mentions with autocomplete
- [ ] Room invite links
- [ ] Message formatting (bold, italic, code blocks)
- [ ] Push notifications (service workers)
- [ ] Video/voice calls (WebRTC)
- [ ] Bot framework (auto-responders)
