import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface Service {
  id: number;
  name: string;
  category: string;
  duration: string;
  price: number;
  active: boolean;
}

const INITIAL_SERVICES: Service[] = [
  { id: 1, name: 'Luxury Facial', category: 'Skin Care', duration: '60 min', price: 85, active: true },
  { id: 2, name: 'Deep Tissue Massage', category: 'Massage', duration: '90 min', price: 120, active: true },
  { id: 3, name: 'Designer Haircut', category: 'Hair', duration: '45 min', price: 65, active: true },
  { id: 4, name: 'Manicure & Pedicure', category: 'Nails', duration: '75 min', price: 75, active: true },
  { id: 5, name: 'Hot Stone Therapy', category: 'Massage', duration: '90 min', price: 140, active: true },
  { id: 6, name: 'Beard Trim & Shape', category: 'Grooming', duration: '30 min', price: 35, active: true },
];

const CATEGORY_ICONS: Record<string, string> = {
  'Skin Care': '✨',
  'Massage': '💆',
  'Hair': '✂',
  'Nails': '💅',
  'Grooming': '🪒',
};

function ServiceModal({
  visible,
  service,
  onClose,
  onSave,
}: {
  visible: boolean;
  service: Service | null;
  onClose: () => void;
  onSave: (s: Partial<Service>) => void;
}) {
  const [name, setName] = useState(service?.name || '');
  const [category, setCategory] = useState(service?.category || '');
  const [duration, setDuration] = useState(service?.duration || '');
  const [price, setPrice] = useState(service?.price?.toString() || '');

  React.useEffect(() => {
    if (service) {
      setName(service.name);
      setCategory(service.category);
      setDuration(service.duration);
      setPrice(service.price.toString());
    } else {
      setName('');
      setCategory('');
      setDuration('');
      setPrice('');
    }
  }, [service, visible]);

  const handleSave = () => {
    if (!name || !category || !duration || !price) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    onSave({ name, category, duration, price: parseFloat(price) });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.handle} />
          <Text style={modalStyles.title}>
            {service ? 'Edit Service' : 'Add New Service'}
          </Text>
          <View style={modalStyles.form}>
            <Input
              label="Service Name"
              placeholder="e.g. Luxury Facial"
              value={name}
              onChangeText={setName}
            />
            <Input
              label="Category"
              placeholder="e.g. Skin Care"
              value={category}
              onChangeText={setCategory}
            />
            <Input
              label="Duration"
              placeholder="e.g. 60 min"
              value={duration}
              onChangeText={setDuration}
            />
            <Input
              label="Price ($)"
              placeholder="e.g. 85"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>
          <View style={modalStyles.actions}>
            <Button onPress={onClose} variant="outline" style={modalStyles.cancelBtn}>
              Cancel
            </Button>
            <Button onPress={handleSave} style={modalStyles.saveBtn}>
              {service ? 'Save Changes' : 'Add Service'}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xxl,
    gap: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: colors.neutral300,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.neutral900,
  },
  form: {
    gap: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 2,
  },
});

export function ServicesScreen() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setServices(services.filter((s) => s.id !== id)),
        },
      ]
    );
  };

  const handleToggle = (id: number) => {
    setServices(services.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const handleSave = (data: Partial<Service>) => {
    if (editingService) {
      setServices(services.map((s) => (s.id === editingService.id ? { ...s, ...data } : s)));
    } else {
      const newService: Service = {
        id: Math.max(...services.map((s) => s.id)) + 1,
        name: data.name || '',
        category: data.category || '',
        duration: data.duration || '',
        price: data.price || 0,
        active: true,
      };
      setServices([...services, newService]);
    }
    setEditingService(null);
  };

  const renderService = ({ item }: { item: Service }) => (
    <Card style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceIconContainer}>
          <Text style={styles.serviceIcon}>
            {CATEGORY_ICONS[item.category] || '🛎'}
          </Text>
        </View>
        <View style={styles.serviceActions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              setEditingService(item);
              setShowModal(true);
            }}
          >
            <Text style={styles.editBtnText}>✏</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.deleteBtnText}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.serviceMeta}>
        <Text style={styles.serviceCategory}>{item.category}</Text>
        <View style={[styles.statusDot, { backgroundColor: item.active ? '#22c55e' : colors.neutral300 }]} />
      </View>
      <Text style={styles.serviceName}>{item.name}</Text>

      <View style={styles.serviceFooter}>
        <View style={styles.serviceMetaItem}>
          <Text style={styles.serviceMetaIcon}>🕐</Text>
          <Text style={styles.serviceMetaText}>{item.duration}</Text>
        </View>
        <Text style={styles.servicePrice}>${item.price}</Text>
      </View>

      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, { color: item.active ? '#16a34a' : colors.neutral500 }]}>
          {item.active ? 'Active' : 'Disabled'}
        </Text>
        <Switch
          value={item.active}
          onValueChange={() => handleToggle(item.id)}
          trackColor={{ false: colors.neutral300, true: '#a5b4fc' }}
          thumbColor={item.active ? colors.primary : colors.neutral400}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor={colors.neutral400}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingService(null);
            setShowModal(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          {filtered.length} services · {filtered.filter((s) => s.active).length} active
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderService}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛎</Text>
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search</Text>
          </View>
        }
      />

      <ServiceModal
        visible={showModal}
        service={editingService}
        onClose={() => {
          setShowModal(false);
          setEditingService(null);
        }}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral50,
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
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  addButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  summaryRow: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  summaryText: {
    ...typography.small,
    color: colors.neutral500,
  },
  row: {
    gap: spacing.md,
  },
  listContent: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  serviceCard: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
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
  serviceActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  editBtn: {
    width: 36,
    height: 36,
    backgroundColor: colors.neutral50,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontSize: 16,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    backgroundColor: colors.errorBg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 16,
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceCategory: {
    ...typography.tiny,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  serviceName: {
    ...typography.bodyBold,
    color: colors.neutral900,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral50,
    marginTop: spacing.xs,
  },
  serviceMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  serviceMetaIcon: {
    fontSize: 12,
  },
  serviceMetaText: {
    ...typography.caption,
    color: colors.neutral500,
  },
  servicePrice: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    ...typography.captionBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
});
