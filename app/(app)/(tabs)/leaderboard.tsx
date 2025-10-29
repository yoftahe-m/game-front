import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack'; // Assuming you have an HStack for horizontal alignment
import React from 'react';
import { FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchIcon } from '@/components/ui/icon'; // Assuming a SearchIcon is available
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- Mock Data ---
const mockLeaderboardData = [
  { id: 1, name: 'Alice 👑', score: 9875, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Bob', score: 8500, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Charlie', score: 7920, avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Diana', score: 6450, avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'Ethan', score: 5890, avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, name: 'Fiona', score: 4900, avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: 7, name: 'George', score: 3810, avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: 8, name: 'Hannah', score: 3550, avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: 9, name: 'Isaac', score: 2990, avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 10, name: 'Jasmine', score: 2100, avatar: 'https://i.pravatar.cc/150?img=10' },
];

// --- Leaderboard Item Component ---
interface LeaderboardItemProps {
  rank: number;
  name: string;
  score: number;
  isTopThree?: boolean;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ rank, name, score, isTopThree = false }) => {
  const rankStyles = {
    // Top 3 have a more prominent background
    bg: isTopThree ? 'bg-[#ffeb3b]/50' : 'bg-white',
    // Top 3 rank text color
    rankColor: isTopThree ? 'text-[#ffb300]' : 'text-gray-500',
    // Top 3 score/name text size
    textSize: isTopThree ? 'text-lg font-bold' : 'text-base font-medium',
    // Border for top 3
    border: isTopThree ? 'border-l-4 border-[#ffb300]' : 'border-b border-gray-100',
  };

  return (
    <HStack className={`w-full p-4 items-center justify-between ${rankStyles.bg} ${rankStyles.border}`} space="xl">
      {/* Rank and Name */}
      <HStack className="items-center" space="xl">
        <Text className={`w-8 text-center ${rankStyles.textSize} ${rankStyles.rankColor}`}>{rank}</Text>
        <Text className={`${rankStyles.textSize} text-gray-800`}>{name}</Text>
      </HStack>

      {/* Score */}
      <HStack className="items-center" space="sm">
        {rank === 1 && <SearchIcon className="text-[#ffb300]" />}
        <Text className={`${rankStyles.textSize} text-[#4BC0D9]`}>{score.toLocaleString()}</Text>
      </HStack>
    </HStack>
  );
};

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack space="lg" className="flex-1">
        <Center className="">
          <HStack className="items-end">
            <VStack>
              <Box className="w-20 h-28 bg-[#071843] flex items-center justify-center">
                <Text>2</Text>
              </Box>
              <Text className="text-center">{mockLeaderboardData[1].name}</Text>
            </VStack>
            <VStack className='items-center'>
              <MaterialCommunityIcons name="crown-outline" size={24} color={'white'} />
              <Box className="w-20 h-36 bg-[#071843] flex items-center justify-center">
                <Text>1</Text>
              </Box>
              <Text className="text-center">{mockLeaderboardData[0].name}</Text>
            </VStack>
            <VStack>
              <Box className="w-20 h-20 bg-[#071843] flex items-center justify-center">
                <Text>3</Text>
              </Box>
              <Text className="text-center">{mockLeaderboardData[2].name}</Text>
            </VStack>
          </HStack>
        </Center>
        <FlatList
          data={mockLeaderboardData.slice(3, 10)}
          renderItem={({ index, item }) => {
            return (
              <HStack space="md" className="items-center justify-between px-2">
                <HStack space="md" className="items-center">
                  <Text size="lg" bold>
                    {index + 4}
                  </Text>
                  <Avatar size="md">
                    <AvatarFallbackText>{item.name}</AvatarFallbackText>
                    <AvatarImage
                      source={{
                        uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                      }}
                    />
                  </Avatar>
                  <Text size="lg" bold>
                    {item.name}
                  </Text>
                </HStack>
                <Text size="lg" bold>
                  {item.score}
                </Text>
              </HStack>
            );
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            gap: 10,
            paddingBottom: 8,
            margin: 8,
            marginTop: 0,
            borderWidth: 1,
            borderColor: 'white',
            flex: 1,
            borderRadius: 20,
            overflow:"hidden"
          }}
        />
      </VStack>
    </SafeAreaView>
  );
}
