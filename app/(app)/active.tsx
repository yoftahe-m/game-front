import { router } from 'expo-router';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootState } from '@/store';
import { getSocket } from '@/socket';
import games from '@/constants/games';
import Coin from '@/assets/icons/Coin';
import Money from '@/assets/icons/Money';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';

export default function TabOneScreen() {
  const socket = getSocket();
  const insets = useSafeAreaInsets();
  const [selectedGameId, setSelectedGameId] = useState('');
  const [depositModal, setDepositModal] = useState(false);
  const [activeGames, setActiveGames] = useState<{ id: string; type: string; amount: string; maxPlayers: number; players: any[] }[]>([]);
  const user = useSelector((state: RootState) => state.user.data);

  useEffect(() => {
    if (!socket) return;

    socket.on('games:update', (updatedGames) => setActiveGames(updatedGames));

    return () => {
      socket?.off('games:update');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('games:get');

    return () => {
      socket?.off('games:get');
    };
  }, [socket]);

  const renderItem = ({ item }: { item: { id: string; type: string; amount: string; maxPlayers: number; players: any[] } }) => {
    const game = games.find((g) => g.title === item.type);
    return (
      <HStack className="items-center justify-between border-b border-amber-600 pb-2">
        <HStack space="md">
          <Image source={{ uri: game?.image }} alt={'game Image'} width={100} height={100} className="rounded-lg" />

          <VStack>
            <Text size="xl" bold className="text-neutral-700">
              {game?.title}
            </Text>
            <Text size="lg" bold className="text-neutral-500">
              Stake: {item.amount}
            </Text>
            <Text size="lg" bold className="text-neutral-500">
              players: {item.players.length}/{item.maxPlayers}
            </Text>
          </VStack>
        </HStack>
        <Button
          className="bg-green-600 focus:bg-green-500 hover:bg-red-500"
          onPress={() => {
            if (user!.coins < Number(item.amount)) {
              setDepositModal(true);
            } else {
              setSelectedGameId(item.id);
            }
          }}
        >
          <ButtonText>Join</ButtonText>
        </Button>
      </HStack>
    );
  };

  let selectedGame = activeGames.find((g) => g.id === selectedGameId);
  return (
    <Box style={{ flex: 1 }}>
      <VStack className=" flex-1">
        <LinearGradient colors={['#0e1f4d', '#1d3285']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
          <HStack space="md" className="items-center justify-between px-2 pb-3 border-b border-[#113da6]" style={{ paddingTop: insets.top }}>
            <HStack space="sm" className="items-center">
              <Pressable>
                <Avatar size="md" className="border border-white rounded-lg overflow-hidden">
                  <AvatarFallbackText>{user?.fullName}</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: user?.profilePic,
                    }}
                    className="rounded-none "
                  />
                </Avatar>
              </Pressable>

              <VStack>
                <Text bold>{user?.fullName?.slice(0, 10) ?? ''}</Text>
                <Text size="xs" bold>
                  {user?.phone?.slice(0, 10) ?? ''}
                </Text>
              </VStack>
            </HStack>
            <HStack space="2xl">
              <HStack className="items-center relative">
                <Money style={{ transform: [{ rotate: '120deg' }], marginBottom: 10 }} width={30} height={18} />
                <Text className="h-6 px-2 border-y border-[#113da6] " bold>
                  {user?.coins}
                </Text>
                <Pressable className="size-8 bg-green-600 flex items-center justify-center " onPress={() => router.push('/(app)/wallet')}>
                  <FontAwesome5 name="plus" size={12} color="white" />
                </Pressable>
              </HStack>

              <HStack className="items-center">
                <Coin />
                <Text className="h-6 px-2" bold>
                  {user?.rewards}
                </Text>
                <Pressable className="size-5 bg-green-600 flex items-center justify-center" onPress={() => router.push('/(app)/referral')}>
                  <FontAwesome5 name="plus" size={12} color="white" />
                </Pressable>
              </HStack>
            </HStack>
          </HStack>
        </LinearGradient>

        <VStack className=" flex-1 items-center p-2">
          <Box className=" rounded-3xl w-full flex-1 p-4 shadow-md" style={{ backgroundColor: '#1d3285' }}>
            <HStack className="justify-between items-center py-4 px-2F">
              <Text size="xl" bold>
                Active Games
              </Text>

              <Input
                variant="outline"
                size="md"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
                className="h-8 w-40 rounded-full bg-[#456bb0]"
              >
                <InputField placeholder="Search" />
              </Input>
            </HStack>

            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={activeGames.filter((g) => g.players.length < g.maxPlayers)}
              renderItem={({ item }) => {
                const game = games.find((g) => g.title === item.type);
                return (
                  <HStack
                    className="flex flex-row justify-between items-center p-4 rounded-lg mb-2"
                    space="md"
                    style={{ backgroundColor: '#456bb0' }}
                  >
                    <HStack space="md">
                      <Image source={{ uri: game?.image }} alt={'game Image'} width={100} height={100} className="rounded-lg" />

                      <VStack>
                        <Text size="xl" bold>
                          {game?.title}
                        </Text>
                        <Text size="lg" bold>
                          Stake: {item.amount}
                        </Text>
                        <Text size="lg" bold>
                          players: {item.players.length}/{item.maxPlayers}
                        </Text>
                      </VStack>
                    </HStack>
                    <Button
                      className="bg-green-600 focus:bg-green-500 hover:bg-red-500"
                      onPress={() => {
                        if (user!.coins < Number(item.amount)) {
                          setDepositModal(true);
                        } else {
                          setSelectedGameId(item.id);
                        }
                      }}
                    >
                      <ButtonText>Join</ButtonText>
                    </Button>
                  </HStack>
                );
              }}
            />
          </Box>
        </VStack>
      </VStack>
      <Modal
        isOpen={!!selectedGame}
        onClose={() => {
          setSelectedGameId('');
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent className="bg-[#071843] border-0">
          <ModalHeader>
            <Text size="xl" bold>
              {selectedGame?.type}
            </Text>
          </ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to join?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              className="mr-3"
              onPress={() => {
                setSelectedGameId('');
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                const game = activeGames.find((g) => g.id === selectedGameId);
                game?.players.push({ userId: user?.id, username: user?.fullName, picture: user?.profilePic, socketId: '1', status: 'active' });
                router.push({
                  pathname: '/loading',
                  params: {
                    gameData: JSON.stringify(game),
                    gameId: selectedGameId,
                  },
                });
                setSelectedGameId('');
              }}
              className="bg-green-600"
            >
              <ButtonText>Join</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={depositModal}
        onClose={() => {
          setDepositModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent className="bg-[#071843] border-0">
          <ModalHeader>
            <Text size="xl" bold>
              You don't have enough coins
            </Text>
          </ModalHeader>
          <ModalBody>
            <Text>Deposit more coin</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              className="mr-3"
              onPress={() => {
                setDepositModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                router.push({ pathname: '/wallet' });
                setDepositModal(false);
              }}
              className="bg-green-600"
            >
              <ButtonText>Deposit</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
