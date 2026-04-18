import java.util.Arrays;

/**
 * LESSON: Search Algorithms
 * Finding elements in arrays efficiently.
 */
public class SearchAlgorithms {
    public static void main(String[] args) {
        int[] unsorted = {64, 34, 25, 12, 22, 11, 90, 45};
        int[] sorted = {11, 12, 22, 25, 34, 45, 64, 90};

        // ===== LINEAR SEARCH - O(n) =====
        System.out.println("--- Linear Search ---");
        System.out.println("Array: " + Arrays.toString(unsorted));
        System.out.println("Search 22: index " + linearSearch(unsorted, 22));   // 4
        System.out.println("Search 99: index " + linearSearch(unsorted, 99));   // -1

        // ===== BINARY SEARCH (Iterative) - O(log n) =====
        System.out.println("\n--- Binary Search (Iterative) ---");
        System.out.println("Sorted array: " + Arrays.toString(sorted));
        System.out.println("Search 25: index " + binarySearch(sorted, 25));     // 3
        System.out.println("Search 90: index " + binarySearch(sorted, 90));     // 7
        System.out.println("Search 99: index " + binarySearch(sorted, 99));     // -1

        // ===== BINARY SEARCH (Recursive) - O(log n) =====
        System.out.println("\n--- Binary Search (Recursive) ---");
        System.out.println("Search 45: index " + binarySearchRecursive(sorted, 45, 0, sorted.length - 1));
        System.out.println("Search 11: index " + binarySearchRecursive(sorted, 11, 0, sorted.length - 1));

        // ===== COMPARISON =====
        System.out.println("\n===== Comparison =====");
        System.out.println("Algorithm          | Time      | Requirement");
        System.out.println("Linear Search      | O(n)      | None (works on unsorted)");
        System.out.println("Binary Search      | O(log n)  | Array must be SORTED");
        System.out.println();
        System.out.println("For 1,000,000 elements:");
        System.out.println("  Linear: up to 1,000,000 comparisons");
        System.out.println("  Binary: up to 20 comparisons (log2 of 1M ≈ 20)");
    }

    // Linear Search: check every element one by one
    // Works on unsorted arrays
    static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1; // not found
    }

    // Binary Search (Iterative): repeatedly divide search space in half
    // REQUIRES sorted array
    static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2; // avoids integer overflow

            if (arr[mid] == target) return mid;       // found!
            else if (arr[mid] < target) left = mid + 1;  // target is in right half
            else right = mid - 1;                         // target is in left half
        }
        return -1; // not found
    }

    // Binary Search (Recursive)
    static int binarySearchRecursive(int[] arr, int target, int left, int right) {
        if (left > right) return -1; // base case: not found

        int mid = left + (right - left) / 2;

        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
        else return binarySearchRecursive(arr, target, left, mid - 1);
    }
}
