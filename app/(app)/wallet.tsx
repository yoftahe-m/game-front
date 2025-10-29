import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';

export default function WalletScreen() {
  const [showDepositModal, setDepositModal] = useState(false);
  const [showWithdrawModal, setWithdrawModal] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1,paddingHorizontal:8 }}>
      <VStack space='md'>
        <Text className='text-center' size='2xl' bold>3000 ETB</Text>
        <HStack space='md' className="flex">
          <Button className="flex-1" onPress={()=>setDepositModal(true)}>
            <ButtonText>Deposit</ButtonText>
          </Button>
          <Button className="flex-1" onPress={()=>setWithdrawModal(true)}>
            <ButtonText>Withdraw</ButtonText>
          </Button>
        </HStack>
      </VStack>
      <Modal
        isOpen={showDepositModal}
        onClose={() => {
          setDepositModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Modal Title</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>This is the modal body. You can add any content here.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              className="mr-3"
              onPress={() => {
                setDepositModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setDepositModal(false);
              }}
            >
              <ButtonText>Save</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => {
          setWithdrawModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Modal Title</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>This is the modal body. You can add any content here.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              className="mr-3"
              onPress={() => {
                setWithdrawModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setWithdrawModal(false);
              }}
            >
              <ButtonText>Save</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
