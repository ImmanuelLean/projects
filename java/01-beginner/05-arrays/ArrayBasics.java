import java.util.Arrays;

/**
 * LESSON: Arrays
 * Arrays store multiple values of the same type in a fixed-size container.
 */
public class ArrayBasics {
    public static void main(String[] args) {
        // ===== DECLARING AND INITIALIZING =====
        int[] numbers = new int[5]; // creates array of 5 zeros
        numbers[0] = 10;
        numbers[1] = 20;
        numbers[2] = 30;
        numbers[3] = 40;
        numbers[4] = 50;

        // Shorthand initialization
        String[] colors = {"Red", "Green", "Blue", "Yellow"};
        double[] prices = new double[]{9.99, 19.99, 29.99};

        // ===== ACCESSING ELEMENTS =====
        System.out.println("First number: " + numbers[0]);
        System.out.println("Last color: " + colors[colors.length - 1]);
        System.out.println("Array length: " + numbers.length);

        // ===== ITERATING =====
        System.out.println("\n--- For Loop ---");
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("numbers[" + i + "] = " + numbers[i]);
        }

        System.out.println("\n--- For-Each Loop ---");
        for (String color : colors) {
            System.out.println("Color: " + color);
        }

        // ===== USEFUL ARRAYS METHODS =====
        int[] unsorted = {64, 25, 12, 22, 11};

        System.out.println("\nBefore sort: " + Arrays.toString(unsorted));
        Arrays.sort(unsorted);
        System.out.println("After sort:  " + Arrays.toString(unsorted));

        // Copy array
        int[] copy = Arrays.copyOf(unsorted, unsorted.length);
        System.out.println("Copy: " + Arrays.toString(copy));

        // Fill array
        int[] filled = new int[5];
        Arrays.fill(filled, 7);
        System.out.println("Filled: " + Arrays.toString(filled));

        // Binary search (array must be sorted)
        int index = Arrays.binarySearch(unsorted, 22);
        System.out.println("22 found at index: " + index);

        // Compare arrays
        System.out.println("Arrays equal? " + Arrays.equals(unsorted, copy));
    }
}
