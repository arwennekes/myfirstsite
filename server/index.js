const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for both development and production
const allowedOrigins = [
  "http://localhost:3000",
  "https://planning-poker-33vvyy413-annabels-projects-e96bae08.vercel.app",
  "https://planning-poker-kx8eyidk4-annabels-projects-e96bae08.vercel.app",
  "https://planning-poker-oqda0mz6n-annabels-projects-e96bae08.vercel.app",
  "https://planning-poker-dt2um7qb5-annabels-projects-e96bae08.vercel.app",
  "https://planning-poker-app.vercel.app",
  "https://myfirstsite-rs56.onrender.com"
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

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('joinRoom', ({ roomId, isHost }) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        isTimerRunning: false,
        timeLeft: 5,
        stickers: [],
        allStickers: [] // Store all stickers but only reveal after timer
      });
    }

    console.log(`Player joined room ${roomId}`);
  });

  // Start timer
  socket.on('startTimer', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.isTimerRunning = true;
      room.timeLeft = 5;
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
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 