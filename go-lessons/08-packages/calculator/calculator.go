// Package calculator provides basic math operations.
// This demonstrates how to create a reusable Go package.
//
// IMPORTANT CONCEPT: EXPORTED vs UNEXPORTED
//   - Functions starting with UPPERCASE are EXPORTED (public)
//     Other packages can use them: calculator.Add(1, 2)
//   - Functions starting with lowercase are UNEXPORTED (private)
//     Only this package can use them
package calculator

import (
	"errors"
	"math"
)

// ─── Exported Functions (Uppercase = Public) ─────────────────────────────

// Add returns the sum of two integers.
func Add(a, b int) int {
	return a + b
}

// Subtract returns the difference of two integers.
func Subtract(a, b int) int {
	return a - b
}

// Multiply returns the product of two integers.
func Multiply(a, b int) int {
	return a * b
}

// Divide returns the quotient of two float64 numbers.
// Returns an error if dividing by zero.
func Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}

// Average returns the average of a slice of float64 numbers.
// Returns an error if the slice is empty.
func Average(nums []float64) (float64, error) {
	if len(nums) == 0 {
		return 0, errors.New("cannot average empty slice")
	}
	sum := 0.0
	for _, n := range nums {
		sum += n
	}
	return sum / float64(len(nums)), nil
}

// Abs returns the absolute value of an integer.
func Abs(n int) int {
	return int(math.Abs(float64(n)))
}

// Max returns the larger of two integers.
func Max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

// Min returns the smaller of two integers.
func Min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// ─── Unexported function (lowercase = private) ──────────────────────────
// This function can only be used WITHIN the calculator package.
// Other packages cannot call it.

func isPositive(n int) bool {
	return n > 0
}
