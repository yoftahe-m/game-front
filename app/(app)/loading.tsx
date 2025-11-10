import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, BackHandler, FlatList } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { RootState } from '@/store';
import { getSocket } from '@/socket';
import Money from '@/assets/icons/Money';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';

export default function LoadingScreen() {
  const socket = getSocket();
  const { gameData, gameId } = useLocalSearchParams();
  const [game, setGame] = useState<{ id: string; type: string; amount: string; maxPlayers: string; winPinCount: string; players: any[] }>(
    JSON.parse(gameData as string)
  );

  const user = useSelector((state: RootState) => state.user.data);

  function leaveGame() {
    if (!socket || !game) return;
    socket.emit('leaveGame', { gameId: game.id });
    router.back();
  }

  useFocusEffect(
    useCallback(() => {
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
        picture: user?.profilePic,
        gameId,
      });

    } else {
      socket.emit('createGame', {
        userId: user!.id,
        username: user!.fullName,
        picture: user!.profilePic,
        type: game.type,
        options: {},
        amount: Number(game.amount),
        maxPlayers: Number(game.maxPlayers),
        winPinCount: Number(game.winPinCount),
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
      <VStack space="md" className="flex-1 p-2">
        <VStack className=" flex-1 items-center ">
          <Box className=" rounded-3xl w-full flex-1 p-4 shadow-md" style={{ backgroundColor: '#1d3285' }}>
            <HStack className="justify-between items-center py-4 px-2F">
              <Text size="xl" bold>
                {game.type}
              </Text>

              <HStack space="md">
                <HStack space="sm" className="items-center">
                  <Text>
                    {game?.players.length || 0}/{game?.maxPlayers || 0}
                  </Text>
                  <Feather name="users" size={16} color="white" />
                </HStack>
                <HStack space="sm" className="items-center">
                  <Text>
                    {Number(game?.amount || 0) * (game?.players.length || 0)} /{Number(game?.amount || 0) * Number(game?.maxPlayers || 0)}
                  </Text>
                  <Money height={16} width={26} />
                </HStack>
              </HStack>
            </HStack>

            <FlatList
              keyExtractor={(_, index) => index.toString()}
              data={game.players}
              renderItem={({ item }) => {
                return (
                  <HStack className=" items-center p-4 rounded-lg mb-2" space="md" style={{ backgroundColor: '#456bb0' }}>
                    <Avatar size="md">
                      <AvatarFallbackText>{item.username}</AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: item.picture,
                        }}
                        alt="profile"
                      />
                    </Avatar>
                    <Text size="lg" bold>
                      {item.username}
                    </Text>
                  </HStack>
                );
              }}
            />
          </Box>
        </VStack>
        <HStack className="items-center justify-center p-4 bg-green-600 rounded-lg" space="md">
          <ActivityIndicator size="small" color={'white'} />
          <Text bold>{game.players.length === Number(game.maxPlayers) ? 'Game is Starting' : 'Waiting for others to join the game.'}</Text>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
}
