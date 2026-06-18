// ============================================================================
// MODULE 07 — CONCURRENCY (Go's Superpower!)
// ============================================================================
//
// 🎯 WHAT YOU'LL LEARN:
//   - Goroutines (lightweight threads — Go's killer feature!)
//   - Channels (how goroutines communicate)
//   - Buffered vs Unbuffered channels
//   - select statement (multiplexing channels)
//   - sync.WaitGroup (waiting for goroutines to finish)
//   - sync.Mutex (preventing race conditions)
//   - Real-world concurrent patterns
//
// 🚀 RUN: go run main.go
//
// 🔧 DEVOPS RELEVANCE:
//   Concurrency is WHY Go dominates DevOps tooling:
//   - Check 100 servers simultaneously (not one by one!)
//   - Process thousands of log lines in parallel
//   - Handle multiple HTTP requests at once
//   - Docker, K8s, Prometheus all use goroutines HEAVILY
// ============================================================================

package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

func main() {
	fmt.Println("========================================")
	fmt.Println("  MODULE 07: Concurrency")
	fmt.Println("========================================")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 1: GOROUTINES
	// ─────────────────────────────────────────────────────────────────────
	// A goroutine is a lightweight thread managed by Go's runtime.
	// Creating one is trivially easy: just add "go" before a function call!
	//
	// They're INCREDIBLY lightweight:
	//   - A goroutine uses ~2KB of stack (a thread uses ~1MB)
	//   - You can run MILLIONS of goroutines on a single machine
	//   - Go's scheduler manages them efficiently across CPU cores

	fmt.Println("--- Goroutines ---")
	fmt.Println("(Notice how output may be INTERLEAVED — that's concurrency!)")
	fmt.Println()

	// Start a goroutine — it runs CONCURRENTLY with main
	go printNumbers("Goroutine-A", 5)
	go printNumbers("Goroutine-B", 5)

	// main keeps running while goroutines execute
	fmt.Println("  Main: goroutines launched!")

	// IMPORTANT: If main() exits, ALL goroutines are killed!
	// We need to wait... (we'll learn better ways soon)
	time.Sleep(600 * time.Millisecond)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 2: sync.WaitGroup (Waiting for Goroutines)
	// ─────────────────────────────────────────────────────────────────────
	// WaitGroup is the proper way to wait for goroutines to finish.
	// Three methods:
	//   Add(n)  → "I'm adding n goroutines to track"
	//   Done()  → "One goroutine finished" (usually deferred)
	//   Wait()  → "Block until all goroutines are done"

	fmt.Println("--- sync.WaitGroup ---")

	var wg sync.WaitGroup

	servers := []string{"web-01", "web-02", "db-01", "cache-01", "api-01"}

	for _, server := range servers {
		wg.Add(1) // Tell WaitGroup: "one more goroutine coming"
		go func(serverName string) {
			defer wg.Done() // Tell WaitGroup: "I'm done" when function returns
			checkServer(serverName)
		}(server)
	}

	wg.Wait() // Block until ALL goroutines call Done()
	fmt.Println("  ✅ All server checks complete!")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 3: CHANNELS (How Goroutines Communicate)
	// ─────────────────────────────────────────────────────────────────────
	// Channels are pipes that connect goroutines.
	// One goroutine sends data, another receives it.
	//
	// Go's philosophy: "Don't communicate by sharing memory;
	//                   share memory by communicating."
	//
	// Syntax:
	//   ch := make(chan Type)  → create a channel
	//   ch <- value            → SEND to channel
	//   value := <-ch          → RECEIVE from channel

	fmt.Println("--- Channels (Unbuffered) ---")

	// Create a channel that carries strings
	messageCh := make(chan string)

	// Send a message from a goroutine
	go func() {
		messageCh <- "Hello from a goroutine!" // SEND
	}()

	// Receive the message in main
	msg := <-messageCh // RECEIVE (blocks until a value is available)
	fmt.Printf("  Received: %s\n", msg)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 4: CHANNEL DIRECTIONS & PATTERNS
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("--- Channel Pattern: Producer/Consumer ---")

	// Create a channel for server health results
	resultCh := make(chan HealthResult)
	var wg2 sync.WaitGroup

	checkServers := []string{"nginx-01", "postgres-01", "redis-01", "grafana-01"}

	// Launch health checks concurrently (producers)
	for _, server := range checkServers {
		wg2.Add(1)
		go func(name string) {
			defer wg2.Done()
			// Simulate health check with random result
			latency := time.Duration(rand.Intn(200)+50) * time.Millisecond
			time.Sleep(latency)
			healthy := rand.Intn(10) > 2 // 70% chance of healthy
			resultCh <- HealthResult{
				Server:  name,
				Healthy: healthy,
				Latency: latency,
			}
		}(server)
	}

	// Close channel when all producers are done
	go func() {
		wg2.Wait()
		close(resultCh)
	}()

	// Consume results (main goroutine)
	for result := range resultCh {
		status := "✅"
		if !result.Healthy {
			status = "❌"
		}
		fmt.Printf("  %s %s — latency: %v\n", status, result.Server, result.Latency)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 5: BUFFERED CHANNELS
	// ─────────────────────────────────────────────────────────────────────
	// Unbuffered channels BLOCK until both sender and receiver are ready.
	// Buffered channels have a capacity — they can hold values without
	// a receiver being ready immediately.
	//
	// make(chan Type, capacity)

	fmt.Println("--- Buffered Channels ---")

	// Buffer of 3 — can hold 3 values without blocking
	logCh := make(chan string, 3)

	// These don't block because the buffer has room
	logCh <- "Starting server..."
	logCh <- "Loading config..."
	logCh <- "Server ready!"

	// A 4th send would block until someone reads!
	// logCh <- "This would block!" // ← Don't do this in main!

	fmt.Printf("  Channel length: %d, capacity: %d\n", len(logCh), cap(logCh))

	// Drain the channel
	for i := 0; i < 3; i++ {
		fmt.Printf("  Log: %s\n", <-logCh)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 6: SELECT STATEMENT
	// ─────────────────────────────────────────────────────────────────────
	// "select" lets you wait on MULTIPLE channels at once.
	// It's like a switch statement, but for channels.
	// Whichever channel is ready first, that case runs.

	fmt.Println("--- select Statement ---")

	ch1 := make(chan string)
	ch2 := make(chan string)

	go func() {
		time.Sleep(100 * time.Millisecond)
		ch1 <- "Response from API"
	}()

	go func() {
		time.Sleep(50 * time.Millisecond)
		ch2 <- "Response from Cache"
	}()

	// Wait for whichever responds first
	select {
	case msg1 := <-ch1:
		fmt.Printf("  Got: %s\n", msg1)
	case msg2 := <-ch2:
		fmt.Printf("  Got: %s (faster!)\n", msg2)
	}
	// Allow the other goroutine to finish
	time.Sleep(100 * time.Millisecond)
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 7: SELECT WITH TIMEOUT
	// ─────────────────────────────────────────────────────────────────────
	// Critical for DevOps: never wait forever! Always have timeouts.

	fmt.Println("--- select with Timeout ---")

	slowCh := make(chan string)

	go func() {
		time.Sleep(2 * time.Second) // Simulates a slow operation
		slowCh <- "Finally done!"
	}()

	select {
	case result := <-slowCh:
		fmt.Printf("  Got result: %s\n", result)
	case <-time.After(500 * time.Millisecond):
		fmt.Println("  ⏰ Timeout! Operation took too long.")
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 8: sync.Mutex (Preventing Race Conditions)
	// ─────────────────────────────────────────────────────────────────────
	// When multiple goroutines access shared data, you need a MUTEX.
	// Mutex = "MUTual EXclusion" — only one goroutine at a time.
	//
	// Without a mutex, you get RACE CONDITIONS — unpredictable bugs
	// that are VERY hard to debug!

	fmt.Println("--- sync.Mutex (Safe Shared Access) ---")

	counter := &SafeCounter{counts: make(map[string]int)}

	var wg3 sync.WaitGroup
	endpoints := []string{"/api/users", "/api/pods", "/api/health", "/api/users", "/api/health"}

	// Simulate 50 concurrent requests hitting different endpoints
	for i := 0; i < 50; i++ {
		wg3.Add(1)
		go func(endpoint string) {
			defer wg3.Done()
			counter.Increment(endpoint)
		}(endpoints[rand.Intn(len(endpoints))])
	}

	wg3.Wait()

	fmt.Println("  Request counts (safely counted!):")
	for endpoint, count := range counter.GetAll() {
		fmt.Printf("    %-15s → %d hits\n", endpoint, count)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 9: PRACTICAL — CONCURRENT PIPELINE
	// ─────────────────────────────────────────────────────────────────────
	// A pipeline chains goroutines through channels:
	// generate → process → output
	// Each stage runs concurrently!

	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  PRACTICAL: Concurrent Pipeline")
	fmt.Println("═══════════════════════════════════════")

	// Stage 1: Generate numbers
	numbers := generateNumbers(1, 10)

	// Stage 2: Square each number (concurrently)
	squared := transformPipeline(numbers, func(n int) int { return n * n })

	// Stage 3: Filter (keep only values > 20)
	filtered := filterPipeline(squared, func(n int) bool { return n > 20 })

	// Stage 4: Consume results
	fmt.Println("  Numbers squared and > 20:")
	for val := range filtered {
		fmt.Printf("    %d\n", val)
	}
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 10: GOROUTINE PATTERNS CHEAT SHEET
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  GOROUTINE PATTERNS CHEAT SHEET:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  1. Fire-and-forget:  go doWork()")
	fmt.Println("  2. Wait for all:     sync.WaitGroup")
	fmt.Println("  3. Get results:      channels")
	fmt.Println("  4. First result:     select with channels")
	fmt.Println("  5. Timeout:          select with time.After()")
	fmt.Println("  6. Shared state:     sync.Mutex")
	fmt.Println("  7. Pipeline:         chain channels between stages")
	fmt.Println("  8. Fan-out/fan-in:   multiple goroutines → one channel")
	fmt.Println("  9. Worker pool:      N goroutines reading from one channel")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// EXERCISES
	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  🏋️ EXERCISES:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  1. Create a worker pool: 3 workers reading jobs from a channel")
	fmt.Println("  2. Use select to race two API calls — return the faster one")
	fmt.Println("  3. Build a pipeline: generate → double → filter even → print")
	fmt.Println("  4. Use Mutex to safely build a concurrent word counter")
	fmt.Println("  5. Implement a timeout wrapper for any function")
	fmt.Println()
	fmt.Println("✅ Module 07 Complete! Move on to 08-packages/")
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPE & FUNCTION DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

// ─── Health check result ─────────────────────────────────────────────────

type HealthResult struct {
	Server  string
	Healthy bool
	Latency time.Duration
}

// ─── Simple goroutine function ───────────────────────────────────────────

func printNumbers(name string, count int) {
	for i := 1; i <= count; i++ {
		fmt.Printf("  %s: %d\n", name, i)
		time.Sleep(100 * time.Millisecond)
	}
}

// ─── Server health check (simulated) ─────────────────────────────────────

func checkServer(name string) {
	// Simulate varying response times
	duration := time.Duration(rand.Intn(300)+100) * time.Millisecond
	time.Sleep(duration)
	fmt.Printf("  📡 %s checked (took %v)\n", name, duration)
}

// ─── Safe counter with Mutex ─────────────────────────────────────────────

type SafeCounter struct {
	mu     sync.Mutex
	counts map[string]int
}

func (c *SafeCounter) Increment(key string) {
	c.mu.Lock()         // Lock — only one goroutine can enter
	defer c.mu.Unlock() // Unlock when function returns
	c.counts[key]++
}

func (c *SafeCounter) GetAll() map[string]int {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Return a copy to be safe
	result := make(map[string]int)
	for k, v := range c.counts {
		result[k] = v
	}
	return result
}

// ─── Pipeline functions ──────────────────────────────────────────────────

func generateNumbers(start, end int) <-chan int {
	out := make(chan int)
	go func() {
		for i := start; i <= end; i++ {
			out <- i
		}
		close(out)
	}()
	return out
}

func transformPipeline(in <-chan int, fn func(int) int) <-chan int {
	out := make(chan int)
	go func() {
		for val := range in {
			out <- fn(val)
		}
		close(out)
	}()
	return out
}

func filterPipeline(in <-chan int, predicate func(int) bool) <-chan int {
	out := make(chan int)
	go func() {
		for val := range in {
			if predicate(val) {
				out <- val
			}
		}
		close(out)
	}()
	return out
}
