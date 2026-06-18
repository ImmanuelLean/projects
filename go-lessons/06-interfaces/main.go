// ============================================================================
// MODULE 06 — INTERFACES & METHODS
// ============================================================================
//
// 🎯 WHAT YOU'LL LEARN:
//   - Methods on structs (turning structs into "objects")
//   - Value receivers vs Pointer receivers
//   - Interfaces (Go's version of polymorphism)
//   - The empty interface (any)
//   - Type assertions and type switches
//   - Composition over inheritance
//
// 🚀 RUN: go run main.go
//
// 🔧 DEVOPS RELEVANCE:
//   Interfaces let you write code that works with ANY backend:
//   - Store logs in a file, database, or cloud — same interface!
//   - Deploy to AWS, GCP, or Azure — same interface!
//   - Kubernetes uses interfaces everywhere for extensibility
// ============================================================================

package main

import (
	"fmt"
	"math"
	"strings"
	"time"
)

func main() {
	fmt.Println("========================================")
	fmt.Println("  MODULE 06: Interfaces & Methods")
	fmt.Println("========================================")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 1: METHODS ON STRUCTS
	// ─────────────────────────────────────────────────────────────────────
	// A method is a function attached to a type.
	// Syntax: func (receiverName ReceiverType) MethodName() ReturnType
	// The "receiver" is like "self" in Python or "this" in Java.

	fmt.Println("--- Methods on Structs ---")

	rect := Rectangle{Width: 10, Height: 5}
	fmt.Printf("Rectangle: %dx%d\n", rect.Width, rect.Height)
	fmt.Printf("  Area: %.2f\n", rect.Area())
	fmt.Printf("  Perimeter: %.2f\n", rect.Perimeter())

	circle := Circle{Radius: 7}
	fmt.Printf("Circle: radius %d\n", circle.Radius)
	fmt.Printf("  Area: %.2f\n", circle.Area())
	fmt.Printf("  Perimeter: %.2f\n", circle.Perimeter())
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 2: VALUE vs POINTER RECEIVERS
	// ─────────────────────────────────────────────────────────────────────
	// Value receiver (s Server)  → gets a COPY, can't modify original
	// Pointer receiver (s *Server) → gets the ORIGINAL, CAN modify it
	//
	// RULE OF THUMB:
	//   - Use pointer receiver if the method modifies the struct
	//   - Use pointer receiver if the struct is large (avoids copying)
	//   - Be consistent: if one method uses a pointer, all should

	fmt.Println("--- Value vs Pointer Receivers ---")

	server := Container{
		ID:     "abc123",
		Image:  "nginx:latest",
		Status: "running",
		CPU:    25.5,
		Memory: 128.0,
	}

	fmt.Println(server.Info())  // Value receiver — doesn't modify
	server.Stop()               // Pointer receiver — modifies Status!
	fmt.Println(server.Info())  // Status is now "stopped"
	server.Start()              // Pointer receiver — modifies Status!
	fmt.Println(server.Info())  // Status is now "running"
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 3: INTERFACES
	// ─────────────────────────────────────────────────────────────────────
	// An interface defines a SET OF METHODS that a type must have.
	// ANY type that has those methods AUTOMATICALLY implements the interface.
	// No "implements" keyword needed! This is called "implicit implementation."
	//
	// This is one of Go's most powerful features:
	//   - Write code against interfaces, not concrete types
	//   - Swap implementations without changing caller code
	//   - Perfect for testing (mock implementations)

	fmt.Println("--- Interfaces ---")

	// Both Rectangle and Circle implement the Shape interface!
	// We can treat them the same way:
	shapes := []Shape{
		Rectangle{Width: 10, Height: 5},
		Circle{Radius: 7},
		Rectangle{Width: 3, Height: 3},
		Circle{Radius: 1},
	}

	for _, shape := range shapes {
		printShapeInfo(shape) // Works with ANY Shape!
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 4: DEVOPS INTERFACE EXAMPLE — LOGGER
	// ─────────────────────────────────────────────────────────────────────
	// Here's a real-world DevOps pattern:
	// Define a Logger interface, then implement it multiple ways.

	fmt.Println("--- DevOps Interface: Logger ---")

	// Use console logger
	var logger Logger = &ConsoleLogger{Prefix: "APP"}
	logger.Info("Application starting...")
	logger.Error("Connection timeout!")

	fmt.Println()

	// Swap to file logger (same interface!)
	logger = &FileLogger{Filename: "/var/log/app.log"}
	logger.Info("Application starting...")
	logger.Error("Connection timeout!")

	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 5: DEVOPS INTERFACE — CLOUD PROVIDER
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- DevOps Interface: Cloud Provider ---")

	// Same code works with different cloud providers!
	providers := []CloudProvider{
		&AWSProvider{Region: "us-east-1"},
		&GCPProvider{Project: "my-project"},
	}

	for _, provider := range providers {
		instanceID := provider.CreateInstance("web-server", "medium")
		fmt.Printf("  Created: %s\n", instanceID)
		provider.DeleteInstance(instanceID)
		fmt.Println()
	}

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 6: THE EMPTY INTERFACE (any)
	// ─────────────────────────────────────────────────────────────────────
	// The empty interface "any" (or "interface{}") has NO methods.
	// Since EVERY type has zero methods, EVERY type satisfies it.
	// It's like "Object" in Java or "any" in TypeScript.
	// Use sparingly — you lose type safety!

	fmt.Println("--- Empty Interface (any) ---")

	// A slice that can hold ANY type
	var mixed []any
	mixed = append(mixed, 42, "hello", true, 3.14, []int{1, 2, 3})

	for _, item := range mixed {
		fmt.Printf("  Value: %-12v Type: %T\n", item, item)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 7: TYPE ASSERTIONS
	// ─────────────────────────────────────────────────────────────────────
	// When you have an interface value, you can extract the concrete type.
	// Syntax: value, ok := interfaceValue.(ConcreteType)

	fmt.Println("--- Type Assertions ---")

	var val any = "Hello, Go!"

	// Safe type assertion (with ok check)
	str, ok := val.(string)
	if ok {
		fmt.Printf("  It's a string: '%s' (length: %d)\n", str, len(str))
	}

	// This would fail (val is a string, not int)
	num, ok := val.(int)
	if !ok {
		fmt.Printf("  Not an int! Got zero value: %d\n", num)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 8: TYPE SWITCH
	// ─────────────────────────────────────────────────────────────────────
	// A cleaner way to handle multiple possible types.

	fmt.Println("--- Type Switch ---")

	testValues := []any{42, "hello", true, 3.14, []string{"a", "b"}, nil}

	for _, v := range testValues {
		describeType(v)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 9: COMPOSITION (Go's Alternative to Inheritance)
	// ─────────────────────────────────────────────────────────────────────
	// Go doesn't have inheritance (no "extends" keyword).
	// Instead, it uses COMPOSITION — embedding types inside each other.
	// This is actually BETTER than inheritance for most use cases!

	fmt.Println("--- Composition (Embedding) ---")

	admin := AdminUser{
		User: User{
			Name:  "Alice",
			Email: "alice@devops.com",
		},
		Role:        "cluster-admin",
		Permissions: []string{"read", "write", "delete", "deploy"},
	}

	// Embedded fields are "promoted" — access them directly!
	fmt.Printf("Name: %s\n", admin.Name)         // From embedded User
	fmt.Printf("Email: %s\n", admin.Email)        // From embedded User
	fmt.Printf("Role: %s\n", admin.Role)          // From AdminUser
	fmt.Printf("Permissions: %v\n", admin.Permissions)
	fmt.Println(admin.Greeting()) // Method from embedded User!
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 10: COMMON STANDARD LIBRARY INTERFACES
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Common Go Interfaces ---")
	fmt.Println("  fmt.Stringer  → String() string  (like __str__ in Python)")
	fmt.Println("  error         → Error() string    (THE error interface)")
	fmt.Println("  io.Reader     → Read(p []byte) (n int, err error)")
	fmt.Println("  io.Writer     → Write(p []byte) (n int, err error)")
	fmt.Println("  sort.Interface → Len, Less, Swap  (for sorting)")
	fmt.Println()

	// Stringer example — customize how your type prints
	pod := Pod{Name: "nginx-7d4b8c", Namespace: "production", Ready: true}
	fmt.Println(pod) // Uses our String() method automatically!
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// EXERCISES
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  🏋️ EXERCISES:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  1. Create a 'Storage' interface with Get/Set/Delete methods")
	fmt.Println("  2. Implement it as MemoryStorage (using a map)")
	fmt.Println("  3. Implement it as a mock FileStorage (just print actions)")
	fmt.Println("  4. Add a Stringer method to the Container type")
	fmt.Println("  5. Create a 'Deployable' interface with Deploy/Rollback methods")
	fmt.Println()
	fmt.Println("✅ Module 06 Complete! Move on to 07-concurrency/")
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

// ─── Shape Interface & Implementations ───────────────────────────────────

// Shape is an interface — any type with Area() and Perimeter() is a Shape
type Shape interface {
	Area() float64
	Perimeter() float64
}

type Rectangle struct {
	Width, Height int
}

func (r Rectangle) Area() float64 {
	return float64(r.Width * r.Height)
}

func (r Rectangle) Perimeter() float64 {
	return float64(2 * (r.Width + r.Height))
}

type Circle struct {
	Radius int
}

func (c Circle) Area() float64 {
	return math.Pi * float64(c.Radius) * float64(c.Radius)
}

func (c Circle) Perimeter() float64 {
	return 2 * math.Pi * float64(c.Radius)
}

func printShapeInfo(s Shape) {
	fmt.Printf("  Shape: %-20T Area: %8.2f  Perimeter: %8.2f\n",
		s, s.Area(), s.Perimeter())
}

// ─── Container with methods ──────────────────────────────────────────────

type Container struct {
	ID     string
	Image  string
	Status string
	CPU    float64
	Memory float64
}

// Value receiver — doesn't modify the container
func (c Container) Info() string {
	return fmt.Sprintf("  [%s] %s (%s) — CPU: %.1f%%, Mem: %.0fMB",
		c.ID[:6], c.Image, c.Status, c.CPU, c.Memory)
}

// Pointer receiver — MODIFIES the container
func (c *Container) Stop() {
	c.Status = "stopped"
	c.CPU = 0
	fmt.Printf("  ⏹️  Stopping container %s...\n", c.ID[:6])
}

func (c *Container) Start() {
	c.Status = "running"
	c.CPU = 25.5
	fmt.Printf("  ▶️  Starting container %s...\n", c.ID[:6])
}

// ─── Logger Interface ────────────────────────────────────────────────────

type Logger interface {
	Info(msg string)
	Error(msg string)
}

type ConsoleLogger struct {
	Prefix string
}

func (l *ConsoleLogger) Info(msg string) {
	fmt.Printf("  [%s] ℹ️  INFO:  %s\n", l.Prefix, msg)
}

func (l *ConsoleLogger) Error(msg string) {
	fmt.Printf("  [%s] ❌ ERROR: %s\n", l.Prefix, msg)
}

type FileLogger struct {
	Filename string
}

func (l *FileLogger) Info(msg string) {
	fmt.Printf("  → Writing to %s: [INFO] %s\n", l.Filename, msg)
}

func (l *FileLogger) Error(msg string) {
	fmt.Printf("  → Writing to %s: [ERROR] %s\n", l.Filename, msg)
}

// ─── Cloud Provider Interface ────────────────────────────────────────────

type CloudProvider interface {
	CreateInstance(name, size string) string
	DeleteInstance(id string)
}

type AWSProvider struct {
	Region string
}

func (a *AWSProvider) CreateInstance(name, size string) string {
	id := fmt.Sprintf("i-%s-%d", name, time.Now().UnixNano()%10000)
	fmt.Printf("  ☁️  AWS (%s): Creating EC2 instance '%s' (%s)...\n",
		a.Region, name, size)
	return id
}

func (a *AWSProvider) DeleteInstance(id string) {
	fmt.Printf("  ☁️  AWS (%s): Terminating instance %s\n", a.Region, id)
}

type GCPProvider struct {
	Project string
}

func (g *GCPProvider) CreateInstance(name, size string) string {
	id := fmt.Sprintf("gce-%s-%d", name, time.Now().UnixNano()%10000)
	fmt.Printf("  ☁️  GCP (%s): Creating VM '%s' (%s)...\n",
		g.Project, name, size)
	return id
}

func (g *GCPProvider) DeleteInstance(id string) {
	fmt.Printf("  ☁️  GCP (%s): Deleting instance %s\n", g.Project, id)
}

// ─── Composition Example ────────────────────────────────────────────────

type User struct {
	Name  string
	Email string
}

func (u User) Greeting() string {
	return fmt.Sprintf("  Hello, I'm %s (%s)", u.Name, u.Email)
}

type AdminUser struct {
	User        // Embedded struct — "inherits" Name, Email, Greeting()
	Role        string
	Permissions []string
}

// ─── Stringer Interface Example ──────────────────────────────────────────

type Pod struct {
	Name      string
	Namespace string
	Ready     bool
}

// Implementing fmt.Stringer — controls how Pod is printed
func (p Pod) String() string {
	status := "NotReady"
	if p.Ready {
		status = "Ready"
	}
	return fmt.Sprintf("Pod(%s/%s) [%s]", p.Namespace, p.Name, status)
}

// ─── Type switch helper ─────────────────────────────────────────────────

func describeType(val any) {
	switch v := val.(type) {
	case int:
		fmt.Printf("  int: %d\n", v)
	case string:
		fmt.Printf("  string: '%s' (len=%d)\n", v, len(v))
	case bool:
		fmt.Printf("  bool: %t\n", v)
	case float64:
		fmt.Printf("  float64: %.2f\n", v)
	case []string:
		fmt.Printf("  []string: %s\n", strings.Join(v, ", "))
	case nil:
		fmt.Println("  nil value!")
	default:
		fmt.Printf("  unknown type: %T\n", v)
	}
}
