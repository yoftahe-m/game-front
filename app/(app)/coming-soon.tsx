import { useState, useRef } from 'react';
import { Animated, Image, Easing } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import Ludo from '@/assets/images/ludo.png';

const gridSize = 15;

// --- CONFIGURATION ---

// 1. Main Outer Path (52 Steps)
const mainPath = [
  { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 },
  { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 },
  { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 2 },
  { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 9, y: 6 }, { x: 10, y: 6 },
  { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 },
  { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 13, y: 8 }, { x: 12, y: 8 },
  { x: 11, y: 8 }, { x: 10, y: 8 }, { x: 9, y: 8 }, { x: 8, y: 9 },
  { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 },
  { x: 8, y: 14 }, { x: 7, y: 14 }, { x: 6, y: 14 }, { x: 6, y: 13 },
  { x: 6, y: 12 }, { x: 6, y: 11 }, { x: 6, y: 10 }, { x: 6, y: 9 },
  { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 },
  { x: 1, y: 8 }, { x: 0, y: 8 }, { x: 0, y: 7 }, { x: 0, y: 6 },
];

// 2. Home Paths (The colored squares leading to center)
const homePaths = {
  red:    [{ x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }],
  green:  [{ x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }, { x: 7, y: 8 }],
  yellow: [{ x: 13, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }],
  blue:   [{ x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }],
};

// 3. Turning Points (Index on mainPath where each color turns into home)
const turningPoints = {
  red: 50,
  blue: 11,
  yellow: 24,
  green: 37,
};

// 4. Start Positions (Where they enter the board)
const startPositions = {
  red: { x: 1, y: 6 },
  blue: { x: 8, y: 1 },
  yellow: { x: 13, y: 8 },
  green: { x: 6, y: 13 },
};

const isSamePos = (p1:any, p2:any) => p1.x === p2.x && p1.y === p2.y;

const initialPins = [
  { id: 0, x: 1, y: 4, base: { x: 1, y: 4 }, color: 'red', state: 'base' }, // State: base | board | home
  { id: 1, x: 4, y: 4, base: { x: 4, y: 4 }, color: 'red', state: 'base' },
  { id: 4, x: 13, y: 4, base: { x: 13, y: 4 }, color: 'blue', state: 'base' },
  { id: 5, x: 10, y: 4, base: { x: 10, y: 4 }, color: 'blue', state: 'base' },
  { id: 8, x: 10, y: 10, base: { x: 10, y: 10 }, color: 'yellow', state: 'base' },
  { id: 9, x: 13, y: 10, base: { x: 13, y: 10 }, color: 'yellow', state: 'base' },
  { id: 12, x: 1, y: 10, base: { x: 1, y: 10 }, color: 'green', state: 'base' },
  { id: 13, x: 4, y: 10, base: { x: 4, y: 10 }, color: 'green', state: 'base' },
];

export default function ComingSoon() {
  const isAnimating = useRef(false);

  const pinsRef = useRef(
    initialPins.map((pin) => ({
      ...pin,
      animX: new Animated.Value(pin.x),
      animY: new Animated.Value(pin.y),
    }))
  ).current;

  const handlePinPress = (index:any) => {
    if (isAnimating.current) return;

    const pin = pinsRef[index];
    const roll = Math.floor(Math.random() * 6) + 1; // Dice Roll
    
    // --- CASE 1: LEAVE BASE ---
    if (pin.state === 'base') {
      // Standard Ludo rule: usually need a 6 to start, but we'll allow any roll for demo
      const startPos = startPositions[pin.color];
      pin.x = startPos.x;
      pin.y = startPos.y;
      pin.state = 'board';

      checkCollision(pin);

      Animated.parallel([
        Animated.timing(pin.animX, { toValue: startPos.x, duration: 400, useNativeDriver: false, easing: Easing.out(Easing.back(1.5)) }),
        Animated.timing(pin.animY, { toValue: startPos.y, duration: 400, useNativeDriver: false, easing: Easing.out(Easing.back(1.5)) }),
      ]).start();
      return;
    }

    // --- PRE-CALCULATE PATH (Check if move is valid) ---
    // We simulate the steps first. If the roll takes us "beyond" the finish line, we don't move.
    let simulatedState = pin.state;
    let simulatedX = pin.x;
    let simulatedY = pin.y;
    const plannedSteps = [];

    for (let i = 1; i <= roll; i++) {
      let nextPos = null;

      if (simulatedState === 'board') {
        const currentPathIndex = mainPath.findIndex(p => isSamePos(p, {x: simulatedX, y: simulatedY}));
        const turnIndex = turningPoints[pin.color];

        if (currentPathIndex === turnIndex) {
           // ENTER HOME PATH
           simulatedState = 'home';
           nextPos = homePaths[pin.color][0];
        } else {
           // CONTINUE ON BOARD
           const nextIndex = (currentPathIndex + 1) % mainPath.length;
           nextPos = mainPath[nextIndex];
        }
      } else if (simulatedState === 'home') {
        const homeIndex = homePaths[pin.color].findIndex(p => isSamePos(p, {x: simulatedX, y: simulatedY}));
        if (homeIndex + 1 < homePaths[pin.color].length) {
           // ADVANCE IN HOME
           nextPos = homePaths[pin.color][homeIndex + 1];
        } else {
           // ALREADY AT END OR OVERSHOOT
           // In Ludo, you must roll exact number. If overshoot, loop breaks.
           break; 
        }
      }

      if (nextPos) {
        plannedSteps.push(nextPos);
        simulatedX = nextPos.x;
        simulatedY = nextPos.y;
      }
    }

    // If roll was too high to finish, plannedSteps might be empty or fewer than roll
    if (plannedSteps.length === 0) return;

    // --- EXECUTE ANIMATION ---
    isAnimating.current = true;
    const animSequence = [];

    plannedSteps.forEach((pos) => {
      animSequence.push(Animated.parallel([
        Animated.timing(pin.animX, { toValue: pos.x, duration: 200, useNativeDriver: false, easing: Easing.linear }),
        Animated.timing(pin.animY, { toValue: pos.y, duration: 200, useNativeDriver: false, easing: Easing.linear }),
      ]));
    });

    Animated.sequence(animSequence).start(() => {
      // Update logical position at end
      const finalPos = plannedSteps[plannedSteps.length - 1];
      pin.x = finalPos.x;
      pin.y = finalPos.y;
      
      // Update state if we entered home during animation
      const isInHome = homePaths[pin.color].some(p => isSamePos(p, finalPos));
      if (isInHome) pin.state = 'home';

      checkCollision(pin);
      isAnimating.current = false;
    });
  };

  const checkCollision = (movingPin) => {
    // No collisions inside the Home Path (Safe Zone)
    if (movingPin.state === 'home') return;

    pinsRef.forEach((otherPin) => {
      if (
        otherPin.id !== movingPin.id &&
        otherPin.color !== movingPin.color &&
        otherPin.state === 'board' && // Can only capture on board
        otherPin.x === movingPin.x &&
        otherPin.y === movingPin.y
      ) {
        // Send victim back to base
        otherPin.x = otherPin.base.x;
        otherPin.y = otherPin.base.y;
        otherPin.state = 'base';

        Animated.parallel([
            Animated.timing(otherPin.animX, { toValue: otherPin.base.x, duration: 500, useNativeDriver: false, easing: Easing.out(Easing.exp) }),
            Animated.timing(otherPin.animY, { toValue: otherPin.base.y, duration: 500, useNativeDriver: false, easing: Easing.out(Easing.exp) })
        ]).start();
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <VStack className="flex-1 items-center justify-center p-4 space-y-8">
        <Box className="relative w-full max-w-[400px]" style={{ aspectRatio: 1 }}>
          <Image source={Ludo} style={{ width: '100%', height: '100%' }} resizeMode="contain" />

          {pinsRef.map((p, i) => (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                width: '6%', height: '6%',
                borderRadius: 999,
                backgroundColor: p.color,
                borderWidth: 2, borderColor: 'white',
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 2,
                elevation: 4, zIndex: 10,
                left: p.animX.interpolate({ inputRange: [0, gridSize], outputRange: ['0%', '100%'] }),
                top: p.animY.interpolate({ inputRange: [0, gridSize], outputRange: ['0%', '100%'] }),
                transform: [{ translateX: 2 }, { translateY: 2 }],
              }}
            >
              <Pressable className="flex-1" onPress={() => handlePinPress(i)} />
            </Animated.View>
          ))}
        </Box>

        <VStack className="items-center space-y-2">
          <Text size="3xl" bold className="text-gray-900">Coming Soon</Text>
          <Text size="lg" className="text-center text-gray-500 px-6">
            Tap to roll. Reach the center to win!
          </Text>
        </VStack>

        <Pressable onPress={() => router.back()}>
          <Box className="bg-black px-6 py-3 rounded-full active:opacity-80">
            <Text className="text-white font-bold">Go Back</Text>
          </Box>
        </Pressable>
      </VStack>
    </SafeAreaView>
  );
}