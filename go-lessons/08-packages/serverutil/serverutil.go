// Package serverutil provides utility functions for DevOps server management.
// This demonstrates a practical, DevOps-focused Go package.
package serverutil

import (
	"fmt"
	"strconv"
	"strings"
)

// ─── IP Validation ──────────────────────────────────────────────────────

// IsValidIP checks if a string is a valid IPv4 address.
func IsValidIP(ip string) bool {
	parts := strings.Split(ip, ".")
	if len(parts) != 4 {
		return false
	}
	for _, part := range parts {
		num, err := strconv.Atoi(part)
		if err != nil {
			return false
		}
		if num < 0 || num > 255 {
			return false
		}
	}
	return true
}

// ─── Port Validation ────────────────────────────────────────────────────

// IsValidPort checks if a port number is in the valid range (1-65535).
func IsValidPort(port int) bool {
	return port >= 1 && port <= 65535
}

// ─── Byte Formatting ────────────────────────────────────────────────────

// FormatBytes converts a byte count to a human-readable string.
// Example: 1048576 → "1.00 MB"
func FormatBytes(bytes int64) string {
	const (
		KB = 1024
		MB = KB * 1024
		GB = MB * 1024
		TB = GB * 1024
	)

	switch {
	case bytes >= TB:
		return fmt.Sprintf("%.2f TB", float64(bytes)/float64(TB))
	case bytes >= GB:
		return fmt.Sprintf("%.2f GB", float64(bytes)/float64(GB))
	case bytes >= MB:
		return fmt.Sprintf("%.2f MB", float64(bytes)/float64(MB))
	case bytes >= KB:
		return fmt.Sprintf("%.2f KB", float64(bytes)/float64(KB))
	default:
		return fmt.Sprintf("%d B", bytes)
	}
}

// ─── Endpoint Parsing ───────────────────────────────────────────────────

// ServerEndpoint represents a parsed server endpoint.
type ServerEndpoint struct {
	Host string
	Port int
}

// ParseEndpoint parses a "host:port" string into a ServerEndpoint.
func ParseEndpoint(endpoint string) (ServerEndpoint, error) {
	parts := strings.SplitN(endpoint, ":", 2)
	if len(parts) != 2 {
		return ServerEndpoint{}, fmt.Errorf("invalid endpoint format: %q (expected host:port)", endpoint)
	}

	host := strings.TrimSpace(parts[0])
	if host == "" {
		return ServerEndpoint{}, fmt.Errorf("empty host in endpoint: %q", endpoint)
	}

	port, err := strconv.Atoi(strings.TrimSpace(parts[1]))
	if err != nil {
		return ServerEndpoint{}, fmt.Errorf("invalid port in endpoint %q: %s", endpoint, err)
	}

	if !IsValidPort(port) {
		return ServerEndpoint{}, fmt.Errorf("port out of range in endpoint %q: %d", endpoint, port)
	}

	return ServerEndpoint{Host: host, Port: port}, nil
}

// String returns a formatted endpoint string.
func (e ServerEndpoint) String() string {
	return fmt.Sprintf("%s:%d", e.Host, e.Port)
}

// ─── Server Status ──────────────────────────────────────────────────────

// StatusLevel represents the severity of a server status.
type StatusLevel int

const (
	StatusHealthy  StatusLevel = iota // 0
	StatusDegraded                     // 1
	StatusCritical                     // 2
	StatusDown                         // 3
)

// String returns a human-readable status level.
func (s StatusLevel) String() string {
	switch s {
	case StatusHealthy:
		return "HEALTHY"
	case StatusDegraded:
		return "DEGRADED"
	case StatusCritical:
		return "CRITICAL"
	case StatusDown:
		return "DOWN"
	default:
		return "UNKNOWN"
	}
}

// ClassifyCPU returns a StatusLevel based on CPU usage percentage.
func ClassifyCPU(usage float64) StatusLevel {
	switch {
	case usage >= 95:
		return StatusDown
	case usage >= 85:
		return StatusCritical
	case usage >= 70:
		return StatusDegraded
	default:
		return StatusHealthy
	}
}
