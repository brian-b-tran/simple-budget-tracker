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
import DateTimePicker from '@react-native-community/datetimepicker';
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
      fetchCategory();
      fetchBudgets();
    }
  }, [visible]);

  const expenseForm = useForm<CreateExpenseFrontendInput>({
    resolver: zodResolver(createExpenseFrontendSchema),
    defaultValues: { type: 'EXPENSE', currencyOriginal: 'CAD' },
  });

  const recurringForm = useForm<CreateRecurringExpenseFrontendInput>({
    resolver: zodResolver(createRecurringExpenseFrontendSchema),
    defaultValues: { type: 'EXPENSE', currencyOriginal: 'CAD', interval: 1 },
  });

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

  const onSubmitExpense = async (data: CreateExpenseFrontendInput) => {
    setApiError(false);
    try {
      await createExpense(data);
      onClose();
    } catch (error: any) {
      setApiError(true);
    }
  };

  const onSubmitRecurring = async (
    data: CreateRecurringExpenseFrontendInput
  ) => {
    setApiError(false);
    try {
      await createRecurringExpense(data);
      onClose();
    } catch (error: any) {
      setApiError(true);
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
              <ScrollView contentContainerStyle={{ flexGrow: 1 }} className=''>
                <View className=' p-6 '>
                  {/*Amount field*/}
                  <View className='mb-4'>
                    <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                      Amount
                    </Text>
                    <Controller
                      control={expenseForm.control}
                      name='amountOriginal'
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className={`bg-white border p-4 rounded-xl text-slate-900 ${expenseForm.formState.errors.amountOriginal ? 'border-red-500' : 'border-slate-200'}`}
                          onBlur={onBlur}
                          onChangeText={(text) => onChange(parseFloat(text))}
                          value={value?.toString()}
                          placeholder='0.00'
                          keyboardType='decimal-pad'
                        />
                      )}
                    />
                    {expenseForm.formState.errors.amountOriginal && (
                      <Text className='pl-2 text-red-300'>
                        {expenseForm.formState.errors.amountOriginal.message}
                      </Text>
                    )}
                  </View>

                  <View className='mb-4'>
                    {/*Category field*/}
                    <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                      Category
                    </Text>
                    <Controller
                      control={expenseForm.control}
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
                          <Picker
                            selectedValue={value}
                            onValueChange={onChange}
                          >
                            {categories.map((cat) => (
                              <Picker.Item
                                key={cat.id}
                                label={cat.name}
                                value={cat.id}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}
                    />
                  </View>

                  <View className='mb-4'>
                    {/*Budget field*/}
                    <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                      Budget
                    </Text>
                    <Controller
                      control={expenseForm.control}
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
                          <Picker
                            selectedValue={value}
                            onValueChange={onChange}
                          >
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
                    <Text className='mb-2 pl-2 text-slate-600 font-medium'>
                      Notes
                    </Text>
                    <Controller
                      control={expenseForm.control}
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

                  <TouchableOpacity
                    onPress={handleRecurringToggle}
                    className='flex-row items-center mb-4 space-between'
                  >
                    <Text className='text-slate-600 font-medium mr-4'>
                      Recurring
                    </Text>

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
                        <Text style={{ color: 'white', fontSize: 16 }}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>

                  {!isRecurring ? (
                    <Text>Date and time fields go here</Text>
                  ) : (
                    <Text>Recurring fields go here</Text>
                  )}
                  {/*Submit field*/}
                  <TouchableOpacity
                    onPress={
                      isRecurring
                        ? recurringForm.handleSubmit(onSubmitRecurring)
                        : expenseForm.handleSubmit(onSubmitExpense)
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
