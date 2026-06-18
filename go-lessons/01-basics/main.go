// ============================================================================
// MODULE 01 — HELLO GO: THE ABSOLUTE BASICS
// ============================================================================
//
// 🎯 WHAT YOU'LL LEARN:
//   - What Go is and why DevOps engineers love it
//   - The anatomy of a Go program
//   - How to print output
//   - How to run and build Go programs
//
// 🚀 HOW TO RUN THIS FILE:
//   Open your terminal, navigate to this folder, and type:
//     go run main.go
//
//   To BUILD an executable (like a .exe on Windows):
//     go build -o myapp.exe main.go
//     Then run it: .\myapp.exe
//
// ============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT 1: PACKAGES
// ─────────────────────────────────────────────────────────────────────────────
// Every Go file starts with a "package" declaration.
// The "main" package is special — it tells Go "this is an executable program."
// If you were writing a library for others to use, you'd use a different name.
//
// Think of packages like folders that organize your code.
// In DevOps: tools like Docker, Kubernetes, and Terraform are all written in Go
// and use hundreds of packages!
package main

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT 2: IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// "import" brings in code from other packages so you can use it.
// "fmt" stands for "format" — it's Go's printing/formatting package.
//
// Go has a HUGE standard library built in. You don't need to install
// anything extra for most tasks. This is one reason DevOps engineers love Go:
// you get a lot out of the box.
import "fmt"

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT 3: THE main() FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// func main() is the ENTRY POINT of your program.
// When you run "go run main.go", Go looks for this function and starts here.
// Every executable Go program MUST have exactly one main() function
// in the "main" package.
func main() {

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 4: PRINTING OUTPUT
	// ─────────────────────────────────────────────────────────────────────

	// Println = "Print Line" — prints text and adds a newline at the end
	fmt.Println("========================================")
	fmt.Println("  MODULE 01: Hello Go!")
	fmt.Println("========================================")
	fmt.Println()

	// Simple printing — just outputs whatever you give it
	fmt.Println("Hello, World! Welcome to Go programming!")
	fmt.Println("Go was created at Google in 2009 by Robert Griesemer, Rob Pike, and Ken Thompson.")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 5: fmt.Printf — FORMATTED PRINTING
	// ─────────────────────────────────────────────────────────────────────
	// Printf lets you insert values into strings using "verbs" (placeholders):
	//   %s = string
	//   %d = integer (decimal)
	//   %f = floating-point number
	//   %v = any value (Go figures out the type)
	//   %T = the TYPE of a value
	//   \n = newline (you must add it yourself with Printf!)

	name := "DevOps Engineer"    // We'll learn about := in Module 02
	year := 2026                  // This creates an integer variable
	rating := 9.5                 // This creates a floating-point variable

	fmt.Printf("Goal: Become a %s by %d!\n", name, year)
	fmt.Printf("Go awesomeness rating: %.1f/10\n", rating)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 6: Print vs Println vs Printf
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Print vs Println vs Printf ---")

	// Print: no newline at the end
	fmt.Print("I'm on ")
	fmt.Print("the same line!\n") // We have to manually add \n

	// Println: automatically adds a newline
	fmt.Println("I'm on my own line!")

	// Printf: formatted output with placeholders
	fmt.Printf("There are %d modules in this course.\n", 10)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// WHY GO FOR DEVOPS?
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  WHY DEVOPS ENGINEERS LOVE GO:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  1. Compiles to a SINGLE binary — no runtime needed")
	fmt.Println("     (unlike Python/Node that need interpreters)")
	fmt.Println()
	fmt.Println("  2. Cross-compilation — build for Linux from Windows:")
	fmt.Println("     GOOS=linux GOARCH=amd64 go build")
	fmt.Println()
	fmt.Println("  3. Built-in concurrency — handle thousands of tasks")
	fmt.Println("     at once (perfect for monitoring/automation)")
	fmt.Println()
	fmt.Println("  4. Strong standard library — HTTP servers, JSON,")
	fmt.Println("     file I/O, testing — all built in!")
	fmt.Println()
	fmt.Println("  5. Used by: Docker, Kubernetes, Terraform, Prometheus,")
	fmt.Println("     Grafana, Vault, Consul, and many more DevOps tools!")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// EXERCISE: Try these yourself!
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  🏋️ EXERCISES:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  1. Change the name variable to YOUR name")
	fmt.Println("  2. Add a new fmt.Printf that prints your age")
	fmt.Println("  3. Try running: go build -o myfirst.exe main.go")
	fmt.Println("     Then run: .\\myfirst.exe")
	fmt.Println("  4. Try: go run . (runs all .go files in folder)")
	fmt.Println()
	fmt.Println("✅ Module 01 Complete! Move on to 02-variables/")
}
