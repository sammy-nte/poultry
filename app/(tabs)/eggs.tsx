import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductionCard = ({ date, eggs, quality, notes }: any) => (
  <View style={styles.productionCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.dateText}>{date}</Text>
      <View style={styles.eggCount}>
        <Text style={styles.eggCountText}>{eggs}</Text>
        <Text style={styles.eggLabel}>eggs</Text>
      </View>
    </View>
    
    <View style={styles.qualityBreakdown}>
      <View style={styles.qualityItem}>
        <View style={[styles.qualityDot, { backgroundColor: '#16A34A' }]} />
        <Text style={styles.qualityText}>Grade A: {quality.gradeA}</Text>
      </View>
      <View style={styles.qualityItem}>
        <View style={[styles.qualityDot, { backgroundColor: '#F59E0B' }]} />
        <Text style={styles.qualityText}>Grade B: {quality.gradeB}</Text>
      </View>
      <View style={styles.qualityItem}>
        <View style={[styles.qualityDot, { backgroundColor: '#DC2626' }]} />
        <Text style={styles.qualityText}>Damaged: {quality.damaged}</Text>
      </View>
    </View>
    
    {notes && <Text style={styles.notesText}>{notes}</Text>}
  </View>
);

export default function Eggs() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const eggProduction = [
    {
      date: 'Today',
      eggs: 1850,
      quality: { gradeA: 1600, gradeB: 200, damaged: 50 },
      notes: 'Excellent production day',
    },
    {
      date: 'Yesterday',
      eggs: 1780,
      quality: { gradeA: 1520, gradeB: 210, damaged: 50 },
      notes: 'Good quality overall',
    },
    {
      date: 'Jan 20, 2025',
      eggs: 1820,
      quality: { gradeA: 1580, gradeB: 190, damaged: 50 },
      notes: '',
    },
    {
      date: 'Jan 19, 2025',
      eggs: 1750,
      quality: { gradeA: 1500, gradeB: 200, damaged: 50 },
      notes: 'Slight dip in production',
    },
    {
      date: 'Jan 18, 2025',
      eggs: 1880,
      quality: { gradeA: 1650, gradeB: 180, damaged: 50 },
      notes: 'Peak production day',
    },
  ];

  const weeklyStats = {
    totalEggs: 12450,
    averageDaily: 1778,
    gradeAPercentage: 87,
    efficiency: 85.5,
    revenue: 3240,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Egg Production</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Period Toggle */}
      <View style={styles.periodToggle}>
        {['day', 'week', 'month'].map((period) => (
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

      {/* Weekly Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>This Week Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{weeklyStats.totalEggs.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Total Eggs</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{weeklyStats.averageDaily}</Text>
            <Text style={styles.summaryLabel}>Daily Average</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{weeklyStats.gradeAPercentage}%</Text>
            <Text style={styles.summaryLabel}>Grade A Rate</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>${weeklyStats.revenue}</Text>
            <Text style={styles.summaryLabel}>Revenue</Text>
          </View>
        </View>
      </View>

      {/* Production Efficiency */}
      <View style={styles.efficiencySection}>
        <Text style={styles.sectionTitle}>Production Efficiency</Text>
        <View style={styles.efficiencyCard}>
          <View style={styles.efficiencyHeader}>
            <Text style={styles.efficiencyValue}>{weeklyStats.efficiency}%</Text>
            <Text style={styles.efficiencyLabel}>Current Rate</Text>
          </View>
          <View style={styles.efficiencyBar}>
            <View style={[styles.efficiencyProgress, { width: `${weeklyStats.efficiency}%` }]} />
          </View>
          <Text style={styles.efficiencyNote}>
            Target: 90% • Excellent performance this week!
          </Text>
        </View>
      </View>

      {/* Daily Records */}
      <View style={styles.recordsSection}>
        <Text style={styles.sectionTitle}>Daily Records</Text>
        <ScrollView style={styles.recordsList} showsVerticalScrollIndicator={false}>
          {eggProduction.map((record, index) => (
            <ProductionCard
              key={index}
              date={record.date}
              eggs={record.eggs}
              quality={record.quality}
              notes={record.notes}
            />
          ))}
        </ScrollView>
      </View>

      {/* Add Production Modal */}
      <Modal visible={isAddModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Record Egg Production</Text>
            <TouchableOpacity>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Collection Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateText}>Today - Jan 21, 2025</Text>
                <Ionicons name="calendar" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Total Eggs Collected</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter total count"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Quality Breakdown</Text>
              <View style={styles.qualityInputs}>
                <View style={styles.qualityRow}>
                  <Text style={styles.qualityInputLabel}>Grade A</Text>
                  <TextInput
                    style={[styles.input, styles.qualityInput]}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.qualityRow}>
                  <Text style={styles.qualityInputLabel}>Grade B</Text>
                  <TextInput
                    style={[styles.input, styles.qualityInput]}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.qualityRow}>
                  <Text style={styles.qualityInputLabel}>Damaged</Text>
                  <TextInput
                    style={[styles.input, styles.qualityInput]}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Coop Breakdown</Text>
              <View style={styles.coopInputs}>
                <View style={styles.coopRow}>
                  <Text style={styles.coopLabel}>Coop A</Text>
                  <TextInput
                    style={[styles.input, styles.coopInput]}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.coopRow}>
                  <Text style={styles.coopLabel}>Coop B</Text>
                  <TextInput
                    style={[styles.input, styles.coopInput]}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.coopRow}>
                  <Text style={styles.coopLabel}>Coop D</Text>
                  <TextInput
                    style={[styles.input, styles.coopInput]}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.coopRow}>
                  <Text style={styles.coopLabel}>Coop E</Text>
                  <TextInput
                    style={[styles.input, styles.coopInput]}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any observations or notes about today's collection..."
                multiline
                numberOfLines={4}
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
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
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    textAlign: 'center',
  },
  efficiencySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  efficiencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  efficiencyHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  efficiencyValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#16A34A',
    marginBottom: 4,
  },
  efficiencyLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  efficiencyBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  efficiencyProgress: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 4,
  },
  efficiencyNote: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  recordsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recordsList: {
    flex: 1,
  },
  productionCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  eggCount: {
    alignItems: 'center',
  },
  eggCountText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F59E0B',
  },
  eggLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  qualityBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  qualityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  qualityText: {
    fontSize: 12,
    color: '#6B7280',
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
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
    marginBottom: 24,
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
  qualityInputs: {
    gap: 12,
  },
  qualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qualityInputLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  qualityInput: {
    flex: 1,
    marginLeft: 16,
  },
  coopInputs: {
    gap: 12,
  },
  coopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coopLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  coopInput: {
    flex: 1,
    marginLeft: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});