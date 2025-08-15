import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext, HealthRecord } from '@/contexts/AppContext';
import Dropdown from '@/components/Dropdown';
import DatePicker from '@/components/DatePicker';

const HealthCard = ({ title, status, lastCheck, nextDue, priority, onPress }: any) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return '#16A34A';
      case 'Needs Attention': return '#F59E0B';
      case 'Critical': return '#DC2626';
      case 'Due': return '#DC2626';
      case 'Upcoming': return '#F59E0B';
      case 'Completed': return '#16A34A';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity style={styles.healthCard} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleSection}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{lastCheck}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      
      {nextDue && (
        <View style={styles.dueDateContainer}>
          <Ionicons name="calendar" size={16} color="#6B7280" />
          <Text style={styles.dueDateText}>Next: {nextDue}</Text>
        </View>
      )}
      
      <View style={styles.cardFooter}>
        <View style={[styles.priorityIndicator, { backgroundColor: getStatusColor(priority) }]}>
          <Text style={styles.priorityText}>{priority} Priority</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );
};

const VaccinationItem = ({ vaccine, date, flocks, status, notes }: any) => (
  <View style={styles.vaccinationCard}>
    <View style={styles.vaccinationHeader}>
      <View>
        <Text style={styles.vaccineName}>{vaccine}</Text>
        <Text style={styles.vaccineCoop}>{flocks.join(', ')}</Text>
      </View>
      <View style={styles.vaccinationStatus}>
        <Text style={styles.vaccineDate}>{date}</Text>
        <View style={[styles.vaccineStatusBadge, { 
          backgroundColor: status === 'Completed' ? '#16A34A' : status === 'Scheduled' ? '#F59E0B' : '#DC2626'
        }]}>
          <Text style={styles.vaccineStatusText}>{status}</Text>
        </View>
      </View>
    </View>
    {notes && <Text style={styles.vaccineNotes}>{notes}</Text>}
  </View>
);

export default function Health() {
  const { state, dispatch } = useAppContext();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Form state
  const [checkType, setCheckType] = useState('');
  const [selectedFlockId, setSelectedFlockId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [healthStatus, setHealthStatus] = useState('');
  const [observations, setObservations] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [veterinaryConsultation, setVeterinaryConsultation] = useState(false);

  const checkTypeOptions = [
    { label: 'Daily Health Inspection', value: 'daily_inspection' },
    { label: 'Weight Monitoring', value: 'weight_monitoring' },
    { label: 'Respiratory Check', value: 'respiratory_check' },
    { label: 'Feed Quality Assessment', value: 'feed_quality' },
    { label: 'Behavioral Assessment', value: 'behavioral' },
    { label: 'Vaccination Check', value: 'vaccination' },
  ];

  const flockOptions = state.flocks.map(flock => ({
    label: flock.name,
    value: flock.id,
  }));

  const healthStatusOptions = [
    { label: 'Excellent', value: 'Excellent' },
    { label: 'Good', value: 'Good' },
    { label: 'Fair', value: 'Fair' },
    { label: 'Poor', value: 'Poor' },
    { label: 'Critical', value: 'Critical' },
  ];

  const handleAddHealthRecord = () => {
    if (!checkType || !selectedFlockId || !healthStatus || !observations) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      type: checkType,
      flockId: selectedFlockId,
      date: selectedDate.toLocaleDateString(),
      status: healthStatus as any,
      observations,
      actionsTaken,
      followUpRequired,
      veterinaryConsultation,
    };

    dispatch({ type: 'ADD_HEALTH_RECORD', payload: newRecord });
    
    // Reset form
    setCheckType('');
    setSelectedFlockId('');
    setHealthStatus('');
    setObservations('');
    setActionsTaken('');
    setFollowUpRequired(false);
    setVeterinaryConsultation(false);
    setSelectedDate(new Date());
    setIsModalVisible(false);
    
    Alert.alert('Success', 'Health record added successfully!');
  };

  const healthChecks = [
    {
      title: 'Daily Health Inspection',
      status: 'Good',
      lastCheck: 'Completed 2 hours ago',
      nextDue: 'Tomorrow 8:00 AM',
      priority: 'High',
    },
    {
      title: 'Weight Monitoring',
      status: 'Needs Attention',
      lastCheck: 'Last checked yesterday',
      nextDue: 'Today 2:00 PM',
      priority: 'Medium',
    },
    {
      title: 'Respiratory Check',
      status: 'Good',
      lastCheck: 'Completed this morning',
      nextDue: 'Next week',
      priority: 'Medium',
    },
    {
      title: 'Feed Quality Assessment',
      status: 'Good',
      lastCheck: '3 days ago',
      nextDue: 'Jan 25, 2025',
      priority: 'Low',
    },
  ];

  const healthMetrics = {
    overallHealth: 87,
    mortalityRate: state.flocks.reduce((sum, flock) => sum + flock.mortality, 0) / 
                   state.flocks.reduce((sum, flock) => sum + flock.totalBirds, 0) * 100,
    avgWeight: state.flocks.length > 0 
      ? Math.round(state.flocks.reduce((sum, flock) => sum + flock.avgWeight, 0) / state.flocks.length)
      : 0,
    activeAlerts: 2,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['overview', 'checks', 'vaccines'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabButtonText,
                selectedTab === tab && styles.tabButtonTextActive
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && (
          <>
            {/* Health Metrics */}
            <View style={styles.metricsSection}>
              <Text style={styles.sectionTitle}>Health Overview</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{healthMetrics.overallHealth}%</Text>
                  <Text style={styles.metricLabel}>Overall Health</Text>
                  <View style={styles.metricBar}>
                    <View style={[styles.metricProgress, { width: `${healthMetrics.overallHealth}%` }]} />
                  </View>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{healthMetrics.mortalityRate.toFixed(1)}%</Text>
                  <Text style={styles.metricLabel}>Mortality Rate</Text>
                  <Text style={styles.metricNote}>Within normal range</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{healthMetrics.avgWeight}g</Text>
                  <Text style={styles.metricLabel}>Average Weight</Text>
                  <Text style={styles.metricNote}>↑ 2% from last week</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{healthMetrics.activeAlerts}</Text>
                  <Text style={styles.metricLabel}>Active Alerts</Text>
                  <Text style={styles.metricNote}>Requires attention</Text>
                </View>
              </View>
            </View>

            {/* Recent Health Records */}
            <View style={styles.recordsSection}>
              <Text style={styles.sectionTitle}>Recent Health Records</Text>
              <View style={styles.recordsList}>
                {state.healthRecords.slice(0, 5).map((record) => {
                  const flock = state.flocks.find(f => f.id === record.flockId);
                  return (
                    <View key={record.id} style={styles.recordItem}>
                      <View style={styles.recordHeader}>
                        <Text style={styles.recordType}>{record.type.replace('_', ' ')}</Text>
                        <Text style={styles.recordDate}>{record.date}</Text>
                      </View>
                      <Text style={styles.recordFlock}>{flock?.name}</Text>
                      <Text style={[styles.recordStatus, { 
                        color: record.status === 'Excellent' ? '#16A34A' : 
                              record.status === 'Good' ? '#F59E0B' : '#DC2626' 
                      }]}>
                        Status: {record.status}
                      </Text>
                      {record.observations && (
                        <Text style={styles.recordNotes}>{record.observations}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {selectedTab === 'checks' && (
          <View style={styles.checksSection}>
            <Text style={styles.sectionTitle}>Health Checks</Text>
            {healthChecks.map((check, index) => (
              <HealthCard
                key={index}
                title={check.title}
                status={check.status}
                lastCheck={check.lastCheck}
                nextDue={check.nextDue}
                priority={check.priority}
                onPress={() => {}}
              />
            ))}
          </View>
        )}

        {selectedTab === 'vaccines' && (
          <View style={styles.vaccineSection}>
            <Text style={styles.sectionTitle}>Vaccination Schedule</Text>
            {state.vaccinations.map((vaccination) => {
              const flockNames = vaccination.flockIds.map(id => {
                const flock = state.flocks.find(f => f.id === id);
                return flock ? flock.name : 'Unknown';
              });
              
              return (
                <VaccinationItem
                  key={vaccination.id}
                  vaccine={vaccination.vaccine}
                  date={vaccination.date}
                  flocks={flockNames}
                  status={vaccination.status}
                  notes={vaccination.notes}
                />
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Add Health Record Modal */}
      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Health Check Record</Text>
            <TouchableOpacity onPress={handleAddHealthRecord}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Check Type *</Text>
              <Dropdown
                options={checkTypeOptions}
                selectedValue={checkType}
                onSelect={setCheckType}
                placeholder="Select check type"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Coop/Flock *</Text>
              <Dropdown
                options={flockOptions}
                selectedValue={selectedFlockId}
                onSelect={setSelectedFlockId}
                placeholder="Select coop"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Date & Time</Text>
              <DatePicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Health Status *</Text>
              <Dropdown
                options={healthStatusOptions}
                selectedValue={healthStatus}
                onSelect={setHealthStatus}
                placeholder="Select health status"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Observations *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Record any observations, symptoms, or concerns..."
                multiline
                numberOfLines={4}
                placeholderTextColor="#9CA3AF"
                value={observations}
                onChangeText={setObservations}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Actions Taken</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe any treatments or actions taken..."
                multiline
                numberOfLines={3}
                placeholderTextColor="#9CA3AF"
                value={actionsTaken}
                onChangeText={setActionsTaken}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Follow-up Required</Text>
              <View style={styles.followUpOptions}>
                <TouchableOpacity 
                  style={styles.followUpOption}
                  onPress={() => setFollowUpRequired(!followUpRequired)}
                >
                  <View style={[
                    styles.followUpCheckbox,
                    followUpRequired && styles.checkboxSelected
                  ]}>
                    {followUpRequired && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.followUpText}>Schedule follow-up</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.followUpOption}
                  onPress={() => setVeterinaryConsultation(!veterinaryConsultation)}
                >
                  <View style={[
                    styles.followUpCheckbox,
                    veterinaryConsultation && styles.checkboxSelected
                  ]}>
                    {veterinaryConsultation && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.followUpText}>Veterinary consultation needed</Text>
                </TouchableOpacity>
              </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabButtonTextActive: {
    color: '#16A34A',
    fontWeight: '600',
  },
  metricsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
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
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  metricBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  metricProgress: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 2,
  },
  metricNote: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  recordsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  recordsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  recordType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
  },
  recordDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  recordFlock: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  recordStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  recordNotes: {
    fontSize: 12,
    color: '#374151',
  },
  checksSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  healthCard: {
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleSection: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dueDateText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priorityIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  vaccineSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  vaccinationCard: {
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
  vaccinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  vaccineCoop: {
    fontSize: 14,
    color: '#6B7280',
  },
  vaccinationStatus: {
    alignItems: 'flex-end',
  },
  vaccineDate: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  vaccineStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vaccineStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  vaccineNotes: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    paddingTop: 8,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  followUpOptions: {
    gap: 12,
  },
  followUpOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followUpCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  followUpText: {
    fontSize: 16,
    color: '#374151',
  },
});