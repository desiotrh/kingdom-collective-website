import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  Switch,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import { Ionicons } from '@expo/vector-icons';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
  appliesTo: 'subscription' | 'products' | 'all';
  createdAt: string;
  sharable?: boolean;
}

const AdminCouponManagerScreen = () => {
  const navigation = useNavigation();
  const { faithMode } = useFaithMode();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'KINGDOM25',
      description: faithMode ? 'Blessing for New Believers' : 'New User Discount',
      discountType: 'percentage',
      discountValue: 25,
      usageLimit: 100,
      usedCount: 23,
      expiryDate: '2025-12-31',
      isActive: true,
      appliesTo: 'subscription',
      createdAt: '2025-01-15',
      sharable: true,
    },
    {
      id: '2',
      code: 'FAITH50',
      description: faithMode ? 'Ministry Support Discount' : 'Creator Support',
      discountType: 'percentage',
      discountValue: 50,
      usageLimit: 50,
      usedCount: 12,
      expiryDate: '2025-08-31',
      isActive: true,
      appliesTo: 'all',
      createdAt: '2025-02-01',
      sharable: true,
    },
  ]);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    usageLimit: 100,
    expiryDate: '',
    appliesTo: 'subscription' as 'subscription' | 'products' | 'all',
    sharable: true,
  });

  const generateCouponCode = () => {
    const prefixes = faithMode 
      ? ['BLESS', 'GRACE', 'FAITH', 'HOPE', 'LOVE']
      : ['CREATE', 'BUILD', 'GROW', 'SHINE', 'RISE'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 100);
    return `${prefix}${number}`;
  };

  const createCoupon = () => {
    if (!newCoupon.code || !newCoupon.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const coupon: Coupon = {
      id: Date.now().toString(),
      ...newCoupon,
      usedCount: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCoupons([coupon, ...coupons]);
    setNewCoupon({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      usageLimit: 100,
      expiryDate: '',
      appliesTo: 'subscription',
      sharable: true,
    });
    setShowCreateModal(false);
    Alert.alert('Success', 'Coupon created successfully!');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
    ));
  };

  const shareCoupon = (coupon: Coupon) => {
    const shareText = faithMode
      ? `🙏 Blessing Alert! Use code "${coupon.code}" for ${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : '$'} off Kingdom Studios! God's grace extends to you! ✨`
      : `🎉 Special Offer! Use code "${coupon.code}" for ${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : '$'} off Kingdom Studios! Limited time only! 🚀`;
    
    Alert.alert(
      'Share Coupon',
      shareText,
      [
        { text: 'Copy Text', onPress: () => Alert.alert('Copied!', 'Text copied to share') },
        { text: 'Share Link', onPress: () => Alert.alert('Shared!', 'Coupon link shared') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const renderCouponCard = (coupon: Coupon) => (
    <BlurView key={coupon.id} intensity={20} style={styles.couponCard}>
      <LinearGradient
        colors={[
          KingdomColors.background.secondary,
          coupon.isActive ? KingdomColors.primary.deepNavy : KingdomColors.silver.steel
        ]}
        style={styles.couponGradient}
      >
        <View style={styles.couponHeader}>
          <View style={styles.couponCodeContainer}>
            <Text style={styles.couponCode}>{coupon.code}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: coupon.isActive ? KingdomColors.accent.success : KingdomColors.silver.light }
            ]}>
              <Text style={styles.statusText}>
                {coupon.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => toggleCouponStatus(coupon.id)}
          >
            <Ionicons 
              name={coupon.isActive ? 'pause' : 'play'} 
              size={20} 
              color={KingdomColors.text.primary} 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.couponDescription}>{coupon.description}</Text>
        
        <View style={styles.couponDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Discount:</Text>
            <Text style={styles.detailValue}>
              {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '$'} off
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Usage:</Text>
            <Text style={styles.detailValue}>
              {coupon.usedCount}/{coupon.usageLimit}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expires:</Text>
            <Text style={styles.detailValue}>{coupon.expiryDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Applies to:</Text>
            <Text style={styles.detailValue}>{coupon.appliesTo}</Text>
          </View>
        </View>

        {coupon.sharable && (
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => shareCoupon(coupon)}
          >
            <LinearGradient
              colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
              style={styles.shareGradient}
            >
              <Ionicons name="share" size={16} color={KingdomColors.text.inverse} />
              <Text style={styles.shareButtonText}>
                {faithMode ? 'Share Blessing' : 'Share Coupon'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </BlurView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.primary.midnight, KingdomColors.primary.deepNavy]}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={KingdomColors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {faithMode ? 'Blessing Manager' : 'Coupon Manager'}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons name="add" size={24} color={KingdomColors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Stats Section */}
          <BlurView intensity={20} style={styles.statsContainer}>
            <LinearGradient
              colors={[KingdomColors.background.secondary, KingdomColors.primary.deepNavy]}
              style={styles.statsGradient}
            >
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{coupons.length}</Text>
                  <Text style={styles.statLabel}>Total Coupons</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{coupons.filter(c => c.isActive).length}</Text>
                  <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Total Uses</Text>
                </View>
              </View>
            </LinearGradient>
          </BlurView>

          {/* Coupons List */}
          <View style={styles.couponsSection}>
            <Text style={styles.sectionTitle}>
              {faithMode ? 'Active Blessings' : 'Active Coupons'}
            </Text>
            {coupons.map(renderCouponCard)}
          </View>
        </ScrollView>

        {/* Create Coupon Modal */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {faithMode ? 'Create Blessing' : 'Create Coupon'}
              </Text>
              <TouchableOpacity onPress={createCoupon}>
                <Text style={styles.modalSave}>Create</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Coupon Code</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={newCoupon.code}
                    onChangeText={(text) => setNewCoupon({...newCoupon, code: text.toUpperCase()})}
                    placeholder="Enter code"
                    placeholderTextColor={KingdomColors.text.muted}
                  />
                  <TouchableOpacity
                    style={styles.generateButton}
                    onPress={() => setNewCoupon({...newCoupon, code: generateCouponCode()})}
                  >
                    <Text style={styles.generateText}>Generate</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.input}
                  value={newCoupon.description}
                  onChangeText={(text) => setNewCoupon({...newCoupon, description: text})}
                  placeholder={faithMode ? "Blessing description" : "Coupon description"}
                  placeholderTextColor={KingdomColors.text.muted}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Discount Value</Text>
                <TextInput
                  style={styles.input}
                  value={newCoupon.discountValue.toString()}
                  onChangeText={(text) => setNewCoupon({...newCoupon, discountValue: parseInt(text) || 0})}
                  placeholder="25"
                  keyboardType="numeric"
                  placeholderTextColor={KingdomColors.text.muted}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Usage Limit</Text>
                <TextInput
                  style={styles.input}
                  value={newCoupon.usageLimit.toString()}
                  onChangeText={(text) => setNewCoupon({...newCoupon, usageLimit: parseInt(text) || 100})}
                  placeholder="100"
                  keyboardType="numeric"
                  placeholderTextColor={KingdomColors.text.muted}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.opacity.white10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  addButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  statsGradient: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    marginTop: 4,
  },
  couponsSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  couponCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...KingdomShadows.silver,
  },
  couponGradient: {
    padding: 20,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  couponCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  couponCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: KingdomColors.opacity.white10,
  },
  couponDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 16,
  },
  couponDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  detailValue: {
    fontSize: 12,
    color: KingdomColors.text.primary,
    fontWeight: '600',
  },
  shareButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  modalCancel: {
    fontSize: 16,
    color: KingdomColors.text.muted,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: KingdomColors.text.primary,
    borderWidth: 1,
    borderColor: KingdomColors.silver.light,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  generateButton: {
    backgroundColor: KingdomColors.gold.bright,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  generateText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
  },
});

export default React.memo(AdminCouponManagerScreen);
