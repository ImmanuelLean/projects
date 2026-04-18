import java.util.Arrays;

/**
 * LESSON: Sorting Algorithms
 * Understanding how different sorting algorithms work.
 */
public class SortingAlgorithms {
    public static void main(String[] args) {
        int[] original = {64, 34, 25, 12, 22, 11, 90, 45};

        // ===== BUBBLE SORT - O(n²) =====
        int[] arr = original.clone();
        System.out.println("--- Bubble Sort ---");
        System.out.println("Before: " + Arrays.toString(arr));
        bubbleSort(arr);
        System.out.println("After:  " + Arrays.toString(arr));

        // ===== SELECTION SORT - O(n²) =====
        arr = original.clone();
        System.out.println("\n--- Selection Sort ---");
        System.out.println("Before: " + Arrays.toString(arr));
        selectionSort(arr);
        System.out.println("After:  " + Arrays.toString(arr));

        // ===== INSERTION SORT - O(n²) =====
        arr = original.clone();
        System.out.println("\n--- Insertion Sort ---");
        System.out.println("Before: " + Arrays.toString(arr));
        insertionSort(arr);
        System.out.println("After:  " + Arrays.toString(arr));

        // ===== MERGE SORT - O(n log n) =====
        arr = original.clone();
        System.out.println("\n--- Merge Sort ---");
        System.out.println("Before: " + Arrays.toString(arr));
        mergeSort(arr, 0, arr.length - 1);
        System.out.println("After:  " + Arrays.toString(arr));

        // ===== QUICK SORT - O(n log n) average =====
        arr = original.clone();
        System.out.println("\n--- Quick Sort ---");
        System.out.println("Before: " + Arrays.toString(arr));
        quickSort(arr, 0, arr.length - 1);
        System.out.println("After:  " + Arrays.toString(arr));

        // ===== COMPLEXITY SUMMARY =====
        System.out.println("\n===== Complexity Summary =====");
        System.out.println("Algorithm       | Best     | Average  | Worst    | Space");
        System.out.println("Bubble Sort     | O(n)     | O(n²)    | O(n²)    | O(1)");
        System.out.println("Selection Sort  | O(n²)    | O(n²)    | O(n²)    | O(1)");
        System.out.println("Insertion Sort  | O(n)     | O(n²)    | O(n²)    | O(1)");
        System.out.println("Merge Sort      | O(nlogn) | O(nlogn) | O(nlogn) | O(n)");
        System.out.println("Quick Sort      | O(nlogn) | O(nlogn) | O(n²)    | O(logn)");
    }

    // Bubble Sort: repeatedly swap adjacent elements if they're in wrong order
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break; // optimization: already sorted
        }
    }

    // Selection Sort: find minimum and place it at the beginning
    static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }

    // Insertion Sort: build sorted array one element at a time
    static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    // Merge Sort: divide array in half, sort each half, merge them
    static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = (left + right) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    static void merge(int[] arr, int left, int mid, int right) {
        int[] leftArr = Arrays.copyOfRange(arr, left, mid + 1);
        int[] rightArr = Arrays.copyOfRange(arr, mid + 1, right + 1);

        int i = 0, j = 0, k = left;
        while (i < leftArr.length && j < rightArr.length) {
            if (leftArr[i] <= rightArr[j]) arr[k++] = leftArr[i++];
            else arr[k++] = rightArr[j++];
        }
        while (i < leftArr.length) arr[k++] = leftArr[i++];
        while (j < rightArr.length) arr[k++] = rightArr[j++];
    }

    // Quick Sort: pick pivot, partition around it, recursively sort partitions
    static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pivotIdx = partition(arr, low, high);
            quickSort(arr, low, pivotIdx - 1);
            quickSort(arr, pivotIdx + 1, high);
        }
    }

    static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }
}
