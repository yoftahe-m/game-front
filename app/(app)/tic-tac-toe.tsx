import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Pressable, View } from 'react-native';
import { Grid, GridItem } from '@/components/ui/grid';
import { Text } from '@/components/ui/text';
import { router, useLocalSearchParams } from 'expo-router';
import { socket } from '@/socket';

const WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function TicTacToeScreen() {
  const { roomId, userId } = useLocalSearchParams();

  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [player, setPlayer] = useState<'X' | 'O'>('X');

  useEffect(() => {
    socket.on('gameUpdate', (game) => {
      console.log('Game update received:', game.board);
      setBoard(game.board);
      setPlayer(game.turn);
    });
  }, []);

  function handlePress(index: number) {
    socket.emit('makeMove', { roomId, index, userId });
  }
  // const handlePress = useCallback(
  //   (index: number) => {
  //     if (board[index] || checkWinner(board)) return;

  //     const newBoard = [...board];
  //     newBoard[index] = player;
  //     setBoard(newBoard);

  //     const winner = checkWinner(newBoard);
  //     if (winner) {
  //       router.replace('/won');
  //       return;
  //     }

  //     if (!newBoard.includes('')) {
  //       router.replace('/draw');
  //       return;
  //     }

  //     setPlayer((prev) => (prev === 'X' ? 'O' : 'X'));
  //   },
  //   [board, player, checkWinner]
  // );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text className="text-2xl font-bold mb-2">Tic Tac Toe</Text>
          <Text className="text-muted-foreground text-base">Player Turn: {player}</Text>
        </View>

        {/* Game Board */}
        <Grid className="gap-4" _extra={{ className: 'grid-cols-3' }}>
          {board.map((value, index) => (
            <GridItem key={index} className="bg-background-200 rounded-xl shadow-md" style={{ aspectRatio: 1 }} _extra={{ className: 'col-span-1' }}>
              <Pressable onPress={() => handlePress(index)} className="flex-1 items-center justify-center active:opacity-80">
                <Text className={`text-5xl font-extrabold ${value === 'X' ? 'text-blue-600' : 'text-rose-600'}`}>{value}</Text>
              </Pressable>
            </GridItem>
          ))}
        </Grid>
      </ScrollView>
    </SafeAreaView>
  );
}
