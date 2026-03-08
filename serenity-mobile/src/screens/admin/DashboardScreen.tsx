import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { dashboardApi } from '../../api/client';
import { DashboardStats, Appointment, StaffMember, RevenueData } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { colors, typography, spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

const DEFAULT_STATS: DashboardStats = {
  totalRevenue: '12,840',
  totalAppointments: 156,
  activeClients: 842,
  todayAppointments: 12,
  growth: 12.5,
};

const DEFAULT_REVENUE: RevenueData[] = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 6890 },
  { name: 'Sat', revenue: 8390 },
  { name: 'Sun', revenue: 4490 },
];

const DEFAULT_STAFF: StaffMember[] = [
  { name: 'Sarah J.', role: 'Skin', value: 85 },
  { name: 'Michael C.', role: 'Massage', value: 65 },
  { name: 'Emma W.', role: 'Hair', value: 92 },
  { name: 'David L.', role: 'Nails', value: 45 },
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  { _id: '1', clientName: 'Jessica Reed', service: 'Luxury Facial', time: '10:30 AM', status: 'confirmed', specialist: 'Sarah J.' },
  { _id: '2', clientName: 'Marcus Smith', service: 'Deep Tissue', time: '12:00 PM', status: 'pending', specialist: 'Michael C.' },
  { _id: '3', clientName: 'Elena Gilbert', service: 'Designer Haircut', time: '02:15 PM', status: 'in_progress', specialist: 'Emma W.' },
];

const STAT_CARDS = [
  { key: 'revenue', icon: '💵', label: 'Total Revenue', color: '#22c55e', bgColor: '#f0fdf4' },
  { key: 'appointments', icon: '📅', label: 'Bookings', color: colors.primary, bgColor: colors.primaryBg },
  { key: 'clients', icon: '👥', label: 'Active Clients', color: '#3b82f6', bgColor: '#eff6ff' },
  { key: 'today', icon: '📊', label: "Today's Apts", color: '#8b5cf6', bgColor: '#f5f3ff' },
];

function SimpleBarChart({ data }: { data: RevenueData[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const chartWidth = width - spacing.xl * 2 - spacing.xxl * 2;
  const barWidth = chartWidth / data.length - 6;

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.barsContainer}>
        {data.map((item) => {
          const barHeight = (item.revenue / maxRevenue) * 160;
          return (
            <View key={item.name} style={chartStyles.barWrapper}>
              <Text style={chartStyles.barValue}>
                ${Math.round(item.revenue / 1000)}k
              </Text>
              <View style={[chartStyles.bar, { height: barHeight, width: barWidth }]}>
                <View style={chartStyles.barFill} />
              </View>
              <Text style={chartStyles.barLabel}>{item.name}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    height: 220,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
    paddingTop: spacing.xxl,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  bar: {
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    opacity: 0.85,
  },
  barValue: {
    ...typography.tiny,
    color: colors.neutral500,
  },
  barLabel: {
    ...typography.tiny,
    color: colors.neutral500,
  },
});

export function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [revenueData, setRevenueData] = useState<RevenueData[]>(DEFAULT_REVENUE);
  const [staff, setStaff] = useState<StaffMember[]>(DEFAULT_STAFF);
  const [appointments, setAppointments] = useState<Appointment[]>(DEFAULT_APPOINTMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('7');

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsData, revData, staffData] = await Promise.allSettled([
        dashboardApi.getStats(),
        dashboardApi.getRevenue(period),
        dashboardApi.getStaff(),
      ]);

      if (statsData.status === 'fulfilled') {
        setStats(statsData.value.stats);
        if (statsData.value.recentAppointments?.length) {
          setAppointments(statsData.value.recentAppointments as Appointment[]);
        }
      }
      if (revData.status === 'fulfilled' && revData.value.length) {
        setRevenueData(revData.value);
      }
      if (staffData.status === 'fulfilled' && staffData.value.length) {
        setStaff(staffData.value);
      }
    } catch {
      // Keep defaults on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await dashboardApi.updateAppointment(id, newStatus);
      setAppointments(appointments.map((a) => (a._id === id ? { ...a, status: newStatus as Appointment['status'] } : a)));
    } catch {
      // fail silently
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(',', '')) : value;
    if (isNaN(num)) return `$${value}`;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getStatValue = (key: string) => {
    switch (key) {
      case 'revenue': return formatCurrency(stats.totalRevenue);
      case 'appointments': return stats.totalAppointments.toString();
      case 'clients': return stats.activeClients.toString();
      case 'today': return stats.todayAppointments.toString();
      default: return '—';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <Text style={styles.welcomeText}>Business Overview</Text>
          <Text style={styles.welcomeSubtext}>Welcome back! 👋</Text>
        </View>

        <View style={styles.statsGrid}>
          {STAT_CARDS.map((stat) => (
            <Card key={stat.key} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: stat.bgColor }]}>
                  <Text style={styles.statIconText}>{stat.icon}</Text>
                </View>
                <View style={[styles.growthBadge]}>
                  <Text style={styles.growthText}>+{(stats.growth / (stat.key === 'revenue' ? 1 : stat.key === 'appointments' ? 2 : stat.key === 'clients' ? 3 : 4)).toFixed(1)}%</Text>
                </View>
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{getStatValue(stat.key)}</Text>
            </Card>
          ))}
        </View>

        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Revenue Analytics</Text>
            <View style={styles.periodSelector}>
              {[
                { label: '7D', value: '7' },
                { label: '30D', value: '30' },
                { label: 'Year', value: '365' },
              ].map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[styles.periodBtn, period === p.value && styles.periodBtnActive]}
                  onPress={() => setPeriod(p.value)}
                >
                  <Text style={[styles.periodBtnText, period === p.value && styles.periodBtnTextActive]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <SimpleBarChart data={revenueData} />
        </Card>

        <Card style={styles.staffCard}>
          <Text style={styles.sectionTitle}>Staff Utilization</Text>
          <View style={styles.staffList}>
            {staff.map((member) => (
              <View key={member.name} style={styles.staffItem}>
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>{member.name}</Text>
                  <Text style={styles.staffRole}>{member.role}</Text>
                </View>
                <View style={styles.staffBarContainer}>
                  <View style={styles.staffBarBg}>
                    <View
                      style={[
                        styles.staffBarFill,
                        {
                          width: `${member.value}%` as `${number}%`,
                          backgroundColor:
                            member.value >= 80
                              ? colors.primary
                              : member.value >= 60
                              ? '#3b82f6'
                              : '#10b981',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.staffPercent}>{member.value}%</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.appointmentsCard}>
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          <View style={styles.appointmentsList}>
            {appointments.map((apt) => (
              <View key={apt._id} style={styles.appointmentItem}>
                <View style={styles.aptAvatar}>
                  <Text style={styles.aptAvatarText}>{apt.clientName.charAt(0)}</Text>
                </View>
                <View style={styles.aptDetails}>
                  <Text style={styles.aptClientName}>{apt.clientName}</Text>
                  <Text style={styles.aptServiceInfo}>{apt.service} · {apt.time}</Text>
                </View>
                <View style={styles.aptRight}>
                  <StatusBadge status={apt.status} />
                  {apt.status === 'pending' && (
                    <View style={styles.aptActions}>
                      <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={() => handleUpdateStatus(apt._id, 'confirmed')}
                      >
                        <Text style={styles.confirmBtnText}>✓</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => handleUpdateStatus(apt._id, 'cancelled')}
                      >
                        <Text style={styles.rejectBtnText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  topSection: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  welcomeText: {
    ...typography.h2,
    color: colors.neutral900,
  },
  welcomeSubtext: {
    ...typography.body,
    color: colors.neutral500,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    width: (width - spacing.xl * 2 - spacing.md) / 2,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconText: {
    fontSize: 22,
  },
  growthBadge: {
    backgroundColor: '#f0fdf4',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  growthText: {
    ...typography.tiny,
    color: '#16a34a',
    fontWeight: '700',
  },
  statLabel: {
    ...typography.caption,
    color: colors.neutral500,
  },
  statValue: {
    ...typography.h3,
    color: colors.neutral900,
  },
  chartCard: {
    marginHorizontal: spacing.xl,
    padding: spacing.xxl,
    marginBottom: spacing.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  chartTitle: {
    ...typography.h4,
    color: colors.neutral900,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.neutral100,
    borderRadius: borderRadius.lg,
    padding: 3,
    gap: 2,
  },
  periodBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  periodBtnActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  periodBtnText: {
    ...typography.captionBold,
    color: colors.neutral500,
  },
  periodBtnTextActive: {
    color: colors.primary,
  },
  staffCard: {
    marginHorizontal: spacing.xl,
    padding: spacing.xxl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.neutral900,
    marginBottom: spacing.lg,
  },
  staffList: {
    gap: spacing.lg,
  },
  staffItem: {
    gap: spacing.sm,
  },
  staffInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  staffName: {
    ...typography.smallBold,
    color: colors.neutral900,
  },
  staffRole: {
    ...typography.caption,
    color: colors.neutral500,
  },
  staffBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  staffBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.neutral100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  staffBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  staffPercent: {
    ...typography.captionBold,
    color: colors.neutral500,
    width: 36,
    textAlign: 'right',
  },
  appointmentsCard: {
    marginHorizontal: spacing.xl,
    padding: spacing.xxl,
    marginBottom: spacing.md,
  },
  appointmentsList: {
    gap: spacing.lg,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  aptAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aptAvatarText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  aptDetails: {
    flex: 1,
  },
  aptClientName: {
    ...typography.bodyBold,
    color: colors.neutral900,
  },
  aptServiceInfo: {
    ...typography.caption,
    color: colors.neutral500,
    marginTop: 2,
  },
  aptRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  aptActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  confirmBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    ...typography.smallBold,
    color: '#16a34a',
  },
  rejectBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: {
    ...typography.smallBold,
    color: colors.error,
  },
  bottomPad: {
    height: spacing.xl,
  },
});
