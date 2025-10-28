import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { socket } from '@/socket';

// socket.on('gameFound', (gameId) => {
//   console.log('Game found:', gameId);
// });

export default function LoadingScreen() {
  useEffect(() => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    socket.emit('findGame', randomNumber);
    socket.on('gameStart', (gameData) => {
      router.replace({
        pathname: '/tic-tac-toe',
        params: {
          roomId: gameData.id,
          userId: randomNumber,
        },
      });
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box>
        <Spinner size="large" />
        <Text size="lg">Loading, please wait...</Text>
      </Box>
    </SafeAreaView>
  );
}
