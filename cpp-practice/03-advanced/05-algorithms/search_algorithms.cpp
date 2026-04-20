/**
 * LESSON: Search Algorithms
 */
#include <iostream>
#include <vector>

int linearSearch(const std::vector<int>& arr, int target) {
    for (int i = 0; i < (int)arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}

int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int binarySearchRecursive(const std::vector<int>& arr, int target, int left, int right) {
    if (left > right) return -1;
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
    return binarySearchRecursive(arr, target, left, mid - 1);
}

int main() {
    std::vector<int> unsorted = {64, 34, 25, 12, 22, 11, 90, 45};
    std::vector<int> sorted = {11, 12, 22, 25, 34, 45, 64, 90};

    std::cout << "--- Linear Search ---\n";
    std::cout << "Search 22: index " << linearSearch(unsorted, 22) << "\n";
    std::cout << "Search 99: index " << linearSearch(unsorted, 99) << "\n";

    std::cout << "\n--- Binary Search (Iterative) ---\n";
    std::cout << "Search 25: index " << binarySearch(sorted, 25) << "\n";
    std::cout << "Search 99: index " << binarySearch(sorted, 99) << "\n";

    std::cout << "\n--- Binary Search (Recursive) ---\n";
    std::cout << "Search 45: index " << binarySearchRecursive(sorted, 45, 0, sorted.size() - 1) << "\n";

    std::cout << "\n--- Complexity ---\n";
    std::cout << "Linear: O(n)     - works on unsorted\n";
    std::cout << "Binary: O(log n) - requires sorted array\n";

    return 0;
}
