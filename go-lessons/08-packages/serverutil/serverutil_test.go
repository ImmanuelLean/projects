package serverutil

import (
	"testing"
)

// ─── IP Validation Tests ─────────────────────────────────────────────────

func TestIsValidIP(t *testing.T) {
	tests := []struct {
		name     string
		ip       string
		expected bool
	}{
		{"valid localhost", "127.0.0.1", true},
		{"valid private", "192.168.1.1", true},
		{"valid class A", "10.0.0.1", true},
		{"all zeros", "0.0.0.0", true},
		{"max values", "255.255.255.255", true},
		{"too many octets", "1.2.3.4.5", false},
		{"too few octets", "1.2.3", false},
		{"out of range", "256.1.1.1", false},
		{"negative", "-1.0.0.0", false},
		{"not a number", "abc.def.ghi.jkl", false},
		{"empty string", "", false},
		{"single number", "12345", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := IsValidIP(tt.ip)
			if result != tt.expected {
				t.Errorf("IsValidIP(%q) = %v; want %v", tt.ip, result, tt.expected)
			}
		})
	}
}

// ─── Port Validation Tests ──────────────────────────────────────────────

func TestIsValidPort(t *testing.T) {
	tests := []struct {
		name     string
		port     int
		expected bool
	}{
		{"HTTP", 80, true},
		{"HTTPS", 443, true},
		{"SSH", 22, true},
		{"min valid", 1, true},
		{"max valid", 65535, true},
		{"zero", 0, false},
		{"negative", -1, false},
		{"too large", 65536, false},
		{"way too large", 100000, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := IsValidPort(tt.port)
			if result != tt.expected {
				t.Errorf("IsValidPort(%d) = %v; want %v", tt.port, result, tt.expected)
			}
		})
	}
}

// ─── Byte Formatting Tests ──────────────────────────────────────────────

func TestFormatBytes(t *testing.T) {
	tests := []struct {
		name     string
		bytes    int64
		expected string
	}{
		{"zero bytes", 0, "0 B"},
		{"small bytes", 500, "500 B"},
		{"one KB", 1024, "1.00 KB"},
		{"one MB", 1048576, "1.00 MB"},
		{"one GB", 1073741824, "1.00 GB"},
		{"five GB", 5368709120, "5.00 GB"},
		{"one TB", 1099511627776, "1.00 TB"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := FormatBytes(tt.bytes)
			if result != tt.expected {
				t.Errorf("FormatBytes(%d) = %q; want %q", tt.bytes, result, tt.expected)
			}
		})
	}
}

// ─── Endpoint Parsing Tests ─────────────────────────────────────────────

func TestParseEndpoint(t *testing.T) {
	tests := []struct {
		name      string
		input     string
		wantHost  string
		wantPort  int
		expectErr bool
	}{
		{"valid HTTP", "localhost:8080", "localhost", 8080, false},
		{"valid IP", "10.0.0.1:443", "10.0.0.1", 443, false},
		{"valid hostname", "db.example.com:5432", "db.example.com", 5432, false},
		{"no port", "localhost", "", 0, true},
		{"empty host", ":8080", "", 0, true},
		{"invalid port", "localhost:abc", "", 0, true},
		{"port out of range", "localhost:70000", "", 0, true},
		{"empty string", "", "", 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := ParseEndpoint(tt.input)

			if tt.expectErr {
				if err == nil {
					t.Errorf("ParseEndpoint(%q) expected error, got nil", tt.input)
				}
				return
			}

			if err != nil {
				t.Errorf("ParseEndpoint(%q) unexpected error: %s", tt.input, err)
				return
			}

			if result.Host != tt.wantHost {
				t.Errorf("ParseEndpoint(%q).Host = %q; want %q", tt.input, result.Host, tt.wantHost)
			}
			if result.Port != tt.wantPort {
				t.Errorf("ParseEndpoint(%q).Port = %d; want %d", tt.input, result.Port, tt.wantPort)
			}
		})
	}
}

// ─── CPU Classification Tests ───────────────────────────────────────────

func TestClassifyCPU(t *testing.T) {
	tests := []struct {
		name     string
		usage    float64
		expected StatusLevel
	}{
		{"low usage", 25.0, StatusHealthy},
		{"moderate", 69.9, StatusHealthy},
		{"elevated", 70.0, StatusDegraded},
		{"high", 84.9, StatusDegraded},
		{"critical", 85.0, StatusCritical},
		{"very high", 94.9, StatusCritical},
		{"down", 95.0, StatusDown},
		{"maxed out", 100.0, StatusDown},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := ClassifyCPU(tt.usage)
			if result != tt.expected {
				t.Errorf("ClassifyCPU(%.1f) = %s; want %s",
					tt.usage, result, tt.expected)
			}
		})
	}
}
