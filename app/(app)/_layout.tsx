import { Stack } from 'expo-router';
import { socket } from '@/socket';

socket.on('connect', () => {});

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0c2665' },
        contentStyle: { backgroundColor: '#071843' },
        headerTitleStyle: { color: 'white' },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
