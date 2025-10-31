import { Box } from '@/components/ui/box';

import { FlatList, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

import { Pressable } from '@/components/ui/pressable';

import { Image } from '@/components/ui/image';

import { HStack } from '@/components/ui/hstack';

import { VStack } from '@/components/ui/vstack';

import Feather from '@expo/vector-icons/Feather';

import { router } from 'expo-router';

import games from '@/constants/games';

import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';

import { useEffect, useState } from 'react';

import { Heading } from '@/components/ui/heading';

import { Button, ButtonText } from '@/components/ui/button';
import { getSocket } from '@/socket';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input, InputField } from '@/components/ui/input';

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
    <View style={{ flex: 1 }}>
      <VStack className=" flex-1">
        <HStack space="md" className="items-center justify-between px-2 bg-[#0c2665] pb-3" style={{ paddingTop: insets.top }}>
          <HStack space="sm" className="items-center">
            <Avatar size="md">
              <AvatarFallbackText>{user?.fullName}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                }}
              />
            </Avatar>

            <Text bold>{user?.fullName.slice(0, 10)}</Text>
          </HStack>
          <HStack space="2xl">
            <HStack className="items-center">
              <Box className="size-6 bg-amber-300 flex items-center justify-center rounded-full">
                <FontAwesome5 name="coins" size={12} color="white" />
              </Box>
              <Text className="h-6 px-2 " bold>
                {user?.coins}
              </Text>
              <Pressable className="size-5 bg-green-600 flex items-center justify-center " onPress={() => router.push('/(app)/wallet')}>
                <FontAwesome5 name="plus" size={12} color="white" />
              </Pressable>
            </HStack>

            <HStack className="items-center">
              <Box className="size-6 bg-amber-300 flex items-center justify-center rounded-full">
                <FontAwesome5 name="coins" size={12} color="white" />
              </Box>
              <Text className="h-6 px-2" bold>
                {user?.rewards}
              </Text>
              <Pressable className="size-5 bg-green-600 flex items-center justify-center" onPress={() => router.push('/(app)/referral')}>
                <FontAwesome5 name="plus" size={12} color="white" />
              </Pressable>
            </HStack>
          </HStack>
        </HStack>

        <VStack className="m-2 mt-4 mb-0 flex-1 border-[3px] border-amber-600 rounded-3xl bg-amber-400">
          <HStack className="justify-between items-center p-4 px-8">
            <Text size="xl" bold>
              Active Games
            </Text>

            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
              className="h-8 w-40 rounded-full border-amber-200 bg-amber-200"
            >
              <InputField placeholder="Search" />
            </Input>
          </HStack>
          <View className="flex-1 bg-amber-200 border-2 border-amber-500 m-2 mt-0  rounded-2xl overflow-hidden">
            <FlatList
              data={activeGames.filter((g) => g.players.length < g.maxPlayers)}
              renderItem={renderItem}
              contentContainerStyle={{ gap: 10, padding: 8 }}
            />
          </View>
        </VStack>
        <Box className="p-2 px-6">
          <Text bold>helljkshfkjs hdlhsdlv sdkvhskdvhsd sdjvhsjhdv shdjvghsjdvo</Text>
        </Box>
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
                router.push({ pathname: '/loading', params: { gameId: selectedGameId } });
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
    </View>
  );
}
