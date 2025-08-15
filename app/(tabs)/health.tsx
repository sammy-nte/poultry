import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const VaccinationItem = ({ vaccine, date, coop, status, notes }: any) => (
  <View style={styles.vaccinationCard}>
    <View style={styles.vaccinationHeader}>
      <View>
        <Text style={styles.vaccineName}>{vaccine}</Text>
        <Text style={styles.vaccineCoop}>{coop}</Text>
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
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const vaccinations = [
    {
      vaccine: 'Newcastle Disease',
      date: 'Jan 25, 2025',
      coop: 'All Coops',
      status: 'Scheduled',
      notes: 'Annual booster vaccination',
    },
    {
      vaccine: 'Infectious Bronchitis',
      date: 'Jan 20, 2025',
      coop: 'Coop A, B',
      status: 'Completed',
      notes: 'No adverse reactions observed',
    },
    {
      vaccine: 'Marek\'s Disease',
      date: 'Jan 15, 2025',
      coop: 'Coop C',
      status: 'Completed',
      notes: 'Young birds vaccinated successfully',
    },
    {
      vaccine: 'Fowl Pox',
      date: 'Feb 1, 2025',
      coop: 'Coop D, E',
      status: 'Scheduled',
      notes: 'Pre-laying vaccination',
    },
  ];

  const healthMetrics = {
    overallHealth: 87,
    mortalityRate: 0.8,
    avgWeight: 1850,
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
                  <Text style={styles.metricValue}>{healthMetrics.mortalityRate}%</Text>
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

            {/* Recent Alerts */}
            <View style={styles.alertsSection}>
              <Text style={styles.sectionTitle}>Recent Alerts</Text>
              <View style={styles.alertsList}>
                <View style={styles.alertItem}>
                  <View style={[styles.alertIndicator, { backgroundColor: '#F59E0B' }]} />
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>Weight Drop in Coop B</Text>
                    <Text style={styles.alertDescription}>Average weight decreased by 5% this week</Text>
                    <Text style={styles.alertTime}>2 hours ago</Text>
                  </View>
                  <Ionicons name="warning" size={20} color="#F59E0B" />
                </View>
                
                <View style={styles.alertItem}>
                  <View style={[styles.alertIndicator, { backgroundColor: '#DC2626' }]} />
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>Vaccination Due</Text>
                    <Text style={styles.alertDescription}>Newcastle Disease vaccination scheduled for tomorrow</Text>
                    <Text style={styles.alertTime}>1 day ago</Text>
                  </View>
                  <Ionicons name="medical" size={20} color="#DC2626" />
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.actionCard}>
                  <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
                  <Text style={styles.actionText}>Daily Check</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard}>
                  <Ionicons name="medical" size={24} color="#F59E0B" />
                  <Text style={styles.actionText}>Vaccination</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard}>
                  <Ionicons name="scale" size={24} color="#8B5A2B" />
                  <Text style={styles.actionText}>Weight Check</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard}>
                  <Ionicons name="warning" size={24} color="#DC2626" />
                  <Text style={styles.actionText}>Report Issue</Text>
                </TouchableOpacity>
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
            {vaccinations.map((vaccination, index) => (
              <VaccinationItem
                key={index}
                vaccine={vaccination.vaccine}
                date={vaccination.date}
                coop={vaccination.coop}
                status={vaccination.status}
                notes={vaccination.notes}
              />
            ))}
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
            <TouchableOpacity>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Check Type</Text>
              <TouchableOpacity style={styles.selectInput}>
                <Text style={styles.selectText}>Select check type</Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Coop/Flock</Text>
              <TouchableOpacity style={styles.selectInput}>
                <Text style={styles.selectText}>Select coop</Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Date & Time</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateText}>Today - 2:30 PM</Text>
                <Ionicons name="calendar" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Health Status</Text>
              <View style={styles.statusOptions}>
                {['Excellent', 'Good', 'Fair', 'Poor', 'Critical'].map((status) => (
                  <TouchableOpacity key={status} style={styles.statusOption}>
                    <View style={[styles.statusRadio, { 
                      backgroundColor: status === 'Good' ? '#16A34A' : 'transparent',
                      borderColor: status === 'Good' ? '#16A34A' : '#D1D5DB'
                    }]} />
                    <Text style={styles.statusOptionText}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Observations</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Record any observations, symptoms, or concerns..."
                multiline
                numberOfLines={4}
                placeholderTextColor="#9CA3AF"
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
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Follow-up Required</Text>
              <View style={styles.followUpOptions}>
                <TouchableOpacity style={styles.followUpOption}>
                  <View style={styles.followUpCheckbox}>
                    <Ionicons name="checkmark" size={16} color="#16A34A" />
                  </View>
                  <Text style={styles.followUpText}>Schedule follow-up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.followUpOption}>
                  <View style={[styles.followUpCheckbox, { backgroundColor: 'transparent', borderColor: '#D1D5DB' }]} />
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
  alertsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  alertsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  alertIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
  statusOptions: {
    gap: 12,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusOptionText: {
    fontSize: 16,
    color: '#374151',
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
    backgroundColor: '#16A34A',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  followUpText: {
    fontSize: 16,
    color: '#374151',
  },
});