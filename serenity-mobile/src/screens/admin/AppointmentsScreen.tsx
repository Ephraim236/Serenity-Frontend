import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, addDays, startOfDay } from 'date-fns';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { dashboardApi } from '../../api/client';
import { Appointment } from '../../types';
import { colors, typography, spacing, borderRadius } from '../../theme';

const DEFAULT_APPOINTMENTS: Appointment[] = [
  { _id: '1', clientName: 'Alice Freeman', service: 'Luxury Facial', time: '09:00 AM', specialist: 'Sarah J.', status: 'completed', price: '$85', email: 'alice@example.com', phone: '(555) 001-2233' },
  { _id: '2', clientName: 'John Doe', service: 'Designer Haircut', time: '10:30 AM', specialist: 'Emma W.', status: 'confirmed', price: '$65', email: 'john@example.com', phone: '(555) 001-4455' },
  { _id: '3', clientName: 'Samantha Smith', service: 'Deep Tissue', time: '11:45 AM', specialist: 'Michael C.', status: 'confirmed', price: '$120', email: 'sam@example.com', phone: '(555) 001-6677' },
  { _id: '4', clientName: 'Robert Pattinson', service: 'Hot Stone Therapy', time: '01:30 PM', specialist: 'Michael C.', status: 'pending', price: '$140', email: 'rob@example.com', phone: '(555) 001-8899' },
  { _id: '5', clientName: 'Emily Blunt', service: 'Manicure', time: '03:00 PM', specialist: 'David L.', status: 'confirmed', price: '$45', email: 'emily@example.com', phone: '(555) 002-1122' },
  { _id: '6', clientName: 'Tom Hardy', service: 'Beard Trim', time: '04:15 PM', specialist: 'Emma W.', status: 'cancelled', price: '$35', email: 'tom@example.com', phone: '(555) 002-3344' },
];

function generateCalendarDates() {
  const today = startOfDay(new Date());
  return Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));
}

export function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>(DEFAULT_APPOINTMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
  const calendarDates = generateCalendarDates();

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await dashboardApi.getTodayAppointments();
      if (data.length > 0) setAppointments(data);
    } catch {
      // Keep defaults
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await dashboardApi.updateAppointment(id, newStatus);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus as Appointment['status'] } : a))
      );
    } catch {
      Alert.alert('Error', 'Failed to update appointment');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dashboardApi.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch {
      Alert.alert('Error', 'Failed to delete appointment');
    }
  };

  const filteredAppointments = appointments.filter(
    (a) =>
      a.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.service?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: filteredAppointments.length,
    confirmed: filteredAppointments.filter((a) => a.status === 'confirmed').length,
    pending: filteredAppointments.filter((a) => a.status === 'pending').length,
    cancelled: filteredAppointments.filter((a) => a.status === 'cancelled').length,
  };

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <Card style={styles.appointmentCard}>
      <View style={styles.aptHeader}>
        <View style={styles.timeBox}>
          <Text style={styles.timeBoxLabel}>TIME</Text>
          <Text style={styles.timeBoxValue}>{item.time}</Text>
        </View>
        <View style={styles.aptClientInfo}>
          <Text style={styles.aptClientName}>{item.clientName}</Text>
          {item.email && (
            <Text style={styles.aptContact}>✉ {item.email}</Text>
          )}
          {item.phone && (
            <Text style={styles.aptContact}>📞 {item.phone}</Text>
          )}
        </View>
      </View>

      <View style={styles.aptDetails}>
        <View style={styles.aptDetailItem}>
          <Text style={styles.aptDetailLabel}>SERVICE</Text>
          <Text style={styles.aptDetailValue}>{item.service}</Text>
          {item.price && <Text style={styles.aptDetailSub}>{item.price}</Text>}
        </View>
        <View style={styles.aptDetailItem}>
          <Text style={styles.aptDetailLabel}>SPECIALIST</Text>
          <Text style={styles.aptDetailValue}>{item.specialist}</Text>
        </View>
        <View style={styles.aptDetailItem}>
          <Text style={styles.aptDetailLabel}>STATUS</Text>
          <StatusBadge status={item.status} />
        </View>
      </View>

      {(item.status === 'pending' || item.status === 'confirmed' || item.status === 'in_progress') && (
        <View style={styles.aptActions}>
          {item.status === 'pending' && (
            <>
              <TouchableOpacity
                style={styles.confirmActionBtn}
                onPress={() => handleUpdateStatus(item._id, 'confirmed')}
              >
                <Text style={styles.confirmActionText}>✓ Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelActionBtn}
                onPress={() => handleUpdateStatus(item._id, 'cancelled')}
              >
                <Text style={styles.cancelActionText}>✕ Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          {item.status === 'confirmed' && (
            <TouchableOpacity
              style={styles.cancelActionBtn}
              onPress={() => handleUpdateStatus(item._id, 'cancelled')}
            >
              <Text style={styles.cancelActionText}>✕ Cancel</Text>
            </TouchableOpacity>
          )}
          {item.status === 'in_progress' && (
            <TouchableOpacity
              style={styles.completeActionBtn}
              onPress={() => handleUpdateStatus(item._id, 'completed')}
            >
              <Text style={styles.completeActionText}>✓ Complete</Text>
            </TouchableOpacity>
          )}
          {item.status !== 'completed' && item.status !== 'cancelled' && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => setDeleteTarget(item)}
            >
              <Text style={styles.deleteBtnText}>🗑</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.calendarStrip}>
        {calendarDates.map((date) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={[styles.calDateItem, isSelected && styles.calDateItemSelected]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.calDayName, isSelected && styles.calTextSelected]}>
                {format(date, 'EEE')}
              </Text>
              <Text style={[styles.calDayNum, isSelected && styles.calTextSelected, isToday && !isSelected && styles.calDayNumToday]}>
                {format(date, 'd')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.statsRow}>
        {[
          { label: 'Total', value: stats.total, color: colors.neutral900 },
          { label: 'Confirmed', value: stats.confirmed, color: '#16a34a' },
          { label: 'Pending', value: stats.pending, color: '#d97706' },
          { label: 'Cancelled', value: stats.cancelled, color: colors.error },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search client or service..."
          placeholderTextColor={colors.neutral400}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item._id}
          renderItem={renderAppointment}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyTitle}>No appointments found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or date</Text>
            </View>
          }
        />
      )}

      <Modal
        visible={!!deleteTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteTarget(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Appointment</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to permanently delete this appointment for{' '}
              <Text style={styles.modalHighlight}>{deleteTarget?.clientName}</Text>?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setDeleteTarget(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteBtn}
                onPress={() => {
                  if (deleteTarget) {
                    handleDelete(deleteTarget._id);
                    setDeleteTarget(null);
                  }
                }}
              >
                <Text style={styles.modalDeleteText}>Yes, Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  calendarStrip: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  calDateItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: 2,
  },
  calDateItemSelected: {
    backgroundColor: colors.primary,
  },
  calDayName: {
    ...typography.tiny,
    color: colors.neutral500,
    textTransform: 'uppercase',
  },
  calDayNum: {
    ...typography.bodyBold,
    color: colors.neutral900,
  },
  calDayNumToday: {
    color: colors.primary,
  },
  calTextSelected: {
    color: colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    ...typography.h4,
    color: colors.neutral900,
  },
  statLabel: {
    ...typography.caption,
    color: colors.neutral500,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.xl,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral200,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.neutral900,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  appointmentCard: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  aptHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  timeBox: {
    width: 64,
    height: 56,
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  timeBoxLabel: {
    ...typography.tiny,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  timeBoxValue: {
    ...typography.captionBold,
    color: colors.primary,
  },
  aptClientInfo: {
    flex: 1,
    gap: 3,
  },
  aptClientName: {
    ...typography.bodyBold,
    color: colors.neutral900,
  },
  aptContact: {
    ...typography.caption,
    color: colors.neutral500,
  },
  aptDetails: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  aptDetailItem: {
    flex: 1,
    gap: 3,
  },
  aptDetailLabel: {
    ...typography.tiny,
    color: colors.neutral400,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aptDetailValue: {
    ...typography.smallBold,
    color: colors.neutral900,
  },
  aptDetailSub: {
    ...typography.caption,
    color: colors.neutral500,
  },
  aptActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
  },
  confirmActionBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#86efac',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.successBg,
  },
  confirmActionText: {
    ...typography.captionBold,
    color: '#16a34a',
  },
  cancelActionBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.errorBg,
  },
  cancelActionText: {
    ...typography.captionBold,
    color: colors.error,
  },
  completeActionBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#86efac',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.successBg,
  },
  completeActionText: {
    ...typography.captionBold,
    color: '#16a34a',
  },
  deleteBtn: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.errorBg,
    borderWidth: 1.5,
    borderColor: '#fca5a5',
  },
  deleteBtnText: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl * 2,
    gap: spacing.md,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.neutral900,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.neutral500,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: spacing.xxl,
    width: '100%',
    gap: spacing.lg,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.neutral900,
  },
  modalSubtitle: {
    ...typography.body,
    color: colors.neutral600,
    lineHeight: 24,
  },
  modalHighlight: {
    fontWeight: '700',
    color: colors.neutral900,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.neutral300,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  modalCancelText: {
    ...typography.bodyBold,
    color: colors.neutral700,
  },
  modalDeleteBtn: {
    flex: 1,
    backgroundColor: colors.error,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  modalDeleteText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
