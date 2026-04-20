/**
 * LESSON: Dynamic Programming
 * DP solves problems by breaking them into overlapping subproblems.
 * Two approaches: top-down (memoization) and bottom-up (tabulation).
 *
 * Compile: g++ -std=c++17 -o dp dynamic_programming.cpp
 * Run:     ./dp
 */
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>

// ===== FIBONACCI =====
// Naive recursive: O(2^n) - terrible!
long long fibNaive(int n) {
    if (n <= 1) return n;
    return fibNaive(n - 1) + fibNaive(n - 2);
}

// Top-down (memoization): O(n)
std::unordered_map<int, long long> memo;
long long fibMemo(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fibMemo(n - 1) + fibMemo(n - 2);
}

// Bottom-up (tabulation): O(n), O(1) space
long long fibTab(int n) {
    if (n <= 1) return n;
    long long prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        long long curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}

// ===== LONGEST COMMON SUBSEQUENCE =====
int lcs(const std::string& s1, const std::string& s2) {
    int m = s1.size(), n = s2.size();
    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}

// ===== 0/1 KNAPSACK =====
int knapsack(const std::vector<int>& weights, const std::vector<int>& values,
             int capacity) {
    int n = weights.size();
    std::vector<std::vector<int>> dp(n + 1, std::vector<int>(capacity + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i - 1][w];  // don't take item i
            if (weights[i - 1] <= w) {
                dp[i][w] = std::max(dp[i][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]);  // take it
            }
        }
    }
    return dp[n][capacity];
}

// ===== COIN CHANGE (minimum coins) =====
int coinChange(const std::vector<int>& coins, int amount) {
    std::vector<int> dp(amount + 1, amount + 1);  // fill with "infinity"
    dp[0] = 0;

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i && dp[i - coin] + 1 < dp[i]) {
                dp[i] = dp[i - coin] + 1;
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}

// ===== CLIMBING STAIRS =====
int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}

// ===== LONGEST INCREASING SUBSEQUENCE =====
int lis(const std::vector<int>& nums) {
    int n = nums.size();
    std::vector<int> dp(n, 1);

    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = std::max(dp[i], dp[j] + 1);
            }
        }
    }
    return *std::max_element(dp.begin(), dp.end());
}

int main() {
    // --- Fibonacci ---
    std::cout << "--- Fibonacci ---\n";
    std::cout << "  fib(10) naive:  " << fibNaive(10) << "\n";
    std::cout << "  fib(10) memo:   " << fibMemo(10) << "\n";
    std::cout << "  fib(10) tabul:  " << fibTab(10) << "\n";
    std::cout << "  fib(40) memo:   " << fibMemo(40) << "\n";
    std::cout << "  fib(40) tabul:  " << fibTab(40) << "\n";
    // fibNaive(40) would take minutes!

    // --- LCS ---
    std::cout << "\n--- Longest Common Subsequence ---\n";
    std::string s1 = "ABCBDAB", s2 = "BDCAB";
    std::cout << "  LCS(\"" << s1 << "\", \"" << s2 << "\") = " << lcs(s1, s2) << "\n";

    std::string a = "AGGTAB", b = "GXTXAYB";
    std::cout << "  LCS(\"" << a << "\", \"" << b << "\") = " << lcs(a, b) << "\n";

    // --- Knapsack ---
    std::cout << "\n--- 0/1 Knapsack ---\n";
    std::vector<int> weights = {2, 3, 4, 5};
    std::vector<int> values  = {3, 4, 5, 6};
    int capacity = 8;
    std::cout << "  Items: ";
    for (size_t i = 0; i < weights.size(); i++)
        std::cout << "(w=" << weights[i] << ",v=" << values[i] << ") ";
    std::cout << "\n  Capacity: " << capacity << "\n";
    std::cout << "  Max value: " << knapsack(weights, values, capacity) << "\n";

    // --- Coin Change ---
    std::cout << "\n--- Coin Change ---\n";
    std::vector<int> coins = {1, 5, 10, 25};
    int amount = 36;
    std::cout << "  Coins: {1, 5, 10, 25}, Amount: " << amount << "\n";
    std::cout << "  Min coins: " << coinChange(coins, amount) << "\n";

    coins = {2};
    std::cout << "  Coins: {2}, Amount: 3\n";
    std::cout << "  Min coins: " << coinChange(coins, 3) << " (impossible)\n";

    // --- Climbing Stairs ---
    std::cout << "\n--- Climbing Stairs ---\n";
    for (int n : {3, 5, 10}) {
        std::cout << "  " << n << " stairs: " << climbStairs(n) << " ways\n";
    }

    // --- LIS ---
    std::cout << "\n--- Longest Increasing Subsequence ---\n";
    std::vector<int> seq = {10, 22, 9, 33, 21, 50, 41, 60};
    std::cout << "  Sequence: ";
    for (int n : seq) std::cout << n << " ";
    std::cout << "\n  LIS length: " << lis(seq) << "\n";

    // --- Key concepts ---
    std::cout << "\n--- DP Key Concepts ---\n";
    std::cout << "  1. Optimal substructure: solution built from sub-solutions\n";
    std::cout << "  2. Overlapping subproblems: same subproblems repeated\n";
    std::cout << "  3. Memoization (top-down): cache recursive results\n";
    std::cout << "  4. Tabulation (bottom-up): fill table iteratively\n";

    return 0;
}
