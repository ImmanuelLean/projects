/**
 * LESSON: Sorting Algorithms
 */
#include <iostream>
#include <vector>
#include <algorithm>

void printVec(const std::string& label, const std::vector<int>& v) {
    std::cout << label << ": ";
    for (int n : v) std::cout << n << " ";
    std::cout << "\n";
}

// Bubble Sort - O(n²)
void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

// Selection Sort - O(n²)
void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        std::swap(arr[i], arr[minIdx]);
    }
}

// Insertion Sort - O(n²)
void insertionSort(std::vector<int>& arr) {
    for (int i = 1; i < (int)arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

// Merge Sort - O(n log n)
void merge(std::vector<int>& arr, int left, int mid, int right) {
    std::vector<int> L(arr.begin() + left, arr.begin() + mid + 1);
    std::vector<int> R(arr.begin() + mid + 1, arr.begin() + right + 1);
    int i = 0, j = 0, k = left;
    while (i < (int)L.size() && j < (int)R.size()) {
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    }
    while (i < (int)L.size()) arr[k++] = L[i++];
    while (j < (int)R.size()) arr[k++] = R[j++];
}

void mergeSort(std::vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

// Quick Sort - O(n log n) average
int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            std::swap(arr[++i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    std::vector<int> original = {64, 34, 25, 12, 22, 11, 90, 45};
    std::vector<int> arr;

    arr = original;
    bubbleSort(arr);
    printVec("Bubble Sort   ", arr);

    arr = original;
    selectionSort(arr);
    printVec("Selection Sort", arr);

    arr = original;
    insertionSort(arr);
    printVec("Insertion Sort", arr);

    arr = original;
    mergeSort(arr, 0, arr.size() - 1);
    printVec("Merge Sort    ", arr);

    arr = original;
    quickSort(arr, 0, arr.size() - 1);
    printVec("Quick Sort    ", arr);

    std::cout << "\n--- Complexity ---\n";
    std::cout << "Bubble:    O(n²)     | O(1) space\n";
    std::cout << "Selection: O(n²)     | O(1) space\n";
    std::cout << "Insertion: O(n²)     | O(1) space\n";
    std::cout << "Merge:     O(n logn) | O(n) space\n";
    std::cout << "Quick:     O(n logn) | O(logn) space\n";

    return 0;
}
