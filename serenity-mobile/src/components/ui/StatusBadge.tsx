import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, typography } from '../../theme';

type BadgeStatus = 'upcoming' | 'confirmed' | 'pending' | 'in_progress' | 'completed' | 'cancelled' | string;

interface StatusBadgeProps {
  status: BadgeStatus;
}

function getStatusColors(status: string): { bg: string; text: string } {
  switch (status) {
    case 'upcoming':
    case 'confirmed':
      return { bg: colors.primaryBg, text: colors.primary };
    case 'pending':
      return { bg: '#fffbeb', text: '#d97706' };
    case 'in_progress':
      return { bg: '#eff6ff', text: colors.info };
    case 'completed':
      return { bg: colors.successBg, text: '#16a34a' };
    case 'cancelled':
      return { bg: colors.neutral100, text: colors.neutral500 };
    default:
      return { bg: colors.neutral100, text: colors.neutral600 };
  }
}

function formatStatus(status: string): string {
  return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { bg, text } = getStatusColors(status);

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{formatStatus(status)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.tiny,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
