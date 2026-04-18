import java.sql.*;

/**
 * LESSON: JDBC (Java Database Connectivity)
 * JDBC allows Java programs to interact with databases.
 *
 * SETUP REQUIRED:
 *   1. Download SQLite JDBC driver: https://github.com/xerial/sqlite-jdbc/releases
 *   2. Add the JAR to classpath:
 *      javac JdbcDemo.java
 *      java -cp ".:sqlite-jdbc-3.x.x.jar" JdbcDemo
 *
 *   Or use Maven/Gradle:
 *      <dependency>
 *          <groupId>org.xerial</groupId>
 *          <artifactId>sqlite-jdbc</artifactId>
 *          <version>3.43.0.0</version>
 *      </dependency>
 */
public class JdbcDemo {
    // SQLite creates a file-based database (no server needed)
    private static final String URL = "jdbc:sqlite:demo.db";

    public static void main(String[] args) {
        try {
            // ===== CONNECT =====
            System.out.println("--- Connecting to Database ---");
            Connection conn = DriverManager.getConnection(URL);
            System.out.println("Connected to SQLite database!");

            // ===== CREATE TABLE =====
            System.out.println("\n--- Creating Table ---");
            Statement stmt = conn.createStatement();
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS students (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    age INTEGER,
                    gpa REAL
                )
            """);
            System.out.println("Table 'students' created.");

            // ===== INSERT (PreparedStatement - prevents SQL injection) =====
            System.out.println("\n--- Inserting Data ---");
            String insertSQL = "INSERT INTO students (name, age, gpa) VALUES (?, ?, ?)";
            PreparedStatement pstmt = conn.prepareStatement(insertSQL);

            // Insert multiple records
            String[][] data = {
                {"Emmanuel", "20", "3.8"},
                {"Alice", "22", "3.5"},
                {"Bob", "21", "3.2"},
                {"Charlie", "23", "3.9"}
            };
            for (String[] row : data) {
                pstmt.setString(1, row[0]);
                pstmt.setInt(2, Integer.parseInt(row[1]));
                pstmt.setDouble(3, Double.parseDouble(row[2]));
                pstmt.executeUpdate();
            }
            System.out.println(data.length + " records inserted.");

            // ===== SELECT (Query) =====
            System.out.println("\n--- Querying All Students ---");
            ResultSet rs = stmt.executeQuery("SELECT * FROM students");
            while (rs.next()) {
                System.out.printf("ID: %d | Name: %-10s | Age: %d | GPA: %.1f%n",
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getInt("age"),
                    rs.getDouble("gpa"));
            }

            // ===== SELECT with WHERE (PreparedStatement) =====
            System.out.println("\n--- Students with GPA > 3.5 ---");
            PreparedStatement queryPS = conn.prepareStatement(
                "SELECT name, gpa FROM students WHERE gpa > ?");
            queryPS.setDouble(1, 3.5);
            ResultSet filtered = queryPS.executeQuery();
            while (filtered.next()) {
                System.out.printf("%s (GPA: %.1f)%n",
                    filtered.getString("name"),
                    filtered.getDouble("gpa"));
            }

            // ===== UPDATE =====
            System.out.println("\n--- Updating Bob's GPA ---");
            PreparedStatement updatePS = conn.prepareStatement(
                "UPDATE students SET gpa = ? WHERE name = ?");
            updatePS.setDouble(1, 3.7);
            updatePS.setString(2, "Bob");
            int updated = updatePS.executeUpdate();
            System.out.println(updated + " record(s) updated.");

            // ===== DELETE =====
            System.out.println("\n--- Deleting Charlie ---");
            PreparedStatement deletePS = conn.prepareStatement(
                "DELETE FROM students WHERE name = ?");
            deletePS.setString(1, "Charlie");
            int deleted = deletePS.executeUpdate();
            System.out.println(deleted + " record(s) deleted.");

            // Final state
            System.out.println("\n--- Final State ---");
            ResultSet finalRS = stmt.executeQuery("SELECT * FROM students");
            while (finalRS.next()) {
                System.out.printf("ID: %d | Name: %-10s | Age: %d | GPA: %.1f%n",
                    finalRS.getInt("id"),
                    finalRS.getString("name"),
                    finalRS.getInt("age"),
                    finalRS.getDouble("gpa"));
            }

            // Cleanup
            stmt.execute("DROP TABLE IF EXISTS students");
            conn.close();
            System.out.println("\nDatabase connection closed.");

        } catch (SQLException e) {
            System.out.println("Database error: " + e.getMessage());
        }
    }
}
