# ✅ Project 2: Task Manager API

> **Level**: Beginner+ | **Time**: 1 week
> Build a production-quality REST API with full testing and documentation.

---

## Features

- [ ] CRUD for projects and tasks
- [ ] User authentication (JWT)
- [ ] Task assignment to users
- [ ] Priority levels (low, medium, high, urgent)
- [ ] Status workflow (todo → in_progress → review → done)
- [ ] Due dates and reminders
- [ ] Labels/tags
- [ ] Search, filter, sort, pagination
- [ ] Input validation (Zod)
- [ ] Full test coverage (Jest + Supertest)
- [ ] API documentation
- [ ] Rate limiting

---

## Tech Stack

```
Backend:    Node.js + Express + Prisma + PostgreSQL
Validation: Zod
Testing:    Jest + Supertest
Docs:       Swagger / OpenAPI
```

---

## Database Schema

```prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  role      Role      @default(MEMBER)
  projects  ProjectMember[]
  tasks     Task[]    @relation("AssignedTasks")
  created   Task[]    @relation("CreatedTasks")
  comments  TaskComment[]
  createdAt DateTime  @default(now())
}

model Project {
  id          Int             @id @default(autoincrement())
  name        String
  description String?
  owner       User            @relation("ProjectOwner", fields: [ownerId], references: [id])
  ownerId     Int
  members     ProjectMember[]
  tasks       Task[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

model ProjectMember {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  project   Project  @relation(fields: [projectId], references: [id])
  projectId Int
  role      ProjectRole @default(MEMBER)

  @@unique([userId, projectId])
}

model Task {
  id          Int         @id @default(autoincrement())
  title       String
  description String?
  status      TaskStatus  @default(TODO)
  priority    Priority    @default(MEDIUM)
  dueDate     DateTime?
  position    Int         @default(0)
  project     Project     @relation(fields: [projectId], references: [id])
  projectId   Int
  assignee    User?       @relation("AssignedTasks", fields: [assigneeId], references: [id])
  assigneeId  Int?
  creator     User        @relation("CreatedTasks", fields: [creatorId], references: [id])
  creatorId   Int
  labels      Label[]
  comments    TaskComment[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([projectId, status])
  @@index([assigneeId])
}

model Label {
  id    Int    @id @default(autoincrement())
  name  String
  color String @default("#6366f1")
  tasks Task[]

  @@unique([name])
}

model TaskComment {
  id        Int      @id @default(autoincrement())
  content   String
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  taskId    Int
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
}

enum Role { MEMBER, ADMIN }
enum ProjectRole { MEMBER, ADMIN, VIEWER }
enum TaskStatus { TODO, IN_PROGRESS, REVIEW, DONE }
enum Priority { LOW, MEDIUM, HIGH, URGENT }
```

---

## API Endpoints

```
AUTH
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me

PROJECTS
  GET    /api/projects                    — List user's projects
  POST   /api/projects                    — Create project
  GET    /api/projects/:id                — Get project with stats
  PUT    /api/projects/:id                — Update project
  DELETE /api/projects/:id                — Delete project (owner only)
  POST   /api/projects/:id/members        — Add member
  DELETE /api/projects/:id/members/:userId — Remove member

TASKS
  GET    /api/projects/:id/tasks          — List tasks (filter, sort, paginate)
  POST   /api/projects/:id/tasks          — Create task
  GET    /api/tasks/:id                   — Get task detail
  PUT    /api/tasks/:id                   — Update task
  PATCH  /api/tasks/:id/status            — Update status only
  PATCH  /api/tasks/:id/assign            — Assign user
  DELETE /api/tasks/:id                   — Delete task
  POST   /api/tasks/:id/comments          — Add comment
  GET    /api/tasks/:id/comments          — List comments

LABELS
  GET    /api/labels                      — List labels
  POST   /api/labels                      — Create label

DASHBOARD
  GET    /api/dashboard                   — User's task stats
```

---

## Step-by-Step Build Order

### Phase 1: Foundation
1. Initialize project, install dependencies
2. Set up Prisma schema and migrate
3. Create app.js with middleware
4. Build auth (register, login, JWT middleware)
5. Test auth endpoints

### Phase 2: Core CRUD
6. Build project CRUD controller
7. Build task CRUD controller
8. Add member management
9. Add task assignment
10. Add status workflow validation (e.g., can't skip from TODO to DONE)

### Phase 3: Advanced Features
11. Add search, filter, sort, pagination
12. Add labels system
13. Add task comments
14. Add dashboard stats endpoint

### Phase 4: Polish
15. Input validation with Zod on all routes
16. Centralized error handling
17. Rate limiting
18. Write tests for all endpoints (aim for 80%+ coverage)
19. Add Swagger/OpenAPI documentation

---

## Validation Example (Zod)

```javascript
const { z } = require('zod');

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.number().int().positive().optional(),
  labels: z.array(z.string()).max(10).optional(),
});

const taskFilterSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assigneeId: z.coerce.number().optional(),
  search: z.string().max(100).optional(),
  sort: z.enum(['createdAt', 'dueDate', 'priority', 'title']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});
```

---

## Test Examples

```javascript
describe('Tasks API', () => {
  let token, projectId;

  beforeAll(async () => {
    // register + login + create project
  });

  it('creates a task', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Fix login bug', priority: 'HIGH' })
      .expect(201);

    expect(res.body).toMatchObject({
      title: 'Fix login bug',
      priority: 'HIGH',
      status: 'TODO',
    });
  });

  it('filters tasks by status', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/tasks?status=TODO`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    res.body.tasks.forEach(task => {
      expect(task.status).toBe('TODO');
    });
  });

  it('prevents non-members from accessing', async () => {
    await request(app)
      .get(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .expect(403);
  });
});
```

---

## Stretch Features

- [ ] Task drag-and-drop ordering (position field)
- [ ] File attachments on tasks
- [ ] Activity log (who changed what)
- [ ] Email notifications for assignments
- [ ] Kanban board frontend
- [ ] Export tasks to CSV
- [ ] Recurring tasks
- [ ] Time tracking
