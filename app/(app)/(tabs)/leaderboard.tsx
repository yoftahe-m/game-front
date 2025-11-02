import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { LeaderI, useGetLeaderboardQuery } from '@/store/service/transaction';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState<LeaderI[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isSuccess, isFetching, error } = useGetLeaderboardQuery({
    page: currentPage,
    size: 20,
  });

  useEffect(() => {
    if (isSuccess && data?.leaders) {
      setLeaders((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newOnes = data.leaders.filter((t) => !existingIds.has(t.id));
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
    <SafeAreaView style={{ flex: 1, paddingBottom: 20 }}>
      <VStack space="lg" className="flex-1 m-2">
        <Center className="">
          <HStack className="items-end" space="sm">
            <VStack>
              <Avatar size="xl">
                <AvatarFallbackText>{leaders.length > 2 ? leaders[1].full_name.slice(0, 5) : ''}</AvatarFallbackText>
                <AvatarImage source={{ uri: leaders.length > 2 ? leaders[1].picture : '' }} alt="profile" />
              </Avatar>
              <Text className="text-center">{leaders.length > 2 ? leaders[1].full_name.slice(0, 5) : ''}</Text>
            </VStack>
            <VStack className="items-center mb-10">
              <MaterialCommunityIcons name="crown-outline" size={24} color={'#fbbf24'} />

              <Avatar size="2xl">
                <AvatarFallbackText>{leaders.length > 2 ? leaders[0].full_name.slice(0, 5) : ''}</AvatarFallbackText>
                <AvatarImage source={{ uri: leaders.length > 2 ? leaders[0].picture : '' }} alt="profile" />
              </Avatar>
              <Text className="text-center">{leaders.length > 2 ? leaders[0].full_name.slice(0, 5) : ''}</Text>
            </VStack>
            <VStack>
              <Avatar size="xl">
                <AvatarFallbackText>{leaders.length > 2 ? leaders[2].full_name.slice(0, 5) : ''}</AvatarFallbackText>
                <AvatarImage source={{ uri: leaders.length > 2 ? leaders[2].picture : '' }} alt="profile" />
              </Avatar>
              <Text className="text-center">{leaders.length > 2 ? leaders[2].full_name.slice(0, 5) : ''}</Text>
            </VStack>
          </HStack>
        </Center>
        <VStack className=" flex-1 items-center">
          <Box className=" rounded-3xl w-full flex-1 p-4 shadow-md" style={{ backgroundColor: '#1d3285' }}>
            <Text size="2xl" bold className="text-center mb-4">
              Leaderboard
            </Text>

            <FlatList
              data={leaders}
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
}
