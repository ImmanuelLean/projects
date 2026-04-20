/**
 * LESSON: Graph Data Structure
 * Graphs represent relationships between objects.
 * Two representations: adjacency list and adjacency matrix.
 *
 * Compile: g++ -std=c++17 -o graph graph_basics.cpp
 * Run:     ./graph
 */
#include <iostream>
#include <vector>
#include <queue>
#include <stack>
#include <unordered_map>
#include <string>

// ===== ADJACENCY LIST GRAPH =====
class Graph {
    int vertices;
    std::vector<std::vector<int>> adjList;
    bool directed;

public:
    Graph(int v, bool dir = false) : vertices(v), adjList(v), directed(dir) {}

    void addEdge(int u, int v) {
        adjList[u].push_back(v);
        if (!directed) adjList[v].push_back(u);
    }

    void display() const {
        for (int i = 0; i < vertices; i++) {
            std::cout << "  " << i << " -> ";
            for (int neighbor : adjList[i]) std::cout << neighbor << " ";
            std::cout << "\n";
        }
    }

    // ===== BFS (Breadth-First Search) =====
    void bfs(int start) const {
        std::vector<bool> visited(vertices, false);
        std::queue<int> q;

        visited[start] = true;
        q.push(start);

        std::cout << "  BFS from " << start << ": ";
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            std::cout << node << " ";

            for (int neighbor : adjList[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        std::cout << "\n";
    }

    // ===== DFS (Depth-First Search) - Iterative =====
    void dfsIterative(int start) const {
        std::vector<bool> visited(vertices, false);
        std::stack<int> stk;

        stk.push(start);
        std::cout << "  DFS from " << start << " (iterative): ";

        while (!stk.empty()) {
            int node = stk.top();
            stk.pop();

            if (visited[node]) continue;
            visited[node] = true;
            std::cout << node << " ";

            for (int i = adjList[node].size() - 1; i >= 0; i--) {
                if (!visited[adjList[node][i]]) {
                    stk.push(adjList[node][i]);
                }
            }
        }
        std::cout << "\n";
    }

    // ===== DFS - Recursive =====
    void dfsRecursive(int start) const {
        std::vector<bool> visited(vertices, false);
        std::cout << "  DFS from " << start << " (recursive): ";
        dfsHelper(start, visited);
        std::cout << "\n";
    }

private:
    void dfsHelper(int node, std::vector<bool>& visited) const {
        visited[node] = true;
        std::cout << node << " ";
        for (int neighbor : adjList[node]) {
            if (!visited[neighbor]) {
                dfsHelper(neighbor, visited);
            }
        }
    }

public:
    // ===== BFS SHORTEST PATH (unweighted) =====
    std::vector<int> shortestPath(int start, int end) const {
        std::vector<bool> visited(vertices, false);
        std::vector<int> parent(vertices, -1);
        std::queue<int> q;

        visited[start] = true;
        q.push(start);

        while (!q.empty()) {
            int node = q.front();
            q.pop();

            if (node == end) break;

            for (int neighbor : adjList[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    parent[neighbor] = node;
                    q.push(neighbor);
                }
            }
        }

        // Reconstruct path
        std::vector<int> path;
        for (int at = end; at != -1; at = parent[at]) {
            path.push_back(at);
        }
        std::reverse(path.begin(), path.end());
        if (path[0] != start) return {};  // no path
        return path;
    }
};

// ===== ADJACENCY MATRIX =====
class MatrixGraph {
    int vertices;
    std::vector<std::vector<int>> matrix;

public:
    MatrixGraph(int v) : vertices(v), matrix(v, std::vector<int>(v, 0)) {}

    void addEdge(int u, int v, int weight = 1) {
        matrix[u][v] = weight;
        matrix[v][u] = weight;  // undirected
    }

    void display() const {
        std::cout << "    ";
        for (int i = 0; i < vertices; i++) std::cout << i << " ";
        std::cout << "\n";
        for (int i = 0; i < vertices; i++) {
            std::cout << "  " << i << " ";
            for (int j = 0; j < vertices; j++) {
                std::cout << matrix[i][j] << " ";
            }
            std::cout << "\n";
        }
    }
};

int main() {
    // --- Adjacency List ---
    std::cout << "--- Adjacency List Graph ---\n";
    Graph g(7);
    g.addEdge(0, 1);
    g.addEdge(0, 2);
    g.addEdge(1, 3);
    g.addEdge(1, 4);
    g.addEdge(2, 5);
    g.addEdge(2, 6);
    /*
     *        0
     *       / \
     *      1   2
     *     / \ / \
     *    3  4 5  6
     */
    g.display();

    // --- BFS ---
    std::cout << "\n--- BFS ---\n";
    g.bfs(0);

    // --- DFS ---
    std::cout << "\n--- DFS ---\n";
    g.dfsIterative(0);
    g.dfsRecursive(0);

    // --- Shortest path ---
    std::cout << "\n--- Shortest Path (BFS) ---\n";
    auto path = g.shortestPath(3, 6);
    std::cout << "  Path 3 -> 6: ";
    for (int node : path) std::cout << node << " ";
    std::cout << "(length=" << path.size() - 1 << ")\n";

    // --- Adjacency Matrix ---
    std::cout << "\n--- Adjacency Matrix ---\n";
    MatrixGraph mg(4);
    mg.addEdge(0, 1);
    mg.addEdge(0, 2);
    mg.addEdge(1, 3);
    mg.addEdge(2, 3);
    mg.display();

    // --- When to use which ---
    std::cout << "\n--- Representation Comparison ---\n";
    std::cout << "Adjacency List:   Space O(V+E). Good for sparse graphs.\n";
    std::cout << "Adjacency Matrix: Space O(V²). Good for dense graphs.\n";
    std::cout << "List: faster edge iteration. Matrix: faster edge lookup.\n";

    return 0;
}
