import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
import { router, useLocalSearchParams } from 'expo-router';
import { Box } from '@/components/ui/box';
import games from '@/constants/games';

export default function GameScreen() {
  const { gameId } = useLocalSearchParams();
  const game = games.find((g) => g.id === Number(gameId));
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
          <Button className="h-12" onPress={() => router.push('/ludo/ludo')}>
            <ButtonText>Play</ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
