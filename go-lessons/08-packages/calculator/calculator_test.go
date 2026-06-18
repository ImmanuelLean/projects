// ============================================================================
// CALCULATOR TESTS
// ============================================================================
//
// 🎯 THIS FILE TEACHES:
//   - How to write Go unit tests
//   - Table-driven tests (Go's preferred pattern)
//   - Subtests with t.Run()
//   - Test helpers
//   - Benchmarks
//
// 🧪 RUN TESTS: go test -v
// 📊 COVERAGE:  go test -cover
// 🏎️ BENCHMARK: go test -bench .
//
// RULES:
//   1. Test files MUST end with _test.go
//   2. Test functions MUST start with "Test" and take *testing.T
//   3. Test files are NEVER compiled into the final binary
// ============================================================================

package calculator

import (
	"testing"
)

// ─── BASIC TEST ──────────────────────────────────────────────────────────
// The simplest form of a Go test.

func TestAdd(t *testing.T) {
	result := Add(2, 3)
	expected := 5

	if result != expected {
		// t.Errorf reports a failure but continues running other tests
		t.Errorf("Add(2, 3) = %d; want %d", result, expected)
	}
}

func TestSubtract(t *testing.T) {
	result := Subtract(10, 3)
	expected := 7

	if result != expected {
		t.Errorf("Subtract(10, 3) = %d; want %d", result, expected)
	}
}

// ─── TABLE-DRIVEN TESTS ─────────────────────────────────────────────────
// This is THE Go testing pattern. You define test cases in a table (slice
// of structs), then loop through them. Benefits:
//   - Easy to add new test cases
//   - Consistent structure
//   - Covers edge cases systematically

func TestMultiply(t *testing.T) {
	// Define test cases as a "table"
	tests := []struct {
		name     string // Name for the subtest
		a, b     int    // Inputs
		expected int    // Expected output
	}{
		{"positive numbers", 3, 4, 12},
		{"with zero", 5, 0, 0},
		{"negative numbers", -3, -4, 12},
		{"mixed signs", -3, 4, -12},
		{"identity", 7, 1, 7},
		{"large numbers", 1000, 1000, 1000000},
	}

	for _, tt := range tests {
		// t.Run creates a SUBTEST with its own name
		// You can run specific subtests: go test -run TestMultiply/with_zero
		t.Run(tt.name, func(t *testing.T) {
			result := Multiply(tt.a, tt.b)
			if result != tt.expected {
				t.Errorf("Multiply(%d, %d) = %d; want %d",
					tt.a, tt.b, result, tt.expected)
			}
		})
	}
}

// ─── TESTING ERROR RETURNS ──────────────────────────────────────────────

func TestDivide(t *testing.T) {
	tests := []struct {
		name      string
		a, b      float64
		expected  float64
		expectErr bool
	}{
		{"normal division", 10, 3, 3.3333333333333335, false},
		{"exact division", 10, 2, 5.0, false},
		{"divide by zero", 10, 0, 0, true},
		{"negative division", -10, 2, -5.0, false},
		{"zero numerator", 0, 5, 0, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := Divide(tt.a, tt.b)

			// Check error expectation
			if tt.expectErr && err == nil {
				t.Errorf("Divide(%.1f, %.1f) expected error, got nil", tt.a, tt.b)
				return
			}
			if !tt.expectErr && err != nil {
				t.Errorf("Divide(%.1f, %.1f) unexpected error: %s", tt.a, tt.b, err)
				return
			}

			// Check result (only if no error expected)
			if !tt.expectErr && result != tt.expected {
				t.Errorf("Divide(%.1f, %.1f) = %f; want %f",
					tt.a, tt.b, result, tt.expected)
			}
		})
	}
}

// ─── TESTING AVERAGE ────────────────────────────────────────────────────

func TestAverage(t *testing.T) {
	tests := []struct {
		name      string
		input     []float64
		expected  float64
		expectErr bool
	}{
		{"normal case", []float64{10, 20, 30}, 20.0, false},
		{"single element", []float64{42}, 42.0, false},
		{"empty slice", []float64{}, 0, true},
		{"with negatives", []float64{-10, 10}, 0, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := Average(tt.input)

			if tt.expectErr && err == nil {
				t.Error("Expected error, got nil")
				return
			}
			if !tt.expectErr && err != nil {
				t.Errorf("Unexpected error: %s", err)
				return
			}
			if !tt.expectErr && result != tt.expected {
				t.Errorf("Average(%v) = %f; want %f", tt.input, result, tt.expected)
			}
		})
	}
}

// ─── TEST HELPERS ────────────────────────────────────────────────────────

func TestMinMax(t *testing.T) {
	t.Run("Max", func(t *testing.T) {
		assertEqual(t, Max(5, 3), 5)
		assertEqual(t, Max(3, 5), 5)
		assertEqual(t, Max(5, 5), 5)
		assertEqual(t, Max(-1, -5), -1)
	})

	t.Run("Min", func(t *testing.T) {
		assertEqual(t, Min(5, 3), 3)
		assertEqual(t, Min(3, 5), 3)
		assertEqual(t, Min(5, 5), 5)
		assertEqual(t, Min(-1, -5), -5)
	})
}

// Helper function — note the lowercase name (unexported)
// t.Helper() marks this as a helper, so test failures show
// the CALLER's line number, not this function's line number
func assertEqual(t *testing.T, got, want int) {
	t.Helper()
	if got != want {
		t.Errorf("got %d; want %d", got, want)
	}
}

// ─── TEST UNEXPORTED FUNCTIONS ──────────────────────────────────────────
// Tests in the SAME package can access unexported (private) functions!

func TestIsPositive(t *testing.T) {
	if !isPositive(5) {
		t.Error("isPositive(5) should be true")
	}
	if isPositive(-1) {
		t.Error("isPositive(-1) should be false")
	}
	if isPositive(0) {
		t.Error("isPositive(0) should be false")
	}
}

// ─── BENCHMARK ──────────────────────────────────────────────────────────
// Benchmarks measure performance. Run with: go test -bench .
// Go runs the function b.N times and reports time per operation.

func BenchmarkAdd(b *testing.B) {
	for i := 0; i < b.N; i++ {
		Add(42, 58)
	}
}

func BenchmarkMultiply(b *testing.B) {
	for i := 0; i < b.N; i++ {
		Multiply(42, 58)
	}
}

func BenchmarkDivide(b *testing.B) {
	for i := 0; i < b.N; i++ {
		Divide(42, 58)
	}
}
