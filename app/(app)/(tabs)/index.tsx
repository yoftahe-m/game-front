import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode, useCallback, useRef, useState } from 'react';
import { Dimensions, View, StyleSheet, Image, ActivityIndicator, Linking, Alert, ScrollView, RefreshControl } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, G, Path, Pattern } from 'react-native-svg';
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
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');
import Toast from 'react-native-root-toast';
import Gear from '@/assets/icons/Gear';
import Logout from '@/assets/icons/Logout';
import Wheel from '@/assets/icons/Wheel';
import Support from '@/assets/icons/Support';
import Add from '@/assets/icons/Add';

import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Icon, CloseIcon } from '@/components/ui/icon';
import * as ImagePicker from 'expo-image-picker';
import { Animated } from 'react-native';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { useChangeProfileMutation, useRefreshCoinQuery } from '@/store/service/user';
import { logout, setCoins, setUser } from '@/store/slice/user';
import Money from '@/assets/icons/Money';
import Joystick from '@/assets/icons/Controller';
import Die from '@/assets/icons/Die';
import Coin from '@/assets/icons/Coin';
import { GradientButton } from '@/components/Buttons';
import { Switch } from '@/components/ui/switch';
import { setSound, toggleSound } from '@/store/slice/settings';
type FormData = {
  full_name: string;
  phone: string;
};

export default function FullScreenRadialGradientWithContent() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [image, setImage] = useState('');
  const user = useSelector((state: RootState) => state.user.data);
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const insets = useSafeAreaInsets();
  const [changeProfile, { isLoading }] = useChangeProfileMutation();
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
    const formData = new FormData();

    const filename = image.split('/').pop() || 'image.jpg';
    formData.append('image', {
      uri: image,
      name: filename,
      type: `image/${image.split('.').pop()}`,
    } as any);
    formData.append('fullName', data.full_name);
    formData.append('phone', data.phone);
    try {
      const result = await changeProfile(formData).unwrap();
      dispatch(setUser(result));
    } catch (error) {
      console.log('error', error);
    }
  };

  // Helper function to check if a field has an error
  const isInvalid = (fieldName: keyof FormData) => !!errors[fieldName];

  async function selectImage(mode: string) {
    let result: any;
    try {
      if (mode === 'gallery') {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      Toast.show('Please allow camera permission and retry.', {
        duration: Toast.durations.LONG,
      });
    }
  }

  const openEmail = () => {
    const email = 'nati@gmail.com';
    const subject = 'Support';
    const body = 'Help me';

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          // Alert.alert('Error', 'Email client is not available');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  function handleLogout() {
    dispatch(logout());
    router.replace('/signin');
  }
  const cols = Math.ceil(width / 28) + 1;
  const rows = Math.ceil(height / 49) + 1;
  const HEX_PATH =
    'M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z';

  const scale = 1; // increase size
  const hexWidth = 28;
  const hexHeight = 49;

  const { refetch, isFetching } = useRefreshCoinQuery({});

  const onRefresh = useCallback(() => {
    refetch()
      .unwrap() // unwrap returns a promise that either resolves with data or throws an error
      .then((data) => {
        console.log('first', typeof data.coins, data.coins);
        dispatch(setCoins({ coins: data.coins }));
      })
      .catch((error) => {
        console.log('error', error);
        Toast.show('Failed to fetch data.', {
          duration: Toast.durations.LONG,
        });
      });
  }, [refetch]);

  return (
    <>
      <View style={{ flex: 1 }}>
        {/* Radial Gradient Background */}
        <Svg height={height} width={width} style={StyleSheet.absoluteFillObject}>
          <G fill="#0c245c" fillRule="nonzero">
            {Array.from({ length: rows }).map((_, row) =>
              Array.from({ length: cols }).map((_, col) => (
                <Path
                  key={`${row}-${col}`}
                  d={HEX_PATH}
                  transform={`translate(${col * hexWidth * scale}, ${row * hexHeight * scale}) scale(${scale})`}
                />
              ))
            )}
          </G>
        </Svg>

        {/* Components on top */}
        <VStack space="lg" className="flex-1">
          <LinearGradient colors={['#0e1f4d', '#1d3285']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            <HStack space="md" className="items-center justify-between px-2 pb-3 border-b border-[#113da6]" style={{ paddingTop: insets.top }}>
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

                <VStack>
                  <Text bold>{user?.fullName?.slice(0, 10) ?? ''}</Text>
                  <Text size="xs" bold>
                    {user?.phone?.slice(0, 10) ?? ''}
                  </Text>
                </VStack>
              </HStack>
              <HStack space="2xl">
                <HStack className="items-center relative">
                  <Box className="absolute -left-3 z-10">
                    <Money style={{ transform: [{ rotate: '120deg' }], marginBottom: 10 }} width={30} height={18} />
                  </Box>
                  <Text className="h-6 px-2 pl-6 bg-[#0f1d3d]" bold>
                    {user?.coins}
                  </Text>
                  <Pressable
                    className="size-8 bg-green-600 flex items-center justify-center rounded-md "
                    onPress={() => router.push('/(app)/wallet')}
                  >
                    <FontAwesome5 name="plus" size={12} color="white" />
                  </Pressable>
                </HStack>

                <HStack className="items-center">
                  <Box className="absolute -left-3 z-10">
                    <Coin />
                  </Box>
                  <Text className="h-6 px-2 pl-6 bg-[#0f1d3d]" bold>
                    {user?.rewards}
                  </Text>
                  <Pressable
                    className="size-8 bg-green-600 flex items-center justify-center rounded-md"
                    onPress={() => router.push('/(app)/referral')}
                  >
                    <FontAwesome5 name="plus" size={12} color="white" />
                  </Pressable>
                </HStack>
              </HStack>
            </HStack>
          </LinearGradient>
          <ScrollView
            className="flex-1"
            refreshControl={<RefreshControl colors={['white']} progressBackgroundColor={'#1d3285'} refreshing={isFetching} onRefresh={onRefresh} />}
          >
            <VStack className="justify-between flex-1 p-2 ">
              <HStack className="justify-between flex-1 ">
                <VStack space="3xl" className="mt-5">
                  <ButtonIcon
                    icon={<Gear />}
                    onPress={() => {
                      setShowSettingsModal(true);
                    }}
                  />
                  <ButtonIcon
                    icon={<Support />}
                    onPress={() => {
                      setShowSupportModal(true);
                    }}
                  />
                  <ButtonIcon
                    icon={<Logout />}
                    onPress={() => {
                      setShowLogoutModal(true);
                    }}
                  />
                </VStack>
                <Image source={logo} style={{ width: 200, height: 200, objectFit: 'contain' }} />
                <VStack space="3xl" className="mt-5">
                  <ButtonIcon
                    icon={<Wheel />}
                    onPress={() => {
                      router.push('/(app)/coming-soon');
                    }}
                  />
                  <ButtonIcon
                    icon={<Gear />}
                    onPress={() => {
                      router.push('/(app)/coming-soon');
                    }}
                  />
                  <ButtonIcon
                    icon={<Gear />}
                    onPress={() => {
                      router.push('/(app)/coming-soon');
                    }}
                  />
                </VStack>
              </HStack>
              {/* <VStack space="md" className="flex items-center w-[80%] mx-auto "></VStack> */}
            </VStack>
          </ScrollView>
          <VStack space="md" className="pb-16 w-[80%] mx-auto items-center">
            <GradientButton
              colors={['#8f94fb', '#4e54c8']}
              outerStyle={{
                paddingBottom: 5,
                paddingTop: 0,
                borderRadius: 50,
                backgroundColor: '#4046ad',
                shadowColor: '#000',
                shadowOpacity: 0.5,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                width: '100%',
              }}
              innerStyle={{
                height: 80,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: '#c8ffc8',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => router.push('/(app)/(tabs)/games')}
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
              <Box className=" flex items-center justify-center  w-[80px] overflow-hidden">
                <Die width={105} height={50} />
              </Box>
            </GradientButton>

            <GradientButton
              colors={['#f953c6', '#b91d73']}
              outerStyle={{
                paddingBottom: 5,
                paddingTop: 0,
                borderRadius: 50,
                backgroundColor: '#85265b',
                shadowColor: '#000',
                shadowOpacity: 0.5,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                width: '100%',
              }}
              innerStyle={{
                height: 80,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: '#c8ffc8',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => router.push('/(app)/active')}
            >
              <Box className=" flex items-center justify-center  w-[80px] overflow-hidden">
                <Joystick width={120} height={75} />
              </Box>
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
            </GradientButton>
            <Pressable onPress={() => router.push('/(app)/terms')}>
              <Text>Terms and conditions</Text>
            </Pressable>
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
        <ModalContent className="bg-[#132e61] border-0 rounded-2xl">
          <ModalHeader>
            <Text size="lg" bold className="text-center w-full">
              Update user profile
            </Text>
          </ModalHeader>
          <ModalBody>
            <VStack space="sm">
              <Center>
                <Pressable onPress={() => selectImage('gallery')}>
                  <Avatar size="xl" className="rounded-lg ">
                    <AvatarFallbackText className="rounded-lg ">{user?.fullName}</AvatarFallbackText>
                    <AvatarImage
                      source={{
                        uri: image || user?.profilePic,
                      }}
                      className="rounded-lg "
                    />
                  </Avatar>
                </Pressable>
              </Center>
              <Controller
                control={control}
                name="full_name"
                rules={{ required: 'Name is required' }} // 👈 Validation rule
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl isInvalid={isInvalid('full_name')} className="mb-4">
                    <Text>Full name</Text>
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
                    <Text>Phone number</Text>
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
              <ButtonText className="text-white">Cancel</ButtonText>
            </Button>

            <Pressable onPress={handleSubmit(onUpdate)}>
              <HStack space="sm" className="bg-green-600 py-2 px-4 rounded-md">
                {isLoading && <ActivityIndicator color={'white'} size={'small'} />}
                <Text>Update</Text>
              </HStack>
            </Pressable>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showSupportModal}
        onClose={() => {
          setShowSupportModal(false);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent className="bg-[#132e61] border-0 rounded-2xl">
          <ModalHeader>
            <Text size="lg" bold>
              Customer Support
            </Text>
          </ModalHeader>
          <ModalBody>
            <Text>Contact customer support.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              className="mr-3"
              onPress={() => {
                setShowSupportModal(false);
              }}
            >
              <ButtonText className="text-white">Cancel</ButtonText>
            </Button>

            <Pressable onPress={openEmail}>
              <HStack space="sm" className="bg-green-600 py-2 px-4 rounded-md">
                <Text>Contact</Text>
              </HStack>
            </Pressable>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showLogoutModal}
        onClose={() => {
          setShowLogoutModal(false);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent className="bg-[#132e61] border-0 rounded-2xl">
          <ModalHeader>
            <Text size="lg" bold>
              Logout
            </Text>
          </ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to logout?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              className="mr-3"
              onPress={() => {
                setShowLogoutModal(false);
              }}
            >
              <ButtonText className="text-white">Cancel</ButtonText>
            </Button>

            <Pressable onPress={handleLogout}>
              <HStack space="sm" className="bg-red-600 py-2 px-4 rounded-md">
                <Text>LogOut</Text>
              </HStack>
            </Pressable>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent className="bg-[#132e61] border-0 rounded-2xl">
          <ModalHeader>
            <Text size="lg" bold>
              Settings
            </Text>
          </ModalHeader>
          <ModalBody>
            <HStack className="justify-between items-center px-2">
              <Text bold>Sound Effect</Text>
              <Switch
                size="lg"
                value={soundEnabled}
                onValueChange={(v) => {
                  dispatch(setSound(v));
                }}
                trackColor={{ false: '#d4d4d4', true: '#166534' }}
                thumbColor="#fafafa"
                // activeThumbColor="#fafafa"
                ios_backgroundColor="#d4d4d4"
              />
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              className="mr-3"
              onPress={() => {
                setShowSettingsModal(false);
              }}
            >
              <ButtonText className="text-white">Cancel</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function ButtonIcon({ icon, onPress }: { icon: ReactNode; onPress: () => void }) {
  return (
    <GradientButton
      colors={['#8f94fb', '#4e54c8']}
      outerStyle={{
        padding: 5,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        borderRadius: 12,
        backgroundColor: '#4046ad',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        width: 50,
        height: 50,
        aspectRatio: 1,
      }}
      innerStyle={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
      onPress={onPress}
    >
      {icon}
    </GradientButton>
  );
}
