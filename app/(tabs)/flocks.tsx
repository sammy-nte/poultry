import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const FlockCard = ({ flock, onPress }: any) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return '#16A34A';
      case 'Good': return '#F59E0B';
      case 'Poor': return '#DC2626';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity style={styles.flockCard} onPress={() => onPress(flock)}>
      <View style={styles.flockHeader}>
        <View>
          <Text style={styles.flockName}>{flock.name}</Text>
          <Text style={styles.flockType}>{flock.breed} • {flock.age} weeks old</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(flock.health) }]}>
          <Text style={styles.statusText}>{flock.health}</Text>
        </View>
      </View>
      
      <View style={styles.flockStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{flock.totalBirds}</Text>
          <Text style={styles.statLabel}>Total Birds</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{flock.mortality}</Text>
          <Text style={styles.statLabel}>Mortality</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{flock.eggProduction}%</Text>
          <Text style={styles.statLabel}>Egg Production</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{flock.avgWeight}g</Text>
          <Text style={styles.statLabel}>Avg Weight</Text>
        </View>
      </View>

      <View style={styles.flockFooter}>
        <Text style={styles.lastUpdated}>Last updated: {flock.lastUpdated}</Text>
        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );
};

export default function Flocks() {
  const [selectedFlock, setSelectedFlock] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const flocks = [
    {
      id: 1,
      name: 'Coop A - Layer House',
      breed: 'Rhode Island Red',
      age: 28,
      totalBirds: 500,
      mortality: 3,
      eggProduction: 87,
      avgWeight: 1800,
      health: 'Excellent',
      lastUpdated: '2 hours ago',
      notes: 'High egg production this week',
    },
    {
      id: 2,
      name: 'Coop B - Young Layers',
      breed: 'New Hampshire',
      age: 22,
      totalBirds: 450,
      mortality: 1,
      eggProduction: 75,
      avgWeight: 1650,
      health: 'Good',
      lastUpdated: '4 hours ago',
      notes: 'Starting to reach peak production',
    },
    {
      id: 3,
      name: 'Coop C - Broilers',
      breed: 'Cornish Cross',
      age: 6,
      totalBirds: 800,
      mortality: 12,
      eggProduction: 0,
      avgWeight: 900,
      health: 'Good',
      lastUpdated: '1 hour ago',
      notes: 'Ready for processing next week',
    },
    {
      id: 4,
      name: 'Coop D - Heritage Breeds',
      breed: 'Plymouth Rock',
      age: 35,
      totalBirds: 300,
      mortality: 5,
      eggProduction: 68,
      avgWeight: 2100,
      health: 'Excellent',
      lastUpdated: '6 hours ago',
      notes: 'Excellent foraging behavior',
    },
    {
      id: 5,
      name: 'Coop E - Breeding Stock',
      breed: 'Australorp',
      age: 45,
      totalBirds: 400,
      mortality: 8,
      eggProduction: 82,
      avgWeight: 2000,
      health: 'Good',
      lastUpdated: '3 hours ago',
      notes: 'Strong breeding performance',
    },
  ];

  const handleFlockPress = (flock: any) => {
    setSelectedFlock(flock);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Flock Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>2,450</Text>
          <Text style={styles.summaryLabel}>Total Birds</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>5</Text>
          <Text style={styles.summaryLabel}>Active Coops</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>29</Text>
          <Text style={styles.summaryLabel}>Total Mortality</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>79%</Text>
          <Text style={styles.summaryLabel}>Avg Production</Text>
        </View>
      </View>

      {/* Flocks List */}
      <ScrollView style={styles.flocksContainer} showsVerticalScrollIndicator={false}>
        {flocks.map((flock) => (
          <FlockCard key={flock.id} flock={flock} onPress={handleFlockPress} />
        ))}
      </ScrollView>

      {/* Flock Details Modal */}
      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedFlock?.name}</Text>
            <TouchableOpacity>
              <Ionicons name="create" size={24} color="#16A34A" />
            </TouchableOpacity>
          </View>

          {selectedFlock && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Breed:</Text>
                  <Text style={styles.detailValue}>{selectedFlock.breed}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Age:</Text>
                  <Text style={styles.detailValue}>{selectedFlock.age} weeks</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Birds:</Text>
                  <Text style={styles.detailValue}>{selectedFlock.totalBirds}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Health Status:</Text>
                  <Text style={[styles.detailValue, { color: selectedFlock.health === 'Excellent' ? '#16A34A' : '#F59E0B' }]}>
                    {selectedFlock.health}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Performance Metrics</Text>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{selectedFlock.eggProduction}%</Text>
                    <Text style={styles.metricLabel}>Egg Production</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{selectedFlock.avgWeight}g</Text>
                    <Text style={styles.metricLabel}>Average Weight</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{selectedFlock.mortality}</Text>
                    <Text style={styles.metricLabel}>Mortality Count</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>2.1:1</Text>
                    <Text style={styles.metricLabel}>Feed Conversion</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.notesText}>{selectedFlock.notes}</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#16A34A' }]}>
                  <Text style={styles.actionBtnText}>Record Health Check</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F59E0B' }]}>
                  <Text style={styles.actionBtnText}>Update Count</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#8B5A2B' }]}>
                  <Text style={styles.actionBtnText}>Feed Schedule</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Add Flock Modal */}
      <Modal visible={isAddModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Flock</Text>
            <TouchableOpacity>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Flock Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter flock name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Breed</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter breed"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formSection, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Initial Count</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={[styles.formSection, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.inputLabel}>Age (weeks)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any notes about this flock..."
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
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  flocksContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  flockCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  flockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  flockName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  flockType: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  flockStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  flockFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
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
  detailSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
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
  formSection: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});