// ============================================================================
// MODULE 05 — DATA STRUCTURES
// ============================================================================
//
// 🎯 WHAT YOU'LL LEARN:
//   - Arrays (fixed size) vs Slices (dynamic — used 99% of the time!)
//   - Maps (key-value storage, like Python dicts)
//   - Structs (custom data types — Go's "classes")
//   - Pointers (simplified — don't worry, Go makes them easy!)
//
// 🚀 RUN: go run main.go
//
// 🔧 DEVOPS RELEVANCE:
//   Slices = lists of servers, pods, containers
//   Maps = config data, labels, environment variables
//   Structs = modeling infrastructure, API responses, configs
//   Pointers = efficient data passing, modifying data in functions
// ============================================================================

package main

import (
	"fmt"
	"sort"
	"strings"
)

func main() {
	fmt.Println("========================================")
	fmt.Println("  MODULE 05: Data Structures")
	fmt.Println("========================================")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 1: ARRAYS (Fixed Size)
	// ─────────────────────────────────────────────────────────────────────
	// Arrays have a FIXED size that cannot change.
	// In practice, you'll rarely use arrays directly — use slices instead.
	// But understanding arrays helps you understand slices.

	fmt.Println("--- Arrays (Fixed Size) ---")

	// Declare an array of 5 integers
	var ports [5]int
	ports[0] = 80
	ports[1] = 443
	ports[2] = 8080
	ports[3] = 3000
	ports[4] = 5432
	fmt.Printf("Ports: %v\n", ports)
	fmt.Printf("Length: %d\n", len(ports))

	// Array literal (shorthand)
	regions := [3]string{"us-east-1", "eu-west-1", "ap-south-1"}
	fmt.Printf("Regions: %v\n", regions)

	// Let Go count the size with [...]
	protocols := [...]string{"HTTP", "HTTPS", "gRPC", "WebSocket"}
	fmt.Printf("Protocols: %v (size: %d)\n", protocols, len(protocols))
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 2: SLICES (Dynamic — Use These!)
	// ─────────────────────────────────────────────────────────────────────
	// Slices are like arrays but DYNAMIC — they can grow and shrink.
	// This is what you'll use 99% of the time in Go.
	//
	// Under the hood, a slice is a "window" into an array:
	//   - Pointer: points to the underlying array
	//   - Length: how many elements the slice currently has
	//   - Capacity: how many elements the underlying array can hold

	fmt.Println("--- Slices (Dynamic) ---")

	// Create a slice (notice: no size in brackets!)
	servers := []string{"web-01", "web-02", "web-03"}
	fmt.Printf("Servers: %v\n", servers)
	fmt.Printf("Length: %d, Capacity: %d\n", len(servers), cap(servers))

	// APPEND — add elements to a slice
	servers = append(servers, "web-04")
	servers = append(servers, "web-05", "web-06") // Add multiple at once!
	fmt.Printf("After append: %v\n", servers)
	fmt.Printf("New length: %d\n", len(servers))

	// SLICING — get a portion of a slice [start:end]
	// start is inclusive, end is exclusive (like Python!)
	firstTwo := servers[0:2]   // Elements 0 and 1
	lastThree := servers[3:]   // Elements 3 to end
	middle := servers[1:4]     // Elements 1, 2, 3
	fmt.Printf("First two:  %v\n", firstTwo)
	fmt.Printf("Last three: %v\n", lastThree)
	fmt.Printf("Middle:     %v\n", middle)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 3: make() — CREATE SLICES WITH INITIAL SIZE
	// ─────────────────────────────────────────────────────────────────────
	// make(type, length, capacity) pre-allocates memory.
	// Useful when you know how big your slice will be.
	// DevOps example: collecting metrics from 100 servers

	fmt.Println("--- make() for slices ---")

	// Create a slice with length 3 and capacity 10
	metrics := make([]float64, 3, 10)
	metrics[0] = 45.2
	metrics[1] = 67.8
	metrics[2] = 23.1
	fmt.Printf("Metrics: %v (len=%d, cap=%d)\n", metrics, len(metrics), cap(metrics))

	metrics = append(metrics, 89.5, 12.3) // Still within capacity, no reallocation!
	fmt.Printf("After append: %v (len=%d, cap=%d)\n", metrics, len(metrics), cap(metrics))
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 4: SLICE OPERATIONS
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Slice Operations ---")

	// Copy a slice
	original := []int{1, 2, 3, 4, 5}
	copySlice := make([]int, len(original))
	copy(copySlice, original) // Deep copy!
	copySlice[0] = 999
	fmt.Printf("Original:  %v (unchanged!)\n", original)
	fmt.Printf("Copy:      %v\n", copySlice)

	// Remove element from middle (by index 2)
	nums := []int{10, 20, 30, 40, 50}
	indexToRemove := 2
	nums = append(nums[:indexToRemove], nums[indexToRemove+1:]...)
	fmt.Printf("After removing index 2: %v\n", nums)

	// Sort a slice
	unsorted := []int{42, 7, 99, 3, 56, 1}
	sort.Ints(unsorted)
	fmt.Printf("Sorted: %v\n", unsorted)

	// Check if slice contains an element
	names := []string{"nginx", "redis", "postgres", "grafana"}
	sort.Strings(names)
	fmt.Printf("Sorted names: %v\n", names)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 5: MAPS (Key-Value Pairs)
	// ─────────────────────────────────────────────────────────────────────
	// Maps are like Python dictionaries or JavaScript objects.
	// map[KeyType]ValueType

	fmt.Println("--- Maps ---")

	// Create a map using a literal
	envVars := map[string]string{
		"ENVIRONMENT": "production",
		"LOG_LEVEL":   "info",
		"DB_HOST":     "db.example.com",
		"DB_PORT":     "5432",
		"CACHE_TTL":   "300",
	}

	// Access values
	fmt.Printf("Environment: %s\n", envVars["ENVIRONMENT"])
	fmt.Printf("DB Host: %s\n", envVars["DB_HOST"])

	// Add/update a value
	envVars["API_KEY"] = "secret-123"
	envVars["LOG_LEVEL"] = "debug" // Update existing

	// Delete a key
	delete(envVars, "CACHE_TTL")

	// Check if key exists (IMPORTANT pattern!)
	apiKey, exists := envVars["API_KEY"]
	if exists {
		fmt.Printf("API Key found: %s\n", apiKey)
	}

	missingVal, exists := envVars["NONEXISTENT"]
	if !exists {
		fmt.Printf("Key not found, zero value: '%s'\n", missingVal)
	}

	// Iterate over a map
	fmt.Println("\nAll environment variables:")
	for key, value := range envVars {
		fmt.Printf("  %s = %s\n", key, value)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 6: MAPS WITH make()
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Maps with make() ---")

	// Create an empty map with make
	serverLoad := make(map[string]float64)

	serverLoad["web-01"] = 45.2
	serverLoad["web-02"] = 78.9
	serverLoad["web-03"] = 23.1
	serverLoad["api-01"] = 92.5

	// Find overloaded servers
	fmt.Println("Server Load Check:")
	for server, load := range serverLoad {
		status := "🟢 OK"
		if load > 80 {
			status = "🔴 HIGH"
		} else if load > 60 {
			status = "🟡 MEDIUM"
		}
		fmt.Printf("  %s: %.1f%% %s\n", server, load, status)
	}
	fmt.Printf("Total servers: %d\n", len(serverLoad))
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 7: STRUCTS (Custom Data Types)
	// ─────────────────────────────────────────────────────────────────────
	// Structs let you group related data together.
	// Go doesn't have classes, but structs + methods (Module 06) give you
	// the same power. Think of them as "blueprints" for data.

	fmt.Println("--- Structs ---")

	// Create struct instances
	server1 := Server{
		Name:     "web-01",
		IP:       "10.0.1.5",
		Port:     8080,
		IsActive: true,
		Tags:     []string{"production", "frontend"},
	}

	// Access fields with dot notation
	fmt.Printf("Server: %s (%s:%d)\n", server1.Name, server1.IP, server1.Port)
	fmt.Printf("Active: %t\n", server1.IsActive)
	fmt.Printf("Tags: %v\n", server1.Tags)

	// Modify fields
	server1.Port = 9090
	fmt.Printf("Updated port: %d\n", server1.Port)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 8: STRUCT METHODS (preview — more in Module 06)
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Struct with Method ---")
	fmt.Println(server1.Summary())
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 9: NESTED STRUCTS
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Nested Structs ---")

	cluster := Cluster{
		Name:        "prod-k8s",
		Environment: "production",
		Nodes: []Server{
			{Name: "node-01", IP: "10.0.1.1", Port: 6443, IsActive: true,
				Tags: []string{"control-plane"}},
			{Name: "node-02", IP: "10.0.1.2", Port: 10250, IsActive: true,
				Tags: []string{"worker"}},
			{Name: "node-03", IP: "10.0.1.3", Port: 10250, IsActive: false,
				Tags: []string{"worker"}},
		},
	}

	fmt.Printf("Cluster: %s (%s)\n", cluster.Name, cluster.Environment)
	for _, node := range cluster.Nodes {
		status := "✅"
		if !node.IsActive {
			status = "❌"
		}
		fmt.Printf("  %s %s — %s:%d\n", status, node.Name, node.IP, node.Port)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 10: POINTERS (Simplified!)
	// ─────────────────────────────────────────────────────────────────────
	// A pointer holds the MEMORY ADDRESS of a variable.
	// & = "address of" — get a pointer TO something
	// * = "value at" — get the value a pointer POINTS TO (dereference)
	//
	// WHY USE POINTERS?
	//   1. Modify a variable inside a function
	//   2. Avoid copying large structs (efficiency)
	//   3. Represent "nullable" values (pointer can be nil)

	fmt.Println("--- Pointers ---")

	// Basic pointer example
	x := 42
	p := &x // p is a pointer to x

	fmt.Printf("x value: %d\n", x)
	fmt.Printf("x address: %p\n", &x)     // Memory address
	fmt.Printf("p (pointer): %p\n", p)     // Same address!
	fmt.Printf("*p (dereferenced): %d\n", *p) // Value at that address: 42

	// Modify through pointer
	*p = 100
	fmt.Printf("After *p = 100, x is now: %d\n", x) // x changed!
	fmt.Println()

	// ─── Pointers with functions ─────────────────────────────────────────
	fmt.Println("--- Pointers with Functions ---")

	count := 5
	fmt.Printf("Before: count = %d\n", count)

	increment(&count) // Pass a pointer
	fmt.Printf("After increment: count = %d\n", count)

	increment(&count)
	fmt.Printf("After 2nd increment: count = %d\n", count)
	fmt.Println()

	// ─── Pointers with structs ───────────────────────────────────────────
	fmt.Println("--- Pointers with Structs ---")

	server2 := &Server{
		Name:     "db-01",
		IP:       "10.0.2.1",
		Port:     5432,
		IsActive: true,
		Tags:     []string{"database", "primary"},
	}

	// Go automatically dereferences struct pointers!
	// You can write server2.Name instead of (*server2).Name
	fmt.Printf("Before: %s active=%t\n", server2.Name, server2.IsActive)
	deactivateServer(server2) // Modifies the original!
	fmt.Printf("After:  %s active=%t\n", server2.Name, server2.IsActive)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// PRACTICAL EXAMPLE: INFRASTRUCTURE INVENTORY
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  PRACTICAL: Infrastructure Inventory")
	fmt.Println("═══════════════════════════════════════")

	inventory := []Server{
		{Name: "web-01", IP: "10.0.1.1", Port: 80, IsActive: true,
			Tags: []string{"web", "production"}},
		{Name: "web-02", IP: "10.0.1.2", Port: 80, IsActive: true,
			Tags: []string{"web", "production"}},
		{Name: "api-01", IP: "10.0.2.1", Port: 8080, IsActive: true,
			Tags: []string{"api", "production"}},
		{Name: "db-01", IP: "10.0.3.1", Port: 5432, IsActive: false,
			Tags: []string{"database", "production"}},
		{Name: "dev-01", IP: "10.1.1.1", Port: 3000, IsActive: true,
			Tags: []string{"web", "development"}},
	}

	// Filter: find all active production servers
	prodServers := filterServers(inventory, func(s Server) bool {
		return s.IsActive && containsTag(s.Tags, "production")
	})

	fmt.Println("\nActive Production Servers:")
	for _, s := range prodServers {
		fmt.Printf("  📦 %s (%s:%d) — tags: %v\n",
			s.Name, s.IP, s.Port, s.Tags)
	}
	fmt.Printf("\n  Total: %d active production servers\n", len(prodServers))
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// EXERCISES
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  🏋️ EXERCISES:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  1. Create a slice of 'Container' structs with Name, Image, Port")
	fmt.Println("  2. Write a function that returns a map of tag→count from the inventory")
	fmt.Println("  3. Use a pointer to modify a Server's IP address")
	fmt.Println("  4. Write a function that merges two maps (second overrides first)")
	fmt.Println("  5. Create a nested struct: 'Deployment' has Name + []Container")
	fmt.Println()
	fmt.Println("✅ Module 05 Complete! Move on to 06-interfaces/")
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPE AND FUNCTION DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

// ─── Struct definitions ──────────────────────────────────────────────────

// Server represents a machine in our infrastructure
type Server struct {
	Name     string
	IP       string
	Port     int
	IsActive bool
	Tags     []string
}

// Summary returns a formatted string describing the server
func (s Server) Summary() string {
	status := "INACTIVE"
	if s.IsActive {
		status = "ACTIVE"
	}
	return fmt.Sprintf("[%s] %s — %s:%d — tags: %s",
		status, s.Name, s.IP, s.Port, strings.Join(s.Tags, ", "))
}

// Cluster represents a group of servers
type Cluster struct {
	Name        string
	Environment string
	Nodes       []Server
}

// ─── Pointer functions ──────────────────────────────────────────────────

// increment modifies the value through a pointer
func increment(n *int) {
	*n++ // Dereference and increment
}

// deactivateServer modifies the server through a pointer
func deactivateServer(s *Server) {
	s.IsActive = false // Go auto-dereferences struct pointers!
}

// ─── Helper functions ────────────────────────────────────────────────────

// filterServers returns servers matching a predicate function
func filterServers(servers []Server, predicate func(Server) bool) []Server {
	var result []Server
	for _, s := range servers {
		if predicate(s) {
			result = append(result, s)
		}
	}
	return result
}

// containsTag checks if a slice of tags contains a specific tag
func containsTag(tags []string, target string) bool {
	for _, t := range tags {
		if t == target {
			return true
		}
	}
	return false
}
