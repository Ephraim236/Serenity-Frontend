import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, addDays, startOfDay, isBefore } from 'date-fns';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

const { width } = Dimensions.get('window');

const SERVICES = [
  { id: 's1', name: 'Luxury Facial', category: 'Skin', price: '$85', duration: '60 min', icon: '✨' },
  { id: 's2', name: 'Deep Tissue Massage', category: 'Massage', price: '$120', duration: '90 min', icon: '💆' },
  { id: 's3', name: 'Designer Haircut', category: 'Hair', price: '$65', duration: '45 min', icon: '✂' },
  { id: 's4', name: 'Manicure & Pedicure', category: 'Nails', price: '$75', duration: '75 min', icon: '💅' },
  { id: 's5', name: 'Hot Stone Therapy', category: 'Massage', price: '$140', duration: '90 min', icon: '🪨' },
];

const SPECIALISTS = [
  { id: 't1', name: 'Sarah Johnson', role: 'Lead Esthetician', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', specialty: 'Skin' },
  { id: 't2', name: 'Michael Chen', role: 'Massage Therapist', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', specialty: 'Massage' },
  { id: 't3', name: 'Emma Wilson', role: 'Senior Stylist', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', specialty: 'Hair' },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM',
];

function generateDates() {
  const today = startOfDay(new Date());
  return Array.from({ length: 14 }, (_, i) => addDays(today, i)).filter(
    (d) => d.getDay() !== 0
  );
}

interface Service { id: string; name: string; category: string; price: string; duration: string; icon: string }
interface Specialist { id: string; name: string; role: string; image: string; specialty: string }

export function BookingScreen() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const dates = generateDates();

  const handleConfirm = () => {
    if (!selectedTime) {
      Alert.alert('Select Time', 'Please choose a time slot');
      return;
    }
    setConfirmed(true);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedSpecialist(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setConfirmed(false);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
            {step > s ? (
              <Text style={styles.stepCheckmark}>✓</Text>
            ) : (
              <Text style={[styles.stepNumber, step >= s && styles.stepNumberActive]}>{s}</Text>
            )}
          </View>
          {s < 3 && (
            <View style={[styles.stepLine, step > s && styles.stepLineActive]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  if (step === 4 && confirmed) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.confirmationContent}>
          <View style={styles.confirmationIcon}>
            <Text style={styles.confirmationEmoji}>🎉</Text>
          </View>
          <Text style={styles.confirmationTitle}>You're All Set!</Text>
          <Text style={styles.confirmationSubtitle}>
            Your appointment has been confirmed
          </Text>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service</Text>
              <Text style={styles.summaryValue}>{selectedService?.name}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Specialist</Text>
              <Text style={styles.summaryValue}>{selectedSpecialist?.name}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={[styles.summaryValue, styles.totalPrice]}>{selectedService?.price}</Text>
            </View>
          </Card>

          <View style={styles.bookingId}>
            <Text style={styles.bookingIdLabel}>Booking ID</Text>
            <Text style={styles.bookingIdValue}>#SPA-{Math.floor(Math.random() * 90000 + 10000)}</Text>
          </View>

          <Button onPress={handleReset} fullWidth size="lg" style={styles.doneButton}>
            Book Another
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        {step > 1 && (
          <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        )}
      </View>

      {renderProgressBar()}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select a Service</Text>
            <Text style={styles.stepSubtitle}>Choose the treatment you'd like to book</Text>

            <View style={styles.servicesList}>
              {SERVICES.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceItem,
                    selectedService?.id === service.id && styles.serviceItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedService(service);
                    setStep(2);
                  }}
                >
                  <View style={styles.serviceIconContainer}>
                    <Text style={styles.serviceIcon}>{service.icon}</Text>
                  </View>
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceMeta}>{service.duration} · {service.category}</Text>
                  </View>
                  <Text style={styles.servicePrice}>{service.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Choose Specialist</Text>
            <Text style={styles.stepSubtitle}>Select a professional for your {selectedService?.name}</Text>

            <View style={styles.specialistsList}>
              <TouchableOpacity
                style={[
                  styles.specialistCard,
                  selectedSpecialist?.id === 'any' && styles.specialistCardSelected,
                ]}
                onPress={() => {
                  setSelectedSpecialist({ id: 'any', name: 'Any Professional', role: 'Best available', image: '', specialty: '' });
                  setStep(3);
                }}
              >
                <View style={styles.anyAvatar}>
                  <Text style={styles.anyAvatarIcon}>👤</Text>
                </View>
                <Text style={styles.specialistName}>Any Professional</Text>
                <Text style={styles.specialistRole}>Find the best available slot</Text>
              </TouchableOpacity>

              {SPECIALISTS.map((specialist) => (
                <TouchableOpacity
                  key={specialist.id}
                  style={[
                    styles.specialistCard,
                    selectedSpecialist?.id === specialist.id && styles.specialistCardSelected,
                  ]}
                  onPress={() => {
                    setSelectedSpecialist(specialist);
                    setStep(3);
                  }}
                >
                  <Image
                    source={{ uri: specialist.image }}
                    style={styles.specialistImage}
                  />
                  <Text style={styles.specialistName}>{specialist.name}</Text>
                  <Text style={styles.specialistRole}>{specialist.role}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Pick Date & Time</Text>
            <Text style={styles.stepSubtitle}>When would you like to come in?</Text>

            <Text style={styles.fieldLabel}>📅 Select Date</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateScroll}
            >
              {dates.map((date) => (
                <TouchableOpacity
                  key={date.toISOString()}
                  style={[
                    styles.dateChip,
                    selectedDate?.toDateString() === date.toDateString() && styles.dateChipSelected,
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[
                    styles.dateDayName,
                    selectedDate?.toDateString() === date.toDateString() && styles.dateTextSelected,
                  ]}>
                    {format(date, 'EEE')}
                  </Text>
                  <Text style={[
                    styles.dateDayNum,
                    selectedDate?.toDateString() === date.toDateString() && styles.dateTextSelected,
                  ]}>
                    {format(date, 'd')}
                  </Text>
                  <Text style={[
                    styles.dateMonth,
                    selectedDate?.toDateString() === date.toDateString() && styles.dateTextSelected,
                  ]}>
                    {format(date, 'MMM')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>🕐 Available Time Slots</Text>
            <View style={styles.timeSlotsGrid}>
              {TIME_SLOTS.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotSelected,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected,
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              onPress={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              fullWidth
              size="lg"
              style={styles.confirmButton}
            >
              Confirm Booking →
            </Button>
          </View>
        )}
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.neutral900,
  },
  backBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  backBtnText: {
    ...typography.smallMedium,
    color: colors.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxxl,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  stepCheckmark: {
    ...typography.bodyBold,
    color: colors.white,
  },
  stepNumber: {
    ...typography.bodyBold,
    color: colors.neutral500,
  },
  stepNumberActive: {
    color: colors.white,
  },
  stepLine: {
    flex: 1,
    height: 3,
    backgroundColor: colors.neutral200,
    marginHorizontal: spacing.sm,
    borderRadius: 2,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  stepContainer: {
    gap: spacing.xl,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.neutral900,
    textAlign: 'center',
  },
  stepSubtitle: {
    ...typography.bodyMedium,
    color: colors.neutral500,
    textAlign: 'center',
    marginTop: -spacing.md,
  },
  servicesList: {
    gap: spacing.md,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: spacing.lg,
    ...shadows.sm,
  },
  serviceItemSelected: {
    borderColor: colors.primary,
  },
  serviceIconContainer: {
    width: 52,
    height: 52,
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    ...typography.bodyBold,
    color: colors.neutral900,
  },
  serviceMeta: {
    ...typography.small,
    color: colors.neutral500,
    marginTop: 2,
  },
  servicePrice: {
    ...typography.h4,
    color: colors.primary,
  },
  specialistsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  specialistCard: {
    width: (width - spacing.xl * 2 - spacing.md) / 2,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: spacing.sm,
    ...shadows.sm,
  },
  specialistCardSelected: {
    borderColor: colors.primary,
  },
  anyAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anyAvatarIcon: {
    fontSize: 36,
  },
  specialistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primaryMuted,
  },
  specialistName: {
    ...typography.smallBold,
    color: colors.neutral900,
    textAlign: 'center',
  },
  specialistRole: {
    ...typography.caption,
    color: colors.neutral500,
    textAlign: 'center',
  },
  fieldLabel: {
    ...typography.bodyBold,
    color: colors.neutral900,
  },
  dateScroll: {
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  dateChip: {
    width: 64,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 2,
    ...shadows.sm,
  },
  dateChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateDayName: {
    ...typography.caption,
    color: colors.neutral500,
    textTransform: 'uppercase',
  },
  dateDayNum: {
    ...typography.h3,
    color: colors.neutral900,
  },
  dateMonth: {
    ...typography.caption,
    color: colors.neutral500,
  },
  dateTextSelected: {
    color: colors.white,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  timeSlot: {
    width: (width - spacing.xl * 2 - spacing.md * 3) / 4,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.neutral200,
    ...shadows.sm,
  },
  timeSlotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    ...typography.captionBold,
    color: colors.neutral600,
  },
  timeSlotTextSelected: {
    color: colors.white,
  },
  confirmButton: {
    marginTop: spacing.lg,
  },
  confirmationContent: {
    flexGrow: 1,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xl,
    paddingTop: spacing.xxxl * 2,
  },
  confirmationIcon: {
    width: 100,
    height: 100,
    backgroundColor: '#dcfce7',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationEmoji: {
    fontSize: 48,
  },
  confirmationTitle: {
    ...typography.h1,
    color: colors.neutral900,
    textAlign: 'center',
  },
  confirmationSubtitle: {
    ...typography.body,
    color: colors.neutral500,
    textAlign: 'center',
    marginTop: -spacing.md,
  },
  summaryCard: {
    width: '100%',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.small,
    color: colors.neutral500,
  },
  summaryValue: {
    ...typography.smallBold,
    color: colors.neutral900,
  },
  totalPrice: {
    ...typography.bodyBold,
    color: colors.primary,
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral100,
  },
  bookingId: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.neutral50,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.neutral300,
  },
  bookingIdLabel: {
    ...typography.small,
    color: colors.neutral500,
  },
  bookingIdValue: {
    ...typography.bodyBold,
    color: colors.neutral900,
    fontVariant: ['tabular-nums'],
  },
  doneButton: {
    width: '100%',
    marginTop: spacing.sm,
  },
});
