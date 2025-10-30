import { Stack } from 'expo-router';
import { connectSocket } from '@/socket';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useEffect } from 'react';

export default function AppLayout() {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  useEffect(() => {
    if (accessToken) connectSocket(accessToken);
  }, [accessToken]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0c2665' },
        contentStyle: { backgroundColor: '#071843' },
        headerTitleStyle: { color: 'white' },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="tic-tac-toe" options={{ headerShown: false }} />
    </Stack>
  );
}
