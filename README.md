# Planning Poker - Multiplayer Sticker Voting App

A real-time multiplayer planning poker application where teams can vote on story points using emoji stickers on a Fibonacci grid.

## Features

- 🎯 **Real-time multiplayer** - Multiple players can join the same room
- ⏰ **5-second voting timer** - Quick, focused voting sessions
- 🎨 **Emoji stickers** - Fun and visual voting system
- 🎉 **Confetti celebration** - Automatic reveal with celebration
- 📱 **Responsive design** - Works on desktop and mobile
- 🔗 **Easy room sharing** - Copy room code with one click

## How to Play

1. **Create a room** - Enter a room code and click "Join Room"
2. **Share the room** - Copy the room code and share with your team
3. **Start voting** - Host clicks "Start Timer" to begin a 5-second voting round
4. **Place stickers** - Click anywhere on the grid to place your emoji sticker
5. **See results** - When timer ends, all stickers are revealed with confetti!

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Socket.io
- **Real-time**: WebSocket connections
- **Build Tool**: Vite

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
1. Start the server:
   ```bash
   npm run server
   ```
2. Start the client (in a new terminal):
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000 in your browser

### Testing Multiplayer
1. Open multiple browser windows/tabs
2. Join the same room code in each window
3. Start a timer and place stickers to test real-time functionality

## Deployment

This app can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **Render**

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with automatic builds

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── PlanningPoker.tsx    # Main game component
│   │   └── Welcome.tsx          # Room entry component
│   ├── hooks/
│   │   └── useMultiplayer.ts    # Socket.io multiplayer logic
│   └── main.tsx                 # App entry point
├── server/
│   └── index.js                 # Socket.io server
└── package.json
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License 