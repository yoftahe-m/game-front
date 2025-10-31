import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { RootState } from '@/store';
import { getSocket } from '@/socket';
import { Text } from '@/components/ui/text';
import { Grid, GridItem } from '@/components/ui/grid';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';

const TicTacToe = () => {
  const socket = getSocket();
  const { game } = useLocalSearchParams<{ game: string }>();

  const user = useSelector((state: RootState) => state.user.data);
  const [playingGame, setPlayingGame] = useState(JSON.parse(game));

  useEffect(() => {
    if (!socket) return;
    socket.on('gameUpdate', (gameUpdate) => {
      setPlayingGame(gameUpdate);
    });

    return () => {
      socket?.off('gameUpdate');
    };
  }, []);

  function handlePress(index: number) {
    if (!socket) return;
    socket.emit('ticTacToe:selectCell', { gameId: playingGame.id, cell: index });
  }

  return (
    <VStack className=" w-full" space="md">
      <HStack className="justify-between">
        <VStack space="xs">
          <Avatar size="md" className="border border-white rounded-lg overflow-hidden">
            <AvatarFallbackText>{playingGame.players[0].username}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: playingGame.players[0].username,
              }}
              className="rounded-none"
            />
          </Avatar>
          <Text>{playingGame.players[0].username}</Text>
        </VStack>
        <VStack space="xs">
          <Avatar size="md" className="border border-white rounded-lg overflow-hidden">
            <AvatarFallbackText>{playingGame.players[1].username}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: playingGame.players[1].username,
              }}
              className="rounded-none "
            />
          </Avatar>
          <Text>{playingGame.players[1].username}</Text>
        </VStack>
      </HStack>
      <Grid className="gap-4" _extra={{ className: 'grid-cols-3' }}>
        {playingGame.options.board.map((value: string, index: number) => {
          return (
            <GridItem key={index} className="bg-background-200 rounded-xl shadow-md " style={{ aspectRatio: 1 }} _extra={{ className: 'col-span-1' }}>
              <Pressable onPress={() => handlePress(index)} className="flex-1 items-center justify-center active:opacity-80">
                <Text className={`text-5xl font-extrabold ${value === user?.id ? 'text-blue-600' : 'text-rose-600'}`}>
                  {value === user?.id ? 'O' : !!value ? 'X' : ''}
                </Text>
              </Pressable>
            </GridItem>
          );
        })}
      </Grid>
    </VStack>
  );
};

export default TicTacToe;
