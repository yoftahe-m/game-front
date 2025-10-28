import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Pressable, View } from 'react-native';
import { Grid, GridItem } from '@/components/ui/grid';
import { Text } from '@/components/ui/text';
import { router, useLocalSearchParams } from 'expo-router';
import { socket } from '@/socket';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function TicTacToeScreen() {
  const { game } = useLocalSearchParams<{ game: string }>();

  const user = useSelector((state: RootState) => state.user.data);
  const [playingGame, setPlayingGame] = useState(JSON.parse(game));

  useEffect(() => {
    socket.on('gameUpdate', (gameUpdate) => {
      setPlayingGame(gameUpdate);
    });

    return () => {
      socket.off('gameUpdate');
    };
  }, []);

  function handlePress(index: number) {
    socket.emit('ticTacToe:selectCell', { userId: user?.id, gameId: playingGame.id, cell: index });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text className="text-2xl font-bold mb-2">Tic Tac Toe</Text>
          <Text className="text-muted-foreground text-base">
            Player Turn: {playingGame.players.find((p: any) => p.userId === playingGame.turn).username}
          </Text>
        </View>

        {/* Game Board */}
        <Grid className="gap-4" _extra={{ className: 'grid-cols-3' }}>
          {playingGame.options.board.map((value: string, index: number) => {
            return (
              <GridItem
                key={index}
                className="bg-background-200 rounded-xl shadow-md"
                style={{ aspectRatio: 1 }}
                _extra={{ className: 'col-span-1' }}
              >
                <Pressable onPress={() => handlePress(index)} className="flex-1 items-center justify-center active:opacity-80">
                  <Text className={`text-5xl font-extrabold ${value === user?.id ? 'text-blue-600' : 'text-rose-600'}`}>
                    {value === user?.id ? 'O' : !!value ? 'X' : ''}
                  </Text>
                </Pressable>
              </GridItem>
            );
          })}
        </Grid>
      </ScrollView>
    </SafeAreaView>
  );
}
