import { Box } from '@/components/ui/box';

import { FlatList } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

import { Pressable } from '@/components/ui/pressable';

import { Image } from '@/components/ui/image';

import { HStack } from '@/components/ui/hstack';

import { VStack } from '@/components/ui/vstack';

import Feather from '@expo/vector-icons/Feather';

import { router } from 'expo-router';

import games from '@/constants/games';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';

import { useState } from 'react';

import { Heading } from '@/components/ui/heading';

import { Button, ButtonText } from '@/components/ui/button';

export default function TabOneScreen() {
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const handleClose = () => setShowAlertDialog(false);

  console.log('showAlertDialog', showAlertDialog);

  const renderItem = ({ item }: any) => (
    <>
      <Pressable onPress={() => setShowAlertDialog(true)}>
        <HStack space="md">
          <Image source={{ uri: item.image }} alt={item.title} width={50} height={50} />

          <VStack space="sm">
            <Text size="md">{item.title}</Text>

            <Text size="sm" numberOfLines={2}>
              {item.description}
            </Text>
          </VStack>
        </HStack>
      </Pressable>

      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />

        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Are you sure you want to delete this post?
            </Heading>
          </AlertDialogHeader>

          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">Deleting the post will remove it permanently and cannot be undone. Please confirm if you want to proceed.</Text>
          </AlertDialogBody>

          <AlertDialogFooter className="">
            <Button variant="outline" action="secondary" onPress={handleClose} size="sm">
              <ButtonText>Cancel</ButtonText>
            </Button>

            <Button size="sm" onPress={handleClose}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 8 }}>
      <VStack space="sm">
        <Box className="flex flex-row justify-between items-center">
          <HStack space="md">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1754/1754120.png' }} alt={'profile'} width={50} height={50} />

            <VStack>
              <Text size="md">name</Text>

              <Text size="sm" numberOfLines={2}>
                token
              </Text>
            </VStack>
          </HStack>

          <Pressable onPress={() => router.push('/settings')}>
            <Feather name="menu" size={24} color="black" />
          </Pressable>
        </Box>

        <Text>Active Games</Text>
      </VStack>

      <FlatList
        data={games}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 10, paddingBottom: 8 }}
      />
    </SafeAreaView>
  );
}
