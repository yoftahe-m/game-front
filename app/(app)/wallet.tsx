import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { ReactNode, useEffect, useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { FlatList, ActivityIndicator, Animated, ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { useGetTransactionHistoryQuery, useShareMoneyMutation } from '@/store/service/transaction';
import type { TransactionI, TransactionsI } from '@/store/service/transaction';
import { Input, InputField } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import Money from '@/assets/icons/Money';
import { Pressable } from '@/components/ui/pressable';
import { LinearGradient } from 'expo-linear-gradient';
import { useSearchUserQuery } from '@/store/service/user';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import Toast from 'react-native-root-toast';
import { updateCoins } from '@/store/slice/user';

export default function WalletScreen() {
  const dispatch = useDispatch();
  const [showDepositModal, setDepositModal] = useState(false);
  const [showShareModal, setShareModal] = useState(false);
  const [showWithdrawModal, setWithdrawModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionI[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector((state: RootState) => state.user.data);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const { data, isSuccess, isFetching } = useGetTransactionHistoryQuery({
    page: currentPage,
    size: 20,
  });
  const [amount, setAmount] = useState<number | null>(null);
  const { data: users, isSuccess: isUsersLoaded, isFetching: isUsersLoading } = useSearchUserQuery({ name: username }, { skip: username.length < 1 });
  const [share, { isLoading }] = useShareMoneyMutation();
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

  const onShare = async () => {
    try {
      await share({
        data: { amount, personId: userId },
      }).unwrap();
      dispatch(updateCoins({ amount: Number(-amount!) }));
      setShareModal(false);
    } catch (error) {
      Toast.show('Failed to share money.', {
        duration: Toast.durations.LONG,
      });
    }
  };
  return (
    <SafeAreaView className="flex-1 px-2 py-8">
      <VStack space="3xl" className="flex-1">
        <HStack space="xs" className="items-end justify-center py-4">
          <Text size="6xl" bold className="m-0 p-0 leading-[40px] ">
            {user?.coins}
          </Text>

          <Money />
        </HStack>
        <HStack space="md">
          <ModalButton
            colors={['#4CFF4C', '#00C851', '#009432']}
            background={'#0d6b1e'}
            border={'#c8ffc8'}
            onPress={() => {
              setDepositModal(true);
            }}
          >
            <Text size="md" bold>
              Deposit
            </Text>
          </ModalButton>
          <ModalButton
            colors={['#FFD700', '#FFB200', '#E69A00']}
            background={'#8f6b22'}
            border={'#d1b375'}
            onPress={() => {
              setShareModal(true);
            }}
          >
            <Text size="md" bold>
              Share
            </Text>
          </ModalButton>
          <ModalButton
            colors={['#F8B4B4', '#E85C5C', '#8C1C1C']}
            background={'#963e38'}
            border={'#d19490'}
            onPress={() => {
              setWithdrawModal(true);
            }}
          >
            <Text size="md" bold>
              Withdraw
            </Text>
          </ModalButton>
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
        <ModalContent className="bg-[#132e61] border-0">
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

        <ModalContent className="border-0 p-5">
          <Box
            className="bg-white "
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.23,
              shadowRadius: 6,
              elevation: 6, // Android shadow
            }}
          >
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
          </Box>
        </ModalContent>
      </Modal>
      <Modal isOpen={showShareModal} onClose={() => setShareModal(false)} size="md">
        <ModalBackdrop />
        <ModalContent className="bg-[#132e61] border-0">
          <ModalHeader>
            <Text size="lg" bold>
              Share
            </Text>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <VStack space="xs">
                <Text>Amount</Text>
                <Input variant="outline" size="md">
                  <InputField
                    placeholder="Enter amount here..."
                    keyboardType="numeric"
                    value={amount ? amount.toString() : ''}
                    onChangeText={(text) => {
                      const num = Number(text.replace(/[^0-9.]/g, ''));
                      setAmount(isNaN(num) ? 0 : num);
                    }}
                    className="text-white"
                  />
                </Input>
              </VStack>
              <VStack space="xs">
                <Text>Username</Text>
                <Input variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false}>
                  <InputField placeholder="Enter username here..." value={username} onChangeText={(n) => setUsername(n)} className="text-white" />
                </Input>
              </VStack>
              <ScrollView style={{ maxHeight: 200 }} contentContainerStyle={{ flexGrow: 0 }} showsVerticalScrollIndicator={false}>
                <VStack space="xs">
                  {users?.map((u, i) => {
                    return (
                      <Pressable key={i} onPress={() => setUserId(u.id)}>
                        <HStack
                          className=" items-center p-2 rounded-lg "
                          space="md"
                          style={{ backgroundColor: userId === u.id ? '#16a34a' : '#456bb0' }}
                        >
                          <Avatar size="md">
                            <AvatarFallbackText>{u.full_name}</AvatarFallbackText>
                            <AvatarImage
                              source={{
                                uri: u.picture,
                              }}
                              alt="prof"
                            />
                          </Avatar>
                          <Text size="lg" bold>
                            {u.full_name}
                          </Text>
                        </HStack>
                      </Pressable>
                    );
                  })}
                </VStack>
              </ScrollView>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" action="secondary" className="mr-3" onPress={() => setShareModal(false)}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button disabled={!userId || !amount} onPress={onShare}>
              {isLoading && <ButtonSpinner color={'white'} />}
              <ButtonText>Share</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}

function ModalButton({
  children,
  colors,
  background,
  border,
  onPress,
}: {
  children: ReactNode;
  colors: string[];
  background: string;
  border: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} onPressIn={() => {}} onPressOut={() => {}} className="flex-1">
      <Animated.View
        style={{
          padding: 5,
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
          borderRadius: 40,
          backgroundColor: background,
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          height: 50,
        }}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 100,
            borderWidth: 1,
            borderColor: border,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
