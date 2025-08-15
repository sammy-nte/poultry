import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '@/contexts/AppContext';

const DashboardCard = ({ title, value, subtitle, icon, color, onPress }: any) => (
  <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
    <View style={styles.cardHeader}>
      <View style={styles.cardTitleContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.cardValue}>{value}</Text>
  </TouchableOpacity>
);

const AlertItem = ({ type, message, time }: any) => (
  <View style={styles.alertItem}>
    <View style={[styles.alertIndicator, { 
      backgroundColor: type === 'warning' ? '#F59E0B' : type === 'error' ? '#DC2626' : '#16A34A' 
    }]} />
    <View style={styles.alertContent}>
      <Text style={styles.alertMessage}>{message}</Text>
      <Text style={styles.alertTime}>{time}</Text>
    </View>
    <Ionicons 
      name={type === 'warning' ? 'warning' : type === 'error' ? 'alert-circle' : 'checkmark-circle'} 
      size={20} 
      color={type === 'warning' ? '#F59E0B' : type === 'error' ? '#DC2626' : '#16A34A'} 
    />
  </View>
);

export default function Dashboard() {
  const { state } = useAppContext();

  // Calculate dynamic stats
  const totalBirds = state.flocks.reduce((sum, flock) => sum + flock.totalBirds, 0);
  const todayEggs = state.eggProduction.length > 0 ? state.eggProduction[0].eggs : 0;
  const totalFeedStock = state.feedInventory.reduce((sum, feed) => sum + feed.currentStock, 0);
  const monthlyRevenue = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const avgProduction = state.flocks.length > 0 
    ? state.flocks.reduce((sum, flock) => sum + flock.eggProduction, 0) / state.flocks.length
    : 0;
  
  const mortalityRate = totalBirds > 0 
    ? (state.flocks.reduce((sum, flock) => sum + flock.mortality, 0) / totalBirds) * 100
    : 0;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.farmName}>Green Valley Poultry Farm</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#374151" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Overview</Text>
          <View style={styles.statsGrid}>
            <DashboardCard
              title="Total Birds"
              value={totalBirds.toLocaleString()}
              subtitle={`Across ${state.flocks.length} coops`}
              icon="leaf"
              color="#16A34A"
            />
            <DashboardCard
              title="Today's Eggs"
              value={todayEggs.toLocaleString()}
              subtitle="↑ 3% from yesterday"
              icon="egg"
              color="#F59E0B"
            />
            <DashboardCard
              title="Feed Stock"
              value={`${totalFeedStock} kg`}
              subtitle="7 days remaining"
              icon="nutrition"
              color="#8B5A2B"
            />
            <DashboardCard
              title="Revenue (Month)"
              value={`$${monthlyRevenue.toLocaleString()}`}
              subtitle="↑ 15% from last month"
              icon="wallet"
              color="#059669"
            />
          </View>
        </View>

        {/* Production Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Performance</Text>
          <View style={styles.trendCard}>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>Egg Production Rate</Text>
              <Text style={styles.trendValue}>{avgProduction.toFixed(1)}%</Text>
              <View style={styles.trendBar}>
                <View style={[styles.trendProgress, { width: `${avgProduction}%` }]} />
              </View>
            </View>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>Feed Conversion Ratio</Text>
              <Text style={styles.trendValue}>2.1:1</Text>
              <View style={styles.trendBar}>
                <View style={[styles.trendProgress, { width: '78%', backgroundColor: '#F59E0B' }]} />
              </View>
            </View>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>Mortality Rate</Text>
              <Text style={styles.trendValue}>{mortalityRate.toFixed(1)}%</Text>
              <View style={styles.trendBar}>
                <View style={[styles.trendProgress, { width: `${Math.min(mortalityRate * 10, 100)}%`, backgroundColor: '#DC2626' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <View style={styles.alertsContainer}>
            <AlertItem
              type="warning"
              message="Coop 3 feed level below 20%"
              time="2 hours ago"
            />
            <AlertItem
              type="success"
              message="Vaccination completed for Coop 1"
              time="5 hours ago"
            />
            <AlertItem
              type="error"
              message="Temperature alert in Coop 2"
              time="1 day ago"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add-circle" size={20} color="#16A34A" />
              <Text style={styles.actionButtonText}>Record Eggs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="medical" size={20} color="#F59E0B" />
              <Text style={styles.actionButtonText}>Health Check</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="nutrition" size={20} color="#8B5A2B" />
              <Text style={styles.actionButtonText}>Feed Stock</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="stats-chart" size={20} color="#059669" />
              <Text style={styles.actionButtonText}>View Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  farmName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    width: '48%',
    borderLeftWidth: 4,
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
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trendItem: {
    marginBottom: 20,
  },
  trendLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  trendValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  trendBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  trendProgress: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 3,
  },
  alertsContainer: {
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
  alertMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
});