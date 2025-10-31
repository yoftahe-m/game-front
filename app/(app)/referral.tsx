import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import bg from '@/assets/images/ss.png';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { EditIcon } from '@/components/ui/icon';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { FontAwesome5 } from '@expo/vector-icons';
const App = () => {
  const [forfeitModal, setForfeitModal] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HStack className="justify-between items-center bg-[#0c2665] p-2">
        <Button size="lg" className="rounded-full size-5" onPress={() => setForfeitModal(true)}>
          <ButtonIcon as={EditIcon} />
        </Button>
        <HStack space="md">
          <HStack space="xs">
            <Text bold>Stake: 5000</Text>
            <Box className="size-6 bg-amber-300 flex items-center justify-center rounded-full">
              <FontAwesome5 name="coins" size={12} color="white" />
            </Box>
          </HStack>
          <HStack space="xs">
            <Text bold>Win amount: 10000</Text>
            <Box className="size-6 bg-amber-300 flex items-center justify-center rounded-full">
              <FontAwesome5 name="coins" size={12} color="white" />
            </Box>
          </HStack>
        </HStack>
      </HStack>
      <Modal
        isOpen={forfeitModal}
        onClose={() => {
          setForfeitModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent className="bg-[#071843] border-0">
          <ModalHeader>
            <Text size="xl" bold>
              Forfeit
            </Text>
          </ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to leave?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              className="mr-3"
              onPress={() => {
                setForfeitModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button className="bg-green-600">
              <ButtonText>Forfeit</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
};

export default App;
