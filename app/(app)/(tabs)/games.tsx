import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWindowDimensions, ScrollView, Pressable } from 'react-native';
import { Grid, GridItem } from '@/components/ui/grid';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Image } from '@/components/ui/image';
import { router } from 'expo-router';
import games from '@/constants/games';

export default function GamesScreen() {
  const { width } = useWindowDimensions();

  // Responsive column count (2 columns on small, 3+ on wide screens)
  const numColumns = width < 500 ? 2 : width < 900 ? 3 : 4;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 10 }}>
        <Grid className="gap-4" _extra={{ className: `grid-cols-${numColumns}` }}>
          {games.map((game) => (
            <GridItem key={game.id} className="bg-background-50  rounded-lg shadow-sm" _extra={{ className: 'col-span-1' }}>
              <Pressable onPress={() => router.push({ pathname: '/game', params: { gameId: game.id } })} className="p-4">
                <Box>
                  <Image source={{ uri: game.image }} alt={game.title} width={80} height={80} />
                  <Text size="md">{game.title}</Text>
                  <Text size="sm" numberOfLines={2}>
                    {game.description}
                  </Text>
                </Box>
              </Pressable>
            </GridItem>
          ))}
        </Grid>
      </ScrollView>
    </SafeAreaView>
  );
}
