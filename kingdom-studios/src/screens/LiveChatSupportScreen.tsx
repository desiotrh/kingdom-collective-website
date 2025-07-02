import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'bot';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file' | 'quick_reply';
  attachments?: any[];
}

interface SupportTicket {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'waiting' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created: Date;
  lastUpdated: Date;
  assignedAgent?: string;
  messages: Message[];
}

const LiveChatSupportScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  
  const [currentView, setCurrentView] = useState<'chat' | 'tickets' | 'help'>('chat');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  // Mock data initialization
  useEffect(() => {
    loadMockData();
  }, [currentMode]);

  const loadMockData = () => {
    // Mock chat messages
    const mockMessages: Message[] = [
      {
        id: '1',
        text: currentMode === 'faith' 
          ? 'Welcome to Kingdom Studios Support! How can we help you on your ministry journey today? 🙏' 
          : 'Welcome to our support chat! How can we help you today? 😊',
        sender: 'support',
        timestamp: new Date(Date.now() - 300000),
        status: 'read',
        type: 'text'
      },
      {
        id: '2',
        text: 'Hi! I\'m having trouble with my content scheduling feature.',
        sender: 'user',
        timestamp: new Date(Date.now() - 240000),
        status: 'read',
        type: 'text'
      },
      {
        id: '3',
        text: currentMode === 'faith' 
          ? 'I understand the importance of consistent ministry content. Let me help you resolve this scheduling issue. Can you tell me what specific problem you\'re experiencing?'
          : 'I\'d be happy to help you with the scheduling feature! Can you tell me what specific issue you\'re facing?',
        sender: 'support',
        timestamp: new Date(Date.now() - 180000),
        status: 'read',
        type: 'text'
      }
    ];

    // Mock support tickets
    const mockTickets: SupportTicket[] = [
      {
        id: 'TK001',
        title: 'Content Scheduling Issue',
        status: 'in_progress',
        priority: 'medium',
        category: currentMode === 'faith' ? 'Ministry Tools' : 'Features',
        created: new Date(Date.now() - 86400000),
        lastUpdated: new Date(Date.now() - 3600000),
        assignedAgent: currentMode === 'faith' ? 'Brother Marcus' : 'Sarah',
        messages: mockMessages
      },
      {
        id: 'TK002',
        title: currentMode === 'faith' ? 'Prayer Room Access Problem' : 'Account Access Issue',
        status: 'waiting',
        priority: 'high',
        category: currentMode === 'faith' ? 'Spiritual Features' : 'Account',
        created: new Date(Date.now() - 172800000),
        lastUpdated: new Date(Date.now() - 7200000),
        assignedAgent: currentMode === 'faith' ? 'Sister Grace' : 'Mike',
        messages: []
      },
      {
        id: 'TK003',
        title: 'Analytics Dashboard Questions',
        status: 'closed',
        priority: 'low',
        category: 'Analytics',
        created: new Date(Date.now() - 259200000),
        lastUpdated: new Date(Date.now() - 86400000),
        assignedAgent: currentMode === 'faith' ? 'Deacon John' : 'Alex',
        messages: []
      }
    ];

    setMessages(mockMessages);
    setTickets(mockTickets);
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    
    // Simulate typing indicator
    setIsAgentTyping(true);
    setTimeout(() => {
      setIsAgentTyping(false);
      // Simulate support response
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: currentMode === 'faith' 
          ? 'Thank you for your message. I\'m reviewing this and will respond shortly. May God bless your patience! 🙏'
          : 'Thanks for your message! I\'m looking into this and will get back to you shortly.',
        sender: 'support',
        timestamp: new Date(),
        status: 'sent',
        type: 'text'
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);

    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
      case 'sent':
        return colors.info;
      case 'in_progress':
      case 'delivered':
        return colors.warning;
      case 'waiting':
        return colors.error;
      case 'closed':
      case 'read':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return colors.error;
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.info;
      case 'low':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    const isBot = message.sender === 'bot';
    
    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.supportMessage
      ]}>
        {!isUser && (
          <View style={[styles.agentAvatar, { backgroundColor: colors.primary }]}>
            <MaterialIcons 
              name={isBot ? 'smart-toy' : 'support-agent'} 
              size={16} 
              color="#FFFFFF" 
            />
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          { backgroundColor: isUser ? colors.primary : colors.surface }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isUser ? '#FFFFFF' : colors.text }
          ]}>
            {message.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[
              styles.messageTime,
              { color: isUser ? 'rgba(255,255,255,0.7)' : colors.textSecondary }
            ]}>
              {formatTimestamp(message.timestamp)}
            </Text>
            {isUser && (
              <MaterialIcons 
                name={message.status === 'read' ? 'done-all' : 'done'} 
                size={12} 
                color={message.status === 'read' ? colors.success : 'rgba(255,255,255,0.7)'} 
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderTicket = (ticket: SupportTicket) => (
    <TouchableOpacity key={ticket.id} style={[styles.ticketCard, { backgroundColor: colors.surface }]}>
      <View style={styles.ticketHeader}>
        <Text style={[styles.ticketId, { color: colors.textSecondary }]}>
          #{ticket.id}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
          <Text style={styles.statusText}>{ticket.status.replace('_', ' ')}</Text>
        </View>
      </View>
      
      <Text style={[styles.ticketTitle, { color: colors.text }]}>
        {ticket.title}
      </Text>
      
      <View style={styles.ticketMeta}>
        <View style={styles.ticketMetaItem}>
          <MaterialIcons name="category" size={14} color={colors.textSecondary} />
          <Text style={[styles.ticketMetaText, { color: colors.textSecondary }]}>
            {ticket.category}
          </Text>
        </View>
        
        <View style={styles.ticketMetaItem}>
          <MaterialIcons name="priority-high" size={14} color={getPriorityColor(ticket.priority)} />
          <Text style={[styles.ticketMetaText, { color: getPriorityColor(ticket.priority) }]}>
            {ticket.priority}
          </Text>
        </View>
        
        <View style={styles.ticketMetaItem}>
          <MaterialIcons name="person" size={14} color={colors.textSecondary} />
          <Text style={[styles.ticketMetaText, { color: colors.textSecondary }]}>
            {ticket.assignedAgent || 'Unassigned'}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.ticketDate, { color: colors.textSecondary }]}>
        Updated {formatDate(ticket.lastUpdated)}
      </Text>
    </TouchableOpacity>
  );

  const renderHelpSection = () => (
    <ScrollView style={styles.helpContent}>
      <View style={styles.helpSection}>
        <Text style={[styles.helpSectionTitle, { color: colors.text }]}>
          {currentMode === 'faith' ? '🙏 Frequently Asked Questions' : '❓ Frequently Asked Questions'}
        </Text>
        
        {[
          {
            question: currentMode === 'faith' ? 'How do I schedule my ministry content?' : 'How do I schedule my content?',
            answer: currentMode === 'faith' 
              ? 'You can schedule your ministry content using our Content Scheduler. Go to Content Generator > Schedule, select your platforms, and set your desired posting times. God\'s timing is perfect!'
              : 'You can schedule content using our Content Scheduler. Navigate to Content Generator > Schedule, choose your platforms, and set your posting times.'
          },
          {
            question: currentMode === 'faith' ? 'Can I get prayer support through the app?' : 'How do I contact support?',
            answer: currentMode === 'faith'
              ? 'Absolutely! Visit our Prayer Room where you can submit prayer requests and connect with our prayer team. We believe in the power of prayer and community support.'
              : 'You can contact support through this chat system, submit a ticket, or email us at support@kingdomstudios.app. We typically respond within 24 hours.'
          },
          {
            question: currentMode === 'faith' ? 'How do I track my kingdom impact?' : 'How do I track my analytics?',
            answer: currentMode === 'faith'
              ? 'Use our Kingdom Analytics to track your spiritual impact, community growth, and content performance. Remember, every soul touched is a victory for the Kingdom!'
              : 'Access your analytics dashboard to view detailed metrics about your content performance, engagement rates, and growth statistics.'
          }
        ].map((faq, index) => (
          <View key={index} style={[styles.faqItem, { backgroundColor: colors.background }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>
              {faq.question}
            </Text>
            <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
              {faq.answer}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.helpSection}>
        <Text style={[styles.helpSectionTitle, { color: colors.text }]}>
          {currentMode === 'faith' ? '📧 Contact Our Ministry Team' : '📧 Contact Information'}
        </Text>
        
        <View style={[styles.contactCard, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="email" size={20} color={colors.primary} />
          <Text style={[styles.contactText, { color: colors.text }]}>
            {currentMode === 'faith' ? 'ministry@kingdomstudios.app' : 'support@kingdomstudios.app'}
          </Text>
        </View>
        
        <View style={[styles.contactCard, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="access-time" size={20} color={colors.primary} />
          <Text style={[styles.contactText, { color: colors.text }]}>
            {currentMode === 'faith' ? 'Available 24/7 for urgent ministry needs' : 'Available Mon-Fri, 9AM-6PM EST'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {currentMode === 'faith' ? '💬 Ministry Support' : '💬 Live Support'}
        </Text>
        
        {/* Connection Status */}
        <View style={styles.connectionStatus}>
          <View style={[
            styles.connectionDot,
            { backgroundColor: isConnected ? colors.success : colors.error }
          ]} />
          <Text style={[styles.connectionText, { color: colors.textSecondary }]}>
            {isConnected ? 'Connected' : 'Reconnecting...'}
          </Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {[
          { key: 'chat', label: currentMode === 'faith' ? 'Live Chat' : 'Chat', icon: 'chat' },
          { key: 'tickets', label: 'Tickets', icon: 'assignment' },
          { key: 'help', label: 'Help', icon: 'help' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              { backgroundColor: currentView === tab.key ? colors.primary : 'transparent' }
            ]}
            onPress={() => setCurrentView(tab.key as any)}
          >
            <MaterialIcons 
              name={tab.icon as any} 
              size={20} 
              color={currentView === tab.key ? '#FFFFFF' : colors.textSecondary} 
            />
            <Text style={[
              styles.tabText,
              { color: currentView === tab.key ? '#FFFFFF' : colors.textSecondary }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {currentView === 'chat' && (
          <>
            <ScrollView 
              ref={scrollViewRef}
              style={styles.chatContainer}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(renderMessage)}
              
              {isAgentTyping && (
                <View style={[styles.messageContainer, styles.supportMessage]}>
                  <View style={[styles.agentAvatar, { backgroundColor: colors.primary }]}>
                    <MaterialIcons name="support-agent" size={16} color="#FFFFFF" />
                  </View>
                  <View style={[styles.messageBubble, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.typingText, { color: colors.textSecondary }]}>
                      {currentMode === 'faith' ? 'Ministry team is typing...' : 'Support is typing...'}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
            
            {/* Message Input */}
            <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder={currentMode === 'faith' ? 'Share your ministry needs...' : 'Type your message...'}
                placeholderTextColor={colors.textSecondary}
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={500}
              />
              
              <View style={styles.inputActions}>
                <TouchableOpacity style={styles.attachButton}>
                  <MaterialIcons name="attach-file" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    { backgroundColor: messageText.trim() ? colors.primary : colors.textSecondary }
                  ]}
                  onPress={sendMessage}
                  disabled={!messageText.trim()}
                >
                  <MaterialIcons name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {currentView === 'tickets' && (
          <ScrollView style={styles.ticketsContainer}>
            <View style={styles.ticketsHeader}>
              <Text style={[styles.ticketsTitle, { color: colors.text }]}>
                {currentMode === 'faith' ? 'Ministry Support Tickets' : 'Support Tickets'}
              </Text>
              
              <TouchableOpacity style={[styles.newTicketButton, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.newTicketText}>New Ticket</Text>
              </TouchableOpacity>
            </View>
            
            {tickets.map(renderTicket)}
          </ScrollView>
        )}

        {currentView === 'help' && renderHelpSection()}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  // Chat Styles
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  supportMessage: {
    justifyContent: 'flex-start',
  },
  agentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
    marginRight: 4,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachButton: {
    padding: 8,
    marginRight: 4,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
  },
  // Tickets Styles
  ticketsContainer: {
    flex: 1,
    padding: 16,
  },
  ticketsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  newTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  newTicketText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  ticketCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ticketTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  ticketMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  ticketMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  ticketMetaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  ticketDate: {
    fontSize: 11,
  },
  // Help Styles
  helpContent: {
    flex: 1,
    padding: 16,
  },
  helpSection: {
    marginBottom: 24,
  },
  helpSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  faqItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 18,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 12,
  },
});

export default LiveChatSupportScreen;
