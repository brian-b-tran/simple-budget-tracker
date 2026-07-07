import { createBudget, updateBudget } from '@/app/services/budgetService';
import { BudgetDetail } from '@/app/types/budgetTypes';
import { formatDate, formatTime } from '@/app/utils/dateUtils';
import {
  UpdateBudgetFrontendInput,
  updateBudgetFrontendSchema,
  currencyEntries,
} from '@expense-app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
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

type EditBudgetModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  budget: BudgetDetail;
};

export default function EditBudgetModal({
  visible,
  onClose,
  onSuccess,
  budget,
}: EditBudgetModalProps) {
  const [apiError, setApiError] = useState<boolean>(false);
  const [currencies, setCurrencies] = useState<string[]>(['CAD', 'USD', 'JPY']);
  const [selectedStartTime, setSelectedStartTime] = useState<Date>(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
  const budgetForm = useForm<UpdateBudgetFrontendInput>({
    resolver: zodResolver(updateBudgetFrontendSchema),
    defaultValues: {
      name: budget.name,
      type: budget.type,
      currency: budget.currency,
      totalAmount: budget.totalAmount.toFixed(2),
      notes: budget.notes,
      startDate: budget.startDate ? new Date(budget.startDate) : undefined,
      startTime: budget.startTime ? new Date(budget.startTime) : undefined,
      endDate: budget.endDate ? new Date(budget.endDate) : undefined,
      endTime: budget.endTime ? new Date(budget.endTime) : undefined,
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

  const onSubmit = async (data: UpdateBudgetFrontendInput) => {
    setApiError(false);
    try {
      console.log(data);
      await updateBudget(budget.id, data);
      reset();
      onSuccess();
    } catch (error: any) {
      setApiError(true);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setSelectedStartDate(
        budget.startDate ? new Date(budget.startDate) : new Date()
      );
      setSelectedStartTime(
        budget.startTime ? new Date(budget.startTime) : new Date()
      );
      setSelectedEndDate(
        budget.endDate ? new Date(budget.endDate) : new Date()
      );
      setSelectedEndTime(
        budget.endTime ? new Date(budget.endTime) : new Date()
      );
      reset({
        name: budget.name,
        type: budget.type,
        currency: budget.currency,
        totalAmount: budget.totalAmount.toFixed(2),
        notes: budget.notes,
        startDate: budget.startDate ? new Date(budget.startDate) : undefined,
        startTime: budget.startTime ? new Date(budget.startTime) : undefined,
        endDate: budget.endDate ? new Date(budget.endDate) : undefined,
        endTime: budget.endTime ? new Date(budget.endTime) : undefined,
      });
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType='slide' transparent>
      <TouchableOpacity
        className='flex-1 justify-end bg-black/20'
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1}>
          <View className='bg-white p-6' style={{ minHeight: '100%' }}>
            <View className='flex-row justify-between items-center'>
              <Text className='text-lg font-bold text-slate-800'>
                Edit Budget
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
                  {/*Name Field */}
                  <View className='mb-4'>
                    <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                      Budget Name
                    </Text>
                    <Controller
                      control={control}
                      name='name'
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className='bg-white border border-slate-200 p-4 rounded-xl text-slate-900'
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          placeholder='My Budget'
                          multiline
                          numberOfLines={3}
                        />
                      )}
                    />
                    {errors.name && (
                      <Text className='pl-2 text-red-300'>
                        {errors.name.message}
                      </Text>
                    )}
                  </View>

                  {/*Type field*/}
                  <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                    Type of Budget
                  </Text>
                  <View className='flex-row flex-wrap gap-2 mb-4'>
                    {[
                      'MONTHLY',
                      'YEARLY',
                      'QUARTERLY',
                      'VACATION',
                      'EVENT',
                    ].map((interval: string) => (
                      <TouchableOpacity
                        onPress={() =>
                          setValue(
                            'type',
                            interval as UpdateBudgetFrontendInput['type']
                          )
                        }
                        style={{ width: '48%' }}
                        className={
                          watch('type') === interval
                            ? 'bg-indigo-600 p-4 rounded-xl items-center'
                            : 'bg-white border border-slate-200 p-4 rounded-xl items-center'
                        }
                        key={interval}
                      >
                        <Text
                          className={
                            watch('type') === interval
                              ? 'text-white font-medium'
                              : 'text-slate-600'
                          }
                        >
                          {interval}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/*Amount field*/}
                  <View className='mb-4'>
                    <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                      Budget Amount
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

                    {/*Currency field (inline with amount eventually)*/}
                    <Controller
                      control={control}
                      name='currency'
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Picker selectedValue={value} onValueChange={onChange}>
                          {currencyEntries.map(([code, name]) => (
                            <Picker.Item
                              key={code}
                              label={`${code} - ${name}`}
                              value={code}
                            />
                          ))}
                        </Picker>
                      )}
                    />
                    {errors.currency && (
                      <Text className='pl-2 text-red-300'>
                        {errors.currency.message}
                      </Text>
                    )}
                  </View>

                  {/*Conditional render for time and date period events & vacation types*/}
                  {(watch('type') === 'VACATION' ||
                    watch('type') === 'EVENT') && (
                    <View className='mb-4'>
                      <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                        Time Frame
                      </Text>
                      <View className='mb-4'>
                        <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                          Start Time
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            DateTimePickerAndroid.open({
                              value: selectedStartTime,
                              onChange: (
                                event: DateTimePickerEvent,
                                time: Date = new Date()
                              ) => {
                                setSelectedStartTime(time);
                                budgetForm.setValue('startTime', time);
                              },
                              mode: 'time',
                              is24Hour: true,
                            })
                          }
                          className='bg-white border border-slate-200 p-4 rounded-xl text-slate-900'
                        >
                          <Text>{formatTime(selectedStartTime.toJSON())}</Text>
                        </TouchableOpacity>
                      </View>
                      <View className='mb-4'>
                        <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                          End Time
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            DateTimePickerAndroid.open({
                              value: selectedEndTime,
                              onChange: (
                                event: DateTimePickerEvent,
                                time: Date = new Date()
                              ) => {
                                setSelectedEndTime(time);
                                budgetForm.setValue('endTime', time);
                              },
                              mode: 'time',
                              is24Hour: true,
                            })
                          }
                          className='bg-white border border-slate-200 p-4 rounded-xl text-slate-900'
                        >
                          <Text>{formatTime(selectedEndTime.toJSON())}</Text>
                        </TouchableOpacity>
                      </View>
                      <View className='mb-4'>
                        <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                          Start Date
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            DateTimePickerAndroid.open({
                              value: selectedStartDate,
                              onChange: (
                                event: DateTimePickerEvent,
                                time: Date = new Date()
                              ) => {
                                setSelectedStartDate(time);
                                budgetForm.setValue('startDate', time);
                              },
                              mode: 'date',
                              is24Hour: true,
                            })
                          }
                          className='bg-white border border-slate-200 p-4 rounded-xl text-slate-900'
                        >
                          <Text>{formatDate(selectedStartDate.toJSON())}</Text>
                        </TouchableOpacity>
                      </View>
                      <View className='mb-4'>
                        <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                          End Date
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            DateTimePickerAndroid.open({
                              value: selectedEndDate,
                              onChange: (
                                event: DateTimePickerEvent,
                                time: Date = new Date()
                              ) => {
                                setSelectedEndDate(time);
                                budgetForm.setValue('endDate', time);
                              },
                              mode: 'date',
                              is24Hour: true,
                            })
                          }
                          className='bg-white border border-slate-200 p-4 rounded-xl text-slate-900'
                        >
                          <Text>{formatDate(selectedEndDate.toJSON())}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  <View className='mb-4'>
                    {/*Notes field*/}
                    <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                      Notes
                    </Text>
                    <Controller
                      control={control}
                      name='notes'
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className='bg-white border border-slate-200 p-4 rounded-xl text-slate-900'
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          placeholder='Optional notes...'
                          multiline
                          numberOfLines={3}
                        />
                      )}
                    />
                  </View>
                  {/*Submit field*/}
                  <TouchableOpacity
                    onPress={handleSubmit(onSubmit, (errors) =>
                      console.log('Budget errors:', JSON.stringify(errors))
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

                  {/*Error field*/}
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
