/**
 * Kingdom Studios Sponsorships Screen
 * Premium sponsorship dashboard with modern fintech-inspired design
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors, KingdomGradients, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';

const { width, height } = Dimensions.get('window');

interface Sponsorship {
  id: string;
  sponsorName: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Pending';
  value: string;
  category: string;
}

interface SponsorshipMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const mockSponsorships: Sponsorship[] = [
  {
    id: '1',
    sponsorName: 'Faith Apparel Co.',
    startDate: '2025-05-01',
    endDate: '2025-08-01',
    status: 'Active',
    value: '$2,500',
    category: 'Fashion & Lifestyle',
  },
  {
    id: '2',
    sponsorName: 'Blessed Media',
    startDate: '2025-01-01',
    endDate: '2025-04-01',
    status: 'Expired',
    value: '$1,800',
    category: 'Digital Media',
  },
  {
    id: '3',
    sponsorName: 'Kingdom Creators Network',
    startDate: '2025-07-01',
    endDate: '2025-10-01',
    status: 'Pending',
    value: '$3,200',
    category: 'Creator Economy',
  },
];

const metrics: SponsorshipMetric[] = [
  { title: 'Total Earnings', value: '$7,500', change: '+12%', isPositive: true },
  { title: 'Active Deals', value: '1', change: '0', isPositive: true },
  { title: 'Pending Requests', value: '3', change: '+2', isPositive: true },
  { title: 'Success Rate', value: '85%', change: '+5%', isPositive: true },
];

function SponsorshipsScreen() {
  // ... existing code ...
}
export default SponsorshipsScreen;
