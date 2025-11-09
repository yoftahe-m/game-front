import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
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
import PrimarySound from '@/assets/sounds/primary.mp3';
import SecondarySound from '@/assets/sounds/secondary.mp3';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';

const TicTacToe = () => {
  const socket = getSocket();
  const { game } = useLocalSearchParams<{ game: string }>();
  const PrimaryPlayer = useAudioPlayer(PrimarySound);
  const SecondaryPlayer = useAudioPlayer(SecondarySound);
  const user = useSelector((state: RootState) => state.user.data);
  const [playingGame, setPlayingGame] = useState(JSON.parse(game));

  useEffect(() => {
    if (!socket) return;
    socket.on('gameUpdate', (gameUpdate) => {
      setPlayingGame(gameUpdate);
      if (gameUpdate.options.turn !== user?.id) {
        PrimaryPlayer.seekTo(0);
        PrimaryPlayer.play();
      } else {
        SecondaryPlayer.seekTo(0);
        SecondaryPlayer.play();
      }
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
      <Grid className="gap-1 border-4 border-background-200 bg-background-200 mb-20 rounded-lg" _extra={{ className: 'grid-cols-3' }}>
        {playingGame.options.board.map((value: string, index: number) => {
          const animatedScale = useSharedValue(0);

          useEffect(() => {
            if (value) {
              animatedScale.value = withSpring(1, {
                damping: 12, // higher = less bounce
                stiffness: 120, // lower = softer motion
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
