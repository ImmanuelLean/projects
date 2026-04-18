import java.io.*;
import java.nio.file.*;
import java.util.List;

/**
 * LESSON: File I/O
 * Reading from and writing to files in Java.
 */
public class FileReadWrite {
    public static void main(String[] args) {
        String fileName = "sample.txt";

        // ===== WRITING WITH BUFFEREDWRITER =====
        System.out.println("--- Writing to File ---");
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(fileName))) {
            writer.write("Line 1: Hello, File I/O!");
            writer.newLine();
            writer.write("Line 2: Java makes file handling easy.");
            writer.newLine();
            writer.write("Line 3: This is the last line.");
            System.out.println("File written successfully!");
        } catch (IOException e) {
            System.out.println("Write error: " + e.getMessage());
        }

        // ===== READING WITH BUFFEREDREADER =====
        System.out.println("\n--- Reading with BufferedReader ---");
        try (BufferedReader reader = new BufferedReader(new FileReader(fileName))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("Read error: " + e.getMessage());
        }

        // ===== MODERN WAY: java.nio.file.Files =====
        System.out.println("\n--- Writing with Files (NIO) ---");
        Path path = Paths.get("sample_nio.txt");
        try {
            // Write all lines at once
            List<String> lines = List.of(
                "NIO Line 1: Modern Java file I/O",
                "NIO Line 2: Simpler and cleaner",
                "NIO Line 3: Uses java.nio.file"
            );
            Files.write(path, lines);
            System.out.println("NIO file written!");

            // Read all lines at once
            System.out.println("\n--- Reading with Files (NIO) ---");
            List<String> readLines = Files.readAllLines(path);
            for (String line : readLines) {
                System.out.println(line);
            }

            // Read entire file as single string
            String content = Files.readString(path);
            System.out.println("\nFull content length: " + content.length() + " chars");

            // Append to file
            Files.writeString(path, "\nNIO Line 4: Appended!", StandardOpenOption.APPEND);
            System.out.println("Line appended!");

            // Check file info
            System.out.println("\n--- File Info ---");
            System.out.println("Exists: " + Files.exists(path));
            System.out.println("Size: " + Files.size(path) + " bytes");

        } catch (IOException e) {
            System.out.println("NIO error: " + e.getMessage());
        }

        // Cleanup
        try {
            Files.deleteIfExists(Paths.get(fileName));
            Files.deleteIfExists(path);
            System.out.println("\nCleanup: temp files deleted");
        } catch (IOException e) {
            System.out.println("Cleanup error: " + e.getMessage());
        }
    }
}
