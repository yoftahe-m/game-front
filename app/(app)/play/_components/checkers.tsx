import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

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
    const playerColor = playingGame.options.players.find((p: any) => p.userId === playingGame.options.turn).color;

    if (piece && piece.color === playerColor && user?.id === playingGame.options.turn) {
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
        <VStack space="xs">
          <HStack space="md" className="items-center">
            <Avatar size="md" className="border border-white rounded-lg overflow-hidden ">
              <AvatarFallbackText>{playingGame.players[0].username}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: playingGame.players[0].picture,
                }}
                className="rounded-none"
              />
            </Avatar>
            {playingGame.players[0].userId === playingGame.options.turn && (
              <FontAwesome name={'arrow-left'} size={24} color={playingGame.options.turn === user?.id ? '#16a34a' : 'white'} />
            )}
          </HStack>
          <Text bold>{playingGame.players[0].username}</Text>
        </VStack>

        <VStack space="xs" className="items-end">
          <HStack space="md" className="items-center">
            {playingGame.players[1].userId === playingGame.options.turn && (
              <FontAwesome name={'arrow-right'} size={24} color={playingGame.options.turn === user?.id ? '#16a34a' : 'white'} />
            )}
            <Avatar size="md" className="border border-white rounded-lg overflow-hidden">
              <AvatarFallbackText>{playingGame.players[1].username}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: playingGame.players[1].picture,
                }}
                className="rounded-none "
              />
            </Avatar>
          </HStack>
          <Text bold>{playingGame.players[1].username}</Text>
        </VStack>
      </HStack>
      <Grid
        _extra={{ className: 'grid-cols-8 ' }}
        style={{ transform: [{ rotate: user?.id === playingGame.players[1].userId ? '180deg' : '0deg' }] }}
      >
        {playingGame.options.board.map((row: any, y: number) =>
          row.map((cell: any, x: number) => (
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
                      className="pb-[2px] rounded-full"
                      style={{
                        backgroundColor: cell.color,
                        paddingBottom: user?.id === playingGame.players[1].userId ? 0 : 3,
                        paddingTop: user?.id === playingGame.players[1].userId ? 3 : 0,
                      }}
                    >
                      <Box
                        className=" size-8 rounded-full"
                        style={{
                          backgroundColor: cell.color === 'black' ? '#222831' : '#E62727',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box style={{ transform: [{ rotate: user?.id === playingGame.players[1].userId ? '180deg' : '0deg' }] }}>
                          {cell.king && <FontAwesome5 name="crown" size={12} color="gold" />}
                        </Box>
                      </Box>
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
