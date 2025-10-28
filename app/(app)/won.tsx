import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { router } from 'expo-router';
export default function WonScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/616/616489.png',
          }}
          alt="Trophy"
          width={120}
          height={120}
        />

        <Text size="3xl">You Won! 🎉</Text>

        <Text size="md">Congratulations! You beat your opponent fair and square.</Text>

        <Button size="lg" variant="solid" onPress={() => router.push('/loading')}>
          <Text>Play Again</Text>
        </Button>
      </Box>
    </SafeAreaView>
  );
}
