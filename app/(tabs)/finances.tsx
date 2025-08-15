import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext, Transaction } from '@/contexts/AppContext';
import Dropdown from '@/components/Dropdown';
import DatePicker from '@/components/DatePicker';

const TransactionItem = ({ type, description, amount, date, category }: any) => {
  const isIncome = type === 'income';
  
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, { 
          backgroundColor: isIncome ? '#DCFCE7' : '#FEF3F2'
        }]}>
          <Ionicons 
            name={isIncome ? 'arrow-down' : 'arrow-up'} 
            size={16} 
            color={isIncome ? '#16A34A' : '#DC2626'} 
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>{description}</Text>
          <Text style={styles.transactionCategory}>{category}</Text>
          <Text style={styles.transactionDate}>{date}</Text>
        </View>
      </View>
      <Text style={[styles.transactionAmount, {
        color: isIncome ? '#16A34A' : '#DC2626'
      }]}>
        {isIncome ? '+' : '-'}${amount.toFixed(2)}
      </Text>
    </View>
  );
};

export default function Finances() {
  const { state, dispatch } = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState('income');
  
  // Form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState('');

  const incomeCategories = [
    { label: 'Egg Sales', value: 'Egg Sales' },
    { label: 'Livestock Sales', value: 'Livestock Sales' },
    { label: 'Breeding Services', value: 'Breeding Services' },
    { label: 'Consulting', value: 'Consulting' },
    { label: 'Other Income', value: 'Other Income' },
  ];

  const expenseCategories = [
    { label: 'Feed & Supplies', value: 'Feed & Supplies' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Utilities', value: 'Utilities' },
    { label: 'Labor', value: 'Labor' },
    { label: 'Equipment', value: 'Equipment' },
    { label: 'Maintenance', value: 'Maintenance' },
    { label: 'Other Expenses', value: 'Other Expenses' },
  ];

  const handleAddTransaction = () => {
    if (!amount || !description || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const formatDate = (date: Date) => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      }
    };

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: transactionType as 'income' | 'expense',
      description,
      amount: amountNum,
      date: formatDate(selectedDate),
      category,
      notes,
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    
    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setNotes('');
    setSelectedDate(new Date());
    setIsAddModalVisible(false);
    
    Alert.alert('Success', 'Transaction added successfully!');
  };

  // Calculate financial summary
  const totalRevenue = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const financialSummary = {
    totalRevenue,
    totalExpenses,
    netProfit,
    profitMargin,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Financial Overview</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Period Toggle */}
      <View style={styles.periodToggle}>
        {['week', 'month', 'year'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Financial Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, styles.revenueCard]}>
              <Text style={styles.summaryValue}>${financialSummary.totalRevenue.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>Total Revenue</Text>
              <View style={styles.summaryTrend}>
                <Ionicons name="trending-up" size={16} color="#16A34A" />
                <Text style={styles.summaryTrendText}>↑ 8.5%</Text>
              </View>
            </View>
            
            <View style={[styles.summaryCard, styles.expenseCard]}>
              <Text style={styles.summaryValue}>${financialSummary.totalExpenses.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <View style={styles.summaryTrend}>
                <Ionicons name="trending-up" size={16} color="#DC2626" />
                <Text style={[styles.summaryTrendText, { color: '#DC2626' }]}>↑ 3.2%</Text>
              </View>
            </View>
            
            <View style={[styles.summaryCard, styles.profitCard]}>
              <Text style={styles.summaryValue}>${financialSummary.netProfit.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>Net Profit</Text>
              <View style={styles.summaryTrend}>
                <Ionicons name="trending-up" size={16} color="#F59E0B" />
                <Text style={[styles.summaryTrendText, { color: '#F59E0B' }]}>↑ 15.8%</Text>
              </View>
            </View>
            
            <View style={[styles.summaryCard, styles.marginCard]}>
              <Text style={styles.summaryValue}>{financialSummary.profitMargin.toFixed(1)}%</Text>
              <Text style={styles.summaryLabel}>Profit Margin</Text>
              <Text style={styles.summarySubtext}>
                {financialSummary.profitMargin > 30 ? 'Excellent' : 
                 financialSummary.profitMargin > 15 ? 'Good' : 'Needs improvement'}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionsList}>
            {state.transactions.slice(0, 10).map((transaction) => (
              <TransactionItem
                key={transaction.id}
                type={transaction.type}
                description={transaction.description}
                amount={transaction.amount}
                date={transaction.date}
                category={transaction.category}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add Transaction Modal */}
      <Modal visible={isAddModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <TouchableOpacity onPress={handleAddTransaction}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.typeToggle}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === 'income' && styles.typeButtonActive
                ]}
                onPress={() => setTransactionType('income')}
              >
                <Text style={[
                  styles.typeButtonText,
                  transactionType === 'income' && styles.typeButtonTextActive
                ]}>Income</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === 'expense' && styles.typeButtonActive
                ]}
                onPress={() => setTransactionType('expense')}
              >
                <Text style={[
                  styles.typeButtonText,
                  transactionType === 'expense' && styles.typeButtonTextActive
                ]}>Expense</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Amount *</Text>
              <View style={styles.amountInput}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountField}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9CA3AF"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter transaction description"
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Category *</Text>
              <Dropdown
                options={transactionType === 'income' ? incomeCategories : expenseCategories}
                selectedValue={category}
                onSelect={setCategory}
                placeholder="Select category"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Date</Text>
              <DatePicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Additional notes (optional)"
                multiline
                numberOfLines={3}
                placeholderTextColor="#9CA3AF"
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#16A34A',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#16A34A',
    fontWeight: '600',
  },
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  revenueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  profitCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  marginCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B5A2B',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  summaryTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTrendText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '500',
    marginLeft: 4,
  },
  summarySubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '500',
  },
  transactionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  saveButton: {
    color: '#16A34A',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#16A34A',
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 8,
  },
  amountField: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingVertical: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});