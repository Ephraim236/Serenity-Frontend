import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ClientTabParamList, Booking } from '../../types';
import { colors, typography, spacing, borderRadius } from '../../theme';

type NavigationProp = BottomTabNavigationProp<ClientTabParamList>;

const MY_BOOKINGS: Booking[] = [
  {
    id: 'BK-9912',
    service: 'Luxury Facial',
    date: 'March 15, 2026',
    time: '10:30 AM',
    specialist: 'Sarah J.',
    status: 'upcoming',
    price: '$85',
    location: 'Downtown Serenity Spa',
  },
  {
    id: 'BK-8821',
    service: 'Designer Haircut',
    date: 'February 10, 2026',
    time: '02:15 PM',
    specialist: 'Emma W.',
    status: 'completed',
    price: '$65',
    location: 'Downtown Serenity Spa',
  },
  {
    id: 'BK-7712',
    service: 'Swedish Massage',
    date: 'January 22, 2026',
    time: '11:00 AM',
    specialist: 'Michael C.',
    status: 'cancelled',
    price: '$95',
    location: 'Uptown Serenity Express',
  },
];

function getStatusBarColor(status: string) {
  switch (status) {
    case 'upcoming': return colors.primary;
    case 'completed': return '#22c55e';
    case 'cancelled': return colors.neutral300;
    default: return colors.neutral300;
  }
}

export function MyBookingsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleCancel = (id: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'Keep', style: 'cancel' },
        { text: 'Cancel Booking', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <Card style={styles.bookingCard}>
      <View style={[styles.statusStripe, { backgroundColor: getStatusBarColor(item.status) }]} />
      <View style={styles.bookingContent}>
        <View style={styles.bookingHeader}>
          <StatusBadge status={item.status} />
          <Text style={styles.bookingId}>#{item.id}</Text>
        </View>

        <Text style={styles.serviceName}>{item.service}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={styles.metaText}>{item.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🕐</Text>
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>✂</Text>
            <Text style={styles.metaText}>{item.specialist}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📍</Text>
            <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>

        <View style={styles.bookingFooter}>
          <View>
            <Text style={styles.totalLabel}>TOTAL PAID</Text>
            <Text style={styles.totalPrice}>{item.price}</Text>
          </View>

          <View style={styles.actions}>
            {item.status === 'upcoming' && (
              <>
                <TouchableOpacity style={styles.rescheduleBtn}>
                  <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => handleCancel(item.id)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
            {item.status === 'completed' && (
              <TouchableOpacity
                style={styles.rebookBtn}
                onPress={() => navigation.navigate('Book')}
              >
                <Text style={styles.rebookBtnText}>🔄 Rebook</Text>
              </TouchableOpacity>
            )}
            {item.status === 'cancelled' && (
              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View Details</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Bookings</Text>
          <Text style={styles.subtitle}>Track and manage your appointments</Text>
        </View>
        <TouchableOpacity
          style={styles.newBookingBtn}
          onPress={() => navigation.navigate('Book')}
        >
          <Text style={styles.newBookingBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MY_BOOKINGS}
        keyExtractor={(item) => item.id}
        renderItem={renderBooking}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.supportBanner}>
            <View>
              <Text style={styles.supportTitle}>Need help? 💬</Text>
              <Text style={styles.supportSubtitle}>
                Our team is available 24/7 to assist you
              </Text>
            </View>
            <TouchableOpacity style={styles.supportBtn}>
              <Text style={styles.supportBtnText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  title: {
    ...typography.h2,
    color: colors.neutral900,
  },
  subtitle: {
    ...typography.small,
    color: colors.neutral500,
  },
  newBookingBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  newBookingBtnText: {
    ...typography.smallBold,
    color: colors.white,
  },
  listContent: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  bookingCard: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
  },
  statusStripe: {
    width: 5,
    borderTopLeftRadius: borderRadius.xxl,
    borderBottomLeftRadius: borderRadius.xxl,
  },
  bookingContent: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingId: {
    ...typography.caption,
    color: colors.neutral400,
    fontVariant: ['tabular-nums'],
  },
  serviceName: {
    ...typography.h3,
    color: colors.neutral900,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  metaIcon: {
    fontSize: 13,
  },
  metaText: {
    ...typography.caption,
    color: colors.neutral600,
    flex: 1,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral50,
  },
  totalLabel: {
    ...typography.tiny,
    color: colors.neutral400,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  totalPrice: {
    ...typography.h3,
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rescheduleBtn: {
    borderWidth: 1.5,
    borderColor: colors.neutral300,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rescheduleBtnText: {
    ...typography.captionBold,
    color: colors.neutral700,
  },
  cancelBtn: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancelBtnText: {
    ...typography.captionBold,
    color: colors.error,
  },
  rebookBtn: {
    backgroundColor: colors.neutral900,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  rebookBtnText: {
    ...typography.captionBold,
    color: colors.white,
  },
  viewBtn: {
    borderWidth: 1.5,
    borderColor: colors.neutral300,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  viewBtnText: {
    ...typography.captionBold,
    color: colors.neutral600,
  },
  supportBanner: {
    backgroundColor: colors.primaryBg,
    borderRadius: 28,
    padding: spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  supportTitle: {
    ...typography.bodyBold,
    color: '#3730a3',
    marginBottom: 2,
  },
  supportSubtitle: {
    ...typography.caption,
    color: '#4f46e5',
    maxWidth: 180,
  },
  supportBtn: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  supportBtnText: {
    ...typography.captionBold,
    color: colors.primary,
  },
});
