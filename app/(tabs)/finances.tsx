import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const RevenueChart = ({ data }: any) => (
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>Monthly Revenue Trend</Text>
    <View style={styles.chart}>
      {data.map((item: any, index: number) => (
        <View key={index} style={styles.chartBar}>
          <View 
            style={[
              styles.bar, 
              { 
                height: `${(item.amount / Math.max(...data.map((d: any) => d.amount))) * 100}%`,
                backgroundColor: '#16A34A'
              }
            ]} 
          />
          <Text style={styles.chartLabel}>{item.month}</Text>
          <Text style={styles.chartValue}>${(item.amount / 1000).toFixed(1)}k</Text>
        </View>
      ))}
    </View>
  </View>
);

export default function Finances() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState('income');

  const financialSummary = {
    totalRevenue: 45800,
    totalExpenses: 28200,
    netProfit: 17600,
    profitMargin: 38.4,
  };

  const monthlyData = [
    { month: 'Aug', amount: 38500 },
    { month: 'Sep', amount: 42300 },
    { month: 'Oct', amount: 39800 },
    { month: 'Nov', amount: 46200 },
    { month: 'Dec', amount: 43900 },
    { month: 'Jan', amount: 45800 },
  ];

  const recentTransactions = [
    {
      type: 'income',
      description: 'Egg Sales - Local Market',
      amount: 1250,
      date: 'Today',
      category: 'Egg Sales',
    },
    {
      type: 'expense',
      description: 'Feed Purchase - Layer Mash',
      amount: 850,
      date: 'Yesterday',
      category: 'Feed & Supplies',
    },
    {
      type: 'income',
      description: 'Bird Sales - 50 Broilers',
      amount: 2100,
      date: 'Jan 19',
      category: 'Livestock Sales',
    },
    {
      type: 'expense',
      description: 'Veterinary Services',
      amount: 320,
      date: 'Jan 18',
      category: 'Healthcare',
    },
    {
      type: 'expense',
      description: 'Utilities - Electricity',
      amount: 180,
      date: 'Jan 17',
      category: 'Utilities',
    },
    {
      type: 'income',
      description: 'Egg Sales - Restaurant Supply',
      amount: 890,
      date: 'Jan 16',
      category: 'Egg Sales',
    },
  ];

  const categoryBreakdown = {
    income: [
      { category: 'Egg Sales', amount: 32400, percentage: 71 },
      { category: 'Livestock Sales', amount: 10200, percentage: 22 },
      { category: 'Other', amount: 3200, percentage: 7 },
    ],
    expenses: [
      { category: 'Feed & Supplies', amount: 15600, percentage: 55 },
      { category: 'Healthcare', amount: 4200, percentage: 15 },
      { category: 'Utilities', amount: 3800, percentage: 13 },
      { category: 'Labor', amount: 2400, percentage: 9 },
      { category: 'Other', amount: 2200, percentage: 8 },
    ]
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
          <Text style={styles.sectionTitle}>This Month Summary</Text>
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
              <Text style={styles.summaryValue}>{financialSummary.profitMargin}%</Text>
              <Text style={styles.summaryLabel}>Profit Margin</Text>
              <Text style={styles.summarySubtext}>Excellent performance</Text>
            </View>
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartSection}>
          <RevenueChart data={monthlyData} />
        </View>

        {/* Category Breakdown */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Income Sources</Text>
            {categoryBreakdown.income.map((item, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{item.category}</Text>
                  <Text style={styles.categoryAmount}>${item.amount.toLocaleString()}</Text>
                </View>
                <View style={styles.categoryProgress}>
                  <View style={[styles.categoryBar, { width: `${item.percentage}%`, backgroundColor: '#16A34A' }]} />
                </View>
                <Text style={styles.categoryPercentage}>{item.percentage}%</Text>
              </View>
            ))}
          </View>

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Expense Categories</Text>
            {categoryBreakdown.expenses.map((item, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{item.category}</Text>
                  <Text style={styles.categoryAmount}>${item.amount.toLocaleString()}</Text>
                </View>
                <View style={styles.categoryProgress}>
                  <View style={[styles.categoryBar, { width: `${item.percentage}%`, backgroundColor: '#DC2626' }]} />
                </View>
                <Text style={styles.categoryPercentage}>{item.percentage}%</Text>
              </View>
            ))}
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
            {recentTransactions.map((transaction, index) => (
              <TransactionItem
                key={index}
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
            <TouchableOpacity>
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
              <Text style={styles.inputLabel}>Amount</Text>
              <View style={styles.amountInput}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountField}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter transaction description"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Category</Text>
              <TouchableOpacity style={styles.selectInput}>
                <Text style={styles.selectText}>Select category</Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateText}>Today - Jan 21, 2025</Text>
                <Ionicons name="calendar" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Additional notes (optional)"
                multiline
                numberOfLines={3}
                placeholderTextColor="#9CA3AF"
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
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    backgroundColor: '#16A34A',
    width: 20,
    borderRadius: 2,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  categorySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryProgress: {
    flex: 2,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  categoryBar: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    width: 30,
    textAlign: 'right',
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
  selectInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});