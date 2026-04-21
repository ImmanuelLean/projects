"""
LESSON: Graph Data Structures
Adjacency list, BFS, DFS, shortest path, topological sort, cycle detection.

Run: python3 graphs.py
"""
from collections import defaultdict, deque
import heapq

# ===== GRAPH REPRESENTATION =====
print("--- Graph Representations ---")

class Graph:
    """Adjacency list graph (directed or undirected)."""

    def __init__(self, directed: bool = False):
        self.adj: dict[str, list[tuple[str, int]]] = defaultdict(list)
        self.directed = directed

    def add_edge(self, u: str, v: str, weight: int = 1):
        self.adj[u].append((v, weight))
        if not self.directed:
            self.adj[v].append((u, weight))
        # ensure nodes exist even if no outgoing edges
        if v not in self.adj:
            self.adj[v] = []

    def neighbors(self, node: str) -> list[tuple[str, int]]:
        return self.adj[node]

    def nodes(self) -> list[str]:
        return list(self.adj.keys())

    def display(self):
        for node in sorted(self.adj):
            edges = [(v, w) for v, w in self.adj[node]]
            print(f"  {node} → {edges}")

# Build sample graph
g = Graph()
g.add_edge("A", "B", 4)
g.add_edge("A", "C", 2)
g.add_edge("B", "D", 3)
g.add_edge("B", "C", 1)
g.add_edge("C", "D", 5)
g.add_edge("D", "E", 2)

g.display()

# ===== BFS =====
print("\n--- BFS (Breadth-First Search) ---")

def bfs(graph: Graph, start: str) -> list[str]:
    """Visit nodes level by level."""
    visited = set()
    order = []
    queue = deque([start])
    visited.add(start)

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor, _ in sorted(graph.neighbors(node)):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order

print(f"  BFS from A: {bfs(g, 'A')}")

# ===== BFS SHORTEST PATH (Unweighted) =====
print("\n--- BFS Shortest Path ---")

def bfs_shortest_path(graph: Graph, start: str, end: str) -> list[str] | None:
    """Find shortest path in unweighted graph."""
    visited = {start}
    queue = deque([(start, [start])])

    while queue:
        node, path = queue.popleft()
        if node == end:
            return path
        for neighbor, _ in graph.neighbors(node):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))

    return None

path = bfs_shortest_path(g, "A", "E")
print(f"  Shortest path A→E: {path}")

# ===== DFS =====
print("\n--- DFS (Depth-First Search) ---")

def dfs_recursive(graph: Graph, start: str, visited: set | None = None) -> list[str]:
    if visited is None:
        visited = set()
    visited.add(start)
    order = [start]
    for neighbor, _ in sorted(graph.neighbors(start)):
        if neighbor not in visited:
            order.extend(dfs_recursive(graph, neighbor, visited))
    return order

def dfs_iterative(graph: Graph, start: str) -> list[str]:
    visited = set()
    order = []
    stack = [start]

    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        order.append(node)
        for neighbor, _ in sorted(graph.neighbors(node), reverse=True):
            if neighbor not in visited:
                stack.append(neighbor)

    return order

print(f"  DFS recursive from A: {dfs_recursive(g, 'A')}")
print(f"  DFS iterative from A: {dfs_iterative(g, 'A')}")

# ===== DIJKSTRA'S ALGORITHM =====
print("\n--- Dijkstra's Shortest Path (Weighted) ---")

def dijkstra(graph: Graph, start: str) -> tuple[dict[str, int], dict[str, str | None]]:
    """Find shortest paths from start to all reachable nodes."""
    dist = {node: float('inf') for node in graph.nodes()}
    prev = {node: None for node in graph.nodes()}
    dist[start] = 0

    heap = [(0, start)]  # (distance, node)

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, weight in graph.neighbors(u):
            new_dist = dist[u] + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                prev[v] = u
                heapq.heappush(heap, (new_dist, v))

    return dist, prev

def reconstruct_path(prev: dict, start: str, end: str) -> list[str]:
    path = []
    current = end
    while current is not None:
        path.append(current)
        current = prev[current]
    path.reverse()
    return path if path[0] == start else []

distances, previous = dijkstra(g, "A")
print(f"  Distances from A: {dict(distances)}")

path = reconstruct_path(previous, "A", "E")
print(f"  Shortest path A→E: {path} (cost: {distances['E']})")

# ===== TOPOLOGICAL SORT =====
print("\n--- Topological Sort ---")

dag = Graph(directed=True)
dag.add_edge("A", "C")
dag.add_edge("B", "C")
dag.add_edge("B", "D")
dag.add_edge("C", "E")
dag.add_edge("D", "E")
dag.add_edge("E", "F")

def topological_sort(graph: Graph) -> list[str]:
    """Kahn's algorithm (BFS-based topological sort)."""
    in_degree = defaultdict(int)
    for node in graph.nodes():
        for neighbor, _ in graph.neighbors(node):
            in_degree[neighbor] += 1

    queue = deque([n for n in graph.nodes() if in_degree[n] == 0])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor, _ in graph.neighbors(node):
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    if len(order) != len(graph.nodes()):
        raise ValueError("Graph has a cycle!")
    return order

print(f"  Topological order: {topological_sort(dag)}")

# ===== CYCLE DETECTION =====
print("\n--- Cycle Detection ---")

def has_cycle_directed(graph: Graph) -> bool:
    """Detect cycle in directed graph using DFS coloring."""
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {node: WHITE for node in graph.nodes()}

    def dfs(node):
        color[node] = GRAY
        for neighbor, _ in graph.neighbors(node):
            if color[neighbor] == GRAY:
                return True  # back edge = cycle
            if color[neighbor] == WHITE and dfs(neighbor):
                return True
        color[node] = BLACK
        return False

    return any(dfs(node) for node in graph.nodes() if color[node] == WHITE)

print(f"  DAG has cycle: {has_cycle_directed(dag)}")

# Add a cycle
cyclic = Graph(directed=True)
cyclic.add_edge("A", "B")
cyclic.add_edge("B", "C")
cyclic.add_edge("C", "A")  # cycle!
print(f"  Cyclic graph has cycle: {has_cycle_directed(cyclic)}")

def has_cycle_undirected(graph: Graph) -> bool:
    """Detect cycle in undirected graph using DFS."""
    visited = set()

    def dfs(node, parent):
        visited.add(node)
        for neighbor, _ in graph.neighbors(node):
            if neighbor not in visited:
                if dfs(neighbor, node):
                    return True
            elif neighbor != parent:
                return True
        return False

    return any(dfs(n, None) for n in graph.nodes() if n not in visited)

print(f"  Undirected graph has cycle: {has_cycle_undirected(g)}")

# ===== CONNECTED COMPONENTS =====
print("\n--- Connected Components ---")

def connected_components(graph: Graph) -> list[set[str]]:
    visited = set()
    components = []

    for node in graph.nodes():
        if node not in visited:
            component = set()
            queue = deque([node])
            while queue:
                n = queue.popleft()
                if n in visited:
                    continue
                visited.add(n)
                component.add(n)
                for neighbor, _ in graph.neighbors(n):
                    if neighbor not in visited:
                        queue.append(neighbor)
            components.append(component)

    return components

print(f"  Components: {connected_components(g)}")

# Add disconnected nodes
g2 = Graph()
g2.add_edge("A", "B")
g2.add_edge("C", "D")
g2.add_edge("E", "F")
g2.add_edge("E", "G")
print(f"  Disconnected components: {connected_components(g2)}")
