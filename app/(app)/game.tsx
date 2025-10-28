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
import { set } from 'react-hook-form';

const amount = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
];

export default function GameScreen() {
  const { gameId } = useLocalSearchParams();
  const game = games.find((g) => g.id === Number(gameId));
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(false);
  const [value, setValue] = useState(5);
  const [maxPlayers, setMaxPlayers] = useState(2);
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
            <WheelPicker data={amount} value={value} onValueChanged={({ item: { value } }) => setValue(value)} enableScrollByTapOnItem={true} />
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
                router.push({ pathname: '/loading', params: { type: game?.title, maxPlayers: maxPlayers, amount: value } });
              }}
            >
              <ButtonText>Play Now</ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </SafeAreaView>
  );
}
