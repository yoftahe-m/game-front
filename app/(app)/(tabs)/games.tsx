import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWindowDimensions, ScrollView, Pressable } from 'react-native';
import { Grid, GridItem } from '@/components/ui/grid';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Image } from '@/components/ui/image';
import { router } from 'expo-router';
import games from '@/constants/games';
import { VStack } from '@/components/ui/vstack';

export default function GamesScreen() {
  const { width } = useWindowDimensions();

  // Responsive column count (2 columns on small, 3+ on wide screens)
  const numColumns = width < 500 ? 2 : width < 900 ? 3 : 4;

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 8 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        <Text size="xl" bold className="py-4">
          All Games
        </Text>
        <Grid className="gap-4" _extra={{ className: `grid-cols-${numColumns}` }}>
          {games.map((game) => (
            <GridItem key={game.id} className="bg-[#0c2665]  rounded-lg shadow-sm overflow-hidden" _extra={{ className: 'col-span-1' }}>
              <Pressable onPress={() => router.push({ pathname: '/game', params: { gameId: game.id } })}>
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
    </SafeAreaView>
  );
}
