import java.io.*;
import java.net.*;

/**
 * LESSON: TCP Server
 * A basic server that listens for client connections and echoes messages.
 *
 * HOW TO RUN:
 *   1. Compile: javac SimpleServer.java
 *   2. Run server: java SimpleServer
 *   3. In another terminal, run: java SimpleClient
 *   4. Type messages in the client terminal
 */
public class SimpleServer {
    public static void main(String[] args) {
        int port = 5000;

        // ServerSocket listens for incoming connections on a port
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Server started on port " + port);
            System.out.println("Waiting for client connection...");

            // accept() blocks until a client connects
            Socket clientSocket = serverSocket.accept();
            System.out.println("Client connected: " + clientSocket.getInetAddress());

            // Set up I/O streams
            BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);

            out.println("Welcome to the Java Echo Server! Type 'exit' to disconnect.");

            // Echo loop: read message from client and send it back
            String message;
            while ((message = in.readLine()) != null) {
                System.out.println("Received: " + message);

                if (message.equalsIgnoreCase("exit")) {
                    out.println("Goodbye!");
                    break;
                }

                out.println("Echo: " + message);
            }

            clientSocket.close();
            System.out.println("Client disconnected. Server shutting down.");

        } catch (IOException e) {
            System.out.println("Server error: " + e.getMessage());
        }
    }
}
