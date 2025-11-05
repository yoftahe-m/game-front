import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

import { RootState } from '@/store';
import { getSocket } from '@/socket';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Grid, GridItem } from '@/components/ui/grid';
import { Pressable } from '@/components/ui/pressable';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';

const Checkers = () => {
  const socket = getSocket();
  const { game } = useLocalSearchParams<{ game: string }>();

  const user = useSelector((state: RootState) => state.user.data);
  const [from, setFrom] = useState<{ x: number; y: number } | null>(null);
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

  function handlePress(x: number, y: number) {
    const piece = playingGame.options.board[y][x];
    const playerColor = playingGame.options.players.find((p) => p.userId === playingGame.options.turn).color;

    if (piece && piece.color === playerColor) {
      setFrom({ x, y });
    } else if (from) {
      if (!socket) return;
      socket.emit('checkers:move', { gameId: playingGame.id, from, to: { x, y } });
      setFrom(null);
    }
  }

  return (
    <VStack className=" w-full" space="md">
      <HStack className="justify-between">
        <HStack space="md" className="items-center">
          <VStack space="xs">
            <Avatar size="md" className="border border-white rounded-lg overflow-hidden">
              <AvatarFallbackText>{playingGame.players[0].username}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: playingGame.players[0].picture,
                }}
                className="rounded-none"
              />
            </Avatar>
            <Text>{playingGame.players[0].username}</Text>
          </VStack>
          {user?.id === playingGame.options.turn && <FontAwesome name={'arrow-left'} size={24} color="black" />}
        </HStack>
        <HStack space="md" className="items-center">
          {user?.id === playingGame.options.turn && <FontAwesome name={'arrow-right'} size={24} color="black" />}
          <VStack space="xs">
            <Avatar size="md" className="border border-white rounded-lg overflow-hidden">
              <AvatarFallbackText>{playingGame.players[1].username}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: playingGame.players[1].picture,
                }}
                className="rounded-none "
              />
            </Avatar>
            <Text>{playingGame.players[1].username}</Text>
          </VStack>
        </HStack>
      </HStack>
      <Grid _extra={{ className: 'grid-cols-8 ' }}>
        {playingGame.options.board.map((row, y: number) =>
          row.map((cell, x: number) => (
            <GridItem
              key={`${x}-${y}`}
              style={{
                backgroundColor: (x + y) % 2 === 0 ? '#f0d9b5' : '#6b3f1d',
                aspectRatio: 1,
              }}
              _extra={{ className: 'col-span-1' }}
            >
              <Pressable onPress={() => handlePress(x, y)}>
                <Box
                  className=" w-full aspect-square"
                  style={{
                    aspectRatio: 1,
                    backgroundColor: from?.x === x && from?.y === y ? '#f0c803' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cell && (
                    <Box
                      className=" size-8 rounded-full"
                      style={{
                        backgroundColor: cell.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {cell.king && <FontAwesome5 name="crown" size={12} color="gold" />}
                    </Box>
                  )}
                </Box>
              </Pressable>
            </GridItem>
          ))
        )}
      </Grid>
    </VStack>
  );
};

export default Checkers;
