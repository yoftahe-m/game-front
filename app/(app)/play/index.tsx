import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootState } from '@/store';
import { getSocket } from '@/socket';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { setCoins } from '@/store/slice/user';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import TicTacToe from './_components/tic-tac-toe';
import Ludo from './_components/ludo';
import { Pressable } from '@/components/ui/pressable';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';

const PlayScreen = () => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [forfeitModal, setForfeitModal] = useState(false);
  const { game } = useLocalSearchParams<{ game: string }>();
  const [pendingAction, setPendingAction] = useState<any>(null);
  const user = useSelector((state: RootState) => state.user.data);

  const parseGame = JSON.parse(game);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Allow replace or reset actions without showing modal
      if (e.data.action.type === 'REPLACE' || e.data.action.type === 'RESET') {
        return;
      }

      // Block goBack or pop actions only
      e.preventDefault();
      setPendingAction(e.data.action);
      setForfeitModal(true);
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
      if (game.winner === user?.id) {
        dispatch(setCoins({ amount: Number(game.amount) }));
        router.replace({ pathname: '/(app)/won', params: { game: JSON.stringify(game) } });
      } else if (game.winner === 'draw') {
        router.replace({ pathname: '/(app)/draw', params: { game: JSON.stringify(game) } });
      } else {
        dispatch(setCoins({ amount: Number(-game.amount) }));
        router.replace({ pathname: '/(app)/lost', params: { game: JSON.stringify(game) } });
      }
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
    </>
  );
};

export default PlayScreen;
