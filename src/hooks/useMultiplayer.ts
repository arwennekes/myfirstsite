import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import confetti from 'canvas-confetti';

interface StickerPosition {
  cellIndex: number;
  relativeX: number;
  relativeY: number;
}

interface Sticker {
  id: string;
  emoji: string;
  position: StickerPosition;
  playerId: string;
}

interface RoomState {
  isTimerRunning: boolean;
  timeLeft: number;
  stickers: Sticker[];
}

export const useMultiplayer = (roomId: string, isHost: boolean) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomState, setRoomState] = useState<RoomState>({
    isTimerRunning: false,
    timeLeft: 5,
    stickers: []
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Use deployed server URL in production, localhost in development
    const serverUrl = import.meta.env.DEV 
      ? 'http://localhost:3002'
      : 'https://myfirstsite-rs56.onrender.com';
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('joinRoom', { roomId, isHost });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('timerStarted', ({ timeLeft }) => {
      setRoomState(prev => ({
        ...prev,
        isTimerRunning: true,
        timeLeft,
        stickers: []
      }));
    });

    newSocket.on('timerUpdate', ({ timeLeft }) => {
      setRoomState(prev => ({
        ...prev,
        timeLeft
      }));
    });

    newSocket.on('timerEnded', ({ stickers }) => {
      setRoomState(prev => ({
        ...prev,
        isTimerRunning: false,
        stickers
      }));
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    });

    newSocket.on('stickerPlaced', ({ sticker, stickers }) => {
      setRoomState(prev => ({
        ...prev,
        stickers
      }));
    });

    newSocket.on('confetti', () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    });

    return () => {
      newSocket.close();
    };
  }, [roomId, isHost]);

  const startTimer = () => {
    if (socket && isHost) {
      socket.emit('startTimer', { roomId });
    }
  };

  const placeSticker = (position: StickerPosition, emoji: string) => {
    if (socket && roomState.isTimerRunning) {
      socket.emit('placeSticker', { roomId, position, emoji });
    }
  };

  return {
    roomState,
    isConnected,
    startTimer,
    placeSticker
  };
}; 