import java.io.*;
import java.net.*;
import java.util.Scanner;

/**
 * LESSON: TCP Client
 * Connects to the SimpleServer and sends/receives messages.
 *
 * HOW TO RUN:
 *   1. First start the server: java SimpleServer
 *   2. Then in a new terminal: javac SimpleClient.java && java SimpleClient
 *   3. Type messages and see the server echo them back
 *   4. Type 'exit' to disconnect
 */
public class SimpleClient {
    public static void main(String[] args) {
        String host = "localhost";
        int port = 5000;

        try (Socket socket = new Socket(host, port)) {
            System.out.println("Connected to server at " + host + ":" + port);

            // Set up I/O
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            Scanner scanner = new Scanner(System.in);

            // Read welcome message from server
            String welcome = in.readLine();
            System.out.println("Server: " + welcome);

            // Chat loop
            String userInput;
            while (true) {
                System.out.print("You: ");
                userInput = scanner.nextLine();

                out.println(userInput); // send to server

                String response = in.readLine(); // receive from server
                System.out.println("Server: " + response);

                if (userInput.equalsIgnoreCase("exit")) break;
            }

            scanner.close();
            System.out.println("Disconnected from server.");

        } catch (ConnectException e) {
            System.out.println("Could not connect. Is the server running?");
        } catch (IOException e) {
            System.out.println("Client error: " + e.getMessage());
        }
    }
}
