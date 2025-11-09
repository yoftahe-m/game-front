import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

import { RootState } from '@/store';
import { getSocket } from '@/socket';
import Pawn from '@/assets/icons/Pawn';
import Rock from '@/assets/icons/Rock';
import King from '@/assets/icons/King';
import Queen from '@/assets/icons/Queen';
import { Box } from '@/components/ui/box';
import Bishop from '@/assets/icons/Bishop';
import Knight from '@/assets/icons/Knight';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Grid, GridItem } from '@/components/ui/grid';
import { Pressable } from '@/components/ui/pressable';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useAudioPlayer } from 'expo-audio';
import WoodSound from '@/assets/sounds/wood.mp3';
const Chess = () => {
  const socket = getSocket();
  const { game } = useLocalSearchParams<{ game: string }>();
  const WoodPlayer = useAudioPlayer(WoodSound);
  const user = useSelector((state: RootState) => state.user.data);
  const [from, setFrom] = useState('');
  const [playingGame, setPlayingGame] = useState(JSON.parse(game));

  useEffect(() => {
    if (!socket) return;
    socket.on('gameUpdate', (gameUpdate) => {
      setPlayingGame(gameUpdate);
         WoodPlayer.seekTo(0);
      WoodPlayer.play();
    });

    return () => {
      socket?.off('gameUpdate');
    };
  }, []);

  const handleSquareClick = (x: number, y: number) => {
    const square = 'abcdefgh'[x] + (8 - y);
    if (!from) setFrom(square);
    else {
      if (!socket) return;
      socket.emit('chess:move', { gameId: playingGame.id, from: from, to: square });
      setFrom('');
    }
  };

  function returnIcons(type: string, color: 'black' | 'white') {
    switch (type) {
      case 'p':
        return <Pawn color={color} />;
        break;
      case 'k':
        return <King color={color} />;
        break;
      case 'q':
        return <Queen color={color} />;
        break;
      case 'n':
        return <Knight color={color} />;
        break;
      case 'b':
        return <Bishop color={color} />;
        break;
      case 'r':
        return <Rock color={color} />;
        break;

      default:
        return <Pawn color={color} />;
        break;
    }
  }
  return (
    <VStack className=" w-full" space="md">
      <HStack className="justify-between p-4">
        <VStack space="xs">
          <HStack space="md" className="items-center">
            <Avatar size="lg" className="border border-white rounded-lg overflow-hidden ">
              <AvatarFallbackText>{playingGame.players[0].username}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: playingGame.players[0].picture,
                }}
                className="rounded-none"
              />
            </Avatar>
            {playingGame.players[0].userId === playingGame.options.turn && (
              <FontAwesome name={'arrow-left'} size={24} color={playingGame.options.turn === user?.id ? '#FFD93D' : 'white'} />
            )}
          </HStack>
          <Text bold>{playingGame.players[0].username.slice(0, 8)}</Text>
        </VStack>

        <VStack space="xs" className="items-end">
          <HStack space="md" className="items-center">
            {playingGame.players[1].userId === playingGame.options.turn && (
              <FontAwesome name={'arrow-right'} size={24} color={playingGame.options.turn === user?.id ? '#FFD93D' : 'white'} />
            )}
            <Avatar size="lg" className="border border-white rounded-lg overflow-hidden">
              <AvatarFallbackText>{playingGame.players[1].username}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: playingGame.players[1].picture,
                }}
                className="rounded-none "
              />
            </Avatar>
          </HStack>
          <Text bold>{playingGame.players[1].username.slice(0, 8)}</Text>
        </VStack>
      </HStack>
      <Grid
        _extra={{ className: 'grid-cols-8 mb-20' }}
        style={{ transform: [{ rotate: user?.id === playingGame.players[1].userId ? '180deg' : '0deg' }] }}
      >
        {playingGame.options.board.map((row: any, y: number) =>
          row.map((piece: any, x: number) => (
            <GridItem
              key={`${x}-${y}`}
              style={{
                backgroundColor: (x + y) % 2 === 0 ? '#f0d9b5' : '#6b3f1d',
                aspectRatio: 1,
              }}
              _extra={{ className: 'col-span-1' }}
            >
              <Pressable
                onPress={() => {
                  handleSquareClick(x, y);
                }}
              >
                <Box
                  className=" w-full aspect-square"
                  style={{
                    aspectRatio: 1,
                    backgroundColor: from === piece?.square ? '#f0c803' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {piece && (
                    <Box style={{ transform: [{ rotate: user?.id === playingGame.players[1].userId ? '180deg' : '0deg' }] }}>
                      {returnIcons(piece.type, piece.color === 'w' ? 'black' : 'white')}
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

export default Chess;
