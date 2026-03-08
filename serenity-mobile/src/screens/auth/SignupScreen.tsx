import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/client';
import { AuthStackParamList, User } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { colors, typography, spacing, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export function SignupScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [role, setRole] = useState<'client' | 'business'>('client');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');

  const handleNext = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (role === 'business') {
      setStep(2);
    } else {
      handleSignup();
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const data: Parameters<typeof authApi.register>[0] = {
        name,
        email,
        password,
        role,
        ...(role === 'business' && {
          businessName: businessName || name,
          businessEmail: businessEmail || email,
          businessPhone,
        }),
      };

      const response = await authApi.register(data);
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role as 'client' | 'business',
      };
      await login(user, response.token);
    } catch (error) {
      Alert.alert('Signup Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backButton} onPress={() => {
            if (step > 1) setStep(step - 1);
            else navigation.goBack();
          }}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>✂</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Serenity today</Text>
          </View>

          <View style={styles.card}>
            {step === 1 && (
              <>
                <View style={styles.roleSwitcher}>
                  {(['client', 'business'] as const).map((r) => (
                    <TouchableOpacity
                      key={r}
                      onPress={() => setRole(r)}
                      style={[styles.roleButton, role === r && styles.roleButtonActive]}
                    >
                      <Text style={[styles.roleButtonText, role === r && styles.roleButtonTextActive]}>
                        {r === 'client' ? '👤 Client' : '🏢 Business'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.form}>
                  <Input
                    label="Full Name"
                    placeholder="Your full name"
                    value={name}
                    onChangeText={setName}
                    autoComplete="name"
                    leftIcon={<Text style={styles.inputIcon}>👤</Text>}
                  />
                  <Input
                    label="Email Address"
                    placeholder="name@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    leftIcon={<Text style={styles.inputIcon}>✉</Text>}
                  />
                  <Input
                    label="Password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
                  />

                  <Button
                    onPress={handleNext}
                    loading={isLoading && role === 'client'}
                    disabled={isLoading}
                    fullWidth
                    size="lg"
                    style={styles.actionButton}
                  >
                    {role === 'business' ? 'Next →' : 'Create Account →'}
                  </Button>
                </View>
              </>
            )}

            {step === 2 && role === 'business' && (
              <>
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepText}>Business Details (Step 2/2)</Text>
                </View>

                <View style={styles.form}>
                  <Input
                    label="Business Name"
                    placeholder="Your salon or spa name"
                    value={businessName}
                    onChangeText={setBusinessName}
                    leftIcon={<Text style={styles.inputIcon}>🏢</Text>}
                  />
                  <Input
                    label="Business Email"
                    placeholder="business@example.com"
                    value={businessEmail}
                    onChangeText={setBusinessEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={<Text style={styles.inputIcon}>✉</Text>}
                  />
                  <Input
                    label="Business Phone"
                    placeholder="+1 (555) 000-0000"
                    value={businessPhone}
                    onChangeText={setBusinessPhone}
                    keyboardType="phone-pad"
                    leftIcon={<Text style={styles.inputIcon}>📞</Text>}
                  />

                  <Button
                    onPress={handleSignup}
                    loading={isLoading}
                    disabled={isLoading}
                    fullWidth
                    size="lg"
                    style={styles.actionButton}
                  >
                    Create Business Account →
                  </Button>
                </View>
              </>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
  },
  backText: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.8)',
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoContainer: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoIcon: {
    fontSize: 30,
    color: colors.white,
  },
  title: {
    ...typography.h2,
    color: colors.white,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.75)',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: spacing.xxl,
    gap: spacing.xl,
  },
  roleSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.neutral100,
    borderRadius: borderRadius.xl,
    padding: 4,
    gap: 4,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roleButtonText: {
    ...typography.smallBold,
    color: colors.neutral500,
  },
  roleButtonTextActive: {
    color: colors.primary,
  },
  stepIndicator: {
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  stepText: {
    ...typography.smallBold,
    color: colors.primary,
  },
  form: {
    gap: spacing.lg,
  },
  inputIcon: {
    fontSize: 18,
    color: colors.primary,
  },
  actionButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
  },
  footerText: {
    ...typography.small,
    color: colors.neutral500,
  },
  loginLink: {
    ...typography.smallBold,
    color: colors.primary,
  },
});
