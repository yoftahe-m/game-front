import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import O from '@/assets/icons/O';
import X from '@/assets/icons/X';
import { RootState } from '@/store';
import { getSocket } from '@/socket';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Grid, GridItem } from '@/components/ui/grid';
import { Pressable } from '@/components/ui/pressable';
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

        <VStack space="xs" className='items-end'>
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
      <Grid className="gap-1 bg-background-200" _extra={{ className: 'grid-cols-3' }}>
        {playingGame.options.board.map((value: string, index: number) => {
          const animatedScale = useSharedValue(0);

          useEffect(() => {
            if (value) {
              animatedScale.value = withSpring(1, {
                damping: 6,
                stiffness: 200,
                mass: 1,
              });
            } else {
              animatedScale.value = 0;
            }
          }, [value]);

          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: animatedScale.value }],
          }));
          return (
            <GridItem key={index} className=" bg-[#071843] " style={{ aspectRatio: 1 }} _extra={{ className: 'col-span-1' }}>
              <Pressable onPress={() => handlePress(index)} className="flex-1 items-center justify-center active:opacity-80">
                {value ? <Animated.View style={animatedStyle}>{value === user?.id ? <O /> : <X />}</Animated.View> : null}
              </Pressable>
            </GridItem>
          );
        })}
      </Grid>
    </VStack>
  );
};

export default TicTacToe;
