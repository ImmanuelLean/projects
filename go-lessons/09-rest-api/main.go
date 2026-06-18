// ============================================================================
// MODULE 09 — BUILDING A REST API (DevOps Essential!)
// ============================================================================
//
// 🎯 WHAT YOU'LL LEARN:
//   - HTTP server with Go's standard library (no frameworks needed!)
//   - Routing and handlers
//   - JSON encoding/decoding
//   - Middleware pattern
//   - Graceful shutdown
//   - Request/response handling
//
// 🚀 RUN:   go run main.go
// 🧪 TEST:  curl http://localhost:8080/api/health
//           curl http://localhost:8080/api/servers
//           curl -X POST http://localhost:8080/api/servers -d '{"name":"web-05","ip":"10.0.1.5","port":8080}'
//
// 🔧 DEVOPS RELEVANCE:
//   - Health check endpoints (used by load balancers, K8s probes)
//   - Status APIs (dashboards, monitoring)
//   - Internal tools (deployment triggers, config management)
//   - Go's net/http is production-grade (used by Docker's API!)
// ============================================================================

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"syscall"
	"time"
)

// ═══════════════════════════════════════════════════════════════════════════
// DATA MODELS
// ═══════════════════════════════════════════════════════════════════════════

// Server represents a managed server in our infrastructure
type Server struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	IP        string    `json:"ip"`
	Port      int       `json:"port"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}

// HealthResponse is returned by the health check endpoint
type HealthResponse struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Uptime    string    `json:"uptime"`
	Version   string    `json:"version"`
}

// ErrorResponse standardizes error responses
type ErrorResponse struct {
	Error   string `json:"error"`
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// ═══════════════════════════════════════════════════════════════════════════
// IN-MEMORY DATA STORE
// ═══════════════════════════════════════════════════════════════════════════

// ServerStore is a thread-safe in-memory store
// In production, you'd use a database!
type ServerStore struct {
	mu      sync.RWMutex
	servers map[string]Server
	nextID  int
}

func NewServerStore() *ServerStore {
	store := &ServerStore{
		servers: make(map[string]Server),
		nextID:  1,
	}
	// Seed with some initial data
	store.Add(Server{Name: "web-01", IP: "10.0.1.1", Port: 80, Status: "running"})
	store.Add(Server{Name: "web-02", IP: "10.0.1.2", Port: 80, Status: "running"})
	store.Add(Server{Name: "db-01", IP: "10.0.2.1", Port: 5432, Status: "running"})
	store.Add(Server{Name: "cache-01", IP: "10.0.3.1", Port: 6379, Status: "stopped"})
	return store
}

func (s *ServerStore) GetAll() []Server {
	s.mu.RLock() // Read lock — multiple goroutines can read at once
	defer s.mu.RUnlock()

	servers := make([]Server, 0, len(s.servers))
	for _, srv := range s.servers {
		servers = append(servers, srv)
	}
	return servers
}

func (s *ServerStore) Get(id string) (Server, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	srv, ok := s.servers[id]
	return srv, ok
}

func (s *ServerStore) Add(srv Server) Server {
	s.mu.Lock() // Write lock — exclusive access
	defer s.mu.Unlock()

	srv.ID = fmt.Sprintf("srv-%03d", s.nextID)
	srv.CreatedAt = time.Now()
	if srv.Status == "" {
		srv.Status = "running"
	}
	s.servers[srv.ID] = srv
	s.nextID++
	return srv
}

func (s *ServerStore) Delete(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.servers[id]; !exists {
		return false
	}
	delete(s.servers, id)
	return true
}

// ═══════════════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════
// Middleware wraps handlers to add cross-cutting concerns:
// logging, authentication, CORS, rate limiting, etc.

// loggingMiddleware logs every HTTP request
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Call the next handler
		next.ServeHTTP(w, r)

		// Log after the request completes
		log.Printf("%-6s %-30s %v", r.Method, r.URL.Path, time.Since(start))
	})
}

// corsMiddleware adds CORS headers (needed for browser access)
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight OPTIONS request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ═══════════════════════════════════════════════════════════════════════════
// HTTP HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

// writeJSON is a helper to send JSON responses
func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// writeError is a helper to send error responses
func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, ErrorResponse{
		Error:   http.StatusText(status),
		Code:    status,
		Message: message,
	})
}

// ─── Health Check Handler ────────────────────────────────────────────────

var startTime = time.Now()

func handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "Only GET allowed")
		return
	}

	writeJSON(w, http.StatusOK, HealthResponse{
		Status:    "healthy",
		Timestamp: time.Now(),
		Uptime:    time.Since(startTime).Round(time.Second).String(),
		Version:   "1.0.0",
	})
}

// ─── Server Handlers ────────────────────────────────────────────────────

func handleServers(store *ServerStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {

		case http.MethodGet:
			// GET /api/servers — list all servers
			servers := store.GetAll()
			writeJSON(w, http.StatusOK, map[string]any{
				"servers": servers,
				"count":   len(servers),
			})

		case http.MethodPost:
			// POST /api/servers — create a new server
			var newServer Server
			if err := json.NewDecoder(r.Body).Decode(&newServer); err != nil {
				writeError(w, http.StatusBadRequest, "Invalid JSON: "+err.Error())
				return
			}

			// Validate
			if newServer.Name == "" {
				writeError(w, http.StatusBadRequest, "Server name is required")
				return
			}
			if newServer.Port <= 0 || newServer.Port > 65535 {
				writeError(w, http.StatusBadRequest, "Port must be between 1 and 65535")
				return
			}

			created := store.Add(newServer)
			writeJSON(w, http.StatusCreated, created)

		default:
			writeError(w, http.StatusMethodNotAllowed, "Only GET and POST allowed")
		}
	}
}

func handleServerByID(store *ServerStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extract ID from URL: /api/servers/srv-001
		parts := strings.Split(r.URL.Path, "/")
		if len(parts) < 4 {
			writeError(w, http.StatusBadRequest, "Missing server ID")
			return
		}
		id := parts[3]

		switch r.Method {
		case http.MethodGet:
			server, found := store.Get(id)
			if !found {
				writeError(w, http.StatusNotFound, "Server not found: "+id)
				return
			}
			writeJSON(w, http.StatusOK, server)

		case http.MethodDelete:
			if !store.Delete(id) {
				writeError(w, http.StatusNotFound, "Server not found: "+id)
				return
			}
			writeJSON(w, http.StatusOK, map[string]string{
				"message": "Server deleted",
				"id":      id,
			})

		default:
			writeError(w, http.StatusMethodNotAllowed, "Only GET and DELETE allowed")
		}
	}
}

// ─── Root Handler ────────────────────────────────────────────────────────

func handleRoot(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		writeError(w, http.StatusNotFound, "Not found")
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"name":    "Go DevOps API",
		"version": "1.0.0",
		"endpoints": []string{
			"GET  /api/health     — Health check",
			"GET  /api/servers    — List all servers",
			"POST /api/servers    — Create a server",
			"GET  /api/servers/:id — Get a server",
			"DELETE /api/servers/:id — Delete a server",
		},
	})
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN — SETTING UP THE SERVER
// ═══════════════════════════════════════════════════════════════════════════

func main() {
	fmt.Println("========================================")
	fmt.Println("  MODULE 09: REST API Server")
	fmt.Println("========================================")
	fmt.Println()

	// Initialize our data store
	store := NewServerStore()

	// Create a new ServeMux (request router)
	mux := http.NewServeMux()

	// ─── Register Routes ─────────────────────────────────────────────
	mux.HandleFunc("/", handleRoot)
	mux.HandleFunc("/api/health", handleHealth)
	mux.HandleFunc("/api/servers", handleServers(store))
	mux.HandleFunc("/api/servers/", handleServerByID(store))

	// ─── Apply Middleware ────────────────────────────────────────────
	// Middleware wraps from outside in:
	// Request → CORS → Logging → Handler → Logging → CORS → Response
	handler := corsMiddleware(loggingMiddleware(mux))

	// ─── Configure the Server ────────────────────────────────────────
	server := &http.Server{
		Addr:         ":8080",
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// ─── Graceful Shutdown ───────────────────────────────────────────
	// This is a CRITICAL DevOps pattern:
	// When the server receives SIGINT (Ctrl+C) or SIGTERM (from K8s),
	// it should:
	//   1. Stop accepting new connections
	//   2. Wait for existing requests to finish
	//   3. Then shut down cleanly

	// Channel to listen for OS signals
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// Start server in a goroutine
	go func() {
		fmt.Println("🚀 Server starting on http://localhost:8080")
		fmt.Println()
		fmt.Println("Try these commands in another terminal:")
		fmt.Println("  curl http://localhost:8080/")
		fmt.Println("  curl http://localhost:8080/api/health")
		fmt.Println("  curl http://localhost:8080/api/servers")
		fmt.Println("  curl http://localhost:8080/api/servers/srv-001")
		fmt.Println("  curl -X POST http://localhost:8080/api/servers -H \"Content-Type: application/json\" -d \"{\\\"name\\\":\\\"web-05\\\",\\\"ip\\\":\\\"10.0.5.1\\\",\\\"port\\\":9090}\"")
		fmt.Println("  curl -X DELETE http://localhost:8080/api/servers/srv-004")
		fmt.Println()
		fmt.Println("Press Ctrl+C to stop the server.")
		fmt.Println()

		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %s\n", err)
		}
	}()

	// Block until we receive a signal
	sig := <-quit
	fmt.Printf("\n📛 Received signal: %s\n", sig)
	fmt.Println("🔄 Gracefully shutting down server...")

	// Create a deadline context for shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Attempt graceful shutdown
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %s\n", err)
	}

	fmt.Println("✅ Server stopped cleanly.")
}
