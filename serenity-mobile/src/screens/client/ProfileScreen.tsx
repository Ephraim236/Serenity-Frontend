import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

const MENU_ITEMS = [
  { icon: '📋', label: 'Booking History', desc: 'View all past appointments' },
  { icon: '🔔', label: 'Notifications', desc: 'Manage notification preferences' },
  { icon: '🔒', label: 'Change Password', desc: 'Update your password' },
  { icon: '💳', label: 'Payment Methods', desc: 'Manage saved cards' },
  { icon: '⭐', label: 'Favorites', desc: 'Your favorite services' },
  { icon: '❓', label: 'Help & Support', desc: 'Get assistance' },
];

export function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user?.role === 'business' ? '🏢 Business' : '👤 Client'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'Total Bookings', value: '12' },
            { label: 'Completed', value: '9' },
            { label: 'Upcoming', value: '3' },
          ].map((stat) => (
            <Card key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.menuSection}>
          <Card style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <React.Fragment key={item.label}>
                <TouchableOpacity style={styles.menuItem}>
                  <View style={styles.menuIconContainer}>
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <Text style={styles.menuDesc}>{item.desc}</Text>
                  </View>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
                {index < MENU_ITEMS.length - 1 && (
                  <View style={styles.menuDivider} />
                )}
              </React.Fragment>
            ))}
          </Card>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Serenity v1.0.0</Text>
          <Text style={styles.footerSubtext}>© 2026 Serenity. All rights reserved.</Text>
        </View>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.neutral900,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    backgroundColor: colors.white,
    gap: spacing.sm,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.primaryMuted,
    marginBottom: spacing.sm,
  },
  avatarText: {
    ...typography.h1,
    color: colors.white,
  },
  userName: {
    ...typography.h3,
    color: colors.neutral900,
  },
  userEmail: {
    ...typography.small,
    color: colors.neutral500,
  },
  roleBadge: {
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  roleText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    ...typography.h2,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.neutral500,
    textAlign: 'center',
  },
  menuSection: {
    paddingHorizontal: spacing.xl,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: colors.neutral50,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 22,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    ...typography.bodyMedium,
    color: colors.neutral900,
  },
  menuDesc: {
    ...typography.caption,
    color: colors.neutral500,
  },
  menuArrow: {
    fontSize: 22,
    color: colors.neutral300,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.neutral50,
    marginLeft: spacing.xl + 44 + spacing.lg,
  },
  logoutSection: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: '#fef2f2',
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.xl,
    borderWidth: 1.5,
    borderColor: '#fecaca',
  },
  logoutIcon: {
    fontSize: 22,
  },
  logoutText: {
    ...typography.bodyBold,
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.xxxl,
    gap: spacing.xs,
  },
  footerText: {
    ...typography.captionBold,
    color: colors.neutral400,
  },
  footerSubtext: {
    ...typography.caption,
    color: colors.neutral300,
  },
});
