import { useAudioPlayer } from 'expo-audio';
import { useDispatch, useSelector } from 'react-redux';
import { useSharedValue } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Game } from '@/types/game';
import { RootState } from '@/store';
import { getSocket } from '@/socket';
import Ludo from './_components/ludo';
import Star from '@/assets/icons/Star';
import Draw from '@/assets/icons/Draw';
import Back from '@/assets/icons/Back';
import Chess from './_components/chess';
import Money from '@/assets/icons/Money';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import Checkers from './_components/checkers';
import WonSound from '@/assets/sounds/won.mp3';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { updateCoins } from '@/store/slice/user';
import LostSound from '@/assets/sounds/lost.mp3';
import DrawSound from '@/assets/sounds/draw.mp3';
import TicTacToe from './_components/tic-tac-toe';
import StartSound from '@/assets/sounds/start.mp3';
import { Pressable } from '@/components/ui/pressable';
import { GradientButton } from '@/components/Buttons';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import AnimatedCircularProgress, { DURATION_MS, interpolateColor, INTERVAL_MS } from './_components/progress';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import Countdown from './_components/countdown';

const PlayScreen = () => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const fill = useSharedValue(100);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const WonPlayer = useAudioPlayer(WonSound);
  const LostPlayer = useAudioPlayer(LostSound);
  const DrawPlayer = useAudioPlayer(DrawSound);
  const StartPlayer = useAudioPlayer(StartSound);
  const startTimeRef = useRef<number | null>(null);
  const [gameModal, setGameModal] = useState(false);
  const tintColor = useSharedValue(interpolateColor(100));
  const [forfeitModal, setForfeitModal] = useState(false);
  const { game } = useLocalSearchParams<{ game: string }>();
  const [pendingAction, setPendingAction] = useState<any>(null);
  const user = useSelector((state: RootState) => state.user.data);
  const [parseGame, setParseGame] = useState<Game>(JSON.parse(game));
  const [showCountdownModal, setShowCountdownModal] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { winner } = parseGame;

  useEffect(() => {
    StartPlayer.seekTo(0);
    StartPlayer.play();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'REPLACE' || e.data.action.type === 'RESET') {
        return;
      }

      if (!parseGame.winner) {
        e.preventDefault();
        setPendingAction(e.data.action);
        setForfeitModal(true);
      }
    });

    return unsubscribe;
  }, [navigation, winner]);

  const handleForfeit = () => {
    if (!socket) return;
    socket.emit('leaveGame', { gameId: parseGame.id });
    dispatch(updateCoins({ amount: Number(-parseGame.amount) }));
    setForfeitModal(false);
    if (pendingAction) navigation.dispatch(pendingAction);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on('gameOver', (game) => {
      setParseGame(game);

      if (game.winner === user?.id) {
        WonPlayer.seekTo(0);
        WonPlayer.play();
        dispatch(updateCoins({ amount: Number(parseGame.amount) }));
      } else if (game.winner === 'draw') {
        DrawPlayer.seekTo(0);
        DrawPlayer.play();
      } else {
        LostPlayer.seekTo(0);
        LostPlayer.play();
        dispatch(updateCoins({ amount: Number(-parseGame.amount) }));
      }

      setGameModal(true);
    });

    return () => {
      socket?.off('gameOver');
    };
  }, []);

  function gameZone(type: string) {
    switch (type) {
      case 'Tic Tac Toe':
        return <TicTacToe resetCountdown={resetCountdown} />;
      case 'Ludo':
        return <Ludo resetCountdown={resetCountdown} />;
      case 'Checkers':
        return <Checkers resetCountdown={resetCountdown} />;
      case 'Chess':
        return <Chess resetCountdown={resetCountdown} />;

      default:
        return null;
    }
  }

  const animate = useCallback(() => {
    if (!startTimeRef.current) return;

    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    let newFill = 100 - (elapsed / DURATION_MS) * 100;

    if (newFill <= 0) {
      newFill = 0;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    fill.value = newFill;
    tintColor.value = interpolateColor(newFill);

    if (newFill > 0) {
      timerRef.current = setTimeout(animate, INTERVAL_MS);
    }
  }, [fill, tintColor]);

  const startCountdown = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(animate, INTERVAL_MS);
  }, [animate]);

  const resetCountdown = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    fill.value = 100;
    tintColor.value = interpolateColor(100);
    startCountdown();
  };

  useEffect(() => {
    startCountdown();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startCountdown]);

  return (
    <>
      <Countdown
        showCountdownModal={showCountdownModal}
        closeCountdownModal={() => {
          setShowCountdownModal(false);
          resetCountdown();
        }}
      />
      <VStack className="flex-1 " space="md">
        <HStack className="justify-between items-center bg-[#0c2665] p-2" style={{ paddingTop: insets.top }}>
          <Pressable onPress={() => router.back()}>
            <Box className="size-10 bg-[#BF092F] flex items-center justify-center rounded-md">
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
          router.back();
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
            <GradientButton
              onPress={() => router.back()}
              colors={['#EDDE5D', '#F09819']}
              outerStyle={{
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
              innerStyle={{
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
            </GradientButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlayScreen;
