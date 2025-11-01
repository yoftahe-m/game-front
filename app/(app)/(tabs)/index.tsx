import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Dimensions, View, StyleSheet, Image } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import logo from '@/assets/images/logo.png';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');

import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Icon, CloseIcon } from '@/components/ui/icon';

type FormData = {
  full_name: string;
  phone: string;
};

export default function FullScreenRadialGradientWithContent() {
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state: RootState) => state.user.data);
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      full_name: user?.fullName,
      phone: user?.phone,
    },
    // Set 'all' to validate on blur, change, and submit
    mode: 'onBlur',
  });

  const onUpdate = async (data: FormData) => {
    console.log('Sign Up Data:', data);
    try {
      // const result = await signup({
      //   data,
      // }).unwrap();
      // console.log('result', result);
      // dispatch(signin(result));
      // router.replace('/(app)/(tabs)');
    } catch (error) {
      console.log('error', error);
    }
  };

  // Helper function to check if a field has an error
  const isInvalid = (fieldName: keyof FormData) => !!errors[fieldName];

  return (
    <>
      <View style={{ flex: 1 }}>
        {/* Radial Gradient Background */}
        {/* <Svg height={height} width={width} style={StyleSheet.absoluteFillObject}>
          <Defs>
            <RadialGradient id="grad" cx="50%" cy="50%" r="70%">
              <Stop offset="0%" stopColor="#1242b0" />
              <Stop offset="25%" stopColor="#0f368f" />
              <Stop offset="50%" stopColor="#0b2c72" />
              <Stop offset="75%" stopColor="#092259" />
              <Stop offset="100%" stopColor="#071843" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg> */}

        {/* Components on top */}
        <VStack space="lg" className="flex-1">
          <LinearGradient colors={['#0e1f4d', '#1d3285']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            <HStack space="md" className="items-center justify-between px-2 pb-3" style={{ paddingTop: insets.top }}>
              <HStack space="sm" className="items-center">
                <Pressable onPress={() => setShowModal(true)}>
                  <Avatar size="md" className="border border-white rounded-lg overflow-hidden">
                    <AvatarFallbackText>{user?.fullName}</AvatarFallbackText>
                    <AvatarImage
                      source={{
                        uri: user?.profilePic,
                      }}
                      className="rounded-none "
                    />
                  </Avatar>
                </Pressable>

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
          <VStack className="justify-between flex-1 p-2 pb-16">
            <HStack className="justify-between">
              <VStack space="4xl" className="mt-5">
                <ButtonIcon />
                <ButtonIcon />
                <ButtonIcon />
              </VStack>
              <Image source={logo} style={{ width: 200, height: 200,objectFit:"contain" }} />
              <VStack space="4xl" className="mt-5">
                <ButtonIcon />
                <ButtonIcon />
                <ButtonIcon />
              </VStack>
            </HStack>
            <VStack space="md" className="flex items-center">
              <View
                style={{
                  padding: 5,
                  paddingTop: 0,
                  borderRadius: 8,
                  backgroundColor: '#0d6b1e',
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  width: '80%',
                }}
              >
                <LinearGradient
                  colors={['#4CFF4C', '#00C851', '#009432']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{
                    paddingVertical: 30,
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
              </View>
              <View
                style={{
                  padding: 5,
                  paddingTop: 0,
                  borderRadius: 8,
                  backgroundColor: '#b57902',
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  width: '80%',
                }}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFB200', '#E69A00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{
                    paddingVertical: 30,
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
                    Join a game
                  </Text>
                </LinearGradient>
              </View>

              <Pressable onPress={() => router.push('/(app)/terms')}>
                <Text>Terms and conditions</Text>
              </Pressable>
            </VStack>
          </VStack>
        </VStack>
      </View>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent className="bg-[#071843] border-0">
          <ModalHeader>
            <Text size="lg" bold>
              Update User
            </Text>
          </ModalHeader>
          <ModalBody>
            <VStack space="sm">
              <Center>
                <Avatar size="xl">
                  <AvatarFallbackText>{user?.fullName}</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: user?.profilePic,
                    }}
                    className="rounded-none "
                  />
                </Avatar>
              </Center>
              <Controller
                control={control}
                name="full_name"
                rules={{ required: 'Name is required' }} // 👈 Validation rule
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl isInvalid={isInvalid('full_name')} className="mb-4">
                    <Text>Full Name</Text>
                    <Input className="h-12">
                      <InputSlot className="pl-3">
                        <Feather name="user" size={16} color="white" />
                      </InputSlot>
                      <InputField placeholder="Name" value={value} onChangeText={onChange} onBlur={onBlur} className="text-white" />
                    </Input>
                    {isInvalid('full_name') && (
                      <FormControlError className="mt-1">
                        <Feather name="alert-circle" size={12} color={'red'} />
                        <FormControlErrorText className="text-red-500 text-xs">{errors.full_name?.message}</FormControlErrorText>
                      </FormControlError>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="phone"
                rules={{ required: 'Phone number is required' }} // 👈 Validation rule
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl isInvalid={isInvalid('phone')} className="mb-4">
                    <Text>Phone</Text>
                    <Input className="h-12">
                      <InputSlot className="pl-3">
                        <Feather name="phone-call" size={16} color="white" />
                      </InputSlot>
                      <InputField
                        placeholder="Phone number"
                        keyboardType="phone-pad"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        className="text-white"
                      />
                    </Input>
                    {isInvalid('phone') && (
                      <FormControlError className="mt-1">
                        <Feather name="alert-circle" size={12} color={'red'} />
                        <FormControlErrorText className="text-red-500 text-xs">{errors.phone?.message}</FormControlErrorText>
                      </FormControlError>
                    )}
                  </FormControl>
                )}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              className="mr-3"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            {/* <Button
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Save</ButtonText>
            </Button> */}
            <Pressable onPress={handleSubmit(onUpdate)}>
              <Box className="bg-green-600 py-2 px-4 rounded-md">
                <Text>Update</Text>
              </Box>
            </Pressable>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function ButtonIcon() {
  return (
    <Pressable onPress={() => router.push('/(app)/active')} onPressIn={() => {}} onPressOut={() => {}} className="flex-1">
      <Animated.View
        style={{
          padding: 5,
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
          borderRadius: 8,
          backgroundColor: '#182970',
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          width: 50,
          height: 50,
          aspectRatio: 1,
        }}
      >
        <LinearGradient
          colors={['#004fde', '#1d3285']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#4d5780',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          {/* <Entypo name="chevron-with-circle-down" size={24} color="white" /> */}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

import { Animated } from 'react-native';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';

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
            borderColor: '#fff2cc',
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
