# ============================================
# DOCKER FOR FULL-STACK APPLICATIONS
# ============================================

## What is Docker?
Docker packages your app + dependencies into a **container** — runs the same everywhere (dev, staging, production).

---

## 1. Dockerfile (Node.js App)

```dockerfile
# ===== Multi-stage build =====

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build  # if you have a build step

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only production files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Don't run as root
USER appuser

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## 2. .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.*
Dockerfile
docker-compose*.yml
.dockerignore
coverage
tests
*.md
.vscode
```

## 3. Docker Commands

```bash
# Build image
docker build -t my-app:latest .

# Run container
docker run -d -p 3000:3000 --name my-app my-app:latest

# Run with environment variables
docker run -d -p 3000:3000 \
  -e DATABASE_URL=postgres://... \
  -e JWT_SECRET=mysecret \
  my-app:latest

# View logs
docker logs -f my-app

# Stop & remove
docker stop my-app
docker rm my-app

# List containers
docker ps          # running
docker ps -a       # all

# List images
docker images

# Remove image
docker rmi my-app:latest

# Interactive shell
docker exec -it my-app sh
```

## 4. Docker Compose (Multi-Container)

```yaml
# docker-compose.yml
version: '3.8'

services:
  # ===== Application =====
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  # ===== PostgreSQL =====
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  # ===== Redis (Caching) =====
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # ===== MongoDB (Optional) =====
  mongo:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  # ===== Nginx (Reverse Proxy) =====
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
  mongo_data:
```

## 5. Docker Compose Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f app

# Stop all
docker compose down

# Rebuild after code changes
docker compose up -d --build

# Run one-off command
docker compose exec app npx prisma migrate deploy

# Scale service
docker compose up -d --scale app=3
```

## 6. Development Docker Compose

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app              # mount source code
      - /app/node_modules   # exclude node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev     # hot reload

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: myapp_dev
    ports:
      - "5432:5432"
```

```bash
# Run dev environment
docker compose -f docker-compose.dev.yml up
```

## 7. Nginx Reverse Proxy Config

```nginx
# nginx.conf
events { worker_connections 1024; }

http {
  upstream app {
    server app:3000;
  }

  server {
    listen 80;
    server_name myapp.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
  }

  server {
    listen 443 ssl;
    server_name myapp.com;

    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    # API routes
    location /api {
      proxy_pass http://app;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }

    # Static frontend
    location / {
      root /usr/share/nginx/html;
      try_files $uri /index.html;
    }
  }
}
```

## 8. Best Practices

- Use **multi-stage builds** to reduce image size
- Use **alpine** base images (smaller)
- **Don't run as root** — create non-root user
- Use **.dockerignore** — exclude node_modules, .git
- **Pin versions** — `node:20-alpine`, not `node:latest`
- Use **health checks** for service readiness
- **Volumes** for persistent data (databases)
- **Environment variables** for configuration (never hardcode secrets)
