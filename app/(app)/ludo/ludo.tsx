import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import Feather from '@expo/vector-icons/Feather';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';

import React, { useContext, useEffect, useState } from 'react';
import { View, Pressable, Animated, Easing, Dimensions, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react-native';
import { LUDO_BOARD } from './_constants/board';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { getSocket } from '@/socket';
export default function LudoScreen() {
  const socket = getSocket();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.data);
  const { game } = useLocalSearchParams<{ game: string }>();

  const [playingGame, setPlayingGame] = useState(JSON.parse(game));

  const getColor = (color: 'red' | 'green' | 'blue' | 'yellow' | 'white', shade: 200 | 500): string => {
    const colors: Record<'red' | 'green' | 'blue' | 'yellow' | 'white', { 200: string; 500: string }> = {
      red: {
        200: '#FF2400', // Light red
        500: '#f56565', // Base red
      },
      green: {
        200: '#00C853', // Light green
        500: '#48bb78', // Base green
      },
      blue: {
        200: '#0F52BA', // Light blue
        500: '#4299e1', // Base blue
      },
      yellow: {
        200: '#FFF700', // Light yellow
        500: '#ecc94b', // Base yellow
      },
      white: {
        200: '#0c2665', // Light yellow
        500: '#ecc94b', // Base yellow
      },
    };

    return colors[color]?.[shade] || '#e2e8f0'; // Default to gray-300
  };
  useEffect(() => {
    if (!socket) return;
    socket.on('gameUpdate', (gameUpdate) => {
      setPlayingGame(gameUpdate);
    });

    return () => {
      socket?.off('gameUpdate');
    };
  }, []);

  const movePin = (pinHome: string) => {
    if (!socket) return;
    console.log('moving', pinHome);
    socket.emit('ludo:movePin', { userId: user!.id, gameId: playingGame.id, pinHome });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 8, flex: 1 }}>
        {/* <Center> */}

        <VStack space="md">
          <Box className="flex flex-row justify-between">
            <Player
              color={getColor('red', 200)}
              name={playingGame.players[0].username}
              userId={playingGame.players[0].userId}
              turn={playingGame.turn}
              gameId={playingGame.id}
              roll={playingGame.options.roll}
            />
            {playingGame.maxPlayers === 4 && (
              <Player color={getColor('blue', 200)} inverse={true} gameId={playingGame.id} roll={playingGame.options.roll} />
            )}
          </Box>
          <Box className=" rounded-xl overflow-hidden relative" style={{ aspectRatio: 1 }}>
            {LUDO_BOARD.map((row, rowIndex) => (
              <View key={rowIndex} className="flex flex-row flex-1">
                {row.map((square, idx) => (
                  <View
                    key={idx}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: square.color ? getColor(square.color, 200) : '#E5E7EB',
                      outlineWidth: 1,
                      outlineColor: !square.color ? '#d1d5db' : 'transparent',
                    }}
                  >
                    {square.safe && <Feather name="star" size={12} color="#ECC94B" style={{ position: 'absolute' }} />}

                    {(() => {
                      const pinsAtSquare = playingGame.options.pins.filter((p: any) => p.position === square.id);
                      const isSingle = pinsAtSquare.length === 1;

                      return (
                        <View
                          style={{
                            width: 36, // fixed size box for wrapping
                            height: 36,
                            flexDirection: 'row',
                            flexWrap: isSingle ? 'nowrap' : 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {pinsAtSquare.map((p: any, i: number) => (
                            <Pressable key={i} onPress={() => movePin(p.home)} className="absolute z-50">
                              <MaterialCommunityIcons name="chess-pawn" size={isSingle ? 24 : 14} color={getColor(p.color, 500)} />
                            </Pressable>
                          ))}
                        </View>
                      );
                    })()}
                  </View>
                ))}
              </View>
            ))}
            <VStack className="absolute top-0 bottom-0 left-0 right-0 z-10">
              <Box className="w-full h-[40%]   flex flex-row">
                <ColorPanel color="red" />
                <Box style={{ width: '20%' }} />
                <ColorPanel color="blue" />
              </Box>
              <Box style={{ height: '20%' }} />
              <Box className="w-full h-[40%]   flex flex-row">
                <ColorPanel color="green" />
                <Box style={{ width: '20%' }} />
                <ColorPanel color="yellow" />
              </Box>
            </VStack>
          </Box>
          <Box className="flex flex-row justify-between">
            {playingGame.maxPlayers === 4 ? (
              <Player color={getColor('green', 200)} gameId={playingGame.id} roll={playingGame.options.roll} />
            ) : (
              <Box />
            )}
            <Player
              color={getColor('yellow', 200)}
              inverse={true}
              name={playingGame.players[playingGame.players.length === 2 ? 1 : 3].username}
              userId={playingGame.players[playingGame.players.length === 2 ? 1 : 3].id}
              turn={playingGame.turn}
              gameId={playingGame.id}
              roll={playingGame.options.roll}
            />
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

function Player({
  color,
  inverse = false,
  name,
  userId,
  turn,
  gameId,
  roll,
}: {
  color: string;
  turn?: string;
  inverse?: boolean;
  name?: string;
  userId?: string;
  gameId: String;
  roll: number;
}) {
  const socket = getSocket();
  const user = useSelector((state: RootState) => state.user.data);
  const [rolling, setRolling] = useState(false);
  const rollDie = () => {
    console.log('rolling');
    if (!socket) return;
    socket.emit('ludo:rollDie', { userId: user!.id, gameId });
  };

  function dice(roll: number) {
    switch (roll) {
      case 1:
        return 'dice-one';
        break;
      case 2:
        return 'dice-two';
        break;
      case 3:
        return 'dice-three';
        break;
      case 4:
        return 'dice-four';
        break;
      case 5:
        return 'dice-five';
        break;
      case 6:
        return 'dice-six';
        break;

      default:
        return 'dice-one';
        break;
    }
  }
  return (
    <VStack space="sm">
      <HStack space="md" className={inverse ? 'flex-row-reverse' : ''} style={{ alignItems: 'center' }}>
        <Box className="rounded-full justify-center items-center size-12" style={{ backgroundColor: color }}>
          <Feather name="user" size={24} color="white" />
        </Box>
        <Pressable onPress={rollDie}>
          <Box className="size-12 rounded-lg justify-center items-center" style={{ backgroundColor: color }}>
            <FontAwesome5 name={dice(roll)} size={24} color="white" />
          </Box>
        </Pressable>
        {userId === turn && <FontAwesome name={inverse ? 'arrow-right' : 'arrow-left'} size={24} color="black" />}
      </HStack>
      <Text className={inverse ? 'text-right ' : ''} bold>
        {name}
        {user?.fullName}
      </Text>
    </VStack>
  );
}

type ColorType = 'red' | 'blue' | 'green' | 'yellow';

const colorMap: Record<ColorType, { gradient: readonly [string, string]; border: string }> = {
  red: { gradient: ['#ff2a2a', '#d80000'], border: '#d80000' },
  blue: { gradient: ['#3b82f6', '#1d4ed8'], border: '#1d4ed8' },
  green: { gradient: ['#22c55e', '#15803d'], border: '#15803d' },
  yellow: { gradient: ['#facc15', '#ca8a04'], border: '#ca8a04' },
};

export const ColorPanel = ({ color }: { color: ColorType }) => {
  const gradient = colorMap[color].gradient;
  const borderColor = colorMap[color].border;

  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.panel, { borderColor }]}>
      <View style={styles.innerGrid} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  panel: {
    width: '40%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
  },
  innerGrid: {
    width: '85%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
});
