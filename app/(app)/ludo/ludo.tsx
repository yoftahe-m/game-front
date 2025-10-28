import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { useCallback } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';

import React, { useContext, useEffect, useState } from 'react';
import { View, Pressable, Animated, Easing, Dimensions } from 'react-native';
import { RelativePathString, useLocalSearchParams, useRouter } from 'expo-router';
import { DataContext } from './_context/DataContext';
import { WsContext } from './_context/WsContext';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react-native';
import { LUDO_BOARD } from './_constants/board';
import { socket } from '@/socket';

export default function LudoScreen() {
  const router = useRouter();
  const gameId = 'ada4896d-02b5-4b45-ba5a-295005788ef7';
  const { width } = Dimensions.get('window');
  const diceSize = width * 0.08;
  const { data } = useContext(DataContext);

  const pulseAnimation = new Animated.Value(1);

  const getColor = (color: 'red' | 'green' | 'blue' | 'yellow', shade: 200 | 500): string => {
    const colors: Record<'red' | 'green' | 'blue' | 'yellow', { 200: string; 500: string }> = {
      red: {
        200: '#fc8181', // Light red
        500: '#f56565', // Base red
      },
      green: {
        200: '#9ae6b4', // Light green
        500: '#48bb78', // Base green
      },
      blue: {
        200: '#90cdf4', // Light blue
        500: '#4299e1', // Base blue
      },
      yellow: {
        200: '#faf089', // Light yellow
        500: '#ecc94b', // Base yellow
      },
    };

    return colors[color]?.[shade] || '#e2e8f0'; // Default to gray-300
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 8, flex: 1 }}>
        {/* <Center> */}
        <VStack space="md">
          <Box className="flex flex-row justify-between">
            <Player color={getColor('red', 200)} />
            <Player color={getColor('blue', 200)} inverse={true} />
          </Box>
          <Box className="border border-[#d1d5db] rounded-xl overflow-hidden" style={{ aspectRatio: 1 }}>
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
                    {/* <Text className="absolute flex justify-center items-center text-yellow-600 font-bold">★</Text> */}
                    {square.safe && <Feather name="star" size={12} color="#ECC94B" className="absolute" />}
                    {data.pieces
                      .filter((piece) => piece.position === square.id)
                      .map((piece, pieceIndex) => (
                        <Pressable
                          key={pieceIndex}
                          style={{
                            width: '75%',
                            height: '75%',
                            borderRadius: 50,
                            backgroundColor: getColor(piece.color, 500),
                            borderWidth: data.playMove && data.turn && piece.color === data.color ? 2 : 0,
                            borderColor: getColor(data.color as 'red' | 'blue' | 'green' | 'yellow', 200),
                          }}
                          // onPress={() => data.playMove && piece.color === data.color && movePiece(piece.home)}
                        />
                      ))}
                  </View>
                ))}
              </View>
            ))}
          </Box>
          <Box className="flex flex-row justify-between">
            <Player color={getColor('green', 200)} />
            <Player color={getColor('yellow', 200)} inverse={true} />
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

function Player({ color, inverse = false }: { color: string; inverse?: boolean }) {
  const [rolling, setRolling] = useState(false);
  const rollDie = () => {
    setRolling(true);
    socket.emit('ludo:rollDie', { roomId: 'roomId', userId: 'userId' });
  };
  return (
    <VStack space="sm">
      <HStack space="md" className={inverse ? 'flex-row-reverse' : ''}>
        <Box className="rounded-full justify-center items-center size-12" style={{ backgroundColor: color }}>
          <Feather name="user" size={24} color="white" />
        </Box>
        <Box className="size-12 rounded-lg justify-center items-center" style={{ backgroundColor: color }}>
          <FontAwesome5 name="dice-five" size={24} color="white" />
        </Box>
      </HStack>
      <Text className={inverse ? 'text-right ' : ''} bold>
        Player 1
      </Text>
    </VStack>
  );
}
