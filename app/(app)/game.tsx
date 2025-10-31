import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { router, useLocalSearchParams } from 'expo-router';
import { Box } from '@/components/ui/box';
import games from '@/constants/games';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from '@/components/ui/actionsheet';
import { useState } from 'react';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const amounts = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
];

export default function GameScreen() {
  const [depositModal, setDepositModal] = useState(false);
  const { gameId } = useLocalSearchParams();
  const game = games.find((g) => g.id === Number(gameId));
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(false);
  const [amount, setAmount] = useState(5);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const user = useSelector((state: RootState) => state.user.data);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20, flex: 1 }}>
        <Box className="justify-between  flex-1">
          <VStack space={'sm'}>
            <Image
              source={{
                uri: game?.image,
              }}
              alt={'title'}
              className="rounded-lg w-full h-60"
            />
            <Text size="2xl" bold>
              {game?.title}
            </Text>
            <Text>{game?.description}</Text>
          </VStack>

          <Button className="h-12" onPress={() => setShowActionsheet(true)}>
            <ButtonText>Play</ButtonText>
          </Button>
        </Box>
      </ScrollView>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBottom: 20 }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          <VStack space="md" className="w-full">
            <Text size="lg" bold>
              Game Options
            </Text>
            <WheelPicker data={amounts} value={amount} onValueChanged={({ item: { value } }) => setAmount(value)} enableScrollByTapOnItem={true} />
            <HStack space="sm" className="flex flex-row">
              <Button
                className="h-12 flex-1"
                onPress={() => {
                  setMaxPlayers(2);
                }}
              >
                <ButtonText>2</ButtonText>
              </Button>
              <Button
                className="h-12 flex-1"
                onPress={() => {
                  setMaxPlayers(4);
                }}
              >
                <ButtonText>4</ButtonText>
              </Button>
            </HStack>
            <Button
              className="h-12 w-full"
              onPress={() => {
                handleClose();
                if (user!.coins < Number(amount)) {
                  setDepositModal(true);
                } else {
                  router.push({ pathname: '/loading', params: { type: game?.title, maxPlayers: maxPlayers, amount: amount } });
                }
              }}
            >
              <ButtonText>Play Now</ButtonText>
            </Button>
          </VStack>
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
            >
              <ButtonText>Deposit</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
