// ============================================
// WEBSOCKETS & REAL-TIME COMMUNICATION
// ============================================
// npm install socket.io (server) + socket.io-client (client)

// ---- 1. WEBSOCKET vs HTTP ----

const comparison = `
  HTTP:
    Request → Response (one-way per request)
    Client initiates, server responds
    Stateless, new connection each time
    Good for: REST APIs, page loads, forms

  WebSocket:
    Full-duplex (both sides send anytime)
    Persistent connection
    Low latency, low overhead
    Good for: Chat, gaming, live feeds, notifications

  Server-Sent Events (SSE):
    One-way: server → client only
    Uses HTTP, auto-reconnects
    Simpler than WebSockets
    Good for: Live feeds, notifications, stock tickers
`;

// ---- 2. SOCKET.IO SERVER ----

const socketServer = `
// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// ===== Connection Handling =====
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // ===== Listen for events =====
  socket.on('chat:message', (data) => {
    console.log('Message:', data);
    // Broadcast to ALL connected clients (including sender)
    io.emit('chat:message', {
      id: Date.now(),
      user: data.user,
      text: data.text,
      timestamp: new Date().toISOString(),
    });
  });

  // ===== Broadcast to others (not sender) =====
  socket.on('user:typing', (data) => {
    socket.broadcast.emit('user:typing', data);
  });

  // ===== Rooms =====
  socket.on('room:join', (roomName) => {
    socket.join(roomName);
    console.log(\`\${socket.id} joined room: \${roomName}\`);

    // Notify room members
    socket.to(roomName).emit('room:userJoined', {
      userId: socket.id,
      room: roomName,
    });
  });

  socket.on('room:leave', (roomName) => {
    socket.leave(roomName);
    socket.to(roomName).emit('room:userLeft', { userId: socket.id });
  });

  socket.on('room:message', ({ room, message }) => {
    // Send only to room members
    io.to(room).emit('room:message', {
      id: Date.now(),
      user: socket.id,
      text: message,
      room,
    });
  });

  // ===== Disconnect =====
  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, reason);
    io.emit('user:left', { userId: socket.id });
  });

  // ===== Error handling =====
  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(3001, () => console.log('Server on port 3001'));
`;

// ---- 3. SOCKET.IO CLIENT (React) ----

const socketClient = `
// hooks/useSocket.js
import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

function useSocket(url = 'http://localhost:3001') {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(url, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected:', socketRef.current.id);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [url]);

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  return { socket: socketRef, emit, on };
}

// ===== Chat Component =====
function ChatRoom({ room, username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState('');
  const { emit, on } = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    emit('room:join', room);

    const unsubMessage = on('room:message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    const unsubTyping = on('user:typing', (data) => {
      setTyping(data.user + ' is typing...');
      setTimeout(() => setTyping(''), 2000);
    });

    return () => {
      emit('room:leave', room);
      unsubMessage();
      unsubTyping();
    };
  }, [room, emit, on]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    emit('room:message', { room, message: input });
    setInput('');
  };

  const handleTyping = () => {
    emit('user:typing', { user: username, room });
  };

  return (
    <div className="chat">
      <h2>Room: {room}</h2>

      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className="message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {typing && <p className="typing">{typing}</p>}

      <form onSubmit={sendMessage}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleTyping}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
`;

// ---- 4. NAMESPACES ----

const namespaces = `
// Server: separate namespaces for different features
const chatNamespace = io.of('/chat');
const notifNamespace = io.of('/notifications');

chatNamespace.on('connection', (socket) => {
  console.log('Chat user connected');
  socket.on('message', (data) => {
    chatNamespace.emit('message', data);
  });
});

notifNamespace.on('connection', (socket) => {
  console.log('Notification client connected');
  // Send notifications only to this namespace
  notifNamespace.emit('notification', { text: 'New update!' });
});

// Client: connect to specific namespace
const chatSocket = io('http://localhost:3001/chat');
const notifSocket = io('http://localhost:3001/notifications');
`;

// ---- 5. AUTHENTICATION WITH SOCKETS ----

const socketAuth = `
// Server: authenticate socket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));

  try {
    const jwt = require('jsonwebtoken');
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;  // attach user to socket
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('Authenticated user:', socket.user.name);
  // Join user's personal room for DMs
  socket.join(\`user:\${socket.user.id}\`);
});

// Client: send token
const socket = io('http://localhost:3001', {
  auth: { token: localStorage.getItem('token') },
});
`;

// ---- 6. SERVER-SENT EVENTS (SSE) ----

const sseExample = `
// ===== SSE Server (Express) =====
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // Send event every 2 seconds
  const interval = setInterval(() => {
    const data = JSON.stringify({
      time: new Date().toISOString(),
      value: Math.random(),
    });
    res.write(\`data: \${data}\\n\\n\`);
  }, 2000);

  // Named events
  res.write(\`event: notification\\ndata: {"msg": "Connected!"}\\n\\n\`);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// ===== SSE Client (React) =====
function LiveFeed() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const source = new EventSource('/api/events');

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEvents(prev => [...prev.slice(-50), data]);  // keep last 50
    };

    source.addEventListener('notification', (event) => {
      const data = JSON.parse(event.data);
      console.log('Notification:', data);
    });

    source.onerror = () => {
      console.log('SSE connection lost, reconnecting...');
    };

    return () => source.close();
  }, []);

  return (
    <div>
      {events.map((e, i) => <p key={i}>{e.time}: {e.value.toFixed(4)}</p>)}
    </div>
  );
}
`;

console.log("=== Real-Time Communication Summary ===");
console.log(`
  Socket.IO:
    Full-duplex, rooms, namespaces, auto-reconnect
    Best for: Chat, collaboration, gaming

  SSE (Server-Sent Events):
    Server → Client only, auto-reconnect, simple
    Best for: Notifications, live feeds, dashboards

  WebSocket vs SSE:
    Need two-way?     → WebSocket/Socket.IO
    Server push only? → SSE (simpler)
`);
