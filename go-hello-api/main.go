package main

import "fmt"

func main() {
	// 1. Declare a string variable using type inference
	message := "Welcome to learning Go!"
	fmt.Println(message)

	// 2. Perform a basic math operation
	num1 := 10
	num2 := 20
	sum := num1 + num2

	// 3. Print formatted output
	fmt.Printf("The sum of %d and %d is %d\n", num1, num2, sum)
}
