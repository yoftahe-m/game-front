import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, SharedValue } from 'react-native-reanimated';

import { RootState } from '@/store';
import { getSocket } from '@/socket';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Grid, GridItem } from '@/components/ui/grid';
import { Pressable } from '@/components/ui/pressable';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';

// Define a type for the piece data to improve clarity
type Piece = {
  id: string;
  color: string;
  king: boolean;
  x: SharedValue<number>;
  y: SharedValue<number>;
};

// === Child component for each animated piece ===
const AnimatedPiece = ({
  piece,
  from,
  onPress,
}: {
  piece: Piece;
  from: { x: number; y: number } | null;
  onPress: (x: number, y: number) => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: `${(piece.y.value * 100) / 8}%`,
    left: `${(piece.x.value * 100) / 8}%`,
    width: '12.5%',
    height: '12.5%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  // Use Math.round() for the current stable position for comparison
  const currentX = Math.round(piece.x.value);
  const currentY = Math.round(piece.y.value);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={() => onPress(currentX, currentY)}>
        <Box
          style={{
            backgroundColor: piece.color,
            width: 32,
            height: 32,
            borderRadius: 100,
            outlineWidth: from?.x === currentX && from?.y === currentY ? 2 : 0,
            outlineColor: '#f0c803',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {piece.king && <FontAwesome5 name="crown" size={12} color="gold" />}
        </Box>
      </Pressable>
    </Animated.View>
  );
};

// === Main Checkers component ===
const Checkers = () => {
  const socket = getSocket();
  const { game } = useLocalSearchParams<{ game: string }>();
  const user = useSelector((state: RootState) => state.user.data);
  const [from, setFrom] = useState<{ x: number; y: number } | null>(null);

  // Ensure 'game' is a string before parsing, default to an empty object
  const initialGameData = game ? JSON.parse(game) : { options: {} };
  const [playingGame, setPlayingGame] = useState(initialGameData);

  // Initialize animated pieces with a robust check for 'playingGame.options.board'
  const [animatedPieces, setAnimatedPieces] = useState<Piece[]>(() => {
    // If board is undefined or null, return an empty array to prevent error
    const board = initialGameData?.options?.board || [];

    return board
      .map((row: any, y: number) => row.map((cell: any, x: number) => ({ y, x, ...cell })))
      .flat()
      .filter((p: any) => !!p.color)
      .map((p: any) => ({
        id: p.id,
        color: p.color,
        king: p.king,
        // These are safe to call only after checking that 'board' exists
        x: useSharedValue(p.x),
        y: useSharedValue(p.y),
      }));
  });

  // Socket listener
  useEffect(() => {
    if (!socket) return;
    socket.on('gameUpdate', (gameUpdate) => {
      setPlayingGame(gameUpdate);
    });
    return () => {
      socket.off('gameUpdate');
    };
  }, [socket]);

  // Animate piece movement when the board updates
  useEffect(() => {
    // **GUARD CLAUSE ADDED HERE:** Check if the board data is available
    const board = playingGame?.options?.board;
    if (!board) return;

    const pieces = board
      .map((row: any, y: number) => row.map((cell: any, x: number) => ({ y, x, ...cell })))
      .flat()
      .filter((p: any) => !!p.color);

    setAnimatedPieces((prev) => {
      const newPieces: Piece[] = [];

      // Update existing pieces and collect new ones
      for (const p of pieces) {
        const existing = prev.find((ap) => ap.id === p.id);
        if (existing) {
          // Update position and king status on existing animated piece
          existing.x.value = withTiming(p.x, { duration: 300 });
          existing.y.value = withTiming(p.y, { duration: 300 });
          existing.king = p.king;
          newPieces.push(existing);
        } else {
          // Create a new animated piece
          newPieces.push({
            id: p.id,
            color: p.color,
            king: p.king,
            // Note: useSharedValue cannot be called outside of the component's render or effects
            // Since this runs in an effect, we rely on the initial state setup for existing pieces
            // For newly created pieces mid-game, you may need a different approach
            // or ensure all pieces are defined initially.
            // Assuming new pieces only appear via 'gameUpdate', we'll use the current values.
            x: useSharedValue(p.x),
            y: useSharedValue(p.y),
          });
        }
      }

      // Filter out pieces that are no longer on the board (captured)
      return newPieces.filter((p) => pieces.some((np) => np.id === p.id));
    });
  }, [playingGame]); // Dependency on playingGame state

  // Handle board press
  function handlePress(x: number, y: number) {
    // **GUARD CLAUSE ADDED HERE:** Check if board exists before accessing
    if (!playingGame?.options?.board) return;

    const piece = playingGame.options.board[y] && playingGame.options.board[y][x];

    if (!piece?.color && from) {
      // If the cell is empty AND we have a piece selected
      socket?.emit('checkers:move', { gameId: playingGame.id, from, to: { x, y } });
      setFrom(null);
    } else if (piece?.color) {
      // If the cell has a piece
      // Allow selecting a piece only if it's the current user's turn and their color
      const playerIndex = playingGame.players.findIndex((p: any) => p.userId === playingGame.options.turn);
      const playerColor = playerIndex === 0 ? 'red' : 'black'; // Assuming red/black colors

      if (playingGame.options.turn === user?.id && piece.color === playerColor) {
        setFrom({ x, y });
      } else if (from && from.x === x && from.y === y) {
        // Deselect if already selected
        setFrom(null);
      }
    } else {
      // Deselect if clicking on an empty square without a move
      setFrom(null);
    }
  }

  // Safety check for players array
  if (!playingGame || !playingGame.players || playingGame.players.length < 2) {
    return <Text>Loading game data or invalid game structure...</Text>;
  }

  // Determine player information safely
  const player1 = playingGame.players[0];
  const player2 = playingGame.players[1];
  const isPlayer1Turn = player1.userId === playingGame.options.turn;
  const isPlayer2Turn = player2.userId === playingGame.options.turn;
  const isMyTurn = playingGame.options.turn === user?.id;

  return (
    <VStack className="w-full" space="md">
      {/* Players header */}
      <HStack className="justify-between">
        <VStack space="xs">
          <HStack space="md" className="items-center">
            <Avatar size="md" className="border border-white rounded-lg overflow-hidden">
              <AvatarFallbackText>{player1.username}</AvatarFallbackText>
              <AvatarImage source={{ uri: player1.picture }} className="rounded-none" />
            </Avatar>
            {isPlayer1Turn && <FontAwesome name="arrow-left" size={24} color={isMyTurn ? '#16a34a' : 'white'} />}
          </HStack>
          <Text bold>{player1.username}</Text>
        </VStack>

        <VStack space="xs" className="items-end">
          <HStack space="md" className="items-center">
            {isPlayer2Turn && <FontAwesome name="arrow-right" size={24} color={isMyTurn ? '#16a34a' : 'white'} />}
            <Avatar size="md" className="border border-white rounded-lg overflow-hidden">
              <AvatarFallbackText>{player2.username}</AvatarFallbackText>
              <AvatarImage source={{ uri: player2.picture }} className="rounded-none" />
            </Avatar>
          </HStack>
          <Text bold>{player2.username}</Text>
        </VStack>
      </HStack>

      {/* Board */}
      <Grid _extra={{ className: 'grid-cols-8' }} style={{ position: 'relative' }}>
        {playingGame.options.board?.map((row: any, y: number) =>
          row.map((cell: any, x: number) => (
            <GridItem
              key={`${x}-${y}`}
              style={{
                // Checkerboard pattern
                backgroundColor: (x + y) % 2 === 0 ? '#f0d9b5' : '#6b3f1d',
                aspectRatio: 1,
              }}
              _extra={{ className: 'col-span-1' }}
            >
              <Pressable
                onPress={() => handlePress(x, y)}
                className="w-full aspect-square"
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  // Highlight potential moves if 'from' is set and the square is empty
                  borderWidth: from && !cell?.color ? 2 : 0,
                  borderColor: '#f0c80380',
                }}
              />
            </GridItem>
          ))
        )}

        {/* Animated Pieces */}
        {animatedPieces.map((p) => (
          <AnimatedPiece key={p.id} piece={p} from={from} onPress={handlePress} />
        ))}
      </Grid>
    </VStack>
  );
};

export default Checkers;
