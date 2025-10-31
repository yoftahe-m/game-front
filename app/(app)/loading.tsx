import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { getSocket } from '@/socket';
import { BackHandler, FlatList, ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Avatar, AvatarFallbackText, AvatarImage, AvatarBadge } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function LoadingScreen() {
  const socket = getSocket();
  const { type, maxPlayers, amount, gameId } = useLocalSearchParams();
  const [game, setGame] = useState<{ id: string; type: string; amount: string; maxPlayers: number; players: any[] }>();
  const user = useSelector((state: RootState) => state.user.data);

  function leaveGame() {
    if (!socket || !game) return;
    socket.emit('leaveGame', { gameId: game.id });
    router.back();
  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        leaveGame();
        return true; // prevent default back
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [game])
  );

  useEffect(() => {
    if (!socket) return;
    if (gameId) {
      socket.emit('joinGame', {
        userId: user!.id,
        username: user!.fullName,
        gameId,
      });
    } else {
      socket.emit('createGame', {
        userId: user!.id,
        username: user!.fullName,
        type,
        options: {},
        amount,
      });
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('waiting', (newGame) => {
      setGame(newGame);
    });

    return () => {
      socket?.off('waiting');
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('gameStarted', (game) => {
      router.replace({ pathname: '/(app)/play', params: { game: JSON.stringify(game) } });
    });

    return () => {
      socket?.off('gameStarted');
    };
  }, []);



  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 8 }}>
      <VStack space="md">
        <Spinner size="large" />
        <Text size="xl" bold className="text-center">
          {game?.type}
        </Text>
        <Box className="border w-full rounded-2xl overflow-hidden">
          <Box className="flex flex-row justify-between items-center p-4 border-b">
            <Text>
              {game?.players.length || 0}/{game?.maxPlayers || 0} players
            </Text>
            <Text>
              {Number(game?.amount || 0) * (game?.players.length || 0)} /{Number(game?.amount || 0) * Number(game?.maxPlayers || 0)} Game Coins
            </Text>
          </Box>
          <FlatList
            data={game?.players || []}
            renderItem={({ item }) => (
              <HStack space="md" className="items-center">
                <Avatar size="md">
                  <AvatarFallbackText>{item.username}</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                    }}
                    alt="prof"
                  />
                  <AvatarBadge />
                </Avatar>
                <Text size="lg" bold>
                  {item.username}
                </Text>
              </HStack>
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => String(item.userId)}
            contentContainerStyle={{ gap: 10, padding: 4, height: 300 }}
          />
        </Box>
      </VStack>
    </SafeAreaView>
  );
}
