/**
 * LESSON: Binary Search Tree (BST)
 * A BST maintains: left < parent < right for all nodes.
 * Provides O(log n) search, insert, and delete on average.
 *
 * Compile: g++ -std=c++17 -o bst binary_tree.cpp
 * Run:     ./bst
 */
#include <iostream>
#include <queue>

class BST {
    struct Node {
        int data;
        Node* left;
        Node* right;
        Node(int val) : data(val), left(nullptr), right(nullptr) {}
    };

    Node* root;

    // ===== RECURSIVE INSERT =====
    Node* insert(Node* node, int val) {
        if (!node) return new Node(val);
        if (val < node->data) node->left = insert(node->left, val);
        else if (val > node->data) node->right = insert(node->right, val);
        return node;
    }

    // ===== RECURSIVE SEARCH =====
    bool search(Node* node, int val) const {
        if (!node) return false;
        if (val == node->data) return true;
        if (val < node->data) return search(node->left, val);
        return search(node->right, val);
    }

    // ===== FIND MIN/MAX =====
    Node* findMin(Node* node) const {
        while (node && node->left) node = node->left;
        return node;
    }

    Node* findMax(Node* node) const {
        while (node && node->right) node = node->right;
        return node;
    }

    // ===== DELETE =====
    Node* remove(Node* node, int val) {
        if (!node) return nullptr;

        if (val < node->data) {
            node->left = remove(node->left, val);
        } else if (val > node->data) {
            node->right = remove(node->right, val);
        } else {
            // Found the node to delete
            if (!node->left) {
                Node* right = node->right;
                delete node;
                return right;
            }
            if (!node->right) {
                Node* left = node->left;
                delete node;
                return left;
            }
            // Two children: replace with inorder successor
            Node* successor = findMin(node->right);
            node->data = successor->data;
            node->right = remove(node->right, successor->data);
        }
        return node;
    }

    // ===== TRAVERSALS =====
    void inorder(Node* node) const {
        if (!node) return;
        inorder(node->left);
        std::cout << node->data << " ";
        inorder(node->right);
    }

    void preorder(Node* node) const {
        if (!node) return;
        std::cout << node->data << " ";
        preorder(node->left);
        preorder(node->right);
    }

    void postorder(Node* node) const {
        if (!node) return;
        postorder(node->left);
        postorder(node->right);
        std::cout << node->data << " ";
    }

    // ===== TREE HEIGHT =====
    int height(Node* node) const {
        if (!node) return -1;
        return 1 + std::max(height(node->left), height(node->right));
    }

    // ===== COUNT NODES =====
    int countNodes(Node* node) const {
        if (!node) return 0;
        return 1 + countNodes(node->left) + countNodes(node->right);
    }

    // ===== CLEANUP =====
    void destroy(Node* node) {
        if (!node) return;
        destroy(node->left);
        destroy(node->right);
        delete node;
    }

public:
    BST() : root(nullptr) {}
    ~BST() { destroy(root); }

    void insert(int val) { root = insert(root, val); }
    bool search(int val) const { return search(root, val); }
    void remove(int val) { root = remove(root, val); }

    int findMin() const { auto* n = findMin(root); return n ? n->data : -1; }
    int findMax() const { auto* n = findMax(root); return n ? n->data : -1; }
    int height() const { return height(root); }
    int size() const { return countNodes(root); }

    void inorder() const { inorder(root); std::cout << "\n"; }
    void preorder() const { preorder(root); std::cout << "\n"; }
    void postorder() const { postorder(root); std::cout << "\n"; }

    // Level-order (BFS) traversal
    void levelOrder() const {
        if (!root) return;
        std::queue<Node*> q;
        q.push(root);
        while (!q.empty()) {
            Node* node = q.front();
            q.pop();
            std::cout << node->data << " ";
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        std::cout << "\n";
    }
};

int main() {
    BST tree;

    // --- Insert ---
    std::cout << "--- Building BST ---\n";
    int values[] = {50, 30, 70, 20, 40, 60, 80, 10, 35, 65};
    for (int v : values) tree.insert(v);

    /*
     *          50
     *        /    \
     *      30      70
     *     / \     / \
     *   20   40  60   80
     *   /   /      \
     *  10  35      65
     */

    // --- Traversals ---
    std::cout << "\n--- Traversals ---\n";
    std::cout << "In-order (sorted):  "; tree.inorder();
    std::cout << "Pre-order:          "; tree.preorder();
    std::cout << "Post-order:         "; tree.postorder();
    std::cout << "Level-order (BFS):  "; tree.levelOrder();

    // --- Search ---
    std::cout << "\n--- Search ---\n";
    std::cout << "Search 40: " << std::boolalpha << tree.search(40) << "\n";
    std::cout << "Search 99: " << tree.search(99) << "\n";

    // --- Min/Max ---
    std::cout << "\n--- Min/Max ---\n";
    std::cout << "Min: " << tree.findMin() << "\n";
    std::cout << "Max: " << tree.findMax() << "\n";

    // --- Height and Size ---
    std::cout << "\n--- Properties ---\n";
    std::cout << "Height: " << tree.height() << "\n";
    std::cout << "Size: " << tree.size() << " nodes\n";

    // --- Delete ---
    std::cout << "\n--- Delete ---\n";
    std::cout << "Delete 20 (leaf): ";
    tree.remove(20);
    tree.inorder();

    std::cout << "Delete 30 (one child): ";
    tree.remove(30);
    tree.inorder();

    std::cout << "Delete 50 (two children): ";
    tree.remove(50);
    tree.inorder();

    std::cout << "Size after deletions: " << tree.size() << "\n";

    return 0;
}
