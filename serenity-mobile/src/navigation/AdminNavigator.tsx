import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { DashboardScreen } from '../screens/admin/DashboardScreen';
import { AppointmentsScreen } from '../screens/admin/AppointmentsScreen';
import { ServicesScreen } from '../screens/admin/ServicesScreen';
import { AdminDrawerParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing, borderRadius } from '../theme';

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>✂</Text>
          </View>
          <Text style={styles.brandName}>Serenity</Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name || 'Admin'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>Business</Text>
            </View>
          </View>
        </View>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export function AdminNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.neutral900,
        headerTitleStyle: { ...typography.h4 },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.neutral500,
        drawerActiveBackgroundColor: colors.primaryBg,
        drawerStyle: { width: 280 },
        drawerLabelStyle: { ...typography.bodyMedium },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          drawerIcon: () => <Text style={{ fontSize: 18 }}>📊</Text>,
        }}
      />
      <Drawer.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{
          title: 'Appointments',
          drawerIcon: () => <Text style={{ fontSize: 18 }}>📅</Text>,
        }}
      />
      <Drawer.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          title: 'Services',
          drawerIcon: () => <Text style={{ fontSize: 18 }}>⚙️</Text>,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  drawerHeader: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    gap: spacing.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
    color: colors.white,
  },
  brandName: {
    ...typography.h3,
    color: colors.white,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    ...typography.h4,
    color: colors.white,
  },
  userDetails: {
    flex: 1,
    gap: 2,
  },
  userName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  userEmail: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  roleText: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  drawerContent: {
    paddingTop: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
    marginBottom: spacing.md,
  },
  logoutIcon: {
    fontSize: 20,
  },
  logoutText: {
    ...typography.bodyMedium,
    color: colors.error,
  },
});
