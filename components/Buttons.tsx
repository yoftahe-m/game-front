import { useAudioPlayer } from 'expo-audio';
import { Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { HStack } from './ui/hstack';
import { ReactNode, useRef } from 'react';
import ClickSound from '@/assets/sounds/click.mp3';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

export function GradientButton({
  colors,
  outerStyle,
  innerStyle,
  children,
  onPress,
}: {
  colors: string[];
  outerStyle: any;
  innerStyle: any;
  children: ReactNode;
  onPress: () => void;
}) {
  const player = useAudioPlayer(ClickSound);
  const scale = useRef(new Animated.Value(1)).current;
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };
  const playSound = () => {
    player.seekTo(0);
    player.play();
  };

  function onclick() {
    if (soundEnabled) {
      playSound();
    }
    onPress();
  }
  return (
    <Pressable onPress={onclick} onPressIn={handlePressIn} onPressOut={handlePressOut} className="w-full">
      <Animated.View style={[{ transform: [{ scale }] }, outerStyle]}>
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={innerStyle}>
          <HStack className="justify-center items-center">{children}</HStack>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
