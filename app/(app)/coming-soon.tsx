import { useRef } from 'react';
import { Animated, Image, Easing } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import Ludo from '@/assets/images/ludo.png';

type Color = 'red' | 'blue' | 'yellow' | 'green';
type Coordinate = { x: number; y: number };
const gridSize = 15;

/* ----------------------------------------------
   PATHS & BOARD CONFIGURATION
---------------------------------------------- */

const mainPath = [
  { x: 1, y: 6 },
  { x: 2, y: 6 },
  { x: 3, y: 6 },
  { x: 4, y: 6 },
  { x: 5, y: 6 },
  { x: 6, y: 5 },
  { x: 6, y: 4 },
  { x: 6, y: 3 },
  { x: 6, y: 2 },
  { x: 6, y: 1 },
  { x: 6, y: 0 },
  { x: 7, y: 0 },
  { x: 8, y: 0 },
  { x: 8, y: 1 },
  { x: 8, y: 2 },
  { x: 8, y: 3 },
  { x: 8, y: 4 },
  { x: 8, y: 5 },
  { x: 9, y: 6 },
  { x: 10, y: 6 },
  { x: 11, y: 6 },
  { x: 12, y: 6 },
  { x: 13, y: 6 },
  { x: 14, y: 6 },
  { x: 14, y: 7 },
  { x: 14, y: 8 },
  { x: 13, y: 8 },
  { x: 12, y: 8 },
  { x: 11, y: 8 },
  { x: 10, y: 8 },
  { x: 9, y: 8 },
  { x: 8, y: 9 },
  { x: 8, y: 10 },
  { x: 8, y: 11 },
  { x: 8, y: 12 },
  { x: 8, y: 13 },
  { x: 8, y: 14 },
  { x: 7, y: 14 },
  { x: 6, y: 14 },
  { x: 6, y: 13 },
  { x: 6, y: 12 },
  { x: 6, y: 11 },
  { x: 6, y: 10 },
  { x: 6, y: 9 },
  { x: 5, y: 8 },
  { x: 4, y: 8 },
  { x: 3, y: 8 },
  { x: 2, y: 8 },
  { x: 1, y: 8 },
  { x: 0, y: 8 },
  { x: 0, y: 7 },
  { x: 0, y: 6 },
];

const homePaths = {
  red: [
    { x: 1, y: 7 },
    { x: 2, y: 7 },
    { x: 3, y: 7 },
    { x: 4, y: 7 },
    { x: 5, y: 7 },
    { x: 6, y: 7 },
  ],
  green: [
    { x: 7, y: 13 },
    { x: 7, y: 12 },
    { x: 7, y: 11 },
    { x: 7, y: 10 },
    { x: 7, y: 9 },
    { x: 7, y: 8 },
  ],
  yellow: [
    { x: 13, y: 7 },
    { x: 12, y: 7 },
    { x: 11, y: 7 },
    { x: 10, y: 7 },
    { x: 9, y: 7 },
    { x: 8, y: 7 },
  ],
  blue: [
    { x: 7, y: 1 },
    { x: 7, y: 2 },
    { x: 7, y: 3 },
    { x: 7, y: 4 },
    { x: 7, y: 5 },
    { x: 7, y: 6 },
  ],
};

const turningPoints = {
  red: 50,
  blue: 11,
  yellow: 24,
  green: 37,
};

const startPositions = {
  red: { x: 1, y: 6 },
  blue: { x: 8, y: 1 },
  yellow: { x: 13, y: 8 },
  green: { x: 6, y: 13 },
};

const safeArea = [
  { x: 1, y: 6 },
  { x: 6, y: 2 },
  { x: 8, y: 1 },
  { x: 12, y: 6 },
  { x: 13, y: 8 },
  { x: 8, y: 12 },
  { x: 6, y: 13 },
  { x: 2, y: 8 },
];

const isSamePos = (p1: Coordinate, p2: Coordinate) => p1.x === p2.x && p1.y === p2.y;

const initialPins = [
  { id: 0, x: 1, y: 4, base: { x: 1, y: 4 }, color: 'red', state: 'base' },
  { id: 1, x: 4, y: 4, base: { x: 4, y: 4 }, color: 'red', state: 'base' },
  { id: 2, x: 1, y: 1, base: { x: 1, y: 1 }, color: 'red', state: 'base' },
  { id: 3, x: 4, y: 1, base: { x: 4, y: 1 }, color: 'red', state: 'base' },
  { id: 4, x: 13, y: 4, base: { x: 13, y: 4 }, color: 'blue', state: 'base' },
  { id: 5, x: 10, y: 4, base: { x: 10, y: 4 }, color: 'blue', state: 'base' },
  { id: 6, x: 10, y: 1, base: { x: 10, y: 1 }, color: 'blue', state: 'base' },
  { id: 7, x: 13, y: 1, base: { x: 13, y: 1 }, color: 'blue', state: 'base' },
  { id: 8, x: 10, y: 10, base: { x: 10, y: 10 }, color: 'yellow', state: 'base' },
  { id: 9, x: 13, y: 10, base: { x: 13, y: 10 }, color: 'yellow', state: 'base' },
  { id: 10, x: 10, y: 13, base: { x: 10, y: 13 }, color: 'yellow', state: 'base' },
  { id: 11, x: 13, y: 13, base: { x: 13, y: 13 }, color: 'yellow', state: 'base' },
  { id: 12, x: 1, y: 10, base: { x: 1, y: 10 }, color: 'green', state: 'base' },
  { id: 13, x: 4, y: 10, base: { x: 4, y: 10 }, color: 'green', state: 'base' },
  { id: 14, x: 1, y: 13, base: { x: 1, y: 13 }, color: 'green', state: 'base' },
  { id: 15, x: 4, y: 13, base: { x: 4, y: 13 }, color: 'green', state: 'base' },
];

export default function ComingSoon() {
  const isAnimating = useRef(false);

  const pinsRef = useRef(
    initialPins.map((pin) => ({
      ...pin,
      animX: new Animated.Value(pin.x),
      animY: new Animated.Value(pin.y),
      animScale: new Animated.Value(1),
    }))
  ).current;

  const handlePinPress = (index: number) => {
    if (isAnimating.current) return;

    const pin = pinsRef[index];
    const roll = Math.floor(Math.random() * 6) + 1;

    if (pin.state === 'base') {
      const startPos = startPositions[pin.color as Color];
      pin.x = startPos.x;
      pin.y = startPos.y;
      pin.state = 'board';

      Animated.parallel([
        Animated.timing(pin.animX, { toValue: startPos.x, duration: 400, useNativeDriver: false }),
        Animated.timing(pin.animY, { toValue: startPos.y, duration: 400, useNativeDriver: false }),
      ]).start();

      return;
    }

    /* ---------------------------
       PRE-SIMULATE PATH
    --------------------------- */
    let simulatedState = pin.state;
    let simulatedX = pin.x;
    let simulatedY = pin.y;
    const plannedSteps: Coordinate[] = [];

    for (let i = 1; i <= roll; i++) {
      let nextPos: Coordinate | null = null;

      if (simulatedState === 'board') {
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

    if (plannedSteps.length === 0) return;

    /* ---------------------------
       ANIMATION SEQUENCE
    --------------------------- */
    isAnimating.current = true;
    const animSequence = [];

    plannedSteps.forEach((pos) => {
      animSequence.push(
        Animated.parallel([
          Animated.timing(pin.animX, { toValue: pos.x, duration: 200, useNativeDriver: false }),
          Animated.timing(pin.animY, { toValue: pos.y, duration: 200, useNativeDriver: false }),
          Animated.sequence([
            Animated.timing(pin.animScale, { toValue: 1.25, duration: 100, useNativeDriver: false }),
            Animated.timing(pin.animScale, { toValue: 1, duration: 100, useNativeDriver: false }),
          ]),
        ])
      );
    });

    Animated.sequence(animSequence).start(() => {
      const finalPos = plannedSteps[plannedSteps.length - 1];
      pin.x = finalPos.x;
      pin.y = finalPos.y;

      const isInHome = homePaths[pin.color as Color].some((p) => isSamePos(p, finalPos));
      if (isInHome) pin.state = 'home';

      const isInSafeArea = safeArea.find((a) => a.x === pin.x && a.y === pin.y);
      if (!isInSafeArea) checkCollision(pin);
      isAnimating.current = false;
    });
  };

  /* ---------------------------
     COLLISION HANDLING
  --------------------------- */
  const checkCollision = (movingPin) => {
    if (movingPin.state === 'home') return;

    pinsRef.forEach((otherPin) => {
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
      const anims = reversePath.map((step) =>
        Animated.parallel([
          Animated.timing(otherPin.animX, {
            toValue: step.x,
            duration: 50,
            useNativeDriver: false,
          }),
          Animated.timing(otherPin.animY, {
            toValue: step.y,
            duration: 50,
            useNativeDriver: false,
          }),
          // Animated.sequence([
          //   Animated.timing(otherPin.animScale, {
          //     toValue: 1.35,
          //     duration: 90,
          //     useNativeDriver: false,
          //   }),
          //   Animated.timing(otherPin.animScale, {
          //     toValue: 1,
          //     duration: 90,
          //     useNativeDriver: false,
          //   }),
          // ]),
        ])
      );

      Animated.sequence(anims).start(() => {
        // Set the final logical position
        otherPin.x = otherPin.base.x;
        otherPin.y = otherPin.base.y;

        isAnimating.current = false;
      });
    });
  };

  /* ---------------------------
     RENDER
  --------------------------- */
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
                width: '6%',
                height: '6%',
                borderRadius: 999,
                backgroundColor: p.color,
                borderWidth: 2,
                borderColor: 'white',
                left: p.animX.interpolate({ inputRange: [0, gridSize], outputRange: ['0%', '100%'] }),
                top: p.animY.interpolate({ inputRange: [0, gridSize], outputRange: ['0%', '100%'] }),

                transform: [
                  { translateX: 2 },
                  { translateY: 2 },
                  { scale: p.animScale }, // SCALE IS APPLIED HERE
                ],
              }}
            >
              <Pressable className="flex-1" onPress={() => handlePinPress(i)} />
            </Animated.View>
          ))}
        </Box>

        <VStack className="items-center space-y-2">
          <Text size="3xl" bold className="text-gray-900">
            Coming Soon
          </Text>
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
