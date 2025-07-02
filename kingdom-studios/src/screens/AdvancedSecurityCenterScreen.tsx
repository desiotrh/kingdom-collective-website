import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

const AdvancedSecurityCenterScreen = () => {
  const { isDualMode } = useDualMode();
  const colors = isDualMode ? KingdomColors.faith : KingdomColors.encouragement;
  const [selectedView, setSelectedView] = useState<string>('overview');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [securityEvents, setSecurityEvents] = useState([
    {
      id: '1',
      title: 'Successful Login',
      description: 'User logged in from verified device',
      timestamp: new Date().toLocaleString(),
      type: 'login',
      severity: 'low',
    },
    {
      id: '2',
      title: 'API Rate Limit Exceeded',
      description: 'Potential bot activity detected',
      timestamp: new Date(Date.now() - 3600000).toLocaleString(),
      type: 'security',
      severity: 'medium',
    },
    {
      id: '3',
      title: 'Password Change Request',
      description: 'User initiated password reset',
      timestamp: new Date(Date.now() - 7200000).toLocaleString(),
      type: 'auth',
      severity: 'low',
    },
    {
      id: '4',
      title: 'Failed Login Attempt',
      description: 'Multiple failed login attempts detected',
      timestamp: new Date(Date.now() - 10800000).toLocaleString(),
      type: 'security',
      severity: 'high',
    },
    {
      id: '5',
      title: 'Data Export Request',
      description: 'User requested account data export',
      timestamp: new Date(Date.now() - 14400000).toLocaleString(),
      type: 'data',
      severity: 'medium',
    },
  ]);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'shield-checkmark' },
    { key: 'events', label: 'Events', icon: 'list' },
    { key: 'policies', label: 'Policies', icon: 'document-text' },
  ];

  const securityMetrics = [
    {
      name: 'Threat Level',
      value: 'Low',
      status: 'good',
      icon: 'shield-checkmark',
      description: 'Current security status',
    },
    {
      name: 'Active Sessions',
      value: '3',
      status: 'good',
      icon: 'person',
      description: 'Users currently online',
    },
    {
      name: 'Failed Logins',
      value: '2',
      status: 'warning',
      icon: 'warning',
      description: 'Failed attempts today',
    },
    {
      name: 'Data Breaches',
      value: '0',
      status: 'good',
      icon: 'lock-closed',
      description: 'Detected breaches',
    },
    {
      name: 'Compliance Score',
      value: '98%',
      status: 'good',
      icon: 'checkmark-circle',
      description: 'Faith-based standards',
    },
  ];

  const securityPolicies = [
    {
      name: 'Authentication',
      policies: [
        {
          name: 'Two-Factor Authentication',
          description: 'Require 2FA for all user accounts',
          enabled: true,
        },
        {
          name: 'Strong Password Policy',
          description: 'Enforce complex password requirements',
          enabled: true,
        },
        {
          name: 'Session Timeout',
          description: 'Auto-logout after 30 minutes of inactivity',
          enabled: true,
        },
        {
          name: 'Faith-Based Content Filter',
          description: 'Filter content based on faith values',
          enabled: isDualMode,
        },
      ],
    },
    {
      name: 'Data Protection',
      policies: [
        {
          name: 'Data Encryption',
          description: 'Encrypt all sensitive user data',
          enabled: true,
        },
        {
          name: 'Backup Verification',
          description: 'Verify backup integrity daily',
          enabled: true,
        },
        {
          name: 'Access Logging',
          description: 'Log all data access attempts',
          enabled: true,
        },
        {
          name: 'Prayer Request Privacy',
          description: 'Enhanced privacy for prayer requests',
          enabled: isDualMode,
        },
      ],
    },
    {
      name: 'Network Security',
      policies: [
        {
          name: 'Firewall Protection',
          description: 'Advanced firewall configuration',
          enabled: true,
        },
        {
          name: 'DDoS Protection',
          description: 'Protect against distributed attacks',
          enabled: true,
        },
        {
          name: 'SSL/TLS Encryption',
          description: 'Secure all network communications',
          enabled: true,
        },
        {
          name: 'VPN Access Control',
          description: 'Secure VPN for remote access',
          enabled: false,
        },
      ],
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return colors.error;
      case 'high':
        return '#FF6B35';
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'danger':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'login':
        return 'log-in';
      case 'security':
        return 'shield';
      case 'auth':
        return 'key';
      case 'data':
        return 'folder';
      case 'resolved':
        return 'checkmark-circle';
      default:
        return 'alert-circle';
    }
  };

  const renderContent = () => (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Security Overview */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Security Overview
        </Text>
        <View style={[styles.scoreCard, { backgroundColor: colors.surface }]}>
          <View style={styles.scoreContent}>
            <Text style={[styles.scoreValue, { color: colors.success }]}>94</Text>
            <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Security Score</Text>
          </View>
          <View>
            <Text style={[styles.scoreDescription, { color: colors.text }]}>
              Your faith-based platform maintains excellent security standards
            </Text>
          </View>
        </View>
      </View>

      {/* Security Metrics */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Security Metrics
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.metricsContainer}>
            {securityMetrics.map((metric, index) => (
              <View
                key={index}
                style={[
                  styles.metricCard,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: getStatusColor(metric.status),
                  }
                ]}
              >
                <Ionicons
                  name={metric.icon as any}
                  size={24}
                  color={getStatusColor(metric.status)}
                />
                <Text style={[styles.metricValue, { color: getStatusColor(metric.status) }]}>
                  {metric.value}
                </Text>
                <Text style={[styles.metricName, { color: colors.text }]}>
                  {metric.name}
                </Text>
                <Text style={[styles.metricDescription, { color: colors.textSecondary }]}>
                  {metric.description}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Recent Security Events */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Security Events
        </Text>
        <View style={[styles.eventsContainer, { backgroundColor: colors.surface }]}>
          {securityEvents.slice(0, 3).map((event, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.eventItem,
                { borderBottomColor: colors.border }
              ]}
              onPress={() => setSelectedEvent(event)}
            >
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <Ionicons
                    name={getEventTypeIcon(event.type)}
                    size={20}
                    color={getSeverityColor(event.severity)}
                  />
                  <Text style={[styles.eventTitle, { color: colors.text }]}>
                    {event.title}
                  </Text>
                  <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
                    {event.description}
                  </Text>
                </View>
                <View style={styles.eventMeta}>
                  <Text
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(event.severity) }
                    ]}
                  >
                    {event.severity.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={[styles.eventTimestamp, { color: colors.textSecondary }]}>
                {event.timestamp}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              const newSecurityCheck = {
                id: Date.now().toString(),
                title: 'Full Security Scan',
                description: 'Comprehensive security check initiated',
                timestamp: new Date().toLocaleString(),
                type: 'scan',
                severity: 'low',
              };
              setSecurityEvents(prev => [newSecurityCheck, ...prev]);
            }}
          >
            <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
              Run Security Scan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.info }]}
            onPress={() => {
              // Show security report
            }}
          >
            <Ionicons name="document-text" size={24} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
              Generate Report
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.warning }]}
            onPress={() => {
              // Update security policies
            }}
          >
            <Ionicons name="settings" size={24} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
              Update Policies
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Detailed Event Log */}
      {selectedView === 'events' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Detailed Event Log
          </Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.surface }]}>
              <Ionicons name="filter" size={16} color={colors.text} />
              <Text style={[styles.filterButtonText, { color: colors.text }]}>
                Filter Events
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.eventsContainer, { backgroundColor: colors.surface }]}>
            {securityEvents.map((event, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.eventItem,
                  { borderBottomColor: colors.border }
                ]}
                onPress={() => setSelectedEvent(event)}
              >
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <Ionicons
                      name={getEventTypeIcon(event.type)}
                      size={20}
                      color={getSeverityColor(event.severity)}
                    />
                    <Text style={[styles.eventTitle, { color: colors.text }]}>
                      {event.title}
                    </Text>
                    <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
                      {event.description}
                    </Text>
                  </View>
                  <View style={styles.eventMeta}>
                    <Text
                      style={[
                        styles.severityBadge,
                        { backgroundColor: getSeverityColor(event.severity) }
                      ]}
                    >
                      {event.severity.toUpperCase()}
                    </Text>
                    {event.type === 'resolved' && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    )}
                  </View>
                </View>
                <Text style={[styles.eventTimestamp, { color: colors.textSecondary }]}>
                  {event.timestamp}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Security Policies */}
      {selectedView === 'policies' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Security Policies
          </Text>
          {securityPolicies.map((category, categoryIndex) => (
            <View key={categoryIndex} style={[styles.policyCategory, { backgroundColor: colors.surface }]}>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>
                {category.name}
              </Text>
              {category.policies.map((policy, policyIndex) => (
                <View key={policyIndex} style={styles.policyItem}>
                  <View style={styles.policyContent}>
                    <Text style={[styles.policyName, { color: colors.text }]}>
                      {policy.name}
                    </Text>
                    <Text style={[styles.policyDescription, { color: colors.textSecondary }]}>
                      {policy.description}
                    </Text>
                  </View>
                  <Switch
                    value={policy.enabled}
                    onValueChange={(value) => {
                      // Update policy state
                    }}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={policy.enabled ? '#FFFFFF' : '#9CA3AF'}
                  />
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Event Detail Modal */}
      <Modal
        visible={!!selectedEvent}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedEvent(null)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(15, 15, 35, 0.9)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSelectedEvent(null)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Event Details
            </Text>
            {selectedEvent && (
              <TouchableOpacity
                style={[styles.resolveButton, { backgroundColor: colors.success }]}
                onPress={() => {
                  // Mark event as resolved
                  const updatedEvents = securityEvents.map(event =>
                    event.id === selectedEvent.id
                      ? { ...event, type: 'resolved' }
                      : event
                  );
                  setSecurityEvents(updatedEvents);
                  setSelectedEvent(null);
                }}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={[styles.resolveButtonText, { color: '#FFFFFF' }]}>
                  Mark as Resolved
                </Text>
              </TouchableOpacity>
            )}
            <ScrollView style={styles.modalScrollView}>
              {selectedEvent && (
                <View>
                  <View style={styles.eventDetailSection}>
                    <Text style={[styles.eventDetailTitle, { color: colors.text }]}>
                      {selectedEvent.title}
                    </Text>
                    <Text
                      style={[
                        styles.severityBadge,
                        { backgroundColor: getSeverityColor(selectedEvent.severity) }
                      ]}
                    >
                      {selectedEvent.severity.toUpperCase()}
                    </Text>
                  </View>
                  
                  <View style={styles.eventDetailSection}>
                    <Text style={[styles.eventDetailDescription, { color: colors.textSecondary }]}>
                      {selectedEvent.description}
                    </Text>
                  </View>

                  <View style={styles.eventMetaSection}>
                    <View style={styles.metaRow}>
                      <Ionicons name="time" size={16} color={colors.textSecondary} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {selectedEvent.timestamp}
                      </Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Ionicons name="location" size={16} color={colors.textSecondary} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        Kingdom Studios Platform
                      </Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Ionicons name="phone-portrait" size={16} color={colors.textSecondary} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        Mobile Application
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Placeholder views */}
      {selectedView === 'threats' && (
        <View style={[styles.placeholderContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="checkmark-done-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            No active threats detected
          </Text>
        </View>
      )}

      {selectedView === 'reports' && (
        <View style={[styles.placeholderContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            Security reports will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        Advanced Security Center
      </Text>
      <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
        {isDualMode ? 'Faith-Driven Security' : 'Platform Protection'}
      </Text>
    </View>
  );

  const renderTabBar = () => (
    <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            {
              backgroundColor: selectedView === tab.key ? colors.primary : colors.surface,
            }
          ]}
          onPress={() => setSelectedView(tab.key)}
        >
          <Ionicons
            name={tab.icon as any}
            size={20}
            color={selectedView === tab.key ? colors.surface : colors.text}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: selectedView === tab.key ? colors.surface : colors.text,
              }
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      {renderTabBar()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scoreCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  scoreContent: {
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  scoreDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  metricName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  metricDescription: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.8,
  },
  eventsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  eventContent: {
    marginBottom: 8,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  eventTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  eventDescription: {
    flex: 1,
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  eventTimestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  policyCategory: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  policyContent: {
    flex: 1,
    marginRight: 12,
  },
  policyName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  policyDescription: {
    fontSize: 12,
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  resolveButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  eventDetailSection: {
    marginBottom: 16,
  },
  eventDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDetailDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  eventMetaSection: {
    marginTop: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  metaText: {
    fontSize: 12,
  },
  placeholderContainer: {
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20,
  },
  placeholderText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default AdvancedSecurityCenterScreen;
