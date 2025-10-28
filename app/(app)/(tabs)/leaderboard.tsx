import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack'; // Assuming you have an HStack for horizontal alignment
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchIcon } from '@/components/ui/icon'; // Assuming a SearchIcon is available

// --- Mock Data ---
const mockLeaderboardData = [
  { rank: 1, name: 'Alice 👑', score: 9875, avatar: 'https://i.pravatar.cc/150?img=1' },
  { rank: 2, name: 'Bob', score: 8500, avatar: 'https://i.pravatar.cc/150?img=2' },
  { rank: 3, name: 'Charlie', score: 7920, avatar: 'https://i.pravatar.cc/150?img=3' },
  { rank: 4, name: 'Diana', score: 6450, avatar: 'https://i.pravatar.cc/150?img=4' },
  { rank: 5, name: 'Ethan', score: 5890, avatar: 'https://i.pravatar.cc/150?img=5' },
  { rank: 6, name: 'Fiona', score: 4900, avatar: 'https://i.pravatar.cc/150?img=6' },
  { rank: 7, name: 'George', score: 3810, avatar: 'https://i.pravatar.cc/150?img=7' },
  { rank: 8, name: 'Hannah', score: 3550, avatar: 'https://i.pravatar.cc/150?img=8' },
  { rank: 9, name: 'Isaac', score: 2990, avatar: 'https://i.pravatar.cc/150?img=9' },
  { rank: 10, name: 'Jasmine', score: 2100, avatar: 'https://i.pravatar.cc/150?img=10' },
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
    <HStack
      className={`w-full p-4 items-center justify-between ${rankStyles.bg} ${rankStyles.border}`}
      space="xl"
    >
      {/* Rank and Name */}
      <HStack className="items-center" space="xl">
        <Text className={`w-8 text-center ${rankStyles.textSize} ${rankStyles.rankColor}`}>
          {rank}
        </Text>
        <Text className={`${rankStyles.textSize} text-gray-800`}>{name}</Text>
      </HStack>

      {/* Score */}
      <HStack className="items-center" space="sm">
        {rank === 1 && <SearchIcon className="text-[#ffb300]" />}
        <Text className={`${rankStyles.textSize} text-[#4BC0D9]`}>
          {score.toLocaleString()}
        </Text>
      </HStack>
    </HStack>
  );
};

// --- Main Leaderboard Screen ---
export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-gray-50">
        {/* Header */}
        <Center className="py-6 px-5 bg-[#4BC0D9] shadow-md">
          <Text className="text-2xl font-bold text-white">Global Leaderboard 🏆</Text>
          <Text className="text-sm text-white/80 mt-1">See who is on top this week!</Text>
        </Center>

        {/* List Header */}
        <HStack className="w-full p-4 items-center justify-between bg-gray-200 border-b border-gray-300">
          <HStack className="items-center" space="xl">
            <Text className="w-8 text-center text-sm font-semibold text-gray-600">RANK</Text>
            <Text className="text-sm font-semibold text-gray-600">USER</Text>
          </HStack>
          <Text className="text-sm font-semibold text-gray-600">SCORE</Text>
        </HStack>

        {/* Leaderboard List */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <VStack className="w-full">
            {mockLeaderboardData.map((item) => (
              <LeaderboardItem
                key={item.rank}
                rank={item.rank}
                name={item.name}
                score={item.score}
                isTopThree={item.rank <= 3}
              />
            ))}
          </VStack>
        </ScrollView>
      </VStack>
    </SafeAreaView>
  );
}