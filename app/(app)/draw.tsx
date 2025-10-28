import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { router } from 'expo-router';

export default function DrawScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Box className="flex-1 items-center justify-center px-6 text-center">
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/616/616489.png',
          }}
          alt="Trophy"
          width={100}
          height={100}
          className="mb-6"
        />

        <Text size="4xl" className="font-extrabold text-red-600 mb-2">
          Its a Draw!
        </Text>

        <Text size="lg" className="text-gray-600 mb-10 max-w-sm">
          Better luck next time! Your efforts were commendable.
        </Text>

        <Button size="lg" variant="solid" onPress={() => router.push('/loading')} className="w-full max-w-xs rounded-xl">
          <Text className="font-bold">Play Again</Text>
        </Button>
      </Box>
    </SafeAreaView>
  );
}
