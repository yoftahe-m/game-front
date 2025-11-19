import { View } from 'react-native';
import { useEffect, useState } from 'react';

import { Text } from '@/components/ui/text';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';

function Countdown({ showCountdownModal, closeCountdownModal }: { showCountdownModal: boolean; closeCountdownModal: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!showCountdownModal) return;
    setCount(3);
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          closeCountdownModal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showCountdownModal, closeCountdownModal]);

  return (
    <Modal isOpen={showCountdownModal} onClose={closeCountdownModal} size="md">
      <ModalBackdrop />
      <ModalContent className="bg-[#132e61] border-0 rounded-2xl">
        <ModalBody>
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}>
            <Text className="text-6xl font-bold">{count}</Text>
          </View>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default Countdown;
