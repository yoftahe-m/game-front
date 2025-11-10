import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Svg, { Polygon } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import { RootState } from '@/store';
import { getSocket } from '@/socket';
import { BOARD } from '@/constants/ludo';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import Cone from '@/assets/icons/Cone';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Grid, GridItem } from '@/components/ui/grid';

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
        200: '#EA4335', // Light red
        500: '#f56565', // Base red
      },
      green: {
        200: '#34A853', // Light green
        500: '#48bb78', // Base green
      },
      blue: {
        200: '#4285F4', // Light blue
        500: '#4299e1', // Base blue
      },
      yellow: {
        200: '#FFC107', // Light yellow
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
          player={playingGame.players[0]}
          turn={playingGame.options.turn}
          gameId={playingGame.id}
          roll={playingGame.options.roll}
          rolledBy={playingGame.options.rolledBy}
        />
        {/* {playingGame.maxPlayers === 4 && <Player color={'#0F52BA'} inverse={true} gameId={playingGame.id} roll={playingGame.options.roll} />} */}
      </HStack>
      <Box className=" rounded-xl overflow-hidden relative" style={{ aspectRatio: 1 }}>
        {BOARD.map((row, rowIndex) => (
          <Box key={rowIndex} className="flex flex-row flex-1">
            {row.map((square, idx) => (
              <Box
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
                    <Box
                      style={{
                        width: '100%', // fixed size box for wrapping
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: isSingle ? 'nowrap' : 'wrap',
                        justifyContent: isSingle ? 'center' : 'flex-start',
                        alignItems: isSingle ? 'center' : 'flex-start',
                      }}
                    >
                      {pinsAtSquare.map((p: any, i: number) => (
                        <Pressable key={i} onPress={() => movePin(p.home)} className=" z-50">
                          <Cone width={isSingle ? 30 : 10} height={isSingle ? 30 : 10} color={p.color} />
                        </Pressable>
                      ))}
                    </Box>
                  );
                })()}
              </Box>
            ))}
          </Box>
        ))}
        <VStack className="absolute top-0 bottom-0 left-0 right-0 z-10">
          <Box className="w-full h-[40%]   flex flex-row">
            <ColorPanel color="red" />
            <Box style={{ width: '20%' }} />
            <ColorPanel color="blue" />
          </Box>
          <Box style={{ height: '20%' }} className="flex flex-row justify-center">
            <CenterPanel />
          </Box>
          <Box className="w-full h-[40%]   flex flex-row">
            <ColorPanel color="green" />
            <Box style={{ width: '20%' }} />
            <ColorPanel color="yellow" />
          </Box>
        </VStack>
      </Box>
      <HStack className="flex flex-row justify-between">
        {playingGame.maxPlayers === 4 ? (
          <Player
            color={'#00C853'}
            player={playingGame.players[4]}
            turn={playingGame.options.turn}
            gameId={playingGame.id}
            roll={playingGame.options.roll}
            rolledBy={playingGame.options.rolledBy}
          />
        ) : (
          <Box />
        )}
        <Player
          color={'#facc15'}
          inverse={true}
          player={playingGame.players[playingGame.players.length === 2 ? 1 : 3]}
          turn={playingGame.options.turn}
          gameId={playingGame.id}
          roll={playingGame.options.roll}
          rolledBy={playingGame.options.rolledBy}
        />
      </HStack>
    </VStack>
  );
};

export default Ludo;

function Player({
  color,
  inverse = false,
  player,
  turn,
  gameId,
  roll,
  rolledBy,
}: {
  color: string;
  turn?: string;
  inverse?: boolean;
  player: any;
  gameId: String;
  roll: number;
  rolledBy?: string;
}) {
  const socket = getSocket();
  const user = useSelector((state: RootState) => state.user.data);
  const rollDie = () => {
    if (turn !== user?.id) return;
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
        <Avatar size="lg" className="border border-white rounded-lg overflow-hidden ">
          <AvatarFallbackText>{player.username}</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: player.picture,
            }}
            className="rounded-none"
          />
        </Avatar>
        <Pressable onPress={rollDie}>
          <Box className="size-12 rounded-lg justify-center items-center" style={{ backgroundColor: color }}>
            {turn === player.userId && turn === rolledBy ? (
              <FontAwesome5 name={dice(roll)} size={24} color="white" />
            ) : (
              <FontAwesome5 name="dice" size={24} color="white" />
            )}
          </Box>
        </Pressable>
        {player.userId === turn && (
          <FontAwesome name={inverse ? 'arrow-right' : 'arrow-left'} size={24} color={turn === user?.id ? '#FFD93D' : 'white'} />
        )}
      </HStack>
      <Text className={inverse ? 'text-right ' : ''} bold>
        {player.username}
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
      <Box style={{ width: '75%', aspectRatio: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 }} />
    </LinearGradient>
  );
};

function CenterPanel() {
  return (
    <Box
      style={{
        width: '20%',
        height: '100%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        overflow: 'hidden',
      }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        {/* Top Triangle (Blue) */}
        <Polygon points="0,0 100,0 50,50" fill="#4285F4" />
        {/* Right Triangle (Yellow) */}
        <Polygon points="100,0 100,100 50,50" fill="#FFC107" />
        {/* Bottom Triangle (Green) */}
        <Polygon points="0,100 100,100 50,50" fill="#34A853" />
        {/* Left Triangle (Red) */}
        <Polygon points="0,0 0,100 50,50" fill="#EA4335" />
      </Svg>
    </Box>
  );
}
