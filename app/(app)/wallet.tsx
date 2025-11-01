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
import Money from '@/assets/icons/Money';
import { Pressable } from '@/components/ui/pressable';

export default function WalletScreen() {
  const [showDepositModal, setDepositModal] = useState(false);
  const [showWithdrawModal, setWithdrawModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionI[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector((state: RootState) => state.user.data);
  const { data, isSuccess, isFetching } = useGetTransactionHistoryQuery({
    page: currentPage,
    size: 20,
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
    <SafeAreaView className="flex-1 px-2 py-8">
      <VStack space="3xl" className="flex-1">
        <HStack space="md" className="items-center justify-center">
          <Text size="4xl" bold>
            {user?.coins}
          </Text>

          <Money />
        </HStack>
        <HStack space="md">
          <Pressable className="flex-1">
            <Box className="rounded-full px-5 py-2 bg-red-500 flex-1">
              <Text className="text-center">Deposit</Text>
            </Box>
          </Pressable>
          <Pressable className="flex-1">
            <Box className="rounded-full px-5 py-2 bg-red-500 flex-1">
              <Text className="text-center">Share</Text>
            </Box>
          </Pressable>
          <Pressable className="flex-1">
            <Box className="rounded-full px-5 py-2 bg-red-500 flex-1">
              <Text className="text-center">Withdraw</Text>
            </Box>
          </Pressable>
        </HStack>

        <VStack className=" flex-1 items-center">
          <Box className=" rounded-3xl w-full flex-1 p-4 shadow-md" style={{ backgroundColor: '#1d3285' }}>
            <Text size="2xl" bold className="text-center mb-4">
              Transaction History
            </Text>

            <FlatList
              data={transactions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ index, item }) => (
                <HStack className="flex flex-row justify-between items-center p-4 rounded-lg mb-2" space="md" style={{ backgroundColor: '#456bb0' }}>
                  {/* <Text>{item.type}</Text> */}
                  <Text className="flex-1">{item.game ? item.game : item.type}</Text>
                  <Text>
                    {(item.type === 'Won' || item.type === 'Deposit') && '+'}
                    {(item.type === 'Lost' || item.type === 'Withdraw') && '-'}
                    {Math.abs(item.amount)}
                  </Text>
                  <Text className="flex-1  text-right">{new Date(item.created_at).toLocaleDateString()}</Text>
                </HStack>
              )}
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
