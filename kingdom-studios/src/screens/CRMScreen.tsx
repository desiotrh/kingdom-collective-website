import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Switch,
  SafeAreaView,
} from 'react-native';
import { KingdomColors } from '../constants/KingdomColors';
import { useDualMode } from '../contexts/DualModeContext';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  status: 'lead' | 'prospect' | 'customer' | 'partner';
  source: 'website' | 'social' | 'referral' | 'event' | 'ad' | 'other';
  tags: string[];
  lastContact: string;
  value: number;
  notes: string;
  createdAt: Date;
  isStarred: boolean;
}

interface Deal {
  id: string;
  contactId: string;
  title: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: Date;
  description: string;
  createdAt: Date;
}

interface Activity {
  id: string;
  contactId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
}

const CRMScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;

  const [activeTab, setActiveTab] = useState<'contacts' | 'deals' | 'activities' | 'analytics'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'lead' | 'prospect' | 'customer' | 'partner'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    status: 'lead' as const,
    source: 'website' as const,
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, [currentMode]);

  const loadData = () => {
    // Mock data - in real app, this would come from Firebase/API
    const mockContacts: Contact[] = currentMode === 'faith' ? [
      {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@faithfulcreative.com',
        phone: '+1 (555) 123-4567',
        company: 'Faithful Creative Studio',
        title: 'Ministry Director',
        status: 'customer',
        source: 'website',
        tags: ['ministry', 'creative', 'high-value'],
        lastContact: '2024-07-05',
        value: 2500,
        notes: 'Interested in our Kingdom Business Academy. Has a growing ministry and needs guidance on digital platforms.',
        createdAt: new Date('2024-06-01'),
        isStarred: true,
      },
      {
        id: '2',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael@gracedesigns.org',
        phone: '+1 (555) 987-6543',
        company: 'Grace Designs',
        title: 'Founder',
        status: 'prospect',
        source: 'referral',
        tags: ['design', 'startup', 'faith-based'],
        lastContact: '2024-07-03',
        value: 1200,
        notes: 'Referred by Pastor David. Looking to create Christian-themed products and needs help with marketing.',
        createdAt: new Date('2024-06-15'),
        isStarred: false,
      },
    ] : [
      {
        id: '1',
        firstName: 'Amanda',
        lastName: 'Rodriguez',
        email: 'amanda@empowermentcoach.com',
        phone: '+1 (555) 234-5678',
        company: 'Empowerment Coaching Co.',
        title: 'Life Coach',
        status: 'customer',
        source: 'social',
        tags: ['coaching', 'high-value', 'influencer'],
        lastContact: '2024-07-06',
        value: 5000,
        notes: 'Successful life coach looking to scale her business. Very engaged with our content.',
        createdAt: new Date('2024-05-20'),
        isStarred: true,
      },
    ];

    const mockDeals: Deal[] = currentMode === 'faith' ? [
      {
        id: '1',
        contactId: '1',
        title: 'Kingdom Business Academy - Premium Package',
        value: 2500,
        stage: 'proposal',
        probability: 75,
        expectedCloseDate: new Date('2024-07-15'),
        description: 'Full academy access plus 1-on-1 coaching sessions',
        createdAt: new Date('2024-06-20'),
      },
    ] : [
      {
        id: '1',
        contactId: '1',
        title: 'Business Scaling Consultation',
        value: 5000,
        stage: 'negotiation',
        probability: 80,
        expectedCloseDate: new Date('2024-07-12'),
        description: 'Complete business audit and growth strategy',
        createdAt: new Date('2024-06-10'),
      },
    ];

    const mockActivities: Activity[] = currentMode === 'faith' ? [
      {
        id: '1',
        contactId: '1',
        type: 'call',
        title: 'Follow-up call about Kingdom Academy',
        description: 'Discuss implementation timeline and answer questions about the faith-based modules',
        dueDate: new Date('2024-07-08'),
        completed: false,
        createdAt: new Date('2024-07-05'),
      },
    ] : [
      {
        id: '1',
        contactId: '1',
        type: 'meeting',
        title: 'Strategy Session',
        description: 'Virtual meeting to discuss business scaling opportunities',
        dueDate: new Date('2024-07-10'),
        completed: false,
        createdAt: new Date('2024-07-06'),
      },
    ];

    setContacts(mockContacts);
    setDeals(mockDeals);
    setActivities(mockActivities);
  };

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "🙏 Build meaningful relationships for God's Kingdom",
      "✨ Serve others through intentional connections",
      "💝 Steward relationships with Kingdom values",
      "🌟 Connect hearts for eternal impact",
    ];

    const encouragementPrompts = [
      "🚀 Build powerful relationships that drive success",
      "💪 Nurture connections that create opportunities",
      "🌈 Transform contacts into lasting partnerships",
      "✨ Grow your network with authentic relationships",
    ];

    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const addContact = () => {
    if (!newContact.firstName.trim() || !newContact.email.trim()) {
      Alert.alert('Error', 'Please enter at least first name and email');
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      firstName: newContact.firstName,
      lastName: newContact.lastName,
      email: newContact.email,
      phone: newContact.phone,
      company: newContact.company,
      title: newContact.title,
      status: newContact.status,
      source: newContact.source,
      tags: [],
      lastContact: new Date().toISOString().split('T')[0],
      value: 0,
      notes: newContact.notes,
      createdAt: new Date(),
      isStarred: false,
    };

    setContacts(prev => [...prev, contact]);
    setShowAddModal(false);
    setNewContact({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      status: 'lead',
      source: 'website',
      notes: '',
    });

    Alert.alert(
      'Contact Added!',
      `${contact.firstName} ${contact.lastName} has been added to your CRM.`
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return '#FF9800';
      case 'prospect': return '#2196F3';
      case 'customer': return '#4CAF50';
      case 'partner': return '#9C27B0';
      default: return '#9E9E9E';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return '#FF9800';
      case 'qualification': return '#2196F3';
      case 'proposal': return '#9C27B0';
      case 'negotiation': return '#FF5722';
      case 'closed-won': return '#4CAF50';
      case 'closed-lost': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || contact.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={[styles.contactCard, { backgroundColor: colors.surface }]}>
      <View style={styles.contactHeader}>
        <View style={styles.contactInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.contactName, { color: colors.text }]}>
              {item.firstName} {item.lastName}
            </Text>
            {item.isStarred && (
              <Text style={styles.starIcon}>⭐</Text>
            )}
          </View>
          <Text style={[styles.contactEmail, { color: colors.textSecondary }]}>
            {item.email}
          </Text>
          {item.company && (
            <Text style={[styles.contactCompany, { color: colors.textSecondary }]}>
              {item.company} {item.title && `• ${item.title}`}
            </Text>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.contactMeta}>
        <Text style={[styles.contactValue, { color: colors.success }]}>
          ${item.value.toLocaleString()}
        </Text>
        <Text style={[styles.lastContact, { color: colors.textSecondary }]}>
          Last contact: {new Date(item.lastContact).toLocaleDateString()}
        </Text>
      </View>

      {item.tags.length > 0 && (
        <View style={styles.tagContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.tagText, { color: colors.success }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.contactActions}>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: colors.success }]}
          onPress={() => Alert.alert('Call', `Call ${item.firstName}?`)}
        >
          <Text style={[styles.actionButtonText, { color: colors.success }]}>
            📞 Call
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: colors.success }]}
          onPress={() => Alert.alert('Email', `Email ${item.firstName}?`)}
        >
          <Text style={[styles.actionButtonText, { color: colors.success }]}>
            ✉️ Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.success }]}
          onPress={() => setSelectedContact(item)}
        >
          <Text style={styles.primaryButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDeal = ({ item }: { item: Deal }) => {
    const contact = contacts.find(c => c.id === item.contactId);
    return (
      <View style={[styles.dealCard, { backgroundColor: colors.surface }]}>
        <View style={styles.dealHeader}>
          <View style={styles.dealInfo}>
            <Text style={[styles.dealTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.dealContact, { color: colors.textSecondary }]}>
              {contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact'}
            </Text>
          </View>
          <Text style={[styles.dealValue, { color: colors.success }]}>
            ${item.value.toLocaleString()}
          </Text>
        </View>

        <View style={styles.dealMeta}>
          <View style={[styles.stageBadge, { backgroundColor: getStageColor(item.stage) }]}>
            <Text style={styles.stageText}>{item.stage.toUpperCase().replace('-', ' ')}</Text>
          </View>
          <Text style={[styles.probability, { color: colors.textSecondary }]}>
            {item.probability}% probability
          </Text>
        </View>

        <Text style={[styles.dealDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>

        <View style={styles.dealFooter}>
          <Text style={[styles.closeDate, { color: colors.textSecondary }]}>
            Expected close: {item.expectedCloseDate.toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.success }]}
            onPress={() => Alert.alert('Deal Details', `View details for "${item.title}"`)}
          >
            <Text style={styles.primaryButtonText}>Manage</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderActivity = ({ item }: { item: Activity }) => {
    const contact = contacts.find(c => c.id === item.contactId);
    const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && !item.completed;

    return (
      <View style={[styles.activityCard, { backgroundColor: colors.surface }]}>
        <View style={styles.activityHeader}>
          <View style={styles.activityInfo}>
            <Text style={[styles.activityTitle, { color: colors.text }]}>
              {getActivityIcon(item.type)} {item.title}
            </Text>
            <Text style={[styles.activityContact, { color: colors.textSecondary }]}>
              {contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact'}
            </Text>
          </View>
          <View style={[
            styles.activityStatus,
            { backgroundColor: item.completed ? '#4CAF50' : isOverdue ? '#F44336' : '#FF9800' }
          ]}>
            <Text style={styles.activityStatusText}>
              {item.completed ? 'DONE' : isOverdue ? 'OVERDUE' : 'PENDING'}
            </Text>
          </View>
        </View>

        <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>

        {item.dueDate && (
          <Text style={[styles.activityDue, { color: isOverdue ? '#F44336' : colors.textSecondary }]}>
            Due: {item.dueDate.toLocaleDateString()}
          </Text>
        )}

        <View style={styles.activityActions}>
          {!item.completed && (
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: colors.success }]}
              onPress={() => Alert.alert('Mark Complete', `Mark "${item.title}" as completed?`)}
            >
              <Text style={[styles.actionButtonText, { color: colors.success }]}>
                ✓ Complete
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.success }]}
            onPress={() => Alert.alert('Activity Details', `View details for "${item.title}"`)}
          >
            <Text style={styles.primaryButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '✉️';
      case 'meeting': return '🤝';
      case 'note': return '📝';
      case 'task': return '✅';
      default: return '📋';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'contacts':
        return (
          <FlatList
            data={filteredContacts}
            renderItem={renderContact}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentList}
          />
        );
      case 'deals':
        return (
          <FlatList
            data={deals}
            renderItem={renderDeal}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentList}
          />
        );
      case 'activities':
        return (
          <FlatList
            data={activities}
            renderItem={renderActivity}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentList}
          />
        );
      case 'analytics':
        return (
          <ScrollView style={styles.analyticsContainer}>
            <View style={[styles.analyticsCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.analyticsTitle, { color: colors.text }]}>
                CRM Analytics
              </Text>
              <View style={styles.analyticsGrid}>
                <View style={styles.analytic}>
                  <Text style={[styles.analyticValue, { color: colors.success }]}>
                    {contacts.length}
                  </Text>
                  <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
                    Total Contacts
                  </Text>
                </View>
                <View style={styles.analytic}>
                  <Text style={[styles.analyticValue, { color: colors.success }]}>
                    {deals.length}
                  </Text>
                  <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
                    Active Deals
                  </Text>
                </View>
                <View style={styles.analytic}>
                  <Text style={[styles.analyticValue, { color: colors.success }]}>
                    ${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
                  </Text>
                  <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
                    Pipeline Value
                  </Text>
                </View>
                <View style={styles.analytic}>
                  <Text style={[styles.analyticValue, { color: colors.success }]}>
                    {activities.filter(a => !a.completed).length}
                  </Text>
                  <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
                    Pending Tasks
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {currentMode === 'faith' ? 'Kingdom CRM' : 'Customer Relations'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>
      </View>

      {/* Search and Filter */}
      {activeTab === 'contacts' && (
        <View style={styles.searchSection}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.primary + '20',
            }]}
            placeholder="Search contacts..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {(['all', 'lead', 'prospect', 'customer', 'partner'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && [
                    styles.activeFilter, 
                    { backgroundColor: colors.success }
                  ]
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  { color: selectedFilter === filter ? '#fff' : colors.textSecondary }
                ]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['contacts', 'deals', 'activities', 'analytics'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && [styles.activeTab, { backgroundColor: colors.success }]
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab ? styles.activeTabText : { color: colors.textSecondary }
            ]}>
              {tab === 'contacts' ? '👥' : tab === 'deals' ? '💰' : tab === 'activities' ? '📋' : '📊'}
            </Text>
            <Text style={[
              styles.tabLabel,
              activeTab === tab ? styles.activeTabText : { color: colors.textSecondary }
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.success }]}
          onPress={() => {
            if (activeTab === 'contacts') {
              setShowAddModal(true);
            } else {
              Alert.alert('Coming Soon', `Create ${activeTab} functionality coming soon!`);
            }
          }}
        >
          <Text style={styles.createButtonText}>
            + Add {activeTab === 'contacts' ? 'Contact' : 
                    activeTab === 'deals' ? 'Deal' : 
                    activeTab === 'activities' ? 'Activity' : 'Report'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>

      {/* Add Contact Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add Contact
            </Text>
            <TouchableOpacity onPress={addContact}>
              <Text style={[styles.saveText, { color: colors.success }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                First Name *
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.primary + '20',
                }]}
                value={newContact.firstName}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, firstName: text }))}
                placeholder="Enter first name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Last Name
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.primary + '20',
                }]}
                value={newContact.lastName}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, lastName: text }))}
                placeholder="Enter last name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Email *
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.primary + '20',
                }]}
                value={newContact.email}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, email: text }))}
                placeholder="Enter email address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Phone
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.primary + '20',
                }]}
                value={newContact.phone}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, phone: text }))}
                placeholder="Enter phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Company
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.primary + '20',
                }]}
                value={newContact.company}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, company: text }))}
                placeholder="Enter company name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Title
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.primary + '20',
                }]}
                value={newContact.title}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, title: text }))}
                placeholder="Enter job title"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Notes
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.primary + '20',
                }]}
                value={newContact.notes}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, notes: text }))}
                placeholder={currentMode === 'faith' ? 
                  "How can we serve this person in their journey?" :
                  "Notes about this contact..."
                }
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeFilter: {
    // backgroundColor applied dynamically
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeTab: {
    // backgroundColor applied dynamically
  },
  tabText: {
    fontSize: 18,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  actionBar: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentList: {
    gap: 16,
    paddingBottom: 20,
  },
  contactCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  starIcon: {
    fontSize: 16,
  },
  contactEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  contactCompany: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contactMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastContact: {
    fontSize: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dealCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dealInfo: {
    flex: 1,
    marginRight: 12,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dealContact: {
    fontSize: 14,
  },
  dealValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  probability: {
    fontSize: 12,
  },
  dealDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeDate: {
    fontSize: 12,
  },
  activityCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityInfo: {
    flex: 1,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityContact: {
    fontSize: 14,
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  activityDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  activityDue: {
    fontSize: 12,
    marginBottom: 12,
  },
  activityActions: {
    flexDirection: 'row',
    gap: 8,
  },
  analyticsContainer: {
    flex: 1,
  },
  analyticsCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  analytic: {
    alignItems: 'center',
    marginBottom: 20,
    width: '45%',
  },
  analyticValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  analyticLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 16,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default React.memo(CRMScreen);
