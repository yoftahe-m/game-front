import { Stack } from 'expo-router';
import { socket } from '@/socket';

socket.on('connect', () => {});

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
