import { Box } from '@/components/ui/box';

import { FlatList } from 'react-native';

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
import { socket } from '@/socket';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CloseIcon, Icon } from '@/components/ui/icon';

export default function TabOneScreen() {
  const [selectedGameId, setSelectedGameId] = useState('');
  const [activeGames, setActiveGames] = useState<{ id: string; type: string; amount: string; maxPlayers: number; players: any[] }[]>([]);
  const user = useSelector((state: RootState) => state.user.data);

  useEffect(() => {
    socket.on('games:update', (updatedGames) => {
      setActiveGames(updatedGames);
    });

    return () => {
      socket.off('games:update');
    };
  }, []);

  const renderItem = ({ item }: { item: { id: string; type: string; amount: string; maxPlayers: number; players: any[] } }) => {
    const game = games.find((g) => g.title === item.type);
    return (
      <Pressable onPress={() => setSelectedGameId(item.id)}>
        <HStack space="md">
          <Image source={{ uri: game?.image }} alt={'game Image'} width={100} height={100} className="rounded-lg" />

          <VStack space="xs">
            <Text size="md" bold>
              {game?.title}
            </Text>
            <Text size="sm" className="" numberOfLines={2}>
              {game?.description}
            </Text>
          </VStack>
        </HStack>
      </Pressable>
    );
  };

  let selectedGame = activeGames.find((g) => g.id === selectedGameId);
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 8 }}>
      <VStack space="sm">
        <Box className="flex flex-row justify-between items-center">
          <HStack space="md">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1754/1754120.png' }} alt={'profile'} width={50} height={50} />

            <VStack>
              <Text size="md">{user?.fullName}</Text>

              <Text size="sm" numberOfLines={2}>
                token
              </Text>
            </VStack>
          </HStack>

          <Pressable onPress={() => router.push('/settings')}>
            <Feather name="menu" size={24} color="black" />
          </Pressable>
        </Box>

        <Text>Active Games</Text>
      </VStack>

      <FlatList
        data={activeGames}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 10, paddingBottom: 8 }}
      />
      <Modal
        isOpen={!!selectedGame}
        onClose={() => {
          setSelectedGameId('');
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">{selectedGame?.type}</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>
              By accepting the modal, you will bet {selectedGame?.amount} game coins for a chance to win
              {Number(selectedGame?.amount) * Number(selectedGame?.maxPlayers)} by playing against {selectedGame?.maxPlayers} players.
            </Text>
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
            >
              <ButtonText>Bet</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
