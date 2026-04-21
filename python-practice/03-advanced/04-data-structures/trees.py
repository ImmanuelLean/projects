"""
LESSON: Tree Data Structures
Binary tree, BST, traversals, AVL concepts, trie.

Run: python3 trees.py
"""
from collections import deque
from typing import Any

# ===== BINARY TREE NODE =====
print("--- Binary Tree ---")

class TreeNode:
    def __init__(self, val: Any, left: "TreeNode | None" = None,
                 right: "TreeNode | None" = None):
        self.val = val
        self.left = left
        self.right = right

    def __repr__(self):
        return f"TreeNode({self.val})"

# Build a sample tree:
#        1
#       / \
#      2   3
#     / \   \
#    4   5   6

root = TreeNode(1,
    TreeNode(2, TreeNode(4), TreeNode(5)),
    TreeNode(3, None, TreeNode(6))
)

# ===== TREE TRAVERSALS =====
print("\n--- Traversals ---")

def inorder(node: TreeNode | None) -> list:
    """Left → Root → Right"""
    if node is None:
        return []
    return inorder(node.left) + [node.val] + inorder(node.right)

def preorder(node: TreeNode | None) -> list:
    """Root → Left → Right"""
    if node is None:
        return []
    return [node.val] + preorder(node.left) + preorder(node.right)

def postorder(node: TreeNode | None) -> list:
    """Left → Right → Root"""
    if node is None:
        return []
    return postorder(node.left) + postorder(node.right) + [node.val]

def level_order(root: TreeNode | None) -> list[list]:
    """BFS level by level."""
    if root is None:
        return []
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result

print(f"  In-order:    {inorder(root)}")
print(f"  Pre-order:   {preorder(root)}")
print(f"  Post-order:  {postorder(root)}")
print(f"  Level-order: {level_order(root)}")

# ===== TREE PROPERTIES =====
print("\n--- Tree Properties ---")

def height(node: TreeNode | None) -> int:
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))

def size(node: TreeNode | None) -> int:
    if node is None:
        return 0
    return 1 + size(node.left) + size(node.right)

def is_balanced(node: TreeNode | None) -> bool:
    if node is None:
        return True
    left_h = height(node.left)
    right_h = height(node.right)
    return (abs(left_h - right_h) <= 1 and
            is_balanced(node.left) and is_balanced(node.right))

print(f"  Height: {height(root)}")
print(f"  Size: {size(root)}")
print(f"  Balanced: {is_balanced(root)}")

# ===== BINARY SEARCH TREE =====
print("\n--- Binary Search Tree ---")

class BST:
    def __init__(self):
        self.root: TreeNode | None = None

    def insert(self, val: Any):
        self.root = self._insert(self.root, val)

    def _insert(self, node: TreeNode | None, val: Any) -> TreeNode:
        if node is None:
            return TreeNode(val)
        if val < node.val:
            node.left = self._insert(node.left, val)
        elif val > node.val:
            node.right = self._insert(node.right, val)
        return node

    def search(self, val: Any) -> bool:
        return self._search(self.root, val)

    def _search(self, node: TreeNode | None, val: Any) -> bool:
        if node is None:
            return False
        if val == node.val:
            return True
        if val < node.val:
            return self._search(node.left, val)
        return self._search(node.right, val)

    def delete(self, val: Any):
        self.root = self._delete(self.root, val)

    def _delete(self, node: TreeNode | None, val: Any) -> TreeNode | None:
        if node is None:
            return None
        if val < node.val:
            node.left = self._delete(node.left, val)
        elif val > node.val:
            node.right = self._delete(node.right, val)
        else:
            # Found node to delete
            if node.left is None:
                return node.right
            if node.right is None:
                return node.left
            # Two children: replace with inorder successor
            successor = self._min_node(node.right)
            node.val = successor.val
            node.right = self._delete(node.right, successor.val)
        return node

    def _min_node(self, node: TreeNode) -> TreeNode:
        while node.left:
            node = node.left
        return node

    def inorder(self) -> list:
        return inorder(self.root)

bst = BST()
for val in [50, 30, 70, 20, 40, 60, 80]:
    bst.insert(val)

print(f"  BST inorder: {bst.inorder()}")
print(f"  Search 40: {bst.search(40)}")
print(f"  Search 45: {bst.search(45)}")

bst.delete(30)
print(f"  After delete 30: {bst.inorder()}")

# ===== TRIE =====
print("\n--- Trie (Prefix Tree) ---")

class TrieNode:
    def __init__(self):
        self.children: dict[str, TrieNode] = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self._find_node(word)
        return node is not None and node.is_end

    def starts_with(self, prefix: str) -> bool:
        return self._find_node(prefix) is not None

    def _find_node(self, prefix: str) -> TrieNode | None:
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node

    def autocomplete(self, prefix: str) -> list[str]:
        """Find all words with given prefix."""
        node = self._find_node(prefix)
        if node is None:
            return []
        results = []
        self._collect(node, prefix, results)
        return results

    def _collect(self, node: TrieNode, prefix: str, results: list):
        if node.is_end:
            results.append(prefix)
        for char, child in sorted(node.children.items()):
            self._collect(child, prefix + char, results)

trie = Trie()
words = ["apple", "app", "application", "apply", "banana", "band", "ban"]
for w in words:
    trie.insert(w)

print(f"  Search 'app': {trie.search('app')}")
print(f"  Search 'apt': {trie.search('apt')}")
print(f"  Starts with 'app': {trie.starts_with('app')}")
print(f"  Autocomplete 'app': {trie.autocomplete('app')}")
print(f"  Autocomplete 'ban': {trie.autocomplete('ban')}")

# ===== TREE ALGORITHMS =====
print("\n--- Tree Algorithms ---")

def lowest_common_ancestor(root, p, q):
    """Find LCA of two nodes in BST."""
    if root is None:
        return None
    if p < root.val and q < root.val:
        return lowest_common_ancestor(root.left, p, q)
    if p > root.val and q > root.val:
        return lowest_common_ancestor(root.right, p, q)
    return root.val

bst2 = BST()
for v in [6, 2, 8, 0, 4, 7, 9, 3, 5]:
    bst2.insert(v)

lca = lowest_common_ancestor(bst2.root, 2, 8)
print(f"  LCA(2, 8) = {lca}")

lca = lowest_common_ancestor(bst2.root, 0, 5)
print(f"  LCA(0, 5) = {lca}")

def max_depth(node):
    if not node:
        return 0
    return 1 + max(max_depth(node.left), max_depth(node.right))

print(f"  Max depth: {max_depth(bst2.root)}")
