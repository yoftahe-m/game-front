import { Stack } from 'expo-router';
import { connectSocket, getSocket } from '@/socket';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useEffect, useState } from 'react';
import Toast from 'react-native-root-toast';

export default function AppLayout() {
  const [socket, setSocket] = useState(getSocket());
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  useEffect(() => {
    if (accessToken && !socket) {
      connectSocket(accessToken);
      setSocket(getSocket());
    }
  }, [accessToken]);

  useEffect(() => {
    if (!socket) return;

    socket.on('error', (message) => {
      Toast.show(message, {
        duration: Toast.durations.LONG,
      });
    });

    return () => {
      socket?.off('error');
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
