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
  UpdateExpenseFrontendInput,
  updateExpenseFrontendSchema,
} from '@expense-app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateExpense } from '@/app/services/expenseService';
import { Category } from '@/app/types/categoryTypes';
import { getCategories } from '@/app/services/categoryService';
import { BudgetSummary } from '@/app/types/budgetTypes';
import { getAllBudgets } from '@/app/services/budgetService';
import { Picker } from '@react-native-picker/picker';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { formatDate, formatTime } from '../../../utils/dateUtils';
import { Expense } from '@/app/types/expenseTypes';
interface EditExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expense: Expense;
}

export default function EditExpenseModal({
  visible,
  onClose,
  expense,
  onSuccess,
}: EditExpenseModalProps) {
  const [apiError, setApiError] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<BudgetSummary[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  //forms
  const expenseForm = useForm<UpdateExpenseFrontendInput>({
    resolver: zodResolver(updateExpenseFrontendSchema),
    defaultValues: {
      categoryId: expense.categoryId,
      date: new Date(expense.date),
      time: new Date(expense.time),
      type: expense.type,
      currencyOriginal: expense.currencyOriginal,
      budgetId: expense.budgetId,
      notes: expense.notes,
      amountOriginal: expense.amountOriginal.toFixed(2),
    },
  });

  //submit handlers
  const onSubmitExpense = async (data: UpdateExpenseFrontendInput) => {
    setApiError(false);
    try {
      console.log(data);
      await updateExpense(data, expense.id);
      resetForm();
      onSuccess();
    } catch (error: any) {
      console.log('Full error:', JSON.stringify(error.response?.data));
      setApiError(true);
    }
  };

  const resetForm = () => {
    const date = new Date(expense.date);
    const time = new Date(expense.time);
    setSelectedDate(date);
    setSelectedTime(time);
    expenseForm.reset({
      categoryId: expense.categoryId,
      date: new Date(expense.date),
      time: new Date(expense.time),
      type: expense.type,
      currencyOriginal: expense.currencyOriginal,
      budgetId: expense.budgetId,
      notes: expense.notes,
      amountOriginal: expense.amountOriginal.toFixed(2),
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  //startup
  useEffect(() => {
    const fetchCategory = async () => {
      await getCategories().then((cats) => {
        setCategories(cats);
      });
    };

    const fetchBudgets = async () => {
      await getAllBudgets().then((budgets) => {
        setBudgets(budgets);
      });
    };

    if (visible) {
      resetForm();
      fetchCategory();
      fetchBudgets();
    }
  }, [visible]);

  const renderFields = (
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
              /*android native picker will replace with better component once bugs fixed */
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
                {/*Expense Fields */}
                <View className='p-4'>
                  {renderFields(
                    expenseForm.watch,
                    expenseForm.control,
                    expenseForm.formState.errors,
                    expenseForm.setValue
                  )}

                  {/*Date and Time pickers */}

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

                {/*Submit field*/}
                <TouchableOpacity
                  onPress={expenseForm.handleSubmit(onSubmitExpense, (errors) =>
                    console.log('Expense errors:', JSON.stringify(errors))
                  )}
                  disabled={expenseForm.formState.isSubmitting}
                  className={`h-14 rounded-xl items-center justify-center ml-6 mr-6 mb-6 ${expenseForm.formState.isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600'}`}
                >
                  {expenseForm.formState.isSubmitting ? (
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
