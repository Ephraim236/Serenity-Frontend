import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ClientTabParamList } from '../../types';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

type NavigationProp = BottomTabNavigationProp<ClientTabParamList>;

const { width } = Dimensions.get('window');

const SERVICES = [
  {
    id: 1,
    name: 'Luxury Facial',
    duration: '60 min',
    price: '$85',
    image: 'https://images.unsplash.com/photo-1761718210055-e83ca7e2c9ad?w=400&q=80',
    description: 'Deep cleansing and rejuvenation for glowing skin.',
    category: 'Skin',
  },
  {
    id: 2,
    name: 'Deep Tissue Massage',
    duration: '90 min',
    price: '$120',
    image: 'https://images.unsplash.com/photo-1617952986600-802f965dcdbc?w=400&q=80',
    description: 'Targeted pressure to release muscle tension and stress.',
    category: 'Massage',
  },
  {
    id: 3,
    name: 'Designer Haircut',
    duration: '45 min',
    price: '$65',
    image: 'https://images.unsplash.com/photo-1461997768827-d66df65bd3c2?w=400&q=80',
    description: 'Modern styling from our master hair artists.',
    category: 'Hair',
  },
];

const STATS = [
  { icon: '⭐', title: '5-Star Rated', desc: 'Best service in the city' },
  { icon: '🕐', title: 'Flexible Hours', desc: 'Open 7 days a week' },
  { icon: '✅', title: 'Expert Staff', desc: 'Certified professionals' },
];

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1637777277337-f114350fb088?w=800&q=80' }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.heroHeader}>
              <View style={styles.logoRow}>
                <View style={styles.logo}>
                  <Text style={styles.logoText}>✂</Text>
                </View>
                <Text style={styles.brandName}>Serenity</Text>
              </View>
              <View style={styles.userGreeting}>
                {user && (
                  <Text style={styles.greetingText}>Hi, {user.name.split(' ')[0]} 👋</Text>
                )}
              </View>
            </View>

            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>WELCOME TO SERENITY</Text>
              </View>
              <Text style={styles.heroTitle}>
                Luxury{'\n'}
                <Text style={styles.heroTitleAccent}>Self-Care</Text>
                {'\n'}Effortlessly Booked
              </Text>
              <Text style={styles.heroSubtitle}>
                Connecting Clients and Services Effortlessly.
              </Text>

              <View style={styles.heroButtons}>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => navigation.navigate('Book')}
                >
                  <Text style={styles.bookButtonText}>Book an Appointment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.statsRow}>
          {STATS.map((stat) => (
            <Card key={stat.title} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={styles.statDesc}>{stat.desc}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Featured Services</Text>
              <Text style={styles.sectionSubtitle}>Our most popular treatments</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Book')}>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScroll}
          >
            {SERVICES.map((service) => (
              <Card key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceImageContainer}>
                  <Image
                    source={{ uri: service.image }}
                    style={styles.serviceImage}
                    resizeMode="cover"
                  />
                  <View style={styles.servicePriceBadge}>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                  </View>
                </View>
                <View style={styles.serviceInfo}>
                  <View style={styles.serviceMeta}>
                    <Text style={styles.serviceDuration}>🕐 {service.duration}</Text>
                    <Text style={styles.serviceCategory}>{service.category}</Text>
                  </View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDesc} numberOfLines={2}>
                    {service.description}
                  </Text>
                  <TouchableOpacity
                    style={styles.serviceBookButton}
                    onPress={() => navigation.navigate('Book')}
                  >
                    <Text style={styles.serviceBookButtonText}>Book This</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        <View style={styles.ctaBanner}>
          <Text style={styles.ctaTitle}>Ready to Relax? 🧘</Text>
          <Text style={styles.ctaSubtitle}>
            Book your perfect spa appointment in just a few taps
          </Text>
          <Button
            onPress={() => navigation.navigate('Book')}
            size="lg"
            variant="secondary"
            style={styles.ctaButton}
            textStyle={styles.ctaButtonText}
          >
            Book Appointment
          </Button>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    height: 480,
  },
  heroImage: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: spacing.xl,
    paddingTop: spacing.md,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
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
  userGreeting: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  greetingText: {
    ...typography.smallMedium,
    color: colors.white,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  heroBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 1,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.white,
    fontSize: 36,
    lineHeight: 44,
  },
  heroTitleAccent: {
    color: '#a5b4fc',
  },
  heroSubtitle: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.8)',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.full,
  },
  bookButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginTop: -24,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.md,
  },
  statIcon: {
    fontSize: 22,
  },
  statTitle: {
    ...typography.captionBold,
    color: colors.neutral900,
    textAlign: 'center',
  },
  statDesc: {
    ...typography.tiny,
    color: colors.neutral500,
    textAlign: 'center',
  },
  section: {
    paddingTop: spacing.lg,
    gap: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.neutral900,
  },
  sectionSubtitle: {
    ...typography.small,
    color: colors.neutral500,
  },
  seeAllText: {
    ...typography.smallBold,
    color: colors.primary,
  },
  servicesScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    paddingBottom: spacing.sm,
  },
  serviceCard: {
    width: width * 0.72,
    overflow: 'hidden',
    padding: 0,
  },
  serviceImageContainer: {
    height: 180,
    position: 'relative',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
  },
  servicePriceBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  servicePrice: {
    ...typography.smallBold,
    color: colors.primary,
  },
  serviceInfo: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDuration: {
    ...typography.caption,
    color: colors.neutral500,
  },
  serviceCategory: {
    ...typography.tiny,
    color: colors.primary,
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  serviceName: {
    ...typography.h4,
    color: colors.neutral900,
  },
  serviceDesc: {
    ...typography.small,
    color: colors.neutral500,
    lineHeight: 20,
  },
  serviceBookButton: {
    backgroundColor: colors.neutral900,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  serviceBookButtonText: {
    ...typography.smallBold,
    color: colors.white,
  },
  ctaBanner: {
    margin: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: 28,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  ctaTitle: {
    ...typography.h3,
    color: colors.white,
    textAlign: 'center',
  },
  ctaSubtitle: {
    ...typography.small,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: colors.white,
    marginTop: spacing.xs,
  },
  ctaButtonText: {
    color: colors.primary,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
