// ============================================================================
// MODULE 03 — CONTROL FLOW
// ============================================================================
//
// 🎯 WHAT YOU'LL LEARN:
//   - if/else statements (with Go's unique twist!)
//   - switch statements (cleaner than if/else chains)
//   - for loops (the ONLY loop in Go!)
//   - break, continue
//   - range keyword for iterating
//
// 🚀 RUN: go run main.go
//
// 🔧 DEVOPS RELEVANCE:
//   Control flow is the backbone of automation scripts, health checks,
//   retry logic, and processing lists of servers/containers.
// ============================================================================

package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println("========================================")
	fmt.Println("  MODULE 03: Control Flow")
	fmt.Println("========================================")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 1: IF / ELSE
	// ─────────────────────────────────────────────────────────────────────
	// Go's if/else is similar to other languages, but with TWO differences:
	//   1. NO parentheses around the condition (mandatory in C/Java)
	//   2. Braces {} are ALWAYS required (even for one-line bodies)

	fmt.Println("--- if/else ---")

	cpuUsage := 85.5

	if cpuUsage > 90 {
		fmt.Println("🔴 CRITICAL: CPU usage is dangerously high!")
	} else if cpuUsage > 70 {
		fmt.Println("🟡 WARNING: CPU usage is elevated!")
	} else {
		fmt.Println("🟢 OK: CPU usage is normal")
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 2: IF WITH INIT STATEMENT (Go's unique feature!)
	// ─────────────────────────────────────────────────────────────────────
	// Go lets you declare a variable IN the if statement!
	// The variable only exists inside the if/else block.
	// This is used EVERYWHERE in Go, especially for error handling.

	fmt.Println("--- if with init statement ---")

	// Simulating checking a server status
	serverStatus := map[string]int{
		"web-01": 200,
		"web-02": 500,
		"db-01":  200,
	}

	// Notice: "status" is declared right in the if!
	if status, exists := serverStatus["web-01"]; exists {
		fmt.Printf("web-01 status: %d\n", status)
	} else {
		fmt.Println("web-01 not found!")
	}

	// "status" doesn't exist out here — it was scoped to the if block
	// fmt.Println(status) // ← This would cause a compile error!
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 3: SWITCH STATEMENTS
	// ─────────────────────────────────────────────────────────────────────
	// Go's switch is MUCH more powerful than C/Java:
	//   - No "break" needed (it's automatic!)
	//   - Cases can be expressions, not just constants
	//   - You can switch without a value (acts like if/else)

	fmt.Println("--- switch ---")

	httpStatus := 404

	switch httpStatus {
	case 200:
		fmt.Println("✅ OK — Request successful")
	case 301:
		fmt.Println("↪️  Moved Permanently")
	case 400:
		fmt.Println("❌ Bad Request")
	case 404:
		fmt.Println("🔍 Not Found")
	case 500:
		fmt.Println("💥 Internal Server Error")
	default:
		fmt.Printf("Unknown status: %d\n", httpStatus)
	}
	fmt.Println()

	// Switch with multiple values per case
	fmt.Println("--- switch with multiple matches ---")
	day := "Saturday"

	switch day {
	case "Monday", "Tuesday", "Wednesday", "Thursday", "Friday":
		fmt.Println("📅 It's a workday — deploy with caution!")
	case "Saturday", "Sunday":
		fmt.Println("🎉 Weekend — maintenance window!")
	}
	fmt.Println()

	// Switch WITHOUT a value (like if/else but cleaner)
	fmt.Println("--- switch without value (conditional switch) ---")
	diskUsage := 78

	switch {
	case diskUsage >= 95:
		fmt.Println("🔴 CRITICAL: Disk almost full! Immediate action needed!")
	case diskUsage >= 80:
		fmt.Println("🟡 WARNING: Disk usage high. Plan cleanup.")
	case diskUsage >= 60:
		fmt.Println("🟢 OK: Disk usage moderate.")
	default:
		fmt.Println("✅ Healthy: Plenty of disk space.")
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 4: FOR LOOPS
	// ─────────────────────────────────────────────────────────────────────
	// Go has ONLY ONE loop keyword: "for"
	// But it can do everything: traditional for, while, infinite, range!

	fmt.Println("--- for loop (traditional C-style) ---")
	// Classic three-part for loop: init; condition; post
	for i := 1; i <= 5; i++ {
		fmt.Printf("  Attempt %d of 5\n", i)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 5: FOR AS A "WHILE" LOOP
	// ─────────────────────────────────────────────────────────────────────
	// Go doesn't have "while" — you just use "for" with only a condition!

	fmt.Println("--- for as while loop ---")
	retries := 0
	maxRetries := 3

	for retries < maxRetries {
		retries++
		fmt.Printf("  Retry attempt %d/%d...\n", retries, maxRetries)
	}
	fmt.Println("  Giving up after max retries!")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 6: INFINITE LOOP + BREAK
	// ─────────────────────────────────────────────────────────────────────
	// "for" with no condition runs forever — use "break" to exit.
	// DevOps use: monitoring loops, server listeners, retry logic

	fmt.Println("--- infinite loop with break ---")
	counter := 0
	for {
		counter++
		if counter > 3 {
			fmt.Println("  Breaking out of infinite loop!")
			break
		}
		fmt.Printf("  Loop iteration %d\n", counter)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 7: CONTINUE (SKIP AN ITERATION)
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- continue (skip iterations) ---")
	fmt.Println("  Printing only odd numbers 1-10:")
	fmt.Print("  ")
	for i := 1; i <= 10; i++ {
		if i%2 == 0 {
			continue // Skip even numbers
		}
		fmt.Printf("%d ", i)
	}
	fmt.Println()
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 8: RANGE — ITERATING OVER COLLECTIONS
	// ─────────────────────────────────────────────────────────────────────
	// "range" is used with for to iterate over slices, maps, strings, etc.
	// It gives you both the INDEX and the VALUE.

	fmt.Println("--- range over a slice ---")
	servers := []string{"web-01", "web-02", "db-01", "cache-01"}

	for index, server := range servers {
		fmt.Printf("  [%d] %s\n", index, server)
	}
	fmt.Println()

	// If you don't need the index, use _ (blank identifier)
	fmt.Println("--- range with _ (ignoring index) ---")
	for _, server := range servers {
		fmt.Printf("  Pinging %s... OK\n", server)
	}
	fmt.Println()

	// Range over a map
	fmt.Println("--- range over a map ---")
	containerPorts := map[string]int{
		"nginx":    80,
		"postgres": 5432,
		"redis":    6379,
		"grafana":  3000,
	}

	for service, port := range containerPorts {
		fmt.Printf("  %s → port %d\n", service, port)
	}
	fmt.Println()

	// Range over a string (gives you rune values)
	fmt.Println("--- range over a string ---")
	fmt.Print("  Characters in 'Go': ")
	for i, char := range "Go!" {
		fmt.Printf("[%d]='%c' ", i, char)
	}
	fmt.Println()
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 9: NESTED LOOPS + LABELS
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- nested loops with labels ---")

	// Labels let you break out of OUTER loops from inside inner loops
	environments := []string{"dev", "staging", "prod"}
	services := []string{"api", "web", "worker"}

	fmt.Println("  Checking all services in all environments:")
outer:
	for _, env := range environments {
		for _, svc := range services {
			if env == "prod" && svc == "worker" {
				fmt.Println("  ⚠️  Skipping prod worker check — breaking out!")
				break outer // Breaks the OUTER loop, not just the inner one
			}
			fmt.Printf("  ✓ %s/%s\n", env, svc)
		}
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// PRACTICAL EXAMPLE: SIMPLE HEALTH CHECK SIMULATOR
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  PRACTICAL: Health Check Simulator")
	fmt.Println("═══════════════════════════════════════")

	healthData := map[string]string{
		"web-01":   "healthy",
		"web-02":   "unhealthy",
		"db-01":    "healthy",
		"cache-01": "degraded",
		"api-01":   "healthy",
	}

	healthyCount := 0
	unhealthyServers := []string{}

	for server, status := range healthData {
		switch status {
		case "healthy":
			healthyCount++
			fmt.Printf("  ✅ %s: %s\n", server, strings.ToUpper(status))
		case "degraded":
			fmt.Printf("  🟡 %s: %s\n", server, strings.ToUpper(status))
		case "unhealthy":
			unhealthyServers = append(unhealthyServers, server)
			fmt.Printf("  🔴 %s: %s\n", server, strings.ToUpper(status))
		}
	}

	fmt.Println()
	fmt.Printf("  Summary: %d/%d servers healthy\n", healthyCount, len(healthData))
	if len(unhealthyServers) > 0 {
		fmt.Printf("  ⚠️  Action needed on: %v\n", unhealthyServers)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// EXERCISES
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  🏋️ EXERCISES:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  1. Write a loop that counts down from 10 to 1, then prints 'Liftoff!'")
	fmt.Println("  2. Create a switch that categorizes HTTP codes (1xx, 2xx, 3xx, 4xx, 5xx)")
	fmt.Println("  3. Use range to iterate a map of container:image pairs and print them")
	fmt.Println("  4. Write a retry loop that simulates 'connecting' and succeeds on attempt 3")
	fmt.Println()
	fmt.Println("✅ Module 03 Complete! Move on to 04-functions/")
}
