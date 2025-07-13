import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import confetti from 'canvas-confetti';

interface Sticker {
  id: string;
  emoji: string;
  position: { x: number; y: number };
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
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
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

  const placeSticker = (position: { x: number; y: number }, emoji: string) => {
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