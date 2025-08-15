import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const FeedItem = ({ name, currentStock, dailyConsumption, daysRemaining, alertLevel, onPress }: any) => {
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

  return (
    <TouchableOpacity style={styles.feedCard} onPress={() => onPress(name)}>
      <View style={styles.feedHeader}>
        <View>
          <Text style={styles.feedName}>{name}</Text>
          <Text style={styles.feedStock}>{currentStock} kg remaining</Text>
        </View>
        <View style={[styles.alertBadge, { backgroundColor: getAlertColor(alertLevel) }]}>
          <Text style={styles.alertText}>{getAlertText(alertLevel)}</Text>
        </View>
      </View>

      <View style={styles.feedStats}>
        <View style={styles.statColumn}>
          <Text style={styles.statValue}>{dailyConsumption} kg</Text>
          <Text style={styles.statLabel}>Daily Usage</Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={styles.statValue}>{daysRemaining}</Text>
          <Text style={styles.statLabel}>Days Remaining</Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={styles.statValue}>$2.45</Text>
          <Text style={styles.statLabel}>Cost per kg</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${Math.min(100, (currentStock / 1000) * 100)}%`,
                backgroundColor: getAlertColor(alertLevel)
              }
            ]} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ConsumptionChart = ({ data }: any) => (
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>Weekly Feed Consumption</Text>
    <View style={styles.chart}>
      {data.map((item: any, index: number) => (
        <View key={index} style={styles.chartBar}>
          <View 
            style={[
              styles.bar, 
              { 
                height: `${(item.consumption / Math.max(...data.map((d: any) => d.consumption))) * 100}%`,
                backgroundColor: '#16A34A'
              }
            ]} 
          />
          <Text style={styles.chartLabel}>{item.day}</Text>
          <Text style={styles.chartValue}>{item.consumption}</Text>
        </View>
      ))}
    </View>
  </View>
);

export default function Feed() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);

  const feedInventory = [
    {
      name: 'Layer Mash',
      currentStock: 850,
      dailyConsumption: 125,
      daysRemaining: 7,
      alertLevel: 'medium',
      totalCapacity: 2000,
      lastRefill: '3 days ago',
      supplier: 'Farm Feed Co.',
      cost: 2.45,
    },
    {
      name: 'Starter Feed',
      currentStock: 150,
      dailyConsumption: 45,
      daysRemaining: 3,
      alertLevel: 'low',
      totalCapacity: 500,
      lastRefill: '1 week ago',
      supplier: 'Premium Feeds Ltd',
      cost: 3.20,
    },
    {
      name: 'Grower Feed',
      currentStock: 1200,
      dailyConsumption: 80,
      daysRemaining: 15,
      alertLevel: 'high',
      totalCapacity: 1500,
      lastRefill: '2 days ago',
      supplier: 'Farm Feed Co.',
      cost: 2.80,
    },
    {
      name: 'Finisher Feed',
      currentStock: 600,
      dailyConsumption: 95,
      daysRemaining: 6,
      alertLevel: 'medium',
      totalCapacity: 1000,
      lastRefill: '5 days ago',
      supplier: 'Quality Nutrition',
      cost: 2.95,
    },
  ];

  const weeklyData = [
    { day: 'Mon', consumption: 340 },
    { day: 'Tue', consumption: 355 },
    { day: 'Wed', consumption: 330 },
    { day: 'Thu', consumption: 365 },
    { day: 'Fri', consumption: 345 },
    { day: 'Sat', consumption: 320 },
    { day: 'Sun', consumption: 335 },
  ];

  const totalStock = feedInventory.reduce((sum, feed) => sum + feed.currentStock, 0);
  const totalCapacity = feedInventory.reduce((sum, feed) => sum + feed.totalCapacity, 0);
  const dailyConsumption = feedInventory.reduce((sum, feed) => sum + feed.dailyConsumption, 0);
  const averageDaysRemaining = Math.round(
    feedInventory.reduce((sum, feed) => sum + feed.daysRemaining, 0) / feedInventory.length
  );

  const handleFeedPress = (feedName: string) => {
    const feed = feedInventory.find(f => f.name === feedName);
    setSelectedFeed(feed);
  };

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

        {/* Consumption Chart */}
        <View style={styles.chartSection}>
          <ConsumptionChart data={weeklyData} />
        </View>

        {/* Feed Inventory */}
        <View style={styles.inventorySection}>
          <Text style={styles.sectionTitle}>Feed Inventory</Text>
          {feedInventory.map((feed, index) => (
            <FeedItem
              key={index}
              name={feed.name}
              currentStock={feed.currentStock}
              dailyConsumption={feed.dailyConsumption}
              daysRemaining={feed.daysRemaining}
              alertLevel={feed.alertLevel}
              onPress={handleFeedPress}
            />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="add-circle" size={24} color="#16A34A" />
              <Text style={styles.actionText}>Record Consumption</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
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

      {/* Add Feed Modal */}
      <Modal visible={isAddModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Record Feed Usage</Text>
            <TouchableOpacity>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Feed Type</Text>
              <TouchableOpacity style={styles.selectInput}>
                <Text style={styles.selectText}>Select feed type</Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Amount Used (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Date & Time</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateText}>Today - 10:30 AM</Text>
                <Ionicons name="time" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Assigned Coops</Text>
              <View style={styles.checkboxGroup}>
                {['Coop A', 'Coop B', 'Coop C', 'Coop D', 'Coop E'].map((coop) => (
                  <TouchableOpacity key={coop} style={styles.checkboxItem}>
                    <View style={styles.checkbox}>
                      <Ionicons name="checkmark" size={16} color="#16A34A" />
                    </View>
                    <Text style={styles.checkboxLabel}>{coop}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any notes about feed quality, consumption patterns, etc..."
                multiline
                numberOfLines={4}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Feed Details Modal */}
      <Modal visible={!!selectedFeed} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedFeed(null)}>
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
                    <Text style={styles.statusValue}>{selectedFeed.daysRemaining}</Text>
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
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#16A34A' }]}>
                  <Text style={styles.actionBtnText}>Record Usage</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F59E0B' }]}>
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
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
    width: 16,
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
    borderColor: '#16A34A',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#16A34A',
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