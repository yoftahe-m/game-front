// socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (socket) return socket; // reuse existing

  socket = io('http://192.168.0.60:8100', {
    transports: ['websocket'],
    auth: { token },
  });

  socket.on('connect', () => console.log('✅ Connected:', socket?.id));
  socket.on('connect_error', (err) => console.error('❌ Socket error:', err));

  return socket;
};

export const getSocket = () => socket; // helper to access current instance
