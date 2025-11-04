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
import { useSigninMutation } from '@/store/service/user';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';

type FormData = {
  email: string;
  phone: string;
  password: string;
};

export default function SigninScreen() {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useSigninMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: 'yoftahemerkebu3@gmail.com',
      phone: '',
      password: '123456',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormData) => {

    try {
      const result = await login({
        data,
      }).unwrap();
      dispatch(signin(result));
      router.replace('/(app)/(tabs)');
    } catch (error) {
      Toast.show('Sign in failed.', {
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
              Login into your account
            </Text>
          </Center>
          <Center>
            <Text size="md">Welcome Back you've been missed!</Text>
          </Center>
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
              <Text size="xl">Sign In</Text>
            </HStack>
          </Pressable>

          <Center className=" flex-row">
            <Text>Don't have an account? </Text>
            <Pressable onPress={() => router.replace('/signup')}>
              <Text className="text-green-600" bold>
                Sign Up
              </Text>
            </Pressable>
          </Center>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
