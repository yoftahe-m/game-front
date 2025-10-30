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
    size: 5,
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
    <SafeAreaView style={{ flex: 1 }}>
      <VStack space="lg" className="flex-1 m-2">
        <Center className="">
          <HStack className="items-end">
            <VStack>
              <Box className="w-20 h-28 bg-slate-400 flex items-center justify-center rounded-tl-lg rounded-bl-lg">
                <Text>2</Text>
              </Box>
              <Text className="text-center">{leaders.length > 2 ? leaders[1].full_name.slice(0, 5) : ''}</Text>
            </VStack>
            <VStack className="items-center">
              <MaterialCommunityIcons name="crown-outline" size={24} color={'#fbbf24'} />
              <Box className="w-20 h-36 bg-amber-400 flex items-center justify-center rounded-t-lg">
                <Text>1</Text>
              </Box>
              <Text className="text-center">{leaders.length > 2 ? leaders[0].full_name.slice(0, 5) : ''}</Text>
            </VStack>
            <VStack>
              <Box className="w-20 h-20 bg-orange-800 flex items-center justify-center rounded-tr-lg rounded-br-lg">
                <Text>3</Text>
              </Box>
              <Text className="text-center">{leaders.length > 2 ? leaders[2].full_name.slice(0, 5) : ''}</Text>
            </VStack>
          </HStack>
        </Center>
        <VStack className=" my-2 flex-1 border-[3px] border-amber-600 rounded-3xl bg-amber-400">
          <HStack className="justify-between items-center p-4 ">
            <Text size="xl" bold>
              Leaderboard
            </Text>
          </HStack>
          <Box className="flex-1 bg-amber-200 border-2 border-amber-500 m-2 mt-0  rounded-2xl overflow-hidden">
            <FlatList
              data={leaders}
              renderItem={({ index, item }) => {
                return (
                  <HStack space="md" className="items-center justify-between px-2">
                    <HStack space="md" className="items-center">
                      <Text size="lg" bold>
                        {index + 1}
                      </Text>
                      <Avatar size="md">
                        <AvatarFallbackText>{item.full_name}</AvatarFallbackText>
                        <AvatarImage
                          source={{
                            uri: item.picture,
                          }}
                          alt="profile"
                        />
                      </Avatar>
                      <Text size="lg" bold>
                        {item.full_name}
                      </Text>
                    </HStack>
                    <Text size="lg" bold>
                      {item.amount}
                    </Text>
                  </HStack>
                );
              }}
              contentContainerStyle={{ gap: 10, padding: 8 }}
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
