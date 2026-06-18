// ============================================================================
// MODULE 08 — PACKAGES, MODULES & TESTING
// ============================================================================
//
// 🎯 WHAT YOU'LL LEARN:
//   - Creating your own packages
//   - go mod for dependency management
//   - Exported vs Unexported (capital letter = public!)
//   - Writing unit tests
//   - Table-driven tests (Go's testing pattern)
//   - Test coverage
//   - Benchmarks
//
// 🚀 RUN: go run .
// 🧪 TEST: go test ./... -v
//
// 🔧 DEVOPS RELEVANCE:
//   - go mod = dependency management (like npm, pip)
//   - Testing is BUILT INTO Go (no pytest, jest needed!)
//   - CI/CD pipelines always run "go test ./..."
//   - Code coverage is built in: go test -cover
// ============================================================================

package main

import (
	"fmt"

	// Import our local packages!
	// These are in subdirectories of this module
	"go-lessons/08-packages/calculator"
	"go-lessons/08-packages/serverutil"
)

func main() {
	fmt.Println("========================================")
	fmt.Println("  MODULE 08: Packages, Modules & Testing")
	fmt.Println("========================================")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 1: USING OUR CUSTOM PACKAGES
	// ─────────────────────────────────────────────────────────────────────
	// We've created two packages:
	//   calculator/ — math operations with tests
	//   serverutil/ — DevOps utility functions with tests
	//
	// RULES:
	//   - Uppercase names are EXPORTED (public): calculator.Add
	//   - Lowercase names are UNEXPORTED (private): calculator.validate
	//   - Package name = directory name (by convention)

	fmt.Println("--- Using calculator package ---")

	fmt.Printf("  Add(10, 5)      = %d\n", calculator.Add(10, 5))
	fmt.Printf("  Subtract(10, 5) = %d\n", calculator.Subtract(10, 5))
	fmt.Printf("  Multiply(10, 5) = %d\n", calculator.Multiply(10, 5))

	result, err := calculator.Divide(10, 3)
	if err != nil {
		fmt.Printf("  Divide error: %s\n", err)
	} else {
		fmt.Printf("  Divide(10, 3)   = %.2f\n", result)
	}

	_, err = calculator.Divide(10, 0)
	if err != nil {
		fmt.Printf("  Divide(10, 0)   = Error: %s\n", err)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 2: USING SERVERUTIL PACKAGE
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Using serverutil package ---")

	// Validate IPs
	ips := []string{"192.168.1.1", "10.0.0.1", "999.999.999.999", "not-an-ip"}
	for _, ip := range ips {
		if serverutil.IsValidIP(ip) {
			fmt.Printf("  ✅ %s — valid\n", ip)
		} else {
			fmt.Printf("  ❌ %s — invalid\n", ip)
		}
	}
	fmt.Println()

	// Validate ports
	ports := []int{80, 443, 8080, 0, -1, 70000}
	for _, port := range ports {
		if serverutil.IsValidPort(port) {
			fmt.Printf("  ✅ Port %d — valid\n", port)
		} else {
			fmt.Printf("  ❌ Port %d — invalid\n", port)
		}
	}
	fmt.Println()

	// Format bytes
	sizes := []int64{500, 2048, 1048576, 1073741824, 5368709120}
	for _, size := range sizes {
		fmt.Printf("  %15d bytes = %s\n", size, serverutil.FormatBytes(size))
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 3: GO MOD CHEAT SHEET
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  GO MOD CHEAT SHEET:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  go mod init <name>      → Initialize a new module")
	fmt.Println("  go mod tidy             → Add missing / remove unused deps")
	fmt.Println("  go get <package>@v1.2.3 → Add a specific dependency version")
	fmt.Println("  go mod vendor           → Copy deps into vendor/ folder")
	fmt.Println("  go list -m all          → List all dependencies")
	fmt.Println("  go mod graph            → Show dependency graph")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 4: TESTING CHEAT SHEET
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  TESTING CHEAT SHEET:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  go test ./...          → Run ALL tests in all packages")
	fmt.Println("  go test -v ./...       → Verbose — see each test name")
	fmt.Println("  go test -cover ./...   → Show code coverage percentage")
	fmt.Println("  go test -run TestAdd   → Run only tests matching 'TestAdd'")
	fmt.Println("  go test -bench .       → Run benchmarks")
	fmt.Println("  go test -race ./...    → Detect race conditions!")
	fmt.Println()
	fmt.Println("  Test file naming:  xxx_test.go (must end with _test.go)")
	fmt.Println("  Test func naming:  TestXxx(t *testing.T)")
	fmt.Println("  Benchmark naming:  BenchmarkXxx(b *testing.B)")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// EXERCISES
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  🏋️ EXERCISES:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  1. Run: go test ./... -v")
	fmt.Println("  2. Run: go test -cover ./...")
	fmt.Println("  3. Add a 'Power(base, exp int) int' function to calculator/")
	fmt.Println("  4. Write tests for your new Power function")
	fmt.Println("  5. Add a 'ParseEndpoint(s string) (host, port, error)' to serverutil/")
	fmt.Println("  6. Write table-driven tests for ParseEndpoint")
	fmt.Println()
	fmt.Println("✅ Module 08 Complete! Move on to 09-rest-api/")
}
