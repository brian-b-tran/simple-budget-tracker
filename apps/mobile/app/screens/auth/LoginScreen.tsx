import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { z } from 'zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';

const loginFormSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'Enter a valid password.'),
});

type loginFormData = z.infer<typeof loginFormSchema>;

interface LoginScreenProps {
  onLogin: (data: loginFormData) => void;
}
function LoginScreen({ onLogin }: LoginScreenProps) {
  //email, password, error, isSubmitting
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: loginFormData) => {
    onLogin(data);
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
        <View className='h-1/6' />
        <View className=' p-6 '>
          {/*Email field*/}
          <View className='mb-4'>
            <Text className='mb-2 pl-2 text-slate-600 font-medium'>Email</Text>
            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-white border p-4 rounded-xl text-slate-900 ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder='email@example.com'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize='none'
                  autoFocus={false}
                  keyboardType='email-address'
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

          {/*Password field*/}
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
                  placeholder='••••••••'
                  secureTextEntry={true}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize='none'
                />
              )}
            ></Controller>
            {errors.password && (
              <Text className='pl-2 text-red-300 font-small'>
                {errors.password.message}
              </Text>
            )}
          </View>

          {/*Submit field*/}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`h-14 rounded-xl items-center justify-center ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600'}`}
          >
            {isSubmitting ? (
              <ActivityIndicator color='white' />
            ) : (
              <Text className='text-white font-bold text-lg'>Login</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className='mt-6'
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text className='text-slate-400 font-bold text-center'>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export default LoginScreen;
