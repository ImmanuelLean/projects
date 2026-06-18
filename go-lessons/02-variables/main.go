// ============================================================================
// MODULE 02 — VARIABLES, TYPES & CONSTANTS
// ============================================================================
//
// 🎯 WHAT YOU'LL LEARN:
//   - How to declare variables (two ways!)
//   - Go's basic data types
//   - Type conversions
//   - Constants and the magic of iota
//   - Zero values (Go's way of initializing things)
//
// 🚀 RUN: go run main.go
// ============================================================================

package main

import "fmt"

func main() {
	fmt.Println("========================================")
	fmt.Println("  MODULE 02: Variables, Types & Constants")
	fmt.Println("========================================")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 1: DECLARING VARIABLES
	// ─────────────────────────────────────────────────────────────────────
	// Go has TWO ways to create variables:

	// METHOD 1: "var" keyword (explicit)
	// Syntax: var name type = value
	var serverName string = "web-server-01"
	var port int = 8080
	var isHealthy bool = true
	var cpuUsage float64 = 45.7

	fmt.Println("--- Method 1: var keyword ---")
	fmt.Printf("Server: %s\n", serverName)
	fmt.Printf("Port: %d\n", port)
	fmt.Printf("Healthy: %t\n", isHealthy)     // %t = boolean
	fmt.Printf("CPU Usage: %.1f%%\n", cpuUsage) // %% prints a literal %
	fmt.Println()

	// METHOD 2: Short declaration ":=" (the Go way — used more often!)
	// Go INFERS the type from the value. This ONLY works inside functions.
	hostname := "k8s-node-03"       // Go knows this is a string
	replicas := 3                    // Go knows this is an int
	memoryGB := 16.5                 // Go knows this is a float64
	isLeader := false                // Go knows this is a bool

	fmt.Println("--- Method 2: := shorthand ---")
	fmt.Printf("Host: %s, Replicas: %d, Memory: %.1fGB, Leader: %t\n",
		hostname, replicas, memoryGB, isLeader)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 2: ZERO VALUES
	// ─────────────────────────────────────────────────────────────────────
	// In Go, variables ALWAYS have a value. If you don't set one,
	// Go gives them a "zero value":
	//   int    → 0
	//   float  → 0.0
	//   string → "" (empty string)
	//   bool   → false
	//
	// This is DIFFERENT from many languages where uninitialized variables
	// are null/undefined/garbage. Go is safer!

	var uninitializedInt int
	var uninitializedString string
	var uninitializedBool bool
	var uninitializedFloat float64

	fmt.Println("--- Zero Values (Go initializes everything!) ---")
	fmt.Printf("int:     %d\n", uninitializedInt)
	fmt.Printf("string:  '%s' (empty)\n", uninitializedString)
	fmt.Printf("bool:    %t\n", uninitializedBool)
	fmt.Printf("float64: %f\n", uninitializedFloat)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 3: ALL THE BASIC TYPES
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Go's Basic Types ---")

	// INTEGERS (whole numbers)
	var smallNum int8 = 127         // 8-bit:  -128 to 127
	var mediumNum int16 = 32767     // 16-bit: -32768 to 32767
	var normalNum int32 = 2147483647 // 32-bit
	var bigNum int64 = 9223372036854775807 // 64-bit
	var autoNum int = 42            // Platform-dependent (usually 64-bit)

	// UNSIGNED INTEGERS (positive only)
	var positiveOnly uint = 42      // Can't be negative!
	var byteVal uint8 = 255         // Same as "byte" type

	fmt.Printf("int8: %d, int16: %d, int32: %d\n", smallNum, mediumNum, normalNum)
	fmt.Printf("int64: %d, int: %d\n", bigNum, autoNum)
	fmt.Printf("uint: %d, byte/uint8: %d\n", positiveOnly, byteVal)

	// FLOATING POINT (decimal numbers)
	var precise float64 = 3.141592653589793 // Use this by default!
	var lessPrecise float32 = 3.1415927      // Less precision, less memory

	fmt.Printf("float64: %.15f\n", precise)
	fmt.Printf("float32: %.7f\n", lessPrecise)

	// STRING
	var greeting string = "Hello, DevOps!"
	fmt.Printf("string: %s (length: %d)\n", greeting, len(greeting))

	// BOOLEAN
	var flag bool = true
	fmt.Printf("bool: %t\n", flag)

	// BYTE and RUNE
	var singleByte byte = 'A'   // byte = uint8, for ASCII
	var singleChar rune = '🚀'  // rune = int32, for Unicode
	fmt.Printf("byte: %c (%d), rune: %c (%d)\n", singleByte, singleByte, singleChar, singleChar)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 4: TYPE CONVERSIONS
	// ─────────────────────────────────────────────────────────────────────
	// Go does NOT automatically convert between types.
	// You must be EXPLICIT. This prevents subtle bugs!

	fmt.Println("--- Type Conversions ---")

	intVal := 42
	floatVal := float64(intVal) // int → float64
	fmt.Printf("int %d → float64 %f\n", intVal, floatVal)

	bigFloat := 3.99
	truncated := int(bigFloat) // float64 → int (TRUNCATES, doesn't round!)
	fmt.Printf("float64 %.2f → int %d (truncated, not rounded!)\n", bigFloat, truncated)

	// String conversions require the "strconv" package (we'll use it later)
	// For now, know that you can't just do string(42) — that gives you "*"
	// (the ASCII character), not "42"!
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 5: MULTIPLE VARIABLE DECLARATION
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Multiple Declarations ---")

	// Declare multiple variables at once
	var (
		clusterName  = "prod-cluster"
		nodeCount    = 5
		isProduction = true
	)
	fmt.Printf("Cluster: %s, Nodes: %d, Prod: %t\n",
		clusterName, nodeCount, isProduction)

	// Multiple short declarations on one line
	x, y, z := 1, 2, 3
	fmt.Printf("x=%d, y=%d, z=%d\n", x, y, z)

	// Swapping variables (Go makes this elegant!)
	a, b := "first", "second"
	fmt.Printf("Before swap: a=%s, b=%s\n", a, b)
	a, b = b, a // Swap in one line!
	fmt.Printf("After swap:  a=%s, b=%s\n", a, b)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 6: CONSTANTS
	// ─────────────────────────────────────────────────────────────────────
	// Constants are values that NEVER change. Use "const" keyword.
	// Constants must be known at compile time (no function calls!).

	fmt.Println("--- Constants ---")

	const maxRetries = 3
	const defaultTimeout = 30 // seconds
	const appVersion = "v1.2.0"

	fmt.Printf("Max Retries: %d\n", maxRetries)
	fmt.Printf("Timeout: %ds\n", defaultTimeout)
	fmt.Printf("Version: %s\n", appVersion)

	// You CANNOT reassign a constant:
	// maxRetries = 5  // ← This would cause a compile error!

	// Grouped constants
	const (
		statusOK       = 200
		statusNotFound = 404
		statusError    = 500
	)
	fmt.Printf("HTTP Status Codes: %d, %d, %d\n",
		statusOK, statusNotFound, statusError)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 7: iota — AUTO-INCREMENTING CONSTANTS
	// ─────────────────────────────────────────────────────────────────────
	// "iota" is a special Go feature that auto-generates incrementing values.
	// Super useful for enums (a set of related constants).
	// DevOps use case: defining log levels, server states, etc.

	fmt.Println("--- iota (Auto-incrementing Constants) ---")

	// See the constants defined outside main() below!
	fmt.Printf("Log Levels: DEBUG=%d, INFO=%d, WARN=%d, ERROR=%d, FATAL=%d\n",
		LogDebug, LogInfo, LogWarn, LogError, LogFatal)

	fmt.Printf("Sizes: KB=%d, MB=%d, GB=%d, TB=%d\n",
		KB, MB, GB, TB)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 8: THE %v AND %T VERBS
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- %v (value) and %T (type) verbs ---")

	// %v prints any value in a default format
	// %T prints the TYPE of a value
	// These are super useful for debugging!

	mystery1 := 42
	mystery2 := "hello"
	mystery3 := true
	mystery4 := 3.14

	fmt.Printf("Value: %v, Type: %T\n", mystery1, mystery1)
	fmt.Printf("Value: %v, Type: %T\n", mystery2, mystery2)
	fmt.Printf("Value: %v, Type: %T\n", mystery3, mystery3)
	fmt.Printf("Value: %v, Type: %T\n", mystery4, mystery4)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// EXERCISES
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  🏋️ EXERCISES:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  1. Create variables for a server: name, IP, port, isActive")
	fmt.Println("  2. Print them all using Printf with proper verbs")
	fmt.Println("  3. Try converting a float64 to int — what happens to 9.99?")
	fmt.Println("  4. Create a const group for days of the week using iota")
	fmt.Println("  5. Use %T to discover the type of: 'A', 42, 3.14, true")
	fmt.Println()
	fmt.Println("✅ Module 02 Complete! Move on to 03-control-flow/")
}

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGE-LEVEL CONSTANTS (defined outside functions)
// ─────────────────────────────────────────────────────────────────────────────
// These are accessible anywhere in the package.

// Log levels using iota (starts at 0, increments by 1)
const (
	LogDebug = iota // 0
	LogInfo         // 1
	LogWarn         // 2
	LogError        // 3
	LogFatal        // 4
)

// Byte sizes using iota with bit shifting (common DevOps pattern!)
const (
	_  = iota             // ignore first value (0)
	KB = 1024 * iota      // 1024
	MB = 1024 * 1024      // 1,048,576 — but we use a simpler pattern below
	GB = 1024 * 1024 * 1024
	TB = 1024 * 1024 * 1024 * 1024
)
