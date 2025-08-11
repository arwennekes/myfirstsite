const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for both development and production
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://planning-poker-33vvyy413-annabels-projects-e96bae08.vercel.app",
  "https://planning-poker-kx8eyidk4-annabels-projects-e96bae08.vercel.app",
  "https://planning-poker-oqda0mz6n-annabels-projects-e96bae08.vercel.app",
  "https://planning-poker-dt2um7qb5-annabels-projects-e96bae08.vercel.app",
  "https://planning-poker-app.vercel.app",
  "https://planning-poker-app-three.vercel.app",
  "https://myfirstsite-rs56.onrender.com",
  "https://www.annabelwennekes.site"
];

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Planning Poker Server is running' });
});

// Store room data
const rooms = new Map();
// Track users per room
const roomUsers = new Map();
// Track host per room
const roomHosts = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('joinRoom', ({ roomId, isHost }) => {
    if (isHost) {
      // Register host for this room
      roomHosts.set(roomId, socket.id);
    } else {
      // If not host, only allow join if host exists
      if (!roomHosts.has(roomId)) {
        socket.emit('roomNotFound');
        return;
      }
    }
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        isTimerRunning: false,
        timeLeft: 10,
        stickers: [],
        allStickers: [] // Store all stickers but only reveal after timer
      });
    }

    // Track users in room
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Set());
    }
    roomUsers.get(roomId).add(socket.id);
    // Broadcast user count
    io.to(roomId).emit('userCountUpdate', { count: roomUsers.get(roomId).size });

    console.log(`Player joined room ${roomId}`);
  });

  // Start timer
  socket.on('startTimer', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.isTimerRunning = true;
      room.timeLeft = 10;
      room.stickers = [];
      room.allStickers = [];

      io.to(roomId).emit('timerStarted', { timeLeft: room.timeLeft });
      
      // Start countdown
      const countdown = setInterval(() => {
        room.timeLeft--;
        io.to(roomId).emit('timerUpdate', { timeLeft: room.timeLeft });
        
        if (room.timeLeft <= 0) {
          room.isTimerRunning = false;
          // Reveal all stickers and trigger confetti
          room.stickers = room.allStickers;
          io.to(roomId).emit('timerEnded', { stickers: room.stickers });
          io.to(roomId).emit('confetti');
          clearInterval(countdown);
        }
      }, 1000);
    }
  });

  // Place sticker
  socket.on('placeSticker', ({ roomId, position, emoji }) => {
    const room = rooms.get(roomId);
    if (room && room.isTimerRunning) {
      // Remove any existing sticker from this player
      room.allStickers = room.allStickers.filter(sticker => sticker.playerId !== socket.id);
      
      const sticker = {
        id: Date.now().toString(),
        emoji,
        position,
        playerId: socket.id
      };

      // Add to all stickers but only show to the player who placed it
      room.allStickers.push(sticker);
      
      // Only show the player's own sticker during timer
      const playerSticker = [sticker];
      socket.emit('stickerPlaced', { sticker, stickers: playerSticker });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    // Remove user from all rooms they were in
    for (const [roomId, users] of roomUsers.entries()) {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        // If this user was the host, remove the host
        if (roomHosts.get(roomId) === socket.id) {
          roomHosts.delete(roomId);
        }
        // Broadcast new user count
        io.to(roomId).emit('userCountUpdate', { count: users.size });
        // Optionally clean up empty rooms
        if (users.size === 0) {
          roomUsers.delete(roomId);
          rooms.delete(roomId);
          roomHosts.delete(roomId);
        }
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 