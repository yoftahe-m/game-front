import { Button } from '@/components/ui/button';
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
import { Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircleIcon } from '@/components/ui/icon'; // Assuming EyeIcon, EyeOffIcon, and AlertCircleIcon are available
import { useForm, Controller } from 'react-hook-form'; // 👈 Import useForm and Controller
import Feather from '@expo/vector-icons/Feather';
import { red } from 'react-native-reanimated/lib/typescript/Colors';
import { useSignupMutation } from '@/store/service/user';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { router } from 'expo-router';
import { signin } from '@/store/slice/user';
import { useDispatch } from 'react-redux';
// Define the shape of your form data
type FormData = {
  full_name: string;
  email: string;
  phone: string;
  password: string;
};

export default function SignupScreen() {
  const toast = useToast();
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
    // Set 'all' to validate on blur, change, and submit
    mode: 'onBlur',
  });

  // 👈 Function to handle successful form submission
  const onSubmit = async (data: FormData) => {
    console.log('Sign Up Data:', data);
    try {
      const result = await signup({
        data,
      }).unwrap();

      console.log('result', result);
      dispatch(signin(result));
      router.replace('/(app)/(tabs)');
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Helper function to check if a field has an error
  const isInvalid = (fieldName: keyof FormData) => !!errors[fieldName];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <VStack className="p-5" space="md">
          <Center className="py-8 my-5 rounded-xl shadow-lg">
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/263/263142.png' }}
              style={{ width: 80, height: 80, tintColor: '#ff007f' }}
              resizeMode="contain"
            />
            <Text className="text-xs text-gray-500 mt-[-20]">Lorem</Text>
          </Center>

          <VStack className="mt-8">
            {/* Name Field */}
            <Controller
              control={control}
              name="full_name"
              rules={{ required: 'Name is required' }} // 👈 Validation rule
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={isInvalid('full_name')} className="mb-4">
                  <Text className="text-typography-500">Name</Text>
                  <Input className="h-12">
                    <InputSlot className="pl-3">
                      <Feather name="user" size={16} color="black" />
                    </InputSlot>
                    <InputField placeholder="Name" value={value} onChangeText={onChange} onBlur={onBlur} className="text-base" />
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

            {/* Email Field */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required', // 👈 Validation rule
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={isInvalid('email')} className="mb-4">
                  <Text className="text-typography-500">Email</Text>
                  <Input className="h-12">
                    <InputSlot className="pl-3">
                      <Feather name="mail" size={16} color="black" />
                    </InputSlot>
                    <InputField
                      placeholder="Email"
                      keyboardType="email-address"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      className="text-base"
                    />
                  </Input>
                  {isInvalid('email') && (
                    <FormControlError className="mt-1">
                      <Feather name="alert-circle" size={12} color={'red'} />
                      <FormControlErrorText className="text-red-500 text-xs">{errors.email?.message}</FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              )}
            />

            {/* Phone Field */}
            <Controller
              control={control}
              name="phone"
              rules={{ required: 'Phone number is required' }} // 👈 Validation rule
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={isInvalid('phone')} className="mb-4">
                  <Text className="text-typography-500">Phone</Text>
                  <Input className="h-12">
                    <InputSlot className="pl-3">
                      <Feather name="phone-call" size={16} color="black" />
                    </InputSlot>
                    <InputField
                      placeholder="Phone number"
                      keyboardType="phone-pad"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      className="text-base"
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

            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required', // 👈 Validation rule
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters.',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={isInvalid('password')} className="mb-4">
                  <Text className="text-typography-500">Password</Text>
                  <Input className="h-12">
                    <InputSlot className="pl-3">
                      <Feather name="lock" size={16} color="black" />
                    </InputSlot>
                    <InputField
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      className="text-base "
                    />
                    <InputSlot className="pr-3" onPress={handleTogglePasswordVisibility}>
                      {showPassword ? <Feather name="eye" size={16} color="black" /> : <Feather name="eye-off" size={16} color="black" />}
                    </InputSlot>
                  </Input>

                  {/* Error and Helper Text */}
                  {isInvalid('password') && (
                    <FormControlError className="mt-1">
                      <Feather name="alert-circle" size={12} color={'red'} />
                      <FormControlErrorText className="text-red-500 text-xs">{errors.password?.message}</FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              )}
            />

            {/* Sign Up Button */}
            <Button
              onPress={handleSubmit(onSubmit)} // 👈 Use handleSubmit from react-hook-form
              className="mt-6 bg-[#4BC0D9] rounded-lg h-12"
            >
              <Text className="text-white text-lg font-bold">Sign Up</Text>
            </Button>

            {/* Sign In Link */}
            <Center className="mt-6 flex-row">
              <Text className="text-base text-gray-600">Already have an account? </Text>
              <Pressable onPress={() => console.log('Go to Sign In')}>
                <Text className="text-[#4BC0D9] text-base font-semibold">Sign In</Text>
              </Pressable>
            </Center>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
