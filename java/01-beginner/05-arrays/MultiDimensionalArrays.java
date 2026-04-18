/**
 * LESSON: Multi-Dimensional Arrays
 * Arrays of arrays - commonly used for grids, matrices, and tables.
 */
public class MultiDimensionalArrays {
    public static void main(String[] args) {
        // ===== 2D ARRAY =====
        // Think of it as rows and columns
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };

        System.out.println("--- 2D Array (Matrix) ---");
        System.out.println("Element at [1][2]: " + matrix[1][2]); // 6
        System.out.println("Rows: " + matrix.length);             // 3
        System.out.println("Cols in row 0: " + matrix[0].length); // 3

        // Iterating 2D array
        System.out.println("\nFull matrix:");
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                System.out.printf("%d\t", matrix[i][j]);
            }
            System.out.println();
        }

        // Using for-each
        System.out.println("\nUsing for-each:");
        for (int[] row : matrix) {
            for (int val : row) {
                System.out.printf("%d\t", val);
            }
            System.out.println();
        }

        // ===== JAGGED ARRAY =====
        // Rows can have different lengths
        int[][] jagged = new int[3][];
        jagged[0] = new int[]{1, 2};
        jagged[1] = new int[]{3, 4, 5, 6};
        jagged[2] = new int[]{7};

        System.out.println("\n--- Jagged Array ---");
        for (int i = 0; i < jagged.length; i++) {
            System.out.print("Row " + i + ": ");
            for (int val : jagged[i]) {
                System.out.print(val + " ");
            }
            System.out.println("(length: " + jagged[i].length + ")");
        }
    }
}
