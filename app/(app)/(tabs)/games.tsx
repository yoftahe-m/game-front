import { useState } from 'react';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWindowDimensions, ScrollView } from 'react-native';

import {
  Select,
  SelectItem,
  SelectInput,
  SelectPortal,
  SelectTrigger,
  SelectContent,
  SelectBackdrop,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
} from '@/components/ui/select';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetBackdrop,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from '@/components/ui/actionsheet';
import { RootState } from '@/store';
import games from '@/constants/games';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Grid, GridItem } from '@/components/ui/grid';
import { Pressable } from '@/components/ui/pressable';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';

import { ChevronDownIcon } from 'lucide-react-native';
import { Entypo } from '@expo/vector-icons';
import { Button, ButtonText } from '@/components/ui/button';
export default function GamesScreen() {
  const [showSheet, setShowSheet] = useState(false);
  const [game, setGame] = useState<any>(null);
  const { width } = useWindowDimensions();
  const [maxPlayers, setMaxPlayers] = useState('2');
  const [amount, setAmount] = useState('5');
  const [winPinCount, setWinPinCount] = useState('1');
  // Responsive column count (2 columns on small, 3+ on wide screens)
  const numColumns = width < 500 ? 2 : width < 900 ? 3 : 4;
  const [depositModal, setDepositModal] = useState(false);
  const user = useSelector((state: RootState) => state.user.data);
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 8 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        <Text size="xl" bold className="py-4">
          All Games
        </Text>
        <Grid className="gap-4" _extra={{ className: `grid-cols-${numColumns}` }} style={{ paddingBottom: 20 }}>
          {games.map((game) => (
            <GridItem key={game.id} className="bg-[#0c2665]  rounded-lg shadow-sm overflow-hidden" _extra={{ className: 'col-span-1' }}>
              <Pressable
                onPress={() => {
                  setGame(game), setShowSheet(true);
                }}
              >
                <VStack space="sm">
                  <Box className="aspect-square">
                    <Image source={{ uri: game.image }} alt={game.title} className="h-full w-full " />
                  </Box>

                  <VStack space="xs" className="p-4 pt-0">
                    <Text size="lg" bold>
                      {game.title}
                    </Text>
                  </VStack>
                </VStack>
              </Pressable>
            </GridItem>
          ))}
        </Grid>
      </ScrollView>
      <Actionsheet isOpen={showSheet} onClose={() => setShowSheet(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBottom: 20, backgroundColor: '#132e61', borderWidth: 0 }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          {game && (
            <VStack space="md" className="w-full">
              <Image
                source={{
                  uri: game?.image,
                }}
                alt={'title'}
                className="rounded-lg w-full h-60"
              />
              <Text size="3xl" bold>
                {game.title}
              </Text>
              <Text>{game.description}</Text>
              <Text size="lg" bold>
                Game Options
              </Text>
              <Text bold>Amount</Text>
              <Select selectedValue={amount} onValueChange={(v) => setAmount(v)}>
                <SelectTrigger variant="outline" size="md" className="h-12 justify-between ">
                  <SelectInput placeholder="Select amount" className="text-white" />
                  <Entypo name="chevron-small-down" size={24} color="white" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent style={{ paddingBottom: 20, backgroundColor: '#132e61', borderWidth: 0 }}>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {['5', '10', '20', '50', '100', '500', '1000'].map((item) => (
                      <SelectItem
                        key={item}
                        label={item}
                        value={item}
                        className=" items-center justify-center mb-2 rounded-md "
                        textStyle={{ style: { color: 'white' } }}
                        style={{ backgroundColor: amount === item ? '#16a34a' : '#071843' }}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
              {game.title === 'Ludo' && (
                <>
                  <Text bold>Players</Text>
                  <HStack space="sm" className="flex flex-row">
                    <Pressable
                      onPress={() => {
                        setMaxPlayers('2');
                      }}
                      className="flex-1"
                    >
                      <Box
                        className="h-12 w-full rounded-md flex items-center justify-center border "
                        style={{ borderColor: maxPlayers === '2' ? '#16a34a' : 'white' }}
                      >
                        <Text bold style={{ color: maxPlayers === '2' ? '#16a34a' : 'white' }}>
                          2
                        </Text>
                      </Box>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setMaxPlayers('4');
                      }}
                      className="flex-1"
                    >
                      <Box
                        className="h-12 w-full rounded-md flex items-center justify-center border "
                        style={{ borderColor: maxPlayers === '4' ? '#16a34a' : 'white' }}
                      >
                        <Text bold style={{ color: maxPlayers === '4' ? '#16a34a' : 'white' }}>
                          4
                        </Text>
                      </Box>
                    </Pressable>
                  </HStack>
                  <Text bold>Win Pin Count</Text>
                  <Select selectedValue={winPinCount} onValueChange={(v) => setWinPinCount(v)}>
                    <SelectTrigger variant="outline" size="md" className="h-12 justify-between ">
                      <SelectInput placeholder="Select amount" className="text-white" />
                      <Entypo name="chevron-small-down" size={24} color="white" />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent style={{ paddingBottom: 20, backgroundColor: '#132e61', borderWidth: 0 }}>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {['1', '2', '4'].map((item) => (
                          <SelectItem
                            key={item}
                            label={item}
                            value={item}
                            className=" items-center justify-center mb-2 rounded-md "
                            textStyle={{ style: { color: 'white' } }}
                            style={{ backgroundColor: winPinCount === item ? '#16a34a' : '#071843' }}
                          />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </>
              )}

              <Pressable
                onPress={() => {
                  setShowSheet(false);
                  if (user!.coins < Number(amount)) {
                    setDepositModal(true);
                  } else {
                    router.push({
                      pathname: '/loading',
                      params: {
                        gameData: JSON.stringify({
                          id: '1',
                          type: game.title,
                          status: 'waiting',
                          options: {},
                          maxPlayers: maxPlayers,
                          winPinCount: winPinCount,
                          amount: amount,
                          players: [{ userId: user?.id, username: user?.fullName, picture: user?.profilePic, socketId: '1', status: 'active' }],
                        }),
                      },
                    });
                  }
                }}
              >
                {/* type: game?.title, maxPlayers: maxPlayers, amount: amount */}
                <Box className="h-12 w-full bg-green-600 rounded-md flex items-center justify-center">
                  <Text bold>Play Now</Text>
                </Box>
              </Pressable>
            </VStack>
          )}
        </ActionsheetContent>
      </Actionsheet>
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
              style={{ backgroundColor: '#16a34a' }}
            >
              <ButtonText>Deposit</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
