import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWindowDimensions, ScrollView, Pressable } from 'react-native';
import { Grid, GridItem } from '@/components/ui/grid';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Image } from '@/components/ui/image';
import { router } from 'expo-router';
import games from '@/constants/games';
import { VStack } from '@/components/ui/vstack';

import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from '@/components/ui/actionsheet';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import HorizontalWheelPicker from '@/components/HorizontalWheelPicker';
import HorizontalPicker from '@vseslav/react-native-horizontal-picker';
export default function GamesScreen() {
  const [showSheet, setShowSheet] = useState(false);
  const [game, setGame] = useState<any>(null);
  const { width } = useWindowDimensions();
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [amount, setAmount] = useState(5);
  // Responsive column count (2 columns on small, 3+ on wide screens)
  const numColumns = width < 500 ? 2 : width < 900 ? 3 : 4;

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 8, paddingBottom: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        <Text size="xl" bold className="py-4">
          All Games
        </Text>
        <Grid className="gap-4" _extra={{ className: `grid-cols-${numColumns}` }}>
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
              {/* <WheelPicker data={amounts} value={amount} onValueChanged={({ item: { value } }) => setAmount(value)} enableScrollByTapOnItem={true} /> */}
              <HorizontalWheelPicker
                data={['5', '10', '20', '50', '100', '500', '1000']}
                initialIndex={0}
                onChange={(i) => console.log('selected index', i)}
              />

              <Text bold>Players</Text>
              <HStack space="sm" className="flex flex-row">
                <Pressable
                  onPress={() => {
                    setMaxPlayers(2);
                  }}
                  className="flex-1"
                >
                  <Box
                    className="h-12 w-full rounded-md flex items-center justify-center border "
                    style={{ borderColor: maxPlayers === 2 ? '#16a34a' : 'white' }}
                  >
                    <Text bold style={{ color: maxPlayers === 2 ? '#16a34a' : 'white' }}>
                      2
                    </Text>
                  </Box>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setMaxPlayers(4);
                  }}
                  className="flex-1"
                >
                  <Box
                    className="h-12 w-full rounded-md flex items-center justify-center border "
                    style={{ borderColor: maxPlayers === 4 ? '#16a34a' : 'white' }}
                  >
                    <Text bold style={{ color: maxPlayers === 4 ? '#16a34a' : 'white' }}>
                      4
                    </Text>
                  </Box>
                </Pressable>
              </HStack>
              <Pressable
                onPress={() => {
                  // handleClose();
                  // if (user!.coins < Number(amount)) {
                  //   setDepositModal(true);
                  // } else {
                  //   router.push({ pathname: '/loading', params: { type: game?.title, maxPlayers: maxPlayers, amount: amount } });
                  // }
                }}
              >
                <Box className="h-12 w-full bg-green-600 rounded-md flex items-center justify-center">
                  <Text bold>Play Now</Text>
                </Box>
              </Pressable>
            </VStack>
          )}
        </ActionsheetContent>
      </Actionsheet>
    </SafeAreaView>
  );
}
