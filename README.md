# Planning Poker

A modern, collaborative planning poker application built with React, TypeScript, and Tailwind CSS.

## Features

- **Real-time Collaboration**: Join rooms with unique room IDs
- **Planning Poker Cards**: Standard Fibonacci sequence (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89) plus special cards (?, ☕)
- **Host Controls**: Room hosts can reveal votes and reset games
- **Player Management**: Add players and track voting status
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd planning-poker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## How to Use

1. **Create a Room**: Enter your name and click "Create Room"
2. **Join a Room**: Enter your name and room ID, then click "Join Room"
3. **Vote**: Click on a planning poker card to cast your vote
4. **Reveal**: Host can reveal all votes to see the average
5. **Reset**: Host can reset the game for a new round

## Technology Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icons

## Project Structure

```
src/
├── components/
│   ├── Welcome.tsx          # Landing page
│   └── PlanningPoker.tsx    # Main game component
├── lib/
│   └── utils.ts             # Utility functions
├── App.tsx                  # Main app component
├── main.tsx                 # Entry point
└── index.css               # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own planning poker sessions! 