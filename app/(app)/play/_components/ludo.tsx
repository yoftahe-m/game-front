import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

import { RootState } from '@/store';
import { getSocket } from '@/socket';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Animated, Image } from 'react-native';
import AnimatedCircularProgress, { interpolateColor } from './progress';
import { useSharedValue } from 'react-native-reanimated';
import LudoBoard from '@/assets/images/ludo-board.png';
import { gridSize, homePaths, initialPins, mainPath, safeArea, startPositions, turningPoints } from '../_constants/ludo';
import { Color, Coordinate } from '../type/ludo';
import { isSamePos } from '../utils/ludo';

const Ludo = ({ resetCountdown }: { resetCountdown: () => void }) => {
  const isAnimating = useRef(false);
  const socket = getSocket();
  const { game } = useLocalSearchParams<{ game: string }>();

  const pinsRef = useRef(
    JSON.parse(game).options.pins.map((pin: any) => ({
      ...pin,
      animX: new Animated.Value(pin.x),
      animY: new Animated.Value(pin.y),
      animScale: new Animated.Value(1),
    }))
  ).current;

  const user = useSelector((state: RootState) => state.user.data);
  const [playingGame, setPlayingGame] = useState(JSON.parse(game));

  useEffect(() => {
    if (!socket) return;
    socket.on('gameUpdate', (gameUpdate) => {
      try {
        const lastMove = gameUpdate.options?.lastMove;

        const animateKilledPins = (killed: any[] | undefined) => {
          if (!Array.isArray(killed) || killed.length === 0) return;
          killed.forEach((k: any) => {
            const otherLocal = pinsRef.find((p: any) => p.id === k.id);
            if (!otherLocal) return;

            if (Array.isArray(k.steps) && k.steps.length > 0) {
              const tileAnims = k.steps.map((step: any) =>
                Animated.sequence([
                  Animated.timing(otherLocal.animX, { toValue: step.x, duration: 60, useNativeDriver: false }),
                  Animated.timing(otherLocal.animY, { toValue: step.y, duration: 60, useNativeDriver: false }),
                ])
              );

              Animated.sequence(tileAnims).start(() => {
                const last = k.steps[k.steps.length - 1];
                otherLocal.state = 'base';
                otherLocal.x = last.x;
                otherLocal.y = last.y;
              });
            } else {
              Animated.sequence([
                Animated.timing(otherLocal.animX, { toValue: k.to?.x ?? otherLocal.base.x, duration: 200, useNativeDriver: false }),
                Animated.timing(otherLocal.animY, { toValue: k.to?.y ?? otherLocal.base.y, duration: 200, useNativeDriver: false }),
              ]).start(() => {
                otherLocal.state = 'base';
                otherLocal.x = k.to?.x ?? otherLocal.base.x;
                otherLocal.y = k.to?.y ?? otherLocal.base.y;
              });
            }
          });
        };

        if (lastMove && typeof lastMove.index === 'number') {
          // Animate the moved pin step-by-step
          const movedPinData = gameUpdate.options.pins[lastMove.index];
          const movedPinLocal = pinsRef.find((p: any) => p.id === movedPinData?.id);

          if (movedPinLocal && Array.isArray(lastMove.steps) && lastMove.steps.length > 0) {
            // If already at final pos, skip move animation but still run kill anims afterwards
            const finalStep = lastMove.steps[lastMove.steps.length - 1];
            const alreadyAtFinal = movedPinLocal.x === finalStep.x && movedPinLocal.y === finalStep.y;

            const moveSeq = lastMove.steps.map((step: any) =>
              Animated.parallel([
                Animated.timing(movedPinLocal.animX, { toValue: step.x, duration: 180, useNativeDriver: false }),
                Animated.timing(movedPinLocal.animY, { toValue: step.y, duration: 180, useNativeDriver: false }),
                Animated.sequence([
                  Animated.timing(movedPinLocal.animScale, { toValue: 1.2, duration: 90, useNativeDriver: false }),
                  Animated.timing(movedPinLocal.animScale, { toValue: 1, duration: 90, useNativeDriver: false }),
                ]),
              ])
            );

            if (alreadyAtFinal) {
              // no move animation, but still update authoritative state and then run killed animations
              movedPinLocal.state = movedPinData.state;
              movedPinLocal.x = finalStep.x;
              movedPinLocal.y = finalStep.y;
              animateKilledPins(lastMove.killed);
            } else {
              Animated.sequence(moveSeq).start(() => {
                movedPinLocal.x = finalStep.x;
                movedPinLocal.y = finalStep.y;
                movedPinLocal.state = movedPinData.state;
                // Start kill animations only after the move finishes
                animateKilledPins(lastMove.killed);
              });
            }
          } else {
            // no detailed steps for moved pin — still run killed pins after syncing state
            animateKilledPins(lastMove.killed);
          }
        } else {
          // fallback: animate any pin that changed position/state to server final
          gameUpdate.options.pins.forEach((updatedPin: any) => {
            const localPin = pinsRef.find((p: any) => p.id === updatedPin.id);
            if (!localPin) return;

            const changed = localPin.x !== updatedPin.x || localPin.y !== updatedPin.y || localPin.state !== updatedPin.state;
            if (!changed) return;

            Animated.parallel([
              Animated.timing(localPin.animX, { toValue: updatedPin.x, duration: 300, useNativeDriver: false }),
              Animated.timing(localPin.animY, { toValue: updatedPin.y, duration: 300, useNativeDriver: false }),
              Animated.sequence([
                Animated.timing(localPin.animScale, { toValue: 1.15, duration: 120, useNativeDriver: false }),
                Animated.timing(localPin.animScale, { toValue: 1, duration: 120, useNativeDriver: false }),
              ]),
            ]).start(() => {
              localPin.x = updatedPin.x;
              localPin.y = updatedPin.y;
              localPin.state = updatedPin.state;
            });
          });
        }
      } catch (e) {
        // ignore animation errors
      }

      setPlayingGame(gameUpdate);
    });

    return () => {
      socket?.off('gameUpdate');
    };
  }, []);

  const handlePinPress = (index: number) => {
    if (!socket) return;
    if (playingGame.options.turn !== user!.id) return;
    let playerIndex = playingGame.players.findIndex((p: any) => p.userId === playingGame.options.turn);

    let playerColor: Color;
    if (playingGame.players.length === 4) {
      playerColor = ['red', 'blue', 'green', 'yellow'][playerIndex] as Color;
    } else {
      playerColor = ['red', 'yellow'][playerIndex] as Color;
    }

    if (isAnimating.current) return;

    const pin = pinsRef[index];
    const roll = playingGame.options.roll;
    if (pin.color !== playerColor) return;

    const isRolledByUser = playingGame.options.rolledBy === user!.id;

    console.log('Pressed pin:', index, 'Color:', pin.color, 'Roll:', roll, 'State:', pin.state);
    // Prevent leaving base unless the die roll is a 6
    if (pin.state === 'base') {
      // only requirement to leave base is that the current roll equals 6
      // (server still enforces that the player actually rolled; this avoids frontend blocking
      // when local `rolledBy` hasn't been updated yet)
      if (roll !== 6) return;
    }

    console.log('Animating pin move...');
    /* ---------------------------
         PRE-SIMULATE PATH (same for preview & actual move)
       --------------------------- */
    let simulatedState = pin.state;
    let simulatedX = pin.x;
    let simulatedY = pin.y;
    const plannedSteps: Coordinate[] = [];

    // If pin is already on home path, ensure roll does not overshoot the end.
    if (simulatedState === 'home') {
      const homeArr = homePaths[pin.color as Color];
      const currIdx = homeArr.findIndex((p) => isSamePos(p, { x: simulatedX, y: simulatedY }));
      // if not found treat as cannot move
      if (currIdx === -1) return;
      const stepsRemaining = homeArr.length - 1 - currIdx;
      if (stepsRemaining <= 0) return; // already at final
      if (roll > stepsRemaining) {
        // overshoot -> cannot move according to rule
        return;
      }
    }

    for (let i = 1; i <= roll; i++) {
      let nextPos: Coordinate | null = null;

      // Handle leaving base: first step goes to the start position if roll allows (roll checked earlier)
      if (simulatedState === 'base') {
        const startPos = startPositions[pin.color as Color];
        nextPos = startPos;
        simulatedState = 'board';

        if (nextPos) {
          plannedSteps.push(nextPos);
        }
        break;
      } else if (simulatedState === 'board') {
        const idx = mainPath.findIndex((p) => isSamePos(p, { x: simulatedX, y: simulatedY }));
        const turnIndex = turningPoints[pin.color as Color];

        if (idx === turnIndex) {
          simulatedState = 'home';
          nextPos = homePaths[pin.color as Color][0];
        } else {
          nextPos = mainPath[(idx + 1) % mainPath.length];
        }
      } else if (simulatedState === 'home') {
        const idx = homePaths[pin.color as Color].findIndex((p) => isSamePos(p, { x: simulatedX, y: simulatedY }));
        if (idx + 1 < homePaths[pin.color as Color].length) {
          nextPos = homePaths[pin.color as Color][idx + 1];
        } else {
          break;
        }
      }

      if (nextPos) {
        plannedSteps.push(nextPos);
        simulatedX = nextPos.x;
        simulatedY = nextPos.y;
      }
    }
    console.log('Planned steps:', plannedSteps);

    if (plannedSteps.length === 0) return;

    /* ---------------------------
         PREVIEW (before rolling) OR ACTUAL MOVE (after rolling)
       --------------------------- */
    isAnimating.current = true;
    const forwardAnims = plannedSteps.map((pos) =>
      Animated.parallel([
        Animated.timing(pin.animX, { toValue: pos.x, duration: 200, useNativeDriver: false }),
        Animated.timing(pin.animY, { toValue: pos.y, duration: 200, useNativeDriver: false }),
        Animated.sequence([
          Animated.timing(pin.animScale, { toValue: 1.25, duration: 100, useNativeDriver: false }),
          Animated.timing(pin.animScale, { toValue: 1, duration: 100, useNativeDriver: false }),
        ]),
      ])
    );

    if (!isRolledByUser) {
      // PREVIEW: animate forward then revert back to original position (don't change authoritative pin.x/y/state or emit)
      const origX = pin.x;
      const origY = pin.y;
      Animated.sequence([
        Animated.sequence(forwardAnims),
        // short pause
        Animated.delay(120),
        // revert animations back to original coords (tile by tile reversed to avoid diagonal)
        ...plannedSteps
          .slice()
          .reverse()
          .map((pos) =>
            Animated.sequence([
              Animated.timing(pin.animX, { toValue: pos.x, duration: 120, useNativeDriver: false }),
              Animated.timing(pin.animY, { toValue: pos.y, duration: 120, useNativeDriver: false }),
            ])
          ),
        Animated.parallel([
          Animated.timing(pin.animX, { toValue: origX, duration: 200, useNativeDriver: false }),
          Animated.timing(pin.animY, { toValue: origY, duration: 200, useNativeDriver: false }),
        ]),
      ]).start(() => {
        // nothing changed server-side, restore scale and flags
        Animated.timing(pin.animScale, { toValue: 1, duration: 80, useNativeDriver: false }).start();
        isAnimating.current = false;
      });

      return;
    }

    // ACTUAL MOVE: user has rolled — perform animation, update local refs and notify server
    Animated.sequence(forwardAnims).start(() => {
      const finalPos = plannedSteps[plannedSteps.length - 1];
      pin.x = finalPos.x;
      pin.y = finalPos.y;

      const isInHome = homePaths[pin.color as Color].some((p) => isSamePos(p, finalPos));
      if (isInHome) pin.state = 'home';

      const isInSafeArea = safeArea.find((a) => a.x === pin.x && a.y === pin.y);
      if (!isInSafeArea) checkCollision(pin);
      isAnimating.current = false;

      if (socket) socket.emit('ludo:movePin', { gameId: playingGame.id, index });
    });
  };

  /* ---------------------------
       COLLISION HANDLING
    --------------------------- */
  const checkCollision = (movingPin: any) => {
    if (movingPin.state === 'home') return;

    pinsRef.forEach((otherPin: any) => {
      const sameTile =
        otherPin.id !== movingPin.id &&
        otherPin.color !== movingPin.color &&
        otherPin.state === 'board' &&
        otherPin.x === movingPin.x &&
        otherPin.y === movingPin.y;

      if (!sameTile) return;
      let index = 0;

      if (otherPin.color === 'red') index = 0;
      else if (otherPin.color === 'blue') index = 13;
      else if (otherPin.color === 'yellow') index = 26;
      else if (otherPin.color === 'green') index = 39;
      // Find index of otherPin along the main path
      const path = [...mainPath.slice(index), ...mainPath.slice(0, index)];

      const hitIndex = path.findIndex((p) => isSamePos(p, { x: otherPin.x, y: otherPin.y }));

      if (hitIndex === -1) return;

      // Build reverse path -> from current tile back to start of mainPath
      const reversePath: Coordinate[] = [];

      for (let i = hitIndex; i >= 0; i--) {
        reversePath.push(path[i]);
      }

      // Then push base position
      reversePath.push({ x: otherPin.base.x, y: otherPin.base.y });

      otherPin.state = 'base';

      // Animation sequence
      isAnimating.current = true;
      // Animate each tile as two sub-steps (X then Y) to avoid diagonal shortcuts.
      // This forces the pin to move along the grid path (L-shaped per tile) instead of directly interpolating.
      const anims = reversePath.map((step) =>
        Animated.sequence([
          Animated.timing(otherPin.animX, {
            toValue: step.x,
            duration: 60,
            useNativeDriver: false,
          }),
          Animated.timing(otherPin.animY, {
            toValue: step.y,
            duration: 60,
            useNativeDriver: false,
          }),
        ])
      );

      Animated.sequence(anims).start(() => {
        otherPin.x = otherPin.base.x;
        otherPin.y = otherPin.base.y;

        isAnimating.current = false;
      });
    });
  };

  const isUserTurn = user?.id === playingGame.options.turn;
  // derive current user's color (only used when it's their turn)
  let userColor: Color | null = null;
  if (isUserTurn) {
    const playerIndex = playingGame.players.findIndex((p: any) => p.userId === user?.id);
    userColor =
      playingGame.players.length === 4 ? (['red', 'blue', 'green', 'yellow'][playerIndex] as Color) : (['red', 'yellow'][playerIndex] as Color);
  }

  return (
    <VStack className=" w-full" space="md">
      <HStack className="justify-between">
        <Player
          color={'#FF2400'}
          player={playingGame.players[0]}
          turn={playingGame.options.turn}
          gameId={playingGame.id}
          roll={playingGame.options.roll}
          rolledBy={playingGame.options.rolledBy}
        />
        {/* {playingGame.maxPlayers === 4 && <Player color={'#0F52BA'} inverse={true} gameId={playingGame.id} roll={playingGame.options.roll} />} */}
      </HStack>
      <Box className=" rounded-xl overflow-hidden relative" style={{ aspectRatio: 1 }}>
        <Image source={LudoBoard} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        {pinsRef.map((p: any, i: number) => {
          const isInSafe = safeArea.some((s) => s.x === p.x && s.y === p.y);
          const isOwnedByUser = userColor !== null && p.color === userColor;
          // Ensure current user's pins are always on top (even when not their turn).
          // Use elevation for Android and zIndex for iOS.
          const pinZ = isOwnedByUser ? 100 : 1;

          return (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                width: '6%',
                height: '6%',
                borderRadius: 999,
                backgroundColor: p.color,
                borderWidth: 2,
                borderColor: 'white',
                left: p.animX.interpolate({ inputRange: [0, gridSize], outputRange: ['0%', '100%'] }),
                top: p.animY.interpolate({ inputRange: [0, gridSize], outputRange: ['0%', '100%'] }),

                transform: [{ translateX: 2 }, { translateY: 2 }, { scale: p.animScale }],
                zIndex: pinZ,
                elevation: pinZ,
              }}
            >
              <Pressable className="flex-1" onPress={() => handlePinPress(i)} />
            </Animated.View>
          );
        })}
      </Box>
      <HStack className="flex flex-row justify-between">
        {playingGame.maxPlayers === 4 ? (
          <Player
            color={'#00C853'}
            player={playingGame.players[4]}
            turn={playingGame.options.turn}
            gameId={playingGame.id}
            roll={playingGame.options.roll}
            rolledBy={playingGame.options.rolledBy}
          />
        ) : (
          <Box />
        )}
        <Player
          color={'#facc15'}
          inverse={true}
          player={playingGame.players[playingGame.players.length === 2 ? 1 : 3]}
          turn={playingGame.options.turn}
          gameId={playingGame.id}
          roll={playingGame.options.roll}
          rolledBy={playingGame.options.rolledBy}
        />
      </HStack>
    </VStack>
  );
};

export default Ludo;

function Player({
  color,
  inverse = false,
  player,
  turn,
  gameId,
  roll,
  rolledBy,
}: {
  color: string;
  turn?: string;
  inverse?: boolean;
  player: any;
  gameId: String;
  roll: number;
  rolledBy?: string;
}) {
  const fill = useSharedValue(100);
  const tintColor = useSharedValue(interpolateColor(100));
  const socket = getSocket();
  const user = useSelector((state: RootState) => state.user.data);
  const rollDie = () => {
    if (turn !== user?.id) return;
    if (!socket) return;
    socket.emit('ludo:rollDie', { userId: user!.id, gameId });
  };

  function dice(roll: number) {
    switch (roll) {
      case 1:
        return 'dice-one';
        break;
      case 2:
        return 'dice-two';
        break;
      case 3:
        return 'dice-three';
        break;
      case 4:
        return 'dice-four';
        break;
      case 5:
        return 'dice-five';
        break;
      case 6:
        return 'dice-six';
        break;

      default:
        return 'dice-one';
        break;
    }
  }

  return (
    <VStack space="sm">
      <HStack space="md" className={inverse ? 'flex-row-reverse' : ''} style={{ alignItems: 'center' }}>
        <Box>
          <AnimatedCircularProgress size={65} width={10} fill={fill} tintColor={tintColor} backgroundColor="#E0E0E0">
            <Avatar size="lg" className="border border-white rounded-full overflow-hidden ">
              <AvatarFallbackText>{player.username}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: player.picture,
                }}
                className="rounded-none"
              />
            </Avatar>
          </AnimatedCircularProgress>
        </Box>

        <Pressable onPress={rollDie}>
          <Box className="size-12 rounded-lg justify-center items-center" style={{ backgroundColor: color }}>
            {turn === player.userId && turn === rolledBy ? (
              <FontAwesome5 name={dice(roll)} size={24} color="white" />
            ) : (
              <FontAwesome5 name="dice" size={24} color="white" />
            )}
          </Box>
        </Pressable>
        {player.userId === turn && (
          <FontAwesome name={inverse ? 'arrow-right' : 'arrow-left'} size={24} color={turn === user?.id ? '#FFD93D' : 'white'} />
        )}
      </HStack>
      <Text className={inverse ? 'text-right ' : ''} bold>
        {player.username}
      </Text>
    </VStack>
  );
}
