import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Toast from 'react-native-root-toast';

import { RootState } from '@/store';
import { connectSocket, getSocket } from '@/socket';

export default function AppLayout() {
  const [socket, setSocket] = useState(getSocket());
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  useEffect(() => {
    if (accessToken && !socket) {
      const newSocket = connectSocket(accessToken);
      setSocket(newSocket);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!socket) return;
    const errorHandler = (message: string) => {
      Toast.show(message, {
        duration: Toast.durations.LONG,
      });
    };
    socket.on('error', errorHandler);
    const connectErrorHandler = () => {
      Toast.show('Failed to connect to the server.', {
        duration: Toast.durations.LONG,
      });
    };
    socket.on('connect_error', connectErrorHandler);
    return () => {
      socket.off('error', errorHandler);
      socket.off('connect_error', connectErrorHandler);
    };
  }, [socket]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0c2665' },
        contentStyle: { backgroundColor: '#071843' },
        headerTitleStyle: { color: 'white' },
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
