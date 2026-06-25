import { createBudget } from '@/app/services/budgetService';
import {
  CreateBudgetFrontendInput,
  createBudgetFrontendSchema,
} from '@expense-app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';

type AddBudgetModalProps = { visible: boolean; onClose: () => void };
/* Fields:
budget name 
type
amount
notes

*only for vacation or events time period based budget
can be used to automatically divide total budget evenly across the days for a custom amount of days vs fixed like months or years or week.

start date - end date
start time - end time
*/
export default function AddBudgetModal({
  visible,
  onClose,
}: AddBudgetModalProps) {
  const [apiError, setApiError] = useState<boolean>(false);
  const budgetForm = useForm<CreateBudgetFrontendInput>({
    resolver: zodResolver(createBudgetFrontendSchema),
    defaultValues: {
      name: 'New Budget',
      type: 'MONTHLY',
      currency: 'CAD',
      totalAmount: '0',
      notes: '',
      startDate: undefined,
      startTime: undefined,
      endDate: undefined,
      endTime: undefined,
    },
  });
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = budgetForm;

  const onSubmit = async (data: CreateBudgetFrontendInput) => {
    setApiError(false);
    try {
      console.log(data);
      await createBudget(data);
      reset();
      handleClose();
    } catch (error: any) {
      setApiError(true);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
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
                Edit Expense
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Text className='text-slate-400'>close</Text>
              </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className='flex-1'
            >
              <ScrollView contentContainerStyle={{ flexGrow: 1 }} className=''>
                <View className='p-4'>
                  <View>
                    {/*Amount field*/}
                    <View className='mb-4'>
                      <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                        Amount
                      </Text>

                      <Controller
                        control={control}
                        name='totalAmount'
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            className={`bg-white border p-4 rounded-xl text-slate-900 ${errors.totalAmount ? 'border-red-500' : 'border-slate-200'}`}
                            onBlur={onBlur}
                            onChangeText={(text) => {
                              const decimalRegex = /^\d*\.?\d*$/;

                              if (decimalRegex.test(text)) {
                                onChange(text);
                              }
                            }}
                            value={value ?? ''}
                            placeholder='0.00'
                            keyboardType='decimal-pad'
                          />
                        )}
                      />
                      {errors.totalAmount && (
                        <Text className='pl-2 text-red-300'>
                          {errors.totalAmount.message}
                        </Text>
                      )}
                    </View>
                    {/*Type field*/}
                    <View className='flex-row flex-wrap gap-2 mb-4'>
                      <TouchableOpacity
                        onPress={() => setValue('type', 'MONTHLY')}
                        style={{ width: '48%' }}
                        className={
                          watch('type') === 'MONTHLY'
                            ? 'bg-indigo-600 p-4 rounded-xl items-center'
                            : 'bg-white border border-slate-200 p-4 rounded-xl items-center'
                        }
                      >
                        <Text
                          className={
                            watch('type') === 'MONTHLY'
                              ? 'text-white font-medium'
                              : 'text-slate-600'
                          }
                        >
                          Income
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/*Submit field*/}
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit, (errors) =>
                    console.log('Expense errors:', JSON.stringify(errors))
                  )}
                  disabled={isSubmitting}
                  className={`h-14 rounded-xl items-center justify-center ml-6 mr-6 mb-6 ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600'}`}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color='white' />
                  ) : (
                    <Text className='text-white font-bold text-lg'>save</Text>
                  )}
                </TouchableOpacity>

                {apiError && (
                  <Text className='pl-2 text-red-300 font-small'>
                    Something went wrong in the backend please try again later.
                  </Text>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
