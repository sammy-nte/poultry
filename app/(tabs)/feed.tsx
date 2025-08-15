import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext, FeedItem } from '@/contexts/AppContext';
import Dropdown from '@/components/Dropdown';
import DatePicker from '@/components/DatePicker';

const FeedCard = ({ feed, onPress }: any) => {
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'low': return '#DC2626';
      case 'medium': return '#F59E0B';
      case 'high': return '#16A34A';
      default: return '#6B7280';
    }
  };

  const getAlertText = (level: string) => {
    switch (level) {
      case 'low': return 'Low Stock';
      case 'medium': return 'Medium';
      case 'high': return 'Good Stock';
      default: return 'Unknown';
    }
  };

  const daysRemaining = Math.floor(feed.currentStock / feed.dailyConsumption);

  return (
    <TouchableOpacity style={styles.feedCard} onPress={() => onPress(feed)}>
      <View style={styles.feedHeader}>
        <View>
          <Text style={styles.feedName}>{feed.name}</Text>
          <Text style={styles.feedStock}>{feed.currentStock} kg remaining</Text>
        </View>
        <View style={[styles.alertBadge, { backgroundColor: getAlertColor(feed.alertLevel) }]}>
          <Text style={styles.alertText}>{getAlertText(feed.alertLevel)}</Text>
        </View>
      </View>

      <View style={styles.feedStats}>
        <View style={styles.statColumn}>
          <Text style={styles.statValue}>{feed.dailyConsumption} kg</Text>
          <Text style={styles.statLabel}>Daily Usage</Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={styles.statValue}>{daysRemaining}</Text>
          <Text style={styles.statLabel}>Days Remaining</Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={styles.statValue}>${feed.cost}</Text>
          <Text style={styles.statLabel}>Cost per kg</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${Math.min(100, (feed.currentStock / feed.totalCapacity) * 100)}%`,
                backgroundColor: getAlertColor(feed.alertLevel)
              }
            ]} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function Feed() {
  const { state, dispatch } = useAppContext();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<FeedItem | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'usage' | 'restock'>('usage');
  
  // Form state
  const [selectedFeedId, setSelectedFeedId] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCoops, setSelectedCoops] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const feedOptions = state.feedInventory.map(feed => ({
    label: feed.name,
    value: feed.id,
  }));

  const handleFeedPress = (feed: FeedItem) => {
    setSelectedFeed(feed);
    setIsDetailModalVisible(true);
  };

  const handleAddUsage = () => {
    if (!selectedFeedId || !amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const feed = state.feedInventory.find(f => f.id === selectedFeedId);
    if (!feed) {
      Alert.alert('Error', 'Selected feed not found');
      return;
    }

    if (actionType === 'usage' && amountNum > feed.currentStock) {
      Alert.alert('Error', 'Amount exceeds current stock');
      return;
    }

    const actionPayload = {
      feedId: selectedFeedId,
      amount: amountNum,
      date: selectedDate.toLocaleDateString(),
    };

    if (actionType === 'usage') {
      dispatch({ type: 'ADD_FEED_USAGE', payload: actionPayload });
    } else {
      dispatch({ type: 'ADD_FEED_RESTOCK', payload: actionPayload });
    }

    // Reset form
    setSelectedFeedId('');
    setAmount('');
    setSelectedCoops([]);
    setNotes('');
    setSelectedDate(new Date());
    setIsAddModalVisible(false);
    
    Alert.alert('Success', `Feed ${actionType} recorded successfully!`);
  };

  const toggleCoopSelection = (coopId: string) => {
    setSelectedCoops(prev => 
      prev.includes(coopId) 
        ? prev.filter(id => id !== coopId)
        : [...prev, coopId]
    );
  };

  const totalStock = state.feedInventory.reduce((sum, feed) => sum + feed.currentStock, 0);
  const totalCapacity = state.feedInventory.reduce((sum, feed) => sum + feed.totalCapacity, 0);
  const dailyConsumption = state.feedInventory.reduce((sum, feed) => sum + feed.dailyConsumption, 0);
  const averageDaysRemaining = state.feedInventory.length > 0
    ? Math.round(
        state.feedInventory.reduce((sum, feed) => sum + Math.floor(feed.currentStock / feed.dailyConsumption), 0) / 
        state.feedInventory.length
      )
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Feed Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Overview Cards */}
        <View style={styles.overviewSection}>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewCard}>
              <Text style={styles.overviewValue}>{totalStock} kg</Text>
              <Text style={styles.overviewLabel}>Total Stock</Text>
              <Text style={styles.overviewSubtext}>{Math.round((totalStock / totalCapacity) * 100)}% capacity</Text>
            </View>
            <View style={styles.overviewCard}>
              <Text style={styles.overviewValue}>{dailyConsumption} kg</Text>
              <Text style={styles.overviewLabel}>Daily Consumption</Text>
              <Text style={styles.overviewSubtext}>↑ 5% from last week</Text>
            </View>
            <View style={styles.overviewCard}>
              <Text style={styles.overviewValue}>{averageDaysRemaining}</Text>
              <Text style={styles.overviewLabel}>Days Remaining</Text>
              <Text style={styles.overviewSubtext}>Average across all feeds</Text>
            </View>
            <View style={styles.overviewCard}>
              <Text style={styles.overviewValue}>$890</Text>
              <Text style={styles.overviewLabel}>Weekly Cost</Text>
              <Text style={styles.overviewSubtext}>Feed expenses</Text>
            </View>
          </View>
        </View>

        {/* Feed Inventory */}
        <View style={styles.inventorySection}>
          <Text style={styles.sectionTitle}>Feed Inventory</Text>
          {state.feedInventory.map((feed) => (
            <FeedCard
              key={feed.id}
              feed={feed}
              onPress={handleFeedPress}
            />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => {
                setActionType('usage');
                setIsAddModalVisible(true);
              }}
            >
              <Ionicons name="add-circle" size={24} color="#16A34A" />
              <Text style={styles.actionText}>Record Consumption</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => {
                setActionType('restock');
                setIsAddModalVisible(true);
              }}
            >
              <Ionicons name="cube" size={24} color="#F59E0B" />
              <Text style={styles.actionText}>Restock Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="stats-chart" size={24} color="#8B5A2B" />
              <Text style={styles.actionText}>Usage Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="settings" size={24} color="#6B7280" />
              <Text style={styles.actionText}>Feed Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Add Feed Usage/Restock Modal */}
      <Modal visible={isAddModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {actionType === 'usage' ? 'Record Feed Usage' : 'Restock Feed'}
            </Text>
            <TouchableOpacity onPress={handleAddUsage}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Feed Type *</Text>
              <Dropdown
                options={feedOptions}
                selectedValue={selectedFeedId}
                onSelect={setSelectedFeedId}
                placeholder="Select feed type"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>
                Amount {actionType === 'usage' ? 'Used' : 'Added'} (kg) *
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Date & Time</Text>
              <DatePicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </View>

            {actionType === 'usage' && (
              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Assigned Coops</Text>
                <View style={styles.checkboxGroup}>
                  {state.flocks.map((flock) => (
                    <TouchableOpacity 
                      key={flock.id} 
                      style={styles.checkboxItem}
                      onPress={() => toggleCoopSelection(flock.id)}
                    >
                      <View style={[
                        styles.checkbox,
                        selectedCoops.includes(flock.id) && styles.checkboxSelected
                      ]}>
                        {selectedCoops.includes(flock.id) && (
                          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        )}
                      </View>
                      <Text style={styles.checkboxLabel}>{flock.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={`Any notes about ${actionType === 'usage' ? 'feed consumption' : 'restocking'}...`}
                multiline
                numberOfLines={4}
                placeholderTextColor="#9CA3AF"
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Feed Details Modal */}
      <Modal visible={isDetailModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsDetailModalVisible(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedFeed?.name}</Text>
            <TouchableOpacity>
              <Ionicons name="create" size={24} color="#16A34A" />
            </TouchableOpacity>
          </View>

          {selectedFeed && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Current Status</Text>
                <View style={styles.statusGrid}>
                  <View style={styles.statusCard}>
                    <Text style={styles.statusValue}>{selectedFeed.currentStock} kg</Text>
                    <Text style={styles.statusLabel}>Current Stock</Text>
                  </View>
                  <View style={styles.statusCard}>
                    <Text style={styles.statusValue}>
                      {Math.floor(selectedFeed.currentStock / selectedFeed.dailyConsumption)}
                    </Text>
                    <Text style={styles.statusLabel}>Days Remaining</Text>
                  </View>
                  <View style={styles.statusCard}>
                    <Text style={styles.statusValue}>{selectedFeed.dailyConsumption} kg</Text>
                    <Text style={styles.statusLabel}>Daily Usage</Text>
                  </View>
                  <View style={styles.statusCard}>
                    <Text style={styles.statusValue}>${selectedFeed.cost}</Text>
                    <Text style={styles.statusLabel}>Cost per kg</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Supplier:</Text>
                  <Text style={styles.detailValue}>{selectedFeed.supplier}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Capacity:</Text>
                  <Text style={styles.detailValue}>{selectedFeed.totalCapacity} kg</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Last Refill:</Text>
                  <Text style={styles.detailValue}>{selectedFeed.lastRefill}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Stock Level:</Text>
                  <Text style={styles.detailValue}>
                    {Math.round((selectedFeed.currentStock / selectedFeed.totalCapacity) * 100)}%
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: '#16A34A' }]}
                  onPress={() => {
                    setSelectedFeedId(selectedFeed.id);
                    setActionType('usage');
                    setIsDetailModalVisible(false);
                    setIsAddModalVisible(true);
                  }}
                >
                  <Text style={styles.actionBtnText}>Record Usage</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: '#F59E0B' }]}
                  onPress={() => {
                    setSelectedFeedId(selectedFeed.id);
                    setActionType('restock');
                    setIsDetailModalVisible(false);
                    setIsAddModalVisible(true);
                  }}
                >
                  <Text style={styles.actionBtnText}>Restock</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#8B5A2B' }]}>
                  <Text style={styles.actionBtnText}>Usage History</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
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
  overviewSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewCard: {
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
  overviewValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  overviewSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  inventorySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  feedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  feedName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  feedStock: {
    fontSize: 14,
    color: '#6B7280',
  },
  alertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  alertText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  feedStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statColumn: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
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
  formSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
  checkboxGroup: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  detailSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  actionButtons: {
    marginTop: 20,
  },
  actionBtn: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});