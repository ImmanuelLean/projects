import java.io.*;
import java.util.*;

/**
 * LESSON: Serialization & Deserialization
 * Serialization   = converting an object to a byte stream (to save or send)
 * Deserialization = converting a byte stream back to an object
 *
 * The class must implement java.io.Serializable interface.
 * Use 'transient' keyword to exclude fields from serialization.
 */
public class SerializationDemo {
    public static void main(String[] args) {
        String filename = "game_save.ser";

        // ===== CREATE OBJECT =====
        GameSave save = new GameSave("Emmanuel", 42, 15750,
            Arrays.asList("Sword of Fire", "Shield of Ice", "Health Potion x5"));
        save.setSecretKey("abc123"); // transient field - won't be saved

        System.out.println("--- Original Object ---");
        System.out.println(save);
        System.out.println("Secret key: " + save.getSecretKey());

        // ===== SERIALIZE (save to file) =====
        System.out.println("\n--- Serializing ---");
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new FileOutputStream(filename))) {
            oos.writeObject(save);
            System.out.println("Object saved to " + filename);
        } catch (IOException e) {
            System.out.println("Serialize error: " + e.getMessage());
        }

        // ===== DESERIALIZE (load from file) =====
        System.out.println("\n--- Deserializing ---");
        try (ObjectInputStream ois = new ObjectInputStream(
                new FileInputStream(filename))) {
            GameSave loaded = (GameSave) ois.readObject();
            System.out.println("Object loaded from " + filename);
            System.out.println(loaded);
            System.out.println("Secret key: " + loaded.getSecretKey()); // null! (transient)
        } catch (IOException | ClassNotFoundException e) {
            System.out.println("Deserialize error: " + e.getMessage());
        }

        // ===== SERIALIZE MULTIPLE OBJECTS =====
        System.out.println("\n--- Multiple Objects ---");
        String multiFile = "players.ser";
        List<GameSave> players = Arrays.asList(
            new GameSave("Alice", 30, 8000, Arrays.asList("Bow", "Arrow x50")),
            new GameSave("Bob", 55, 22000, Arrays.asList("Staff", "Robe", "Mana Potion x10"))
        );

        // Serialize list
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(multiFile))) {
            oos.writeObject(players);
            System.out.println("Saved " + players.size() + " players");
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }

        // Deserialize list
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(multiFile))) {
            @SuppressWarnings("unchecked")
            List<GameSave> loadedPlayers = (List<GameSave>) ois.readObject();
            System.out.println("Loaded " + loadedPlayers.size() + " players:");
            loadedPlayers.forEach(p -> System.out.println("  " + p));
        } catch (IOException | ClassNotFoundException e) {
            System.out.println("Error: " + e.getMessage());
        }

        // Cleanup temp files
        new File(filename).delete();
        new File(multiFile).delete();
        System.out.println("\nTemp files cleaned up.");
    }
}

class GameSave implements Serializable {
    // serialVersionUID ensures compatibility between saved and loaded versions
    private static final long serialVersionUID = 1L;

    private String playerName;
    private int level;
    private long score;
    private List<String> inventory;

    // 'transient' fields are NOT serialized
    private transient String secretKey;

    GameSave(String playerName, int level, long score, List<String> inventory) {
        this.playerName = playerName;
        this.level = level;
        this.score = score;
        this.inventory = inventory;
    }

    String getSecretKey() { return secretKey; }
    void setSecretKey(String key) { this.secretKey = key; }

    @Override
    public String toString() {
        return String.format("GameSave{player='%s', level=%d, score=%d, inventory=%s}",
            playerName, level, score, inventory);
    }
}
