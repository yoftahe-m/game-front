import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { RootState } from '@/store';
import { getSocket } from '@/socket';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Feather, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Box } from '@/components/ui/box';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { BOARD } from '@/constants/ludo';

const Ludo = () => {
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
  const movePin = (pinHome: string) => {
    if (!socket) return;
    console.log('moving', pinHome);
    socket.emit('ludo:movePin', { userId: user!.id, gameId: playingGame.id, pinHome });
  };
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

  return (
    <VStack className=" w-full" space="md">
      <HStack className="justify-between">
        <Player
          color={'#FF2400'}
          name={playingGame.players[0].username}
          userId={playingGame.players[0].userId}
          turn={playingGame.turn}
          gameId={playingGame.id}
          roll={playingGame.options.roll}
        />
        {playingGame.maxPlayers === 4 && <Player color={'#0F52BA'} inverse={true} gameId={playingGame.id} roll={playingGame.options.roll} />}
      </HStack>
      <Box className=" rounded-xl overflow-hidden relative" style={{ aspectRatio: 1 }}>
        {BOARD.map((row, rowIndex) => (
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
      <HStack className="flex flex-row justify-between">
        {playingGame.maxPlayers === 4 ? <Player color={'#00C853'} gameId={playingGame.id} roll={playingGame.options.roll} /> : <Box />}
        <Player
          color={'#FFF700'}
          inverse={true}
          name={playingGame.players[playingGame.players.length === 2 ? 1 : 3].username}
          userId={playingGame.players[playingGame.players.length === 2 ? 1 : 3].id}
          turn={playingGame.turn}
          gameId={playingGame.id}
          roll={playingGame.options.roll}
        />
      </HStack>
    </VStack>
  );
};

export default Ludo;

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
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
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
        borderColor,
      }}
    >
      <Box style={{ width: '85%', aspectRatio: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 }} />
    </LinearGradient>
  );
};
