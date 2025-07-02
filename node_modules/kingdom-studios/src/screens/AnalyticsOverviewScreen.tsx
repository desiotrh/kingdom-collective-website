import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useAppNavigation } from '../utils/navigationUtils';

interface MetricData {
  title: string;
  value: string;
  subtitle: string;
  emoji: string;
  color: string;
}

interface ChartData {
  day: string;
  value: number;
}

const AnalyticsOverviewScreen = () => {
  const { faithMode } = useFaithMode();
  const navigation = useAppNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLearnMore = () => {
    Alert.alert(
      'Creator Pro Coming Soon!',
      'Get ready for advanced analytics, custom reports, and deeper insights into your content performance.',
      [{ text: 'Got it!' }]
    );
  };

  // Mock analytics data
  const metrics: MetricData[] = [
    {
      title: 'Impressions',
      value: '12.4K',
      subtitle: '+23% vs last week',
      emoji: '📥',
      color: '#3b82f6',
    },
    {
      title: 'Engagements',
      value: '5.2K',
      subtitle: '+18% vs last week',
      emoji: '❤️',
      color: '#dc2626',
    },
    {
      title: 'Followers Gained',
      value: '312',
      subtitle: '+15% vs last week',
      emoji: '👥',
      color: '#22c55e',
    },
    {
      title: 'Conversion Rate',
      value: '4.8%',
      subtitle: '+2.1% vs last week',
      emoji: '🎯',
      color: '#f59e0b',
    },
  ];

  // Mock chart data for 7 days
  const chartData: ChartData[] = [
    { day: 'Mon', value: 420 },
    { day: 'Tue', value: 680 },
    { day: 'Wed', value: 590 },
    { day: 'Thu', value: 720 },
    { day: 'Fri', value: 850 },
    { day: 'Sat', value: 1200 },
    { day: 'Sun', value: 980 },
  ];

  // Find max value for chart scaling
  const maxValue = Math.max(...chartData.map(d => d.value));

  // Dynamic content based on Faith Mode
  const welcomeMessage = faithMode
    ? "The harvest is plenty. 🌾 Let's look at the fruit of your labor."
    : "Check your growth. 📈 Let's break down your reach and performance.";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
          <View style={styles.dateRangeContainer}>
            <Text style={styles.dateRangeLabel}>Period:</Text>
            <Text style={styles.dateRangeValue}>Last 7 Days</Text>
          </View>
        </View>

        {/* Metrics Cards */}
        <View style={styles.metricsContainer}>
          {metrics.map((metric, index) => (
            <AnalyticsCard key={index} metric={metric} />
          ))}
        </View>

        {/* Engagement Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>📈 Engagement Over Time</Text>
          <View style={styles.chartContainer}>
            {chartData.map((data, index) => {
              const height = (data.value / maxValue) * 100;
              return (
                <View key={index} style={styles.chartBarContainer}>
                  <View style={styles.chartValueContainer}>
                    <Text style={styles.chartValue}>{data.value}</Text>
                  </View>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: `${height}%`,
                        backgroundColor: index === chartData.length - 1 ? '#3b82f6' : '#1a1a1a',
                      },
                    ]}
                  />
                  <Text style={styles.chartDay}>{data.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Coming Soon CTA */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Want deeper insights?</Text>
          <Text style={styles.ctaSubtitle}>Creator Pro is launching soon. 🔓</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleLearnMore}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable Analytics Card Component
const AnalyticsCard: React.FC<{ metric: MetricData }> = ({ metric }) => {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricEmoji}>{metric.emoji}</Text>
        <Text style={styles.metricTitle}>{metric.title}</Text>
      </View>
      <Text style={[styles.metricValue, { color: metric.color }]}>{metric.value}</Text>
      <Text style={styles.metricSubtitle}>{metric.subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 40,
  },
  welcomeCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 15,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateRangeLabel: {
    fontSize: 14,
    color: '#cccccc',
    marginRight: 8,
  },
  dateRangeValue: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  metricTitle: {
    fontSize: 12,
    color: '#cccccc',
    fontWeight: '500',
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metricSubtitle: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    paddingHorizontal: 10,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  chartValueContainer: {
    marginBottom: 5,
    minHeight: 20,
  },
  chartValue: {
    fontSize: 10,
    color: '#cccccc',
    textAlign: 'center',
  },
  chartBar: {
    width: '80%',
    borderRadius: 4,
    minHeight: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
  chartDay: {
    fontSize: 11,
    color: '#cccccc',
    marginTop: 8,
    textAlign: 'center',
  },
  ctaCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default AnalyticsOverviewScreen;
