import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Coin from '@/assets/icons/Coin';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { useGetReferredUsersQuery } from '@/store/service/user';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';

const ReferralScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [referredUsers, setReferredUsers] = useState<any[]>([]);
  const { data, isSuccess, isFetching } = useGetReferredUsersQuery({
    page: currentPage,
    size: 20,
  });

  useEffect(() => {
    if (isSuccess && data?.referredUsers) {
      setReferredUsers((prev) => {
        const existingIds = new Set(prev.map((u) => u.user_id));
        const newOnes = data.referredUsers.filter((u: any) => !existingIds.has(u.id));
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
        <HStack space="xs" className="items-end justify-center py-4">
          <Text size="6xl" bold className="m-0 p-0 leading-[40px] ">
            0
          </Text>

          <Coin />
        </HStack>
        <VStack className=" flex-1 items-center">
          <Box className=" rounded-3xl w-full flex-1 p-4 shadow-md" style={{ backgroundColor: '#1d3285' }}>
            <Text size="2xl" bold className="text-center mb-4">
              Referral History
            </Text>

            <FlatList
              data={referredUsers}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ index, item }) => (
                <HStack className="justify-between items-center px-4 py-2 rounded-xl mb-2" space="md" style={{ backgroundColor: '#456bb0' }}>
                  <HStack space="md" className="items-center">
                    <Text size="lg" bold>
                      {index + 1}
                    </Text>
                    <Avatar size="md">
                      <AvatarFallbackText>{item.full_name}</AvatarFallbackText>
                      <AvatarImage source={{ uri: item.picture }} alt="profile" />
                    </Avatar>
                    <Text size="lg" bold>
                      {item.full_name}
                    </Text>
                  </HStack>
                  <Text size="lg" bold>
                    {item.amount}
                  </Text>
                </HStack>
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.4}
              ListFooterComponent={isFetching ? <ActivityIndicator size="small" color="#000" style={{ marginVertical: 10 }} /> : null}
            />
          </Box>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};
export default ReferralScreen;
