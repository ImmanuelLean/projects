/**
 * LESSON: Graph Algorithms
 * Classic graph algorithms: Dijkstra's shortest path,
 * topological sort, and minimum spanning tree (Prim's).
 *
 * Compile: g++ -std=c++17 -o graph_algo graph_algorithms.cpp
 * Run:     ./graph_algo
 */
#include <iostream>
#include <vector>
#include <queue>
#include <stack>
#include <climits>
#include <algorithm>

using Edge = std::pair<int, int>;  // {weight, vertex}
using AdjList = std::vector<std::vector<Edge>>;

// ===== DIJKSTRA'S SHORTEST PATH =====
std::vector<int> dijkstra(const AdjList& graph, int source) {
    int n = graph.size();
    std::vector<int> dist(n, INT_MAX);
    dist[source] = 0;

    // Min-heap: {distance, vertex}
    std::priority_queue<Edge, std::vector<Edge>, std::greater<Edge>> pq;
    pq.push({0, source});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;  // skip outdated entry

        for (auto [weight, v] : graph[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}

// ===== TOPOLOGICAL SORT (Kahn's algorithm - BFS) =====
std::vector<int> topologicalSort(int n, const std::vector<std::vector<int>>& adj) {
    std::vector<int> inDegree(n, 0);
    for (int u = 0; u < n; u++)
        for (int v : adj[u])
            inDegree[v]++;

    std::queue<int> q;
    for (int i = 0; i < n; i++)
        if (inDegree[i] == 0) q.push(i);

    std::vector<int> order;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);

        for (int v : adj[u]) {
            if (--inDegree[v] == 0) q.push(v);
        }
    }

    if (static_cast<int>(order.size()) != n) {
        std::cout << "  Cycle detected! Not a DAG.\n";
        return {};
    }
    return order;
}

// ===== PRIM'S MST (Minimum Spanning Tree) =====
int primMST(const AdjList& graph) {
    int n = graph.size();
    std::vector<bool> inMST(n, false);
    std::vector<int> key(n, INT_MAX);  // min weight edge to reach each vertex

    // Min-heap: {weight, vertex}
    std::priority_queue<Edge, std::vector<Edge>, std::greater<Edge>> pq;
    key[0] = 0;
    pq.push({0, 0});

    int totalWeight = 0;
    std::vector<std::pair<int, int>> mstEdges;

    while (!pq.empty()) {
        auto [w, u] = pq.top();
        pq.pop();

        if (inMST[u]) continue;
        inMST[u] = true;
        totalWeight += w;

        for (auto [weight, v] : graph[u]) {
            if (!inMST[v] && weight < key[v]) {
                key[v] = weight;
                pq.push({weight, v});
            }
        }
    }
    return totalWeight;
}

// ===== BFS SHORTEST PATH (unweighted) =====
std::vector<int> bfsShortestPath(const std::vector<std::vector<int>>& adj, int source) {
    int n = adj.size();
    std::vector<int> dist(n, -1);
    dist[source] = 0;
    std::queue<int> q;
    q.push(source);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
    return dist;
}

int main() {
    // --- Dijkstra's Algorithm ---
    std::cout << "--- Dijkstra's Shortest Path ---\n";
    /*  Graph:
     *  0 --4-- 1 --8-- 2
     *  |       |       |
     *  8       2       7
     *  |       |       |
     *  3 --7-- 4 --9-- 5
     */
    AdjList graph(6);
    auto addEdge = [&](int u, int v, int w) {
        graph[u].push_back({w, v});
        graph[v].push_back({w, u});
    };
    addEdge(0, 1, 4);
    addEdge(0, 3, 8);
    addEdge(1, 2, 8);
    addEdge(1, 4, 2);
    addEdge(2, 5, 7);
    addEdge(3, 4, 7);
    addEdge(4, 5, 9);

    auto dist = dijkstra(graph, 0);
    std::cout << "  Shortest distances from vertex 0:\n";
    for (int i = 0; i < 6; i++) {
        std::cout << "    0 -> " << i << ": " << dist[i] << "\n";
    }

    // --- Topological Sort ---
    std::cout << "\n--- Topological Sort ---\n";
    /*  DAG (course prerequisites):
     *  0 -> 1 -> 3
     *  0 -> 2 -> 3
     *  2 -> 4
     *  3 -> 5
     *  4 -> 5
     */
    std::vector<std::vector<int>> dag(6);
    dag[0] = {1, 2};
    dag[1] = {3};
    dag[2] = {3, 4};
    dag[3] = {5};
    dag[4] = {5};

    auto order = topologicalSort(6, dag);
    std::cout << "  Topological order: ";
    for (int v : order) std::cout << v << " ";
    std::cout << "\n";

    // --- Prim's MST ---
    std::cout << "\n--- Prim's MST ---\n";
    AdjList mstGraph(5);
    auto addMSTEdge = [&](int u, int v, int w) {
        mstGraph[u].push_back({w, v});
        mstGraph[v].push_back({w, u});
    };
    addMSTEdge(0, 1, 2);
    addMSTEdge(0, 3, 6);
    addMSTEdge(1, 2, 3);
    addMSTEdge(1, 3, 8);
    addMSTEdge(1, 4, 5);
    addMSTEdge(2, 4, 7);
    addMSTEdge(3, 4, 9);

    int mstWeight = primMST(mstGraph);
    std::cout << "  MST total weight: " << mstWeight << "\n";

    // --- BFS Shortest Path (unweighted) ---
    std::cout << "\n--- BFS Shortest Path (unweighted) ---\n";
    std::vector<std::vector<int>> unweighted(6);
    unweighted[0] = {1, 2};
    unweighted[1] = {0, 3, 4};
    unweighted[2] = {0, 5};
    unweighted[3] = {1};
    unweighted[4] = {1, 5};
    unweighted[5] = {2, 4};

    auto bfsDist = bfsShortestPath(unweighted, 0);
    std::cout << "  Distances from 0: ";
    for (int i = 0; i < 6; i++) std::cout << i << "=" << bfsDist[i] << " ";
    std::cout << "\n";

    return 0;
}
