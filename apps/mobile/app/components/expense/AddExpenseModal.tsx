import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  createExpenseFrontendSchema,
  CreateExpenseFrontendInput,
} from '../../../../../packages/types/schemas/expense';
import { zodResolver } from '@hookform/resolvers/zod';
import { createExpense } from '@/app/services/expenseService';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({
  visible,
  onClose,
}: AddExpenseModalProps) {
  const [apiError, setApiError] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateExpenseFrontendInput>({
    resolver: zodResolver(createExpenseFrontendSchema),
    defaultValues: { type: 'EXPENSE', currencyOriginal: 'CAD' },
  });

  const onSubmit = async (data: CreateExpenseFrontendInput) => {
    setApiError(false);
    try {
      await createExpense(data);
    } catch (error: any) {
      setApiError(true);
      console.error('Failed to add Expense.', error);
      return;
    }
  };
  return (
    <Modal visible={visible} animationType='slide' transparent>
      <TouchableOpacity
        className='flex-1 justify-end bg-black/20'
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1}>
          <View
            className='bg-white rounded-t-3xl p-6'
            style={{ minHeight: '80%' }}
          >
            <View className='flex-row justify-between items-center'>
              <Text className='text-lg font-bold text-slate-800'>
                Add Expense
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text className='text-slate-400'>close</Text>
              </TouchableOpacity>
            </View>
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
                  {/*Amount field*/}
                  <View className='mb-4'>
                    <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                      Amount
                    </Text>
                    <Controller
                      control={control}
                      name='amountOriginal'
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className={`bg-white border p-4 rounded-xl text-slate-900 ${errors.amountOriginal ? 'border-red-500' : 'border-slate-200'}`}
                          onBlur={onBlur}
                          onChangeText={(text) => onChange(parseFloat(text))}
                          value={value?.toString()}
                          placeholder='0.00'
                          keyboardType='decimal-pad'
                        />
                      )}
                    />
                    {errors.amountOriginal && (
                      <Text className='pl-2 text-red-300'>
                        {errors.amountOriginal.message}
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
                      <Text className='text-white font-bold text-lg'>Add</Text>
                    )}
                  </TouchableOpacity>
                  {apiError && (
                    <Text className='pl-2 text-red-300 font-small'>
                      Something went wrong in the backend please try again
                      later.
                    </Text>
                  )}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
