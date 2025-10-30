import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { useState } from 'react';
import { Image, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircleIcon } from '@/components/ui/icon'; // Assuming EyeIcon, EyeOffIcon, and AlertCircleIcon are available
import { useForm, Controller } from 'react-hook-form'; // 👈 Import useForm and Controller
import Feather from '@expo/vector-icons/Feather';
import { useSigninMutation, useSignupMutation } from '@/store/service/user';
import Toast from 'react-native-root-toast';
import { router } from 'expo-router';
import { signin } from '@/store/slice/user';
import { useDispatch } from 'react-redux';
// Define the shape of your form data
type FormData = {
  email: string;
  phone: string;
  password: string;
};

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useSigninMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      phone: '',
      password: '',
    },
    // Set 'all' to validate on blur, change, and submit
    mode: 'onBlur',
  });

  // 👈 Function to handle successful form submission
  const onSubmit = async (data: FormData) => {
    console.log('Sign in Data:', data);

    try {
      const result = await login({
        data,
      }).unwrap();
      dispatch(signin(result));
      router.replace('/(app)/(tabs)');
    } catch (error) {
      console.log('error', error);
      Toast.show('Sign In failed.', {
        duration: Toast.durations.LONG,
      });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Helper function to check if a field has an error
  const isInvalid = (fieldName: keyof FormData) => !!errors[fieldName];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 8 }}>
        <VStack space="md">
          <Center>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/263/263142.png' }}
              style={{ width: 80, height: 80, tintColor: '#ff007f' }}
              resizeMode="contain"
              alt="logo"
            />
          </Center>
          <Center>
            <Text size="2xl" bold>
              Login Here
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
                  <Text>Email</Text>
                  <Input className="h-12 rounded-full">
                    <InputSlot className="pl-3">
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
                  <Input className="h-12 rounded-full">
                    <InputSlot className="pl-3">
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
                    <InputSlot className="pr-3" onPress={handleTogglePasswordVisibility}>
                      {showPassword ? <Feather name="eye" size={16} color={'white'} /> : <Feather name="eye-off" size={16} color={'white'} />}
                    </InputSlot>
                  </Input>
                </VStack>

                {/* Error and Helper Text */}
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

          <Button onPress={handleSubmit(onSubmit)} className="mt-6 bg-[#73d264] rounded-full h-12">
            {isLoading && <ButtonSpinner color="gray" />}
            <ButtonText size="xl">Sign In</ButtonText>
          </Button>

          <Center className=" flex-row">
            <Text>Don't have an account? </Text>
            <Pressable onPress={() => router.replace('/signup')}>
              <Text className="text-[#73d264]" bold>
                Sign Up
              </Text>
            </Pressable>
          </Center>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
