import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';

export default function ComingSoon() {
  return (
    <SafeAreaView className="flex-1">
      <VStack space="md" className="flex-1 flex items-center justify-center p-2">
        <Text size="3xl" bold>
          Coming Soon
        </Text>
        <Text size="lg" className="text-center">
          We are working hard to bring you something amazing. Stay tuned!
        </Text>
        <Pressable onPress={() => router.back()}>
          <Box className="bg-green-600 px-4 py-2 rounded-md">
            <Text>Go Back</Text>
          </Box>
        </Pressable>
      </VStack>
    </SafeAreaView>
  );
}
