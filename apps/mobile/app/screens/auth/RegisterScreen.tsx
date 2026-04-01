import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { z } from 'zod';
import { AuthStackParamList } from '../../navigation/AuthStack';
interface RegisterScreenProps {
  onRegister: (email: string, password: string) => void;
}

const RegisterInputSchema = z
  .object({
    email: z.email('Please use a valid email address e.g. email@email.com'),
    password: z
      .string()
      .min(6, { message: 'Please enter a password with min 6 characters' })
      .max(20, { message: 'Please enter a password with max 20 characters' })
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Please enter a password with at least 1 Capital Letter ',
      })
      .refine((password) => /[a-z]/.test(password), {
        message: 'Please enter a password with max 20 characters',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Please enter a password with max 20 characters',
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message: 'Please enter a password with max 20 characters',
      }),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((fields) => fields.confirmPassword === fields.password, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof RegisterInputSchema>;

function RegisterScreen({ onRegister }: RegisterScreenProps) {
  const navigate =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterInputSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (data: RegisterFormData) => {
    onRegister(data.email, data.password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1'
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className='bg-slate-50'
      >
        {/*Empty view to push content down but remain scrollable */}
        <View className='h-1/6' />
        <View className='p-6'>
          {/*Email input */}
          <View className='mb-4'>
            <Text className='mb-2 pl-2 text-slate-600 font-medium'>Email</Text>
            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-white border p-4 rounded-xl text-slate-900 ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder='email@example.com'
                  autoCapitalize='none'
                  keyboardType='email-address'
                  autoFocus={false}
                  autoCorrect={false}
                  importantForAutofill='yes'
                />
              )}
            ></Controller>
            {errors.email && (
              <Text className='pl-2 text-red-300 font-small'>
                {errors.email.message}
              </Text>
            )}
          </View>

          {/*Password input */}
          <View className='mb-4'>
            <Text className='mb-2 pl-2 text-slate-600 font-medium'>
              Password
            </Text>
            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-white border p-4 rounded-xl text-slate-900 ${errors.password ? 'border-red-500' : 'border-slate-200'}`}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder='••••••••'
                  autoCapitalize='none'
                  secureTextEntry={true}
                  autoFocus={false}
                  autoCorrect={false}
                  importantForAutofill='yes'
                />
              )}
            ></Controller>
            {errors.password && (
              <Text className='pl-2 text-red-300 font-small'>
                {errors.password.message}
              </Text>
            )}
          </View>
          {/*Confirm Password input */}
          <View className='mb-4'>
            <Text className='mb-2 pl-2 text-slate-600 font-medium'>
              Confirm Password
            </Text>
            <Controller
              control={control}
              name='confirmPassword'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-white border p-4 rounded-xl text-slate-900 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'}`}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder='••••••••'
                  autoCapitalize='none'
                  secureTextEntry={true}
                  autoFocus={false}
                  autoCorrect={false}
                  importantForAutofill='yes'
                />
              )}
            ></Controller>
            {errors.confirmPassword && (
              <Text className='pl-2 text-red-300 font-small'>
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>
          {/*Submit */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`h-14 rounded-xl items-center justify-center ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600'}`}
          >
            {isSubmitting ? (
              <ActivityIndicator color='white' />
            ) : (
              <Text className='text-white font-bold text-lg'>Register</Text>
            )}
          </TouchableOpacity>
          {/*Navigate to login */}
          <TouchableOpacity
            className='mt-6'
            onPress={() => navigate.navigate('Login')}
          >
            <Text className='text-slate-400 font-bold text-center'>
              Already have an account? Login.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export default RegisterScreen;
