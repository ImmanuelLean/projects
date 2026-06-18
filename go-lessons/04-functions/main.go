// ============================================================================
// MODULE 04 — FUNCTIONS & ERROR HANDLING
// ============================================================================
//
// 🎯 WHAT YOU'LL LEARN:
//   - Defining and calling functions
//   - Multiple return values (Go's signature feature!)
//   - Error handling (THE Go way — no try/catch!)
//   - defer, panic, recover
//   - Anonymous functions and closures
//   - Variadic functions (variable number of arguments)
//
// 🚀 RUN: go run main.go
//
// 🔧 DEVOPS RELEVANCE:
//   Functions are how you organize automation scripts.
//   Error handling is CRITICAL — DevOps tools must handle failures gracefully.
//   defer is used everywhere for cleanup (closing connections, files, etc.)
// ============================================================================

package main

import (
	"errors"
	"fmt"
	"math"
	"strings"
)

func main() {
	fmt.Println("========================================")
	fmt.Println("  MODULE 04: Functions & Error Handling")
	fmt.Println("========================================")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 1: BASIC FUNCTIONS
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Basic Functions ---")

	// Calling our functions (defined below main)
	greet("DevOps Engineer")
	greet("Go Developer")
	fmt.Println()

	// Function with a return value
	result := add(10, 20)
	fmt.Printf("add(10, 20) = %d\n", result)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 2: MULTIPLE RETURN VALUES
	// ─────────────────────────────────────────────────────────────────────
	// This is one of Go's MOST IMPORTANT features.
	// Functions can return MORE THAN ONE value.
	// Most commonly used to return (result, error).

	fmt.Println("--- Multiple Return Values ---")

	quotient, remainder := divide(17, 5)
	fmt.Printf("17 ÷ 5 = %d remainder %d\n", quotient, remainder)

	min, max := minMax(42, 7, 99, 3, 56)
	fmt.Printf("Min: %d, Max: %d\n", min, max)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 3: ERROR HANDLING — THE GO WAY
	// ─────────────────────────────────────────────────────────────────────
	// Go does NOT have try/catch/exceptions like Python or Java.
	// Instead, functions return an error as a second value.
	// You CHECK the error explicitly. This is intentional:
	//   - Forces you to handle errors at every step
	//   - Makes error handling visible (not hidden in catch blocks)
	//   - Prevents unhandled exceptions from crashing your program
	//
	// Pattern:
	//   result, err := someFunction()
	//   if err != nil {
	//       // handle the error
	//   }

	fmt.Println("--- Error Handling (The Go Way) ---")

	// Successful case
	result2, err := safeDivide(10, 3)
	if err != nil {
		fmt.Printf("Error: %s\n", err)
	} else {
		fmt.Printf("10 / 3 = %.2f\n", result2)
	}

	// Error case
	result2, err = safeDivide(10, 0)
	if err != nil {
		fmt.Printf("Error: %s\n", err) // This will print!
	} else {
		fmt.Printf("10 / 0 = %.2f\n", result2)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 4: REAL-WORLD ERROR HANDLING PATTERN
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Real-world Error Handling ---")

	// DevOps scenario: validating server configurations
	configs := []ServerConfig{
		{Name: "web-01", Port: 8080, Region: "us-east-1"},
		{Name: "", Port: 8080, Region: "us-east-1"},       // Invalid: no name
		{Name: "api-01", Port: 0, Region: "eu-west-1"},    // Invalid: no port
		{Name: "db-01", Port: 5432, Region: ""},            // Invalid: no region
		{Name: "cache-01", Port: 6379, Region: "ap-south-1"},
	}

	for _, cfg := range configs {
		if err := validateConfig(cfg); err != nil {
			fmt.Printf("  ❌ Config invalid: %s\n", err)
		} else {
			fmt.Printf("  ✅ %s:%d (%s) — valid!\n", cfg.Name, cfg.Port, cfg.Region)
		}
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 5: NAMED RETURN VALUES
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Named Return Values ---")

	area, perimeter := rectangleStats(5.0, 3.0)
	fmt.Printf("Rectangle 5x3: area=%.1f, perimeter=%.1f\n", area, perimeter)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 6: DEFER
	// ─────────────────────────────────────────────────────────────────────
	// "defer" delays a function call until the surrounding function returns.
	// It's perfect for cleanup: closing files, connections, releasing locks.
	//
	// KEY RULES:
	//   1. Deferred calls run AFTER the function returns
	//   2. Multiple defers run in LIFO order (last in, first out — like a stack)
	//   3. Arguments are evaluated when defer is called, not when it runs

	fmt.Println("--- defer ---")
	fmt.Println("  Simulating file operations:")
	simulateFileOps()
	fmt.Println()

	fmt.Println("--- defer order (LIFO) ---")
	fmt.Print("  Order: ")
	defer fmt.Println(" (this prints LAST — deferred from main!)")
	for i := 1; i <= 3; i++ {
		defer fmt.Printf("%d ", i) // Will print: 3 2 1
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 7: ANONYMOUS FUNCTIONS & CLOSURES
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Anonymous Functions ---")

	// A function without a name — can be assigned to a variable
	double := func(n int) int {
		return n * 2
	}
	fmt.Printf("  double(21) = %d\n", double(21))

	// Immediately invoked function (IIFE)
	result3 := func(a, b int) int {
		return a + b
	}(5, 3) // Called immediately with (5, 3)
	fmt.Printf("  IIFE result: %d\n", result3)

	// Closure — a function that "remembers" variables from its scope
	counter := makeCounter()
	fmt.Printf("  counter() = %d\n", counter())
	fmt.Printf("  counter() = %d\n", counter())
	fmt.Printf("  counter() = %d\n", counter())
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 8: VARIADIC FUNCTIONS
	// ─────────────────────────────────────────────────────────────────────
	// Functions that accept a variable number of arguments.
	// You've already seen this: fmt.Println() is variadic!

	fmt.Println("--- Variadic Functions ---")
	fmt.Printf("  sum(1, 2, 3) = %d\n", sum(1, 2, 3))
	fmt.Printf("  sum(10, 20) = %d\n", sum(10, 20))
	fmt.Printf("  sum(5) = %d\n", sum(5))

	// You can also pass a slice with the ... spread operator
	numbers := []int{100, 200, 300, 400}
	fmt.Printf("  sum(100..400) = %d\n", sum(numbers...))
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 9: FUNCTIONS AS PARAMETERS
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Functions as Parameters ---")

	data := []float64{10.5, 20.3, 30.7, 40.1, 50.9}

	// Pass different functions to transform data
	doubled := transform(data, func(x float64) float64 { return x * 2 })
	rounded := transform(data, math.Round)
	fmt.Printf("  Original: %v\n", data)
	fmt.Printf("  Doubled:  %v\n", doubled)
	fmt.Printf("  Rounded:  %v\n", rounded)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 10: PANIC AND RECOVER
	// ─────────────────────────────────────────────────────────────────────
	// panic = crash the program (like throwing an unhandled exception)
	// recover = catch the panic and handle it gracefully
	//
	// RULE: Don't use panic for normal error handling!
	// Use it only for truly unrecoverable situations.
	// In DevOps tools, you almost always want to return errors, not panic.

	fmt.Println("--- panic and recover ---")
	safeExecute(func() {
		fmt.Println("  This runs fine!")
	})
	safeExecute(func() {
		panic("something went terribly wrong!")
	})
	fmt.Println("  Program continues after recovered panic!")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// EXERCISES
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  🏋️ EXERCISES:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  1. Write a function 'isPrime(n int) bool'")
	fmt.Println("  2. Write a function 'parsePort(s string) (int, error)'")
	fmt.Println("  3. Create a closure that generates unique server IDs")
	fmt.Println("  4. Write a variadic function 'joinPaths(parts ...string) string'")
	fmt.Println("  5. Practice defer: print 'start', defer 'end', print 'middle'")
	fmt.Println()
	fmt.Println("✅ Module 04 Complete! Move on to 05-data-structures/")
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCTION DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

// ─── Basic function (no return value) ────────────────────────────────────
// The syntax: func functionName(paramName paramType) { ... }
func greet(name string) {
	fmt.Printf("Hello, %s! Welcome to Go.\n", name)
}

// ─── Function with return value ──────────────────────────────────────────
// Return type goes AFTER the parameters
func add(a int, b int) int {
	return a + b
}

// When parameters share a type, you can shorten it:
func divide(a, b int) (int, int) {
	return a / b, a % b
}

// ─── Function returning min and max (variadic) ──────────────────────────
func minMax(nums ...int) (int, int) {
	min, max := nums[0], nums[0]
	for _, n := range nums {
		if n < min {
			min = n
		}
		if n > max {
			max = n
		}
	}
	return min, max
}

// ─── Error handling function ─────────────────────────────────────────────
// Returns (float64, error) — the standard Go pattern
func safeDivide(a, b float64) (float64, error) {
	if b == 0 {
		// errors.New creates a new error with a message
		return 0, errors.New("cannot divide by zero")
	}
	return a / b, nil // nil means "no error"
}

// ─── Struct for config validation example ────────────────────────────────
type ServerConfig struct {
	Name   string
	Port   int
	Region string
}

// Function that validates a config and returns an error if invalid
func validateConfig(cfg ServerConfig) error {
	if strings.TrimSpace(cfg.Name) == "" {
		return fmt.Errorf("server name cannot be empty")
	}
	if cfg.Port <= 0 || cfg.Port > 65535 {
		return fmt.Errorf("invalid port %d for server %s", cfg.Port, cfg.Name)
	}
	if strings.TrimSpace(cfg.Region) == "" {
		return fmt.Errorf("region cannot be empty for server %s", cfg.Name)
	}
	return nil // No error — config is valid!
}

// ─── Named return values ────────────────────────────────────────────────
// You can NAME your return values. Then "return" without arguments
// returns whatever those variables currently hold. Called a "naked return."
func rectangleStats(width, height float64) (area float64, perimeter float64) {
	area = width * height
	perimeter = 2 * (width + height)
	return // "naked return" — returns area and perimeter
}

// ─── Demonstrating defer ────────────────────────────────────────────────
func simulateFileOps() {
	fmt.Println("    Opening config.yaml...")
	defer fmt.Println("    Closing config.yaml (deferred — runs last!)")

	fmt.Println("    Reading config data...")
	fmt.Println("    Processing config...")
	fmt.Println("    Done processing!")
	// Even if we return here, the deferred Close still runs!
}

// ─── Closure that creates a counter ─────────────────────────────────────
// makeCounter returns a FUNCTION that "remembers" its count variable
func makeCounter() func() int {
	count := 0
	return func() int {
		count++ // This modifies the outer "count" variable!
		return count
	}
}

// ─── Variadic sum function ──────────────────────────────────────────────
func sum(nums ...int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	return total
}

// ─── Higher-order function (takes a function as parameter) ──────────────
func transform(data []float64, fn func(float64) float64) []float64 {
	result := make([]float64, len(data))
	for i, v := range data {
		result[i] = fn(v)
	}
	return result
}

// ─── Safe execution with recover ────────────────────────────────────────
func safeExecute(fn func()) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("  ⚠️ Recovered from panic: %v\n", r)
		}
	}()
	fn()
}
