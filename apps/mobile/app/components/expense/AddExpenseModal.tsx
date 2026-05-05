import { useEffect, useState } from 'react';
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
} from '@expense-app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { createExpense } from '@/app/services/expenseService';
import { createRecurringExpense } from '@/app/services/recurringExpenseService';
import {
  CreateRecurringExpenseFrontendInput,
  createRecurringExpenseFrontendSchema,
} from '@expense-app/types';
import { Category } from '@/app/types/categoryTypes';
import { getCategories } from '@/app/services/categoryService';
import { BudgetSummary } from '@/app/types/budgetTypes';
import { getAllBudgets } from '@/app/services/budgetService';
import { Picker } from '@react-native-picker/picker';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { formatDate, formatTime } from '../../utils/dateUtils';
interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({
  visible,
  onClose,
}: AddExpenseModalProps) {
  const [apiError, setApiError] = useState<boolean>(false);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<BudgetSummary[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    new Date()
  );

  //forms
  const expenseForm = useForm<CreateExpenseFrontendInput>({
    resolver: zodResolver(createExpenseFrontendSchema),
    defaultValues: { type: 'EXPENSE', currencyOriginal: 'CAD' },
  });

  const recurringForm = useForm<CreateRecurringExpenseFrontendInput>({
    resolver: zodResolver(createRecurringExpenseFrontendSchema),
    defaultValues: {
      type: 'EXPENSE',
      currencyOriginal: 'CAD',
      frequency: 'DAILY',
      interval: 1,
    },
  });

  //form switch
  const handleRecurringToggle = () => {
    if (!isRecurring) {
      // switching to recurring — copy expense form values to recurring form
      const values = expenseForm.getValues();
      recurringForm.setValue('amountOriginal', values.amountOriginal);
      recurringForm.setValue('currencyOriginal', values.currencyOriginal);
      recurringForm.setValue('categoryId', values.categoryId);
      recurringForm.setValue('budgetId', values.budgetId);
      recurringForm.setValue('notes', values.notes);
      recurringForm.setValue('type', values.type);
    } else {
      // switching back — copy recurring form values to expense form
      const values = recurringForm.getValues();
      expenseForm.setValue('amountOriginal', values.amountOriginal);
      expenseForm.setValue(
        'currencyOriginal',
        values.currencyOriginal ? values.currencyOriginal : 'CAD'
      );
      expenseForm.setValue('categoryId', values.categoryId);
      expenseForm.setValue('budgetId', values.budgetId);
      expenseForm.setValue('notes', values.notes);
      expenseForm.setValue('type', values.type);
    }
    setIsRecurring(!isRecurring);
  };

  //submit handlers
  const onSubmitExpense = async (data: CreateExpenseFrontendInput) => {
    setApiError(false);
    try {
      const cleanedData = {
        ...data,
        budgetId: data.budgetId === '' ? undefined : data.budgetId,
        recurringExpenseId:
          data.recurringExpenseId === '' ? undefined : data.recurringExpenseId,
        notes: data.notes === '' ? undefined : data.notes,
      };
      console.log(cleanedData);
      await createExpense(cleanedData);
      expenseForm.reset({ type: 'EXPENSE', currencyOriginal: 'CAD' });
      handleClose();
    } catch (error: any) {
      console.log('Full error:', JSON.stringify(error.response?.data));
      setApiError(true);
    }
  };

  const onSubmitRecurring = async (
    data: CreateRecurringExpenseFrontendInput
  ) => {
    setApiError(false);
    try {
      const cleanedData = {
        ...data,
        budgetId: data.budgetId === '' ? undefined : data.budgetId,
        endDate: data.endDate === undefined ? undefined : data.endDate,
        notes: data.notes === '' ? undefined : data.notes,
      };
      console.log(cleanedData);
      await createRecurringExpense(cleanedData);
      recurringForm.reset({
        type: 'EXPENSE',
        currencyOriginal: 'CAD',
        frequency: 'DAILY',
        interval: 1,
      });

      handleClose();
    } catch (error: any) {
      setApiError(true);
    }
  };

  const renderIntervalFormat = (freq: string) => {
    switch (freq) {
      case 'DAILY':
        return 'day';
      case 'WEEKLY':
        return 'week';
      case 'MONTHLY':
        return 'month';
      case 'YEARLY':
        return 'year';
      default:
        return 'day';
    }
  };

  const handleClose = () => {
    expenseForm.reset({ type: 'EXPENSE', currencyOriginal: 'CAD' });
    recurringForm.reset({
      type: 'EXPENSE',
      currencyOriginal: 'CAD',
      frequency: 'DAILY',
      interval: 1,
    });
    setIsRecurring(false);
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setSelectedStartDate(new Date());
    setSelectedEndDate(undefined);
    onClose();
  };

  //startup
  useEffect(() => {
    const fetchCategory = async () => {
      await getCategories().then((cats) => {
        setCategories(cats);
        const defaultCat = cats.find((c) => c.name === 'No Category');
        if (defaultCat) {
          expenseForm.setValue('categoryId', defaultCat.id);
          recurringForm.setValue('categoryId', defaultCat.id);
        }
      });
    };
    const fetchBudgets = async () => {
      await getAllBudgets().then((budgets) => {
        setBudgets(budgets);
        expenseForm.setValue('budgetId', '');
        recurringForm.setValue('budgetId', '');
      });
    };

    if (visible) {
      const now = new Date();
      fetchCategory();
      fetchBudgets();
      setSelectedDate(now);
      setSelectedTime(now);
      expenseForm.setValue('date', now);
      expenseForm.setValue('time', now);
      recurringForm.setValue('startDate', now);
    }
  }, [visible]);

  const renderSharedFields = (
    watch: any,
    control: any,
    errors: any,
    setValue: any
  ) => {
    return (
      <View>
        {/*Amount field*/}
        <View className='mb-4'>
          <Text className='mb-2 pl-2 text-slate-600 font-medium'>Amount</Text>
          <Controller
            control={control}
            name='amountOriginal'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`bg-white border p-4 rounded-xl text-slate-900 ${errors.amountOriginal ? 'border-red-500' : 'border-slate-200'}`}
                onBlur={onBlur}
                onChangeText={(text) => {
                  if (text === '' || text === '-') {
                    onChange(undefined);
                    return;
                  }
                  const parsed = parseFloat(text);
                  onChange(isNaN(parsed) ? undefined : parsed);
                }}
                value={value !== undefined ? value.toString() : ''}
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
        {/*Type field*/}
        <View className='flex-row flex-wrap gap-2 mb-4'>
          <TouchableOpacity
            onPress={() => setValue('type', 'EXPENSE')}
            style={{ width: '48%' }}
            className={
              watch('type') === 'EXPENSE'
                ? 'bg-indigo-600 p-4 rounded-xl items-center'
                : 'bg-white border border-slate-200 p-4 rounded-xl items-center'
            }
          >
            <Text
              className={
                watch('type') === 'EXPENSE'
                  ? 'text-white font-medium'
                  : 'text-slate-600'
              }
            >
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setValue('type', 'INCOME')}
            style={{ width: '48%' }}
            className={
              watch('type') === 'INCOME'
                ? 'bg-indigo-600 p-4 rounded-xl items-center'
                : 'bg-white border border-slate-200 p-4 rounded-xl items-center'
            }
          >
            <Text
              className={
                watch('type') === 'INCOME'
                  ? 'text-white font-medium'
                  : 'text-slate-600'
              }
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <View className='mb-4'>
          {/*Category field*/}
          <Text className='mb-2 pl-2 text-slate-600 font-medium'>Category</Text>
          <Controller
            control={control}
            name='categoryId'
            render={({ field: { onChange, onBlur, value } }) => (
              /*android native picker replace with better component once bugs fixed */
              <View
                style={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <Picker selectedValue={value} onValueChange={onChange}>
                  {categories.map((cat) => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                  ))}
                </Picker>
              </View>
            )}
          />
        </View>

        <View className='mb-4'>
          {/*Budget field*/}
          <Text className='mb-2 pl-2 text-slate-600 font-medium'>Budget</Text>
          <Controller
            control={control}
            name='budgetId'
            render={({ field: { onChange, onBlur, value } }) => (
              /*android native picker replace with better component once bugs fixed */
              <View
                style={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <Picker selectedValue={value} onValueChange={onChange}>
                  <Picker.Item label={'No Budget'} value={''} />
                  {budgets.map((budget) => (
                    <Picker.Item
                      key={budget.id}
                      label={budget.name}
                      value={budget.id}
                    />
                  ))}
                </Picker>
              </View>
            )}
          />
        </View>

        <View className='mb-4'>
          {/*Notes field*/}
          <Text className='mb-2 pl-2 text-slate-600 font-medium'>Notes</Text>
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
      </View>
    );
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
              <TouchableOpacity onPress={handleClose}>
                <Text className='text-slate-400'>close</Text>
              </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className='flex-1'
            >
              <ScrollView contentContainerStyle={{ flexGrow: 1 }} className=''>
                <View className='p-6'>
                  {isRecurring
                    ? renderSharedFields(
                        recurringForm.watch,
                        recurringForm.control,
                        recurringForm.formState.errors,
                        recurringForm.setValue
                      )
                    : renderSharedFields(
                        expenseForm.watch,
                        expenseForm.control,
                        expenseForm.formState.errors,
                        expenseForm.setValue
                      )}
                  <View className='flex-row items-center mb-4 space-between'>
                    <Text className='text-slate-600 font-medium mr-4'>
                      Recurring
                    </Text>
                    <TouchableOpacity onPress={handleRecurringToggle}>
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 4,
                          borderWidth: 2,
                          borderColor: isRecurring ? '#4f46e5' : '#94a3b8',
                          backgroundColor: isRecurring ? '#4f46e5' : 'white',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 8,
                        }}
                      >
                        {isRecurring && (
                          <Text style={{ color: 'white', fontSize: 16 }}>
                            ✓
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>

                  {!isRecurring ? (
                    <View>
                      <View className='mb-4'>
                        <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                          Date
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            DateTimePickerAndroid.open({
                              value: selectedDate,
                              onChange: (
                                event: DateTimePickerEvent,
                                date: Date = new Date()
                              ) => {
                                setSelectedDate(date);
                                expenseForm.setValue('date', date);
                              },
                              mode: 'date',
                              is24Hour: true,
                            })
                          }
                          className='bg-white border border-slate-200 p-4 rounded-xl text-slate-900'
                        >
                          <Text>{formatDate(selectedDate.toJSON())} </Text>
                        </TouchableOpacity>
                      </View>
                      <View className='mb-4'>
                        <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                          Time
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            DateTimePickerAndroid.open({
                              value: selectedTime,
                              onChange: (
                                event: DateTimePickerEvent,
                                time: Date = new Date()
                              ) => {
                                setSelectedTime(time);
                                expenseForm.setValue('time', time);
                              },
                              mode: 'time',
                              is24Hour: true,
                            })
                          }
                          className='bg-white border border-slate-200 p-4 rounded-xl text-slate-900'
                        >
                          <Text>{formatTime(selectedTime.toJSON())}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View className='mb-4'>
                        <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                          Frequency
                        </Text>
                        <View className='flex-row flex-wrap gap-2 mb-4'>
                          {['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].map(
                            (freq) => (
                              <TouchableOpacity
                                key={freq}
                                onPress={() =>
                                  recurringForm.setValue(
                                    'frequency',
                                    freq as any
                                  )
                                }
                                style={{ width: '48%' }}
                                className={
                                  recurringForm.watch('frequency') === freq
                                    ? 'bg-indigo-600 p-4 rounded-xl items-center'
                                    : 'bg-white border border-slate-200 p-4 rounded-xl items-center'
                                }
                              >
                                <Text
                                  className={
                                    recurringForm.watch('frequency') === freq
                                      ? 'text-white font-medium'
                                      : 'text-slate-600'
                                  }
                                >
                                  {freq}
                                </Text>
                              </TouchableOpacity>
                            )
                          )}
                        </View>
                      </View>
                      <View className='mb-4 '>
                        <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                          Interval
                        </Text>
                        <View className='flex-row flex-wrap gap-2 mb-4'>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((int) => (
                            <TouchableOpacity
                              key={int}
                              onPress={() =>
                                recurringForm.setValue('interval', int as any)
                              }
                              style={{ width: '48%' }}
                              className={
                                recurringForm.watch('interval') === int
                                  ? 'bg-indigo-600 p-4 rounded-xl items-center'
                                  : 'bg-white border border-slate-200 p-4 rounded-xl items-center'
                              }
                            >
                              <Text
                                className={
                                  recurringForm.watch('interval') === int
                                    ? 'text-white font-medium'
                                    : 'text-slate-600'
                                }
                              >
                                Every {int > 1 ? int + ' ' : ''}
                                {renderIntervalFormat(
                                  recurringForm.watch('frequency')
                                ) + (int > 1 ? 's' : '')}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
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
                                date: Date = new Date()
                              ) => {
                                recurringForm.setValue('startDate', date);
                                setSelectedStartDate(date);
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
                              value: new Date(),
                              onChange: (
                                event: DateTimePickerEvent,
                                date: Date = new Date()
                              ) => {
                                recurringForm.setValue('endDate', date);
                                setSelectedEndDate(date);
                              },
                              mode: 'date',
                              is24Hour: true,
                            })
                          }
                          className='bg-white border border-slate-200 p-4 rounded-xl text-slate-900'
                        >
                          <Text>
                            {recurringForm.watch('endDate')
                              ? formatDate(selectedEndDate!.toJSON())
                              : 'No end date'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            recurringForm.setValue('endDate', undefined);
                            setSelectedEndDate(undefined);
                          }}
                        >
                          <Text className='text-slate-400 text-sm mt-1 pl-2'>
                            Clear
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/*Submit field*/}
                  <TouchableOpacity
                    onPress={
                      isRecurring
                        ? recurringForm.handleSubmit(
                            onSubmitRecurring,
                            (errors) =>
                              console.log(
                                'Recurring errors:',
                                JSON.stringify(errors)
                              )
                          )
                        : expenseForm.handleSubmit(onSubmitExpense, (errors) =>
                            console.log(
                              'Expense errors:',
                              JSON.stringify(errors)
                            )
                          )
                    }
                    disabled={expenseForm.formState.isSubmitting}
                    className={`h-14 rounded-xl items-center justify-center ${expenseForm.formState.isSubmitting || recurringForm.formState.isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600'}`}
                  >
                    {expenseForm.formState.isSubmitting ||
                    recurringForm.formState.isSubmitting ? (
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
