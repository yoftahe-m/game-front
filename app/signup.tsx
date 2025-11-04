import { useState } from 'react';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-root-toast';
import Feather from '@expo/vector-icons/Feather';
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Image, ScrollView } from 'react-native';

import { Text } from '@/components/ui/text';
import { signin } from '@/store/slice/user';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import { useSignupMutation } from '@/store/service/user';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';

type FormData = {
  full_name: string;
  email: string;
  phone: string;
  password: string;
};

export default function SignupScreen() {
  const dispatch = useDispatch();
  const [signup, { isLoading }] = useSignupMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await signup({
        data,
      }).unwrap();

      dispatch(signin(result));
      router.replace('/(app)/(tabs)');
    } catch (error) {
      Toast.show('Signing up failed.', {
        duration: Toast.durations.LONG,
      });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isInvalid = (fieldName: keyof FormData) => !!errors[fieldName];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
        <VStack space="md" className="mt-20 flex-1">
          <Center>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/263/263142.png' }}
              style={{ width: 80, height: 80, tintColor: '#ff007f' }}
              resizeMode="contain"
              alt="logo"
            />
          </Center>
          <Center>
            <Text size="4xl" bold className="text-center">
              Create an account
            </Text>
          </Center>
          <Center>
            <Text size="md">We are glad to have you!</Text>
          </Center>
          <Controller
            control={control}
            name="full_name"
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={isInvalid('full_name')}>
                <VStack space="sm">
                  <Text bold>Name</Text>
                  <Input className="h-16 rounded-full" style={{ borderColor: 'white' }}>
                    <InputSlot className="pl-5">
                      <Feather name="user" size={16} color="whiteF" />
                    </InputSlot>
                    <InputField placeholder="Name" value={value} onChangeText={onChange} onBlur={onBlur} className="text-white" />
                  </Input>
                </VStack>

                {isInvalid('full_name') && (
                  <FormControlError>
                    <Feather name="alert-circle" size={12} color={'red'} />
                    <FormControlErrorText className="text-red-500 text-xs">{errors.full_name?.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={isInvalid('email')}>
                <VStack space="sm">
                  <Text bold>Email</Text>
                  <Input className="h-16 rounded-full" style={{ borderColor: 'white' }}>
                    <InputSlot className="pl-5">
                      <Feather name="mail" size={16} color={'white'} />
                    </InputSlot>
                    <InputField
                      placeholder="Email"
                      keyboardType="email-address"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      className="text-white"
                      autoCapitalize="none"
                    />
                  </Input>
                </VStack>
                {isInvalid('email') && (
                  <FormControlError>
                    <Feather name="alert-circle" size={12} color={'red'} />
                    <FormControlErrorText className="text-red-500 " size="xs">
                      {errors.email?.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            )}
          />

          {/* Phone Field */}
          <Controller
            control={control}
            name="phone"
            rules={{ required: 'Phone number is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={isInvalid('phone')}>
                <VStack space="sm">
                  <Text bold>Phone</Text>
                  <Input className="h-16 rounded-full" style={{ borderColor: 'white' }}>
                    <InputSlot className="pl-5">
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
                </VStack>

                {isInvalid('phone') && (
                  <FormControlError>
                    <Feather name="alert-circle" size={12} color={'red'} />
                    <FormControlErrorText className="text-red-500 text-xs">{errors.phone?.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters.',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={isInvalid('password')}>
                <VStack space="sm">
                  <Text>Password</Text>
                  <Input className="h-16 rounded-full " style={{ borderColor: 'white' }}>
                    <InputSlot className="pl-5">
                      <Feather name="lock" size={16} color={'white'} />
                    </InputSlot>
                    <InputField
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      className="text-white"
                    />
                    <InputSlot className="pr-5" onPress={handleTogglePasswordVisibility}>
                      {showPassword ? <Feather name="eye" size={16} color={'white'} /> : <Feather name="eye-off" size={16} color={'white'} />}
                    </InputSlot>
                  </Input>
                </VStack>

                {isInvalid('password') && (
                  <FormControlError>
                    <Feather name="alert-circle" size={12} color={'red'} />
                    <FormControlErrorText className="text-red-500" size="xs">
                      {errors.password?.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            )}
          />

          <Pressable onPress={handleSubmit(onSubmit)} className="mt-6 bg-green-600 rounded-full h-16">
            <HStack space="md" className="items-center justify-center  h-full">
              {isLoading && <ActivityIndicator color="white" />}
              <Text size="xl">Sign Up</Text>
            </HStack>
          </Pressable>

          <Center className=" flex-row">
            <Text>Already have an account? </Text>
            <Pressable onPress={() => router.replace('/signin')}>
              <Text className="text-green-600" bold>
                Sign In
              </Text>
            </Pressable>
          </Center>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
