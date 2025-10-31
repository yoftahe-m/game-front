import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Dimensions, View, StyleSheet, Image } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import logo from '@/assets/images/logo.jpg';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');
export default function FullScreenRadialGradientWithContent() {
  const user = useSelector((state: RootState) => state.user.data);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      {/* Radial Gradient Background */}
      <Svg height={height} width={width} style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="70%">
            <Stop offset="0%" stopColor="#1242b0" />
            <Stop offset="100%" stopColor="#0a1e45" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>

      {/* Components on top */}
      <VStack space="lg" className="flex-1">
        <LinearGradient colors={['#0e1f4d', '#1d3285']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
          <HStack space="md" className="items-center justify-between px-2 pb-3" style={{ paddingTop: insets.top }}>
            <HStack space="sm" className="items-center">
              <Avatar size="md" className="border border-white rounded-lg overflow-hidden">
                <AvatarFallbackText>{user?.fullName}</AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: user?.profilePic,
                  }}
                  className="rounded-none "
                />
              </Avatar>

              <Text bold>{user?.fullName.slice(0, 10)}</Text>
            </HStack>
            <HStack space="2xl">
              <HStack className="items-center">
                <Box className="size-6 bg-amber-300 flex items-center justify-center rounded-full">
                  <FontAwesome5 name="coins" size={12} color="white" />
                </Box>
                <Text className="h-6 px-2 " bold>
                  {user?.coins}
                </Text>
                <Pressable className="size-5 bg-green-600 flex items-center justify-center " onPress={() => router.push('/(app)/wallet')}>
                  <FontAwesome5 name="plus" size={12} color="white" />
                </Pressable>
              </HStack>

              <HStack className="items-center">
                <Box className="size-6 bg-amber-300 flex items-center justify-center rounded-full">
                  <FontAwesome5 name="coins" size={12} color="white" />
                </Box>
                <Text className="h-6 px-2" bold>
                  {user?.rewards}
                </Text>
                <Pressable className="size-5 bg-green-600 flex items-center justify-center" onPress={() => router.push('/(app)/referral')}>
                  <FontAwesome5 name="plus" size={12} color="white" />
                </Pressable>
              </HStack>
            </HStack>
          </HStack>
        </LinearGradient>
        <VStack className="justify-between flex-1 p-2 pb-32">
          <HStack className="justify-between">
            <VStack space="4xl" className="mt-5">
              <Pressable onPress={() => {}}>
                <Box className="bg-red-500 size-12 items-center justify-center rounded-md">
                  <Entypo name="chevron-with-circle-down" size={24} color="white" />
                </Box>
              </Pressable>
              <Pressable onPress={() => {}}>
                <Box className="bg-red-500 size-12 items-center justify-center rounded-md">
                  <Entypo name="chevron-with-circle-down" size={24} color="white" />
                </Box>
              </Pressable>
              <Pressable onPress={() => {}}>
                <Box className="bg-red-500 size-12 items-center justify-center rounded-md">
                  <Entypo name="chevron-with-circle-down" size={24} color="white" />
                </Box>
              </Pressable>
            </VStack>
            <Image source={logo} style={{ width: 200, height: 200 }} />
            <VStack space="4xl" className="mt-5">
              <Pressable onPress={() => {}}>
                <Box className="bg-red-500 size-12 items-center justify-center rounded-md">
                  <Entypo name="chevron-with-circle-down" size={24} color="white" />
                </Box>
              </Pressable>
              <Pressable onPress={() => {}}>
                <Box className="bg-red-500 size-12 items-center justify-center rounded-md">
                  <Entypo name="chevron-with-circle-down" size={24} color="white" />
                </Box>
              </Pressable>
              <Pressable onPress={() => {}}>
                <Box className="bg-red-500 size-12 items-center justify-center rounded-md">
                  <Entypo name="chevron-with-circle-down" size={24} color="white" />
                </Box>
              </Pressable>
            </VStack>
          </HStack>
          <HStack space="xl" className="flex ">
            {/* <View
              style={{
                padding: 5,
                paddingTop: 0,
                borderRadius: 8,
                backgroundColor: '#0d6b1e',
                shadowColor: '#000',
                shadowOpacity: 0.5,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <LinearGradient
                colors={['#4CFF4C', '#00C851', '#009432']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 35,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#c8ffc8',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '700',
                    fontSize: 18,
                    textShadowColor: 'rgba(0,0,0,0.4)',
                    textShadowOffset: { width: 1, height: 2 },
                    textShadowRadius: 3,
                  }}
                >
                  Start a game
                </Text>
              </LinearGradient>
            </View> */}

            <JoinButton color="green" />
            <JoinButton color="yellow" />
          </HStack>
        </VStack>
      </VStack>
    </View>
  );
}

import { Animated } from 'react-native';

export function JoinButton({ color }: { color: 'yellow' | 'green' }) {
  const options = {
    yellow: { gradient: ['#FFD700', '#FFB200', '#E69A00'], border: '#fff2cc' },
    green: { gradient: ['#4CFF4C', '#00C851', '#009432'], border: '#c8ffc8' },
  };
  const scale = useRef(new Animated.Value(1)).current;

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

  return (
    <Pressable onPress={() => router.push('/(app)/active')} onPressIn={handlePressIn} onPressOut={handlePressOut} className="flex-1">
      <Animated.View
        style={{
          transform: [{ scale }],
          padding: 5,
          paddingTop: 0,
          borderRadius: 8,
          backgroundColor: options[color].border,
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          width: '100%',
          aspectRatio: 1,
        }}
      >
        <LinearGradient
          colors={options[color].gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            paddingVertical: 14,
            paddingHorizontal: 35,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#fff2cc",
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Text
            style={{
              color: '#fffbea',
              fontWeight: '700',
              fontSize: 18,
              textShadowColor: 'rgba(0,0,0,0.4)',
              textShadowOffset: { width: 1, height: 2 },
              textShadowRadius: 3,
            }}
          >
            Join a game
          </Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
