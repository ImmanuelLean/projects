// ============================================================================
// MODULE 10 — DEVOPS TOOLING: CLI, Docker, File I/O & System Commands
// ============================================================================
//
// 🎯 WHAT YOU'LL LEARN:
//   - Building CLI tools with flag package
//   - Reading/writing files
//   - Working with JSON and YAML-like configs
//   - Executing system commands (os/exec)
//   - Environment variables
//   - Working with file paths
//   - Dockerfile for Go applications
//
// 🚀 RUN:   go run main.go -help
//           go run main.go -mode=sysinfo
//           go run main.go -mode=files
//           go run main.go -mode=env
//           go run main.go -mode=exec -cmd="go version"
//           go run main.go -mode=config
//
// 🔧 DEVOPS RELEVANCE:
//   This is what DevOps engineers DO with Go daily:
//   - Write CLI tools for automation
//   - Process config files (YAML, JSON, TOML)
//   - Execute system commands
//   - Gather system information
//   - Build Docker images for Go services
// ============================================================================

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

// ═══════════════════════════════════════════════════════════════════════════
// CONFIG STRUCTURES
// ═══════════════════════════════════════════════════════════════════════════

// AppConfig represents a typical DevOps application configuration
type AppConfig struct {
	App      AppSettings      `json:"app"`
	Server   ServerSettings   `json:"server"`
	Database DatabaseSettings `json:"database"`
	Logging  LoggingSettings  `json:"logging"`
}

type AppSettings struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	Environment string `json:"environment"`
}

type ServerSettings struct {
	Host         string `json:"host"`
	Port         int    `json:"port"`
	ReadTimeout  string `json:"read_timeout"`
	WriteTimeout string `json:"write_timeout"`
}

type DatabaseSettings struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Name     string `json:"name"`
	User     string `json:"user"`
	Password string `json:"password"`
	SSLMode  string `json:"ssl_mode"`
}

type LoggingSettings struct {
	Level  string `json:"level"`
	Format string `json:"format"`
	Output string `json:"output"`
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN — CLI WITH FLAG PACKAGE
// ═══════════════════════════════════════════════════════════════════════════

func main() {
	fmt.Println("========================================")
	fmt.Println("  MODULE 10: DevOps Tooling")
	fmt.Println("========================================")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────────
	// CONCEPT 1: CLI FLAGS
	// ─────────────────────────────────────────────────────────────────────
	// The "flag" package provides command-line argument parsing.
	// This is how tools like kubectl, docker, terraform parse arguments.
	//
	// flag.String(name, default, usage) → returns *string
	// flag.Int(name, default, usage)    → returns *int
	// flag.Bool(name, default, usage)   → returns *bool

	mode := flag.String("mode", "all", "Mode to run: sysinfo|files|env|exec|config|all")
	cmd := flag.String("cmd", "", "Command to execute (used with -mode=exec)")
	verbose := flag.Bool("verbose", false, "Enable verbose output")

	// Parse the command-line flags
	flag.Parse()

	if *verbose {
		fmt.Println("🔍 Verbose mode enabled")
		fmt.Println()
	}

	// ─── Route to the appropriate demo ───────────────────────────────
	switch *mode {
	case "sysinfo":
		demoSystemInfo()
	case "files":
		demoFileOperations()
	case "env":
		demoEnvironmentVariables()
	case "exec":
		demoExecCommand(*cmd)
	case "config":
		demoConfigFiles()
	case "all":
		demoSystemInfo()
		demoFileOperations()
		demoEnvironmentVariables()
		demoExecCommand("go version")
		demoConfigFiles()
		demoBuildInfo()
	default:
		fmt.Printf("Unknown mode: %s\n", *mode)
		fmt.Println("Valid modes: sysinfo, files, env, exec, config, all")
		os.Exit(1)
	}
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

// ─── System Information ──────────────────────────────────────────────────

func demoSystemInfo() {
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  SYSTEM INFORMATION")
	fmt.Println("═══════════════════════════════════════")

	fmt.Printf("  OS:          %s\n", runtime.GOOS)
	fmt.Printf("  Architecture: %s\n", runtime.GOARCH)
	fmt.Printf("  CPUs:        %d\n", runtime.NumCPU())
	fmt.Printf("  Goroutines:  %d\n", runtime.NumGoroutine())
	fmt.Printf("  Go Version:  %s\n", runtime.Version())

	hostname, err := os.Hostname()
	if err == nil {
		fmt.Printf("  Hostname:    %s\n", hostname)
	}

	cwd, err := os.Getwd()
	if err == nil {
		fmt.Printf("  Working Dir: %s\n", cwd)
	}

	homeDir, err := os.UserHomeDir()
	if err == nil {
		fmt.Printf("  Home Dir:    %s\n", homeDir)
	}

	fmt.Printf("  PID:         %d\n", os.Getpid())
	fmt.Println()
}

// ─── File Operations ─────────────────────────────────────────────────────

func demoFileOperations() {
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  FILE OPERATIONS")
	fmt.Println("═══════════════════════════════════════")

	// Create a temporary directory for our demos
	tmpDir := filepath.Join(os.TempDir(), "go-lessons-demo")
	os.MkdirAll(tmpDir, 0755)
	fmt.Printf("  📁 Created temp dir: %s\n", tmpDir)

	// ─── WRITING FILES ───────────────────────────────────────────────
	fmt.Println("\n  --- Writing Files ---")

	// Method 1: os.WriteFile (simplest — for small files)
	filePath := filepath.Join(tmpDir, "servers.txt")
	content := "web-01 10.0.1.1 80 running\nweb-02 10.0.1.2 80 running\ndb-01 10.0.2.1 5432 stopped\n"

	err := os.WriteFile(filePath, []byte(content), 0644)
	if err != nil {
		fmt.Printf("  ❌ Error writing file: %s\n", err)
		return
	}
	fmt.Printf("  ✅ Wrote %s\n", filePath)

	// Method 2: os.Create + Write (for more control)
	logPath := filepath.Join(tmpDir, "deploy.log")
	logFile, err := os.Create(logPath)
	if err != nil {
		fmt.Printf("  ❌ Error creating file: %s\n", err)
		return
	}
	defer logFile.Close()

	logEntries := []string{
		fmt.Sprintf("[%s] INFO: Deployment started", time.Now().Format("2006-01-02 15:04:05")),
		fmt.Sprintf("[%s] INFO: Building image...", time.Now().Format("2006-01-02 15:04:05")),
		fmt.Sprintf("[%s] INFO: Pushing to registry...", time.Now().Format("2006-01-02 15:04:05")),
		fmt.Sprintf("[%s] INFO: Deployment complete!", time.Now().Format("2006-01-02 15:04:05")),
	}

	for _, entry := range logEntries {
		fmt.Fprintln(logFile, entry)
	}
	fmt.Printf("  ✅ Wrote %s\n", logPath)

	// ─── READING FILES ───────────────────────────────────────────────
	fmt.Println("\n  --- Reading Files ---")

	// Method 1: os.ReadFile (simplest — reads entire file into memory)
	data, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Printf("  ❌ Error reading file: %s\n", err)
		return
	}
	fmt.Printf("  📖 Contents of servers.txt:\n")
	for i, line := range strings.Split(strings.TrimSpace(string(data)), "\n") {
		fmt.Printf("     Line %d: %s\n", i+1, line)
	}

	// ─── FILE INFO ───────────────────────────────────────────────────
	fmt.Println("\n  --- File Info ---")

	info, err := os.Stat(filePath)
	if err == nil {
		fmt.Printf("  Name:     %s\n", info.Name())
		fmt.Printf("  Size:     %d bytes\n", info.Size())
		fmt.Printf("  Mode:     %s\n", info.Mode())
		fmt.Printf("  Modified: %s\n", info.ModTime().Format("2006-01-02 15:04:05"))
		fmt.Printf("  Is Dir:   %t\n", info.IsDir())
	}

	// ─── CHECK IF FILE/DIR EXISTS ────────────────────────────────────
	fmt.Println("\n  --- Checking Existence ---")

	checkPaths := []string{filePath, filepath.Join(tmpDir, "nonexistent.txt"), tmpDir}
	for _, p := range checkPaths {
		if _, err := os.Stat(p); os.IsNotExist(err) {
			fmt.Printf("  ❌ Does not exist: %s\n", filepath.Base(p))
		} else {
			fmt.Printf("  ✅ Exists: %s\n", filepath.Base(p))
		}
	}

	// ─── LISTING DIRECTORY CONTENTS ──────────────────────────────────
	fmt.Println("\n  --- Directory Listing ---")

	entries, err := os.ReadDir(tmpDir)
	if err == nil {
		for _, entry := range entries {
			fileType := "📄"
			if entry.IsDir() {
				fileType = "📁"
			}
			info, _ := entry.Info()
			fmt.Printf("  %s %-20s %d bytes\n", fileType, entry.Name(), info.Size())
		}
	}

	// Cleanup
	os.RemoveAll(tmpDir)
	fmt.Printf("\n  🗑️  Cleaned up temp dir: %s\n", tmpDir)
	fmt.Println()
}

// ─── Environment Variables ───────────────────────────────────────────────

func demoEnvironmentVariables() {
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  ENVIRONMENT VARIABLES")
	fmt.Println("═══════════════════════════════════════")

	// ─── Reading env vars ────────────────────────────────────────────
	fmt.Println("  --- Reading Environment Variables ---")

	// os.Getenv returns empty string if not set
	path := os.Getenv("PATH")
	fmt.Printf("  PATH (first 80 chars): %.80s...\n", path)

	goPath := os.Getenv("GOPATH")
	fmt.Printf("  GOPATH: %s\n", goPath)

	// Use os.LookupEnv to check if a var EXISTS (vs just being empty)
	if val, exists := os.LookupEnv("HOME"); exists {
		fmt.Printf("  HOME: %s\n", val)
	} else if val, exists := os.LookupEnv("USERPROFILE"); exists {
		fmt.Printf("  USERPROFILE: %s\n", val)
	}

	// ─── Setting env vars ────────────────────────────────────────────
	fmt.Println("\n  --- Setting Environment Variables ---")

	os.Setenv("MY_APP_ENV", "production")
	os.Setenv("MY_APP_PORT", "8080")
	os.Setenv("MY_APP_DEBUG", "false")

	fmt.Printf("  MY_APP_ENV:   %s\n", os.Getenv("MY_APP_ENV"))
	fmt.Printf("  MY_APP_PORT:  %s\n", os.Getenv("MY_APP_PORT"))
	fmt.Printf("  MY_APP_DEBUG: %s\n", os.Getenv("MY_APP_DEBUG"))

	// ─── Helper function: GetEnvOrDefault ────────────────────────────
	fmt.Println("\n  --- GetEnvOrDefault Pattern ---")

	dbHost := getEnvOrDefault("DB_HOST", "localhost")
	dbPort := getEnvOrDefault("DB_PORT", "5432")
	logLevel := getEnvOrDefault("LOG_LEVEL", "info")

	fmt.Printf("  DB_HOST:    %s (from default)\n", dbHost)
	fmt.Printf("  DB_PORT:    %s (from default)\n", dbPort)
	fmt.Printf("  LOG_LEVEL:  %s (from default)\n", logLevel)

	// ─── Listing all env vars with a prefix ──────────────────────────
	fmt.Println("\n  --- All MY_APP_* Variables ---")
	for _, env := range os.Environ() {
		if strings.HasPrefix(env, "MY_APP_") {
			parts := strings.SplitN(env, "=", 2)
			fmt.Printf("  %s = %s\n", parts[0], parts[1])
		}
	}

	// Cleanup
	os.Unsetenv("MY_APP_ENV")
	os.Unsetenv("MY_APP_PORT")
	os.Unsetenv("MY_APP_DEBUG")
	fmt.Println()
}

// ─── Executing System Commands ───────────────────────────────────────────

func demoExecCommand(cmdStr string) {
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  EXECUTING SYSTEM COMMANDS")
	fmt.Println("═══════════════════════════════════════")

	if cmdStr == "" {
		cmdStr = "go version"
	}

	// ─── Simple command execution ────────────────────────────────────
	fmt.Println("  --- Running Commands ---")

	// Method 1: exec.Command with Output()
	// Captures stdout, returns it as bytes
	fmt.Printf("  Running: %s\n", cmdStr)

	parts := strings.Fields(cmdStr)
	cmd := exec.Command(parts[0], parts[1:]...)
	output, err := cmd.Output()
	if err != nil {
		fmt.Printf("  ❌ Error: %s\n", err)
	} else {
		fmt.Printf("  📤 Output: %s\n", strings.TrimSpace(string(output)))
	}

	// Method 2: CombinedOutput (captures stdout AND stderr)
	fmt.Println("\n  --- Combined Output ---")
	cmd2 := exec.Command("go", "env", "GOPATH")
	combined, err := cmd2.CombinedOutput()
	if err != nil {
		fmt.Printf("  ❌ Error: %s\n", err)
	} else {
		fmt.Printf("  📤 GOPATH: %s\n", strings.TrimSpace(string(combined)))
	}

	// ─── Check if a command exists ───────────────────────────────────
	fmt.Println("\n  --- Checking Command Availability ---")
	commands := []string{"go", "docker", "kubectl", "terraform", "git"}
	for _, c := range commands {
		if path, err := exec.LookPath(c); err == nil {
			fmt.Printf("  ✅ %-12s → %s\n", c, path)
		} else {
			fmt.Printf("  ❌ %-12s → not found\n", c)
		}
	}

	fmt.Println()
}

// ─── Configuration File Handling ─────────────────────────────────────────

func demoConfigFiles() {
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  CONFIGURATION FILES (JSON)")
	fmt.Println("═══════════════════════════════════════")

	// ─── Create a config struct ──────────────────────────────────────
	config := AppConfig{
		App: AppSettings{
			Name:        "go-devops-api",
			Version:     "1.0.0",
			Environment: "production",
		},
		Server: ServerSettings{
			Host:         "0.0.0.0",
			Port:         8080,
			ReadTimeout:  "15s",
			WriteTimeout: "15s",
		},
		Database: DatabaseSettings{
			Host:     "db.example.com",
			Port:     5432,
			Name:     "myapp",
			User:     "admin",
			Password: "***REDACTED***",
			SSLMode:  "require",
		},
		Logging: LoggingSettings{
			Level:  "info",
			Format: "json",
			Output: "stdout",
		},
	}

	// ─── Write config to JSON file ───────────────────────────────────
	fmt.Println("  --- Writing Config ---")

	tmpDir := filepath.Join(os.TempDir(), "go-lessons-config")
	os.MkdirAll(tmpDir, 0755)
	configPath := filepath.Join(tmpDir, "config.json")

	// json.MarshalIndent for pretty-printed JSON
	jsonData, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		fmt.Printf("  ❌ Error marshaling JSON: %s\n", err)
		return
	}

	err = os.WriteFile(configPath, jsonData, 0644)
	if err != nil {
		fmt.Printf("  ❌ Error writing config: %s\n", err)
		return
	}
	fmt.Printf("  ✅ Config written to: %s\n\n", configPath)

	// ─── Read config from JSON file ──────────────────────────────────
	fmt.Println("  --- Reading Config ---")

	data, err := os.ReadFile(configPath)
	if err != nil {
		fmt.Printf("  ❌ Error reading config: %s\n", err)
		return
	}

	var loadedConfig AppConfig
	err = json.Unmarshal(data, &loadedConfig)
	if err != nil {
		fmt.Printf("  ❌ Error parsing config: %s\n", err)
		return
	}

	fmt.Printf("  App:    %s v%s (%s)\n",
		loadedConfig.App.Name, loadedConfig.App.Version, loadedConfig.App.Environment)
	fmt.Printf("  Server: %s:%d\n",
		loadedConfig.Server.Host, loadedConfig.Server.Port)
	fmt.Printf("  DB:     %s@%s:%d/%s (SSL: %s)\n",
		loadedConfig.Database.User, loadedConfig.Database.Host,
		loadedConfig.Database.Port, loadedConfig.Database.Name,
		loadedConfig.Database.SSLMode)
	fmt.Printf("  Log:    level=%s format=%s output=%s\n",
		loadedConfig.Logging.Level, loadedConfig.Logging.Format,
		loadedConfig.Logging.Output)

	// ─── Config with env var overrides ───────────────────────────────
	fmt.Println("\n  --- Config Override Pattern ---")
	fmt.Println("  (This is how 12-factor apps work!)")

	effectivePort := loadedConfig.Server.Port
	if envPort := os.Getenv("PORT"); envPort != "" {
		fmt.Printf("  PORT env var found: %s — overriding config!\n", envPort)
	} else {
		fmt.Printf("  Using config port: %d\n", effectivePort)
	}

	// Cleanup
	os.RemoveAll(tmpDir)
	fmt.Println()
}

// ─── Build/Deploy Info ───────────────────────────────────────────────────

func demoBuildInfo() {
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  DOCKERFILE & BUILD INFO")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println()
	fmt.Println("  A Dockerfile for Go apps (multi-stage build):")
	fmt.Println("  ┌─────────────────────────────────────────────────┐")
	fmt.Println("  │ # Stage 1: Build                                │")
	fmt.Println("  │ FROM golang:1.26-alpine AS builder               │")
	fmt.Println("  │ WORKDIR /app                                     │")
	fmt.Println("  │ COPY go.mod go.sum ./                            │")
	fmt.Println("  │ RUN go mod download                              │")
	fmt.Println("  │ COPY . .                                         │")
	fmt.Println("  │ RUN CGO_ENABLED=0 go build -o /app/server .      │")
	fmt.Println("  │                                                   │")
	fmt.Println("  │ # Stage 2: Run (tiny final image!)               │")
	fmt.Println("  │ FROM alpine:latest                                │")
	fmt.Println("  │ RUN apk --no-cache add ca-certificates           │")
	fmt.Println("  │ COPY --from=builder /app/server /server           │")
	fmt.Println("  │ EXPOSE 8080                                       │")
	fmt.Println("  │ CMD [\"/server\"]                                  │")
	fmt.Println("  └─────────────────────────────────────────────────┘")
	fmt.Println()
	fmt.Println("  Key Docker commands:")
	fmt.Println("    docker build -t my-go-app .")
	fmt.Println("    docker run -p 8080:8080 my-go-app")
	fmt.Println("    docker run -e PORT=9090 my-go-app")
	fmt.Println()
	fmt.Println("  Cross-compilation (build Linux binary from Windows):")
	fmt.Println("    set GOOS=linux")
	fmt.Println("    set GOARCH=amd64")
	fmt.Println("    go build -o myapp-linux .")
	fmt.Println()
	fmt.Println("  Makefile targets commonly used:")
	fmt.Println("  ┌─────────────────────────────────────────────────┐")
	fmt.Println("  │ build:    go build -o bin/app .                  │")
	fmt.Println("  │ test:     go test -v -cover ./...                │")
	fmt.Println("  │ lint:     golangci-lint run                      │")
	fmt.Println("  │ docker:   docker build -t app .                  │")
	fmt.Println("  │ clean:    rm -rf bin/                            │")
	fmt.Println("  │ run:      go run .                               │")
	fmt.Println("  └─────────────────────────────────────────────────┘")
	fmt.Println()

	// ─────────────────────────────────────────────────────────────────
	// FINAL EXERCISES
	// ─────────────────────────────────────────────────────────────────
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  🏋️ FINAL EXERCISES:")
	fmt.Println("═══════════════════════════════════════")
	fmt.Println("  1. Add a -output flag that writes results to a file")
	fmt.Println("  2. Write a 'disk usage checker' CLI that warns when usage > 80%")
	fmt.Println("  3. Create a config loader that merges file + env vars")
	fmt.Println("  4. Build a simple 'server pinger' that pings a list of hosts")
	fmt.Println("  5. Write a Dockerfile for the Module 09 REST API")
	fmt.Println("  6. Create a Makefile with build/test/docker/clean targets")
	fmt.Println()
	fmt.Println("🎓 ═══════════════════════════════════════════════════")
	fmt.Println("  🎉 CONGRATULATIONS! YOU'VE COMPLETED ALL 10 MODULES!")
	fmt.Println("  🎓 ═══════════════════════════════════════════════════")
	fmt.Println()
	fmt.Println("  You now understand:")
	fmt.Println("    ✅ Go syntax, types, and control flow")
	fmt.Println("    ✅ Functions, error handling, and defer")
	fmt.Println("    ✅ Data structures (slices, maps, structs)")
	fmt.Println("    ✅ Interfaces and composition")
	fmt.Println("    ✅ Concurrency with goroutines and channels")
	fmt.Println("    ✅ Packages, modules, and testing")
	fmt.Println("    ✅ Building REST APIs")
	fmt.Println("    ✅ CLI tools, file I/O, and system commands")
	fmt.Println("    ✅ Docker and deployment patterns")
	fmt.Println()
	fmt.Println("  🚀 NEXT STEPS FOR DEVOPS:")
	fmt.Println("    1. Build a real monitoring tool with Prometheus client")
	fmt.Println("    2. Learn the Cobra library for advanced CLIs")
	fmt.Println("    3. Study the Kubernetes Go client (client-go)")
	fmt.Println("    4. Build a CI/CD pipeline for your Go apps")
	fmt.Println("    5. Explore Terraform provider development in Go")
	fmt.Println()
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

// getEnvOrDefault returns the env var value, or a default if not set.
// This is a VERY common pattern in DevOps Go applications!
func getEnvOrDefault(key, defaultValue string) string {
	if val, exists := os.LookupEnv(key); exists {
		return val
	}
	return defaultValue
}
