import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Game } from '@/types/game';
import { getSocket } from '@/socket';
import Ludo from './_components/ludo';
import Star from '@/assets/icons/Star';
import Draw from '@/assets/icons/Draw';
import Back from '@/assets/icons/Back';
import Money from '@/assets/icons/Money';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { setCoins } from '@/store/slice/user';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import TicTacToe from './_components/tic-tac-toe';
import { Pressable } from '@/components/ui/pressable';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import Checkers from './_components/checkers';
import Chess from './_components/chess';

const PlayScreen = () => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [gameModal, setGameModal] = useState(false);
  const [forfeitModal, setForfeitModal] = useState(false);
  const { game } = useLocalSearchParams<{ game: string }>();
  const [pendingAction, setPendingAction] = useState<any>(null);

  const [parseGame, setParseGame] = useState<Game>(JSON.parse(game));

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'REPLACE' || e.data.action.type === 'RESET') {
        return;
      }

      console.log(parseGame.winner)
      if (!parseGame.winner) {
        e.preventDefault();
        setPendingAction(e.data.action);
        setForfeitModal(true);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleForfeit = () => {
    if (!socket) return;
    socket.emit('leaveGame', { gameId: parseGame.id });
    dispatch(setCoins({ amount: Number(-parseGame.amount) }));
    setForfeitModal(false);
    if (pendingAction) navigation.dispatch(pendingAction);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on('gameOver', (game) => {
      setParseGame(game);

      setGameModal(true);
    });

    return () => {
      socket?.off('gameOver');
    };
  }, []);

  function gameZone(type: string) {
    switch (type) {
      case 'Tic Tac Toe':
        return <TicTacToe />;
        break;
      case 'Ludo':
        return <Ludo />;
        break;
      case 'Checkers':
        return <Checkers />;
        break;
      case 'Chess':
        return <Chess />;
        break;

      default:
        return null;
        break;
    }
  }

  return (
    <>
      <VStack className="flex-1 ">
        <HStack className="justify-between items-center bg-[#0c2665] p-2" style={{ paddingTop: insets.top }}>
          <Pressable onPress={() => router.back()}>
            <Box className="size-10 bg-green-700 flex items-center justify-center rounded-md">
              <Entypo name="chevron-left" size={24} color="white" />
            </Box>
          </Pressable>
          <HStack space="md">
            <HStack space="xs">
              <Text bold>Stake: {parseGame.amount}</Text>
              <Box className="size-6 bg-amber-300 flex items-center justify-center rounded-full">
                <FontAwesome5 name="coins" size={12} color="white" />
              </Box>
            </HStack>
            <HStack space="xs">
              <Text bold>Win amount: {Number(parseGame.amount) * parseGame.players.length}</Text>
              <Box className="size-6 bg-amber-300 flex items-center justify-center rounded-full">
                <FontAwesome5 name="coins" size={12} color="white" />
              </Box>
            </HStack>
          </HStack>
        </HStack>
        <VStack className="flex-1  items-center justify-center p-2">{gameZone(parseGame.type)}</VStack>
      </VStack>

      <Modal isOpen={forfeitModal} onClose={() => setForfeitModal(false)} size="md">
        <ModalBackdrop />
        <ModalContent className="bg-[#071843] border-0">
          <ModalHeader>
            <Text size="xl" bold>
              Forfeit
            </Text>
          </ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to leave?</Text>
          </ModalBody>
          <ModalFooter>
            <HStack space="md">
              <Box className="bg-gray-600 px-4 py-2 rounded-md" onTouchEnd={() => setForfeitModal(false)}>
                <Text>Cancel</Text>
              </Box>
              <Box className="bg-green-600 px-4 py-2 rounded-md" onTouchEnd={handleForfeit}>
                <Text>Forfeit</Text>
              </Box>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={gameModal}
        onClose={() => {
          setGameModal(false);
        }}
        size="lg"
      >
        <ModalBackdrop onPress={() => router.back()} />
        <ModalContent className="bg-[#132e61] border-0 rounded-2xl">
          <ModalBody>
            {parseGame.winner && (
              <VStack className="items-center" space="md">
                {parseGame.winner === 'draw' ? (
                  <>
                    <Box className=" flex items-center justify-center" style={{ height: 150 }}>
                      <Draw />
                    </Box>
                    <Text size="2xl" bold>
                      It's a draw
                    </Text>
                  </>
                ) : (
                  <>
                    <Box className=" flex items-center justify-center" style={{ height: 90 }}>
                      <Star />
                    </Box>

                    <Avatar size="2xl" className="border border-white rounded-lg overflow-hidden">
                      <AvatarFallbackText>{parseGame.players.find((p) => p.userId === parseGame.winner)?.username}</AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: parseGame.players.find((p) => p.userId === parseGame.winner)?.picture,
                        }}
                        className="rounded-none "
                      />
                    </Avatar>
                    <Text size="2xl" bold>
                      {parseGame.players.find((p) => p.userId === parseGame.winner)?.username} Won
                    </Text>
                    <HStack space="md" className="items-center">
                      <Text size="lg" bold>
                        {parseGame.amount * parseGame.players.length}
                      </Text>
                      <Money />
                    </HStack>
                  </>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Pressable onPress={() => router.back()} className="w-full">
              <Box
                style={{
                  paddingBottom: 5,
                  paddingTop: 0,

                  borderRadius: 50,
                  backgroundColor: '#c47b12',
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  width: '100%',
                }}
              >
                <LinearGradient
                  colors={['#EDDE5D', '#F09819']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{
                    height: 50,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: '#c8ffc8',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <HStack space="md">
                    <Back />
                    <Text
                      size="2xl"
                      style={{
                        color: 'white',
                        fontWeight: '700',
                        textShadowColor: 'rgba(0,0,0,0.4)',
                        textShadowOffset: { width: 1, height: 2 },
                        textShadowRadius: 3,
                      }}
                    >
                      Go Back
                    </Text>
                  </HStack>
                </LinearGradient>
              </Box>
            </Pressable>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlayScreen;
