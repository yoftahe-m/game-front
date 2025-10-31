import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { useEffect, useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { FlatList, ActivityIndicator } from 'react-native';
import { Box } from '@/components/ui/box';
import { useGetTransactionHistoryQuery } from '@/store/service/transaction';
import type { TransactionI, TransactionsI } from '@/store/service/transaction';
import { Input, InputField } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function WalletScreen() {
  const [showDepositModal, setDepositModal] = useState(false);
  const [showWithdrawModal, setWithdrawModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionI[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector((state: RootState) => state.user.data);
  const { data, isSuccess, isFetching } = useGetTransactionHistoryQuery({
    page: currentPage,
    size: 5,
  });

  useEffect(() => {
    if (isSuccess && data?.transactions) {
      setTransactions((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newOnes = data.transactions.filter((t) => !existingIds.has(t.id));
        return [...prev, ...newOnes];
      });
    }
  }, [data, isSuccess]);

  const loadMore = () => {
    if (!isFetching && data && currentPage < data.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 8 }}>
      <VStack space="md" className="flex-1">
        <Text className="text-center" size="2xl" bold>
          3000 ETB
        </Text>

        <HStack space="md">
          <Button className="flex-1" onPress={() => setDepositModal(true)}>
            <ButtonText>Deposit</ButtonText>
          </Button>
          <Button className="flex-1" onPress={() => setWithdrawModal(true)}>
            <ButtonText>Withdraw</ButtonText>
          </Button>
        </HStack>

        <VStack className="my-2 flex-1 border-[3px] border-amber-600 rounded-3xl bg-amber-400">
          <HStack className="justify-between items-center p-4">
            <Text size="xl" bold>
              Transaction History
            </Text>
          </HStack>

          <Box className="flex-1 bg-amber-200 border-2 border-amber-500 m-2 mt-0 rounded-2xl overflow-hidden">
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <HStack className="justify-between px-4 py-2 bg-amber-100 rounded-lg">
                  <Text>{item.type}</Text>
                  <Text>{item.amount} ETB</Text>
                  <Text>{new Date(item.created_at).toLocaleDateString()}</Text>
                </HStack>
              )}
              contentContainerStyle={{ gap: 10, padding: 8 }}
              onEndReached={loadMore}
              onEndReachedThreshold={0.4}
              ListFooterComponent={isFetching ? <ActivityIndicator size="small" color="#000" style={{ marginVertical: 10 }} /> : null}
            />
          </Box>
        </VStack>
      </VStack>

      {/* Deposit Modal */}
      <Modal isOpen={showDepositModal} onClose={() => setDepositModal(false)} size="md">
        <ModalBackdrop />
        <ModalContent className="bg-[#071843] border-0">
          <ModalHeader>
            <Text size="lg" bold>
              Deposit
            </Text>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <VStack space="xs">
                <Text>Deposit Phone Number</Text>
                <Input variant="outline" size="md" isDisabled={true} isInvalid={false} isReadOnly={false}>
                  <InputField placeholder="Enter phone number here..." value={user?.phone} className="text-white" />
                </Input>
              </VStack>
              <VStack space="xs">
                <Text>Amount</Text>
                <Input variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false}>
                  <InputField placeholder="Enter Amount here..." className="text-white" />
                </Input>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" action="secondary" className="mr-3" onPress={() => setDepositModal(false)}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button onPress={() => setDepositModal(false)}>
              <ButtonText>Deposit</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Withdraw Modal */}
      <Modal isOpen={showWithdrawModal} onClose={() => setWithdrawModal(false)} size="md">
        <ModalBackdrop />
        <ModalContent className="bg-[#071843] border-0">
          <ModalHeader>
            <Text size="lg" bold>
              Withdraw
            </Text>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <VStack space="xs">
                <Text>Withdraw Phone Number</Text>
                <Input variant="outline" size="md" isDisabled={true} isInvalid={false} isReadOnly={false}>
                  <InputField placeholder="Enter phone number here..." value={user?.phone} className="text-white" />
                </Input>
              </VStack>
              <VStack space="xs">
                <Text>Amount</Text>
                <Input variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false}>
                  <InputField placeholder="Enter Amount here..." />
                </Input>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" action="secondary" className="mr-3" onPress={() => setWithdrawModal(false)}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button onPress={() => setWithdrawModal(false)}>
              <ButtonText>Withdraw</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
