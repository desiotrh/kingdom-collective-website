import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAppNavigation } from '../utils/navigationUtils';
import { useFaithMode } from '../contexts/FaithModeContext';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  emoji: string;
  onPress: () => void;
  color: string;
}

const QuickActionsWidget: React.FC = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();

  const quickActions: QuickAction[] = [
    {
      id: 'add-product',
      title: 'Add Product',
      description: faithMode ? 'Share God\'s gifts through your business' : 'Add a new product to sell',
      emoji: '📦',
      onPress: () => navigation.navigate('AddProduct'),
      color: '#3b82f6',
    },
    {
      id: 'create-content',
      title: 'Create Content',
      description: faithMode ? 'Let your light shine through content' : 'Generate engaging social posts',
      emoji: '✨',
      onPress: () => navigation.navigate('ContentGenerator'),
      color: '#8b5cf6',
    },
    {
      id: 'schedule-posts',
      title: 'Schedule Posts',
      description: faithMode ? 'Plan your testimony ahead' : 'Plan your content calendar',
      emoji: '📅',
      onPress: () => navigation.navigate('Scheduling'),
      color: '#06b6d4',
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: faithMode ? 'See how God is using your platform' : 'Track your performance',
      emoji: '📊',
      onPress: () => navigation.navigate('AnalyticsOverview'),
      color: '#10b981',
    },
    {
      id: 'community',
      title: 'Forge Community',
      description: faithMode ? 'Connect with Kingdom entrepreneurs' : 'Network with fellow creators',
      emoji: '🤝',
      onPress: () => navigation.navigate('ForgeCommunity'),
      color: '#f59e0b',
    },
    {
      id: 'sponsorship',
      title: 'Request Sponsorship',
      description: faithMode ? 'Get support for your ministry' : 'Apply for sponsored access',
      emoji: '💝',
      onPress: () => navigation.navigate('SponsorshipRequest'),
      color: '#ef4444',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quick Actions</Text>
        <Text style={styles.subtitle}>
          {faithMode 
            ? 'Take your next step in ministry' 
            : 'Choose your next move'}
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
      >
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionCard, { backgroundColor: action.color }]}
            onPress={action.onPress}
            activeOpacity={0.8}
          >
            <Text style={styles.actionEmoji}>{action.emoji}</Text>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionDescription}>{action.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {faithMode && (
        <View style={styles.faithBanner}>
          <Text style={styles.faithText}>
            💖 "In all your ways acknowledge Him, and He will direct your paths" - Proverbs 3:6
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  actionsContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  actionCard: {
    width: 160,
    height: 140,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#f3f4f6',
    lineHeight: 16,
    opacity: 0.9,
  },
  faithBanner: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: '#1f2937',
    borderLeftColor: '#f97316',
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 8,
  },
  faithText: {
    fontSize: 13,
    color: '#d1d5db',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default QuickActionsWidget;
