import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KingdomColors } from '../constants/KingdomColors';
import { useAuth } from '../contexts/AuthContext';
import { AppMode } from '../types/spiritual';

const { width } = Dimensions.get('window');

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  order: number;
  type: 'social' | 'store' | 'custom' | 'donation';
}

interface BioSettings {
  profilePhoto: string;
  displayName: string;
  bio: string;
  missionStatement: string;
  backgroundColor: string;
  accentColor: string;
  showMissionStatement: boolean;
  showSponsorButton: boolean;
  sponsorButtonText: string;
  sponsorButtonUrl: string;
}

const LinkInBioBuilderScreen: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AppMode>('faith');
  const [activeTab, setActiveTab] = useState<'design' | 'links' | 'preview'>('design');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [bioSettings, setBioSettings] = useState<BioSettings>({
    profilePhoto: '',
    displayName: user?.displayName || 'Your Name',
    bio: mode === 'faith' ? 'Faith-driven creator sharing God\'s love through business' : 'Creative entrepreneur building something amazing',
    missionStatement: mode === 'faith' ? '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future." - Jeremiah 29:11' : 'Inspiring others to achieve their dreams through creativity and determination.',
    backgroundColor: '#1A1A3A',
    accentColor: '#FFD700',
    showMissionStatement: true,
    showSponsorButton: mode === 'faith',
    sponsorButtonText: mode === 'faith' ? 'Support This Ministry' : 'Support My Work',
    sponsorButtonUrl: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadDefaultLinks();
  }, [mode]);

  const loadDefaultLinks = () => {
    const defaultLinks: LinkItem[] = mode === 'faith' ? [
      {
        id: '1',
        title: 'My Etsy Shop',
        url: 'https://etsy.com/shop/yourshop',
        icon: '🛍️',
        isActive: true,
        order: 1,
        type: 'store'
      },
      {
        id: '2',
        title: 'Instagram',
        url: 'https://instagram.com/yourusername',
        icon: '📸',
        isActive: true,
        order: 2,
        type: 'social'
      },
      {
        id: '3',
        title: 'TikTok',
        url: 'https://tiktok.com/@yourusername',
        icon: '🎵',
        isActive: true,
        order: 3,
        type: 'social'
      },
      {
        id: '4',
        title: 'Prayer Requests',
        url: 'mailto:prayers@yourdomain.com',
        icon: '🙏',
        isActive: true,
        order: 4,
        type: 'custom'
      },
      {
        id: '5',
        title: 'Support Ministry',
        url: 'https://donate.yourchurch.org',
        icon: '💝',
        isActive: false,
        order: 5,
        type: 'donation'
      }
    ] : [
      {
        id: '1',
        title: 'My Store',
        url: 'https://yourstore.com',
        icon: '🛍️',
        isActive: true,
        order: 1,
        type: 'store'
      },
      {
        id: '2',
        title: 'Instagram',
        url: 'https://instagram.com/yourusername',
        icon: '📸',
        isActive: true,
        order: 2,
        type: 'social'
      },
      {
        id: '3',
        title: 'TikTok',
        url: 'https://tiktok.com/@yourusername',
        icon: '🎵',
        isActive: true,
        order: 3,
        type: 'social'
      },
      {
        id: '4',
        title: 'YouTube',
        url: 'https://youtube.com/@yourusername',
        icon: '📺',
        isActive: true,
        order: 4,
        type: 'social'
      },
      {
        id: '5',
        title: 'Buy Me Coffee',
        url: 'https://buymeacoffee.com/yourusername',
        icon: '☕',
        isActive: false,
        order: 5,
        type: 'donation'
      }
    ];
    setLinks(defaultLinks);
  };

  const addNewLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: 'New Link',
      url: 'https://',
      icon: '🔗',
      isActive: true,
      order: links.length + 1,
      type: 'custom'
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (id: string, updates: Partial<LinkItem>) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, ...updates } : link
    ));
  };

  const deleteLink = (id: string) => {
    Alert.alert(
      'Delete Link',
      'Are you sure you want to delete this link?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setLinks(links.filter(link => link.id !== id))
        }
      ]
    );
  };

  const toggleLinkActive = (id: string) => {
    updateLink(id, { isActive: !links.find(l => l.id === id)?.isActive });
  };

  const saveBioPage = () => {
    // In real app, this would save to Firebase/API
    Alert.alert('Success', 'Your link in bio page has been saved!');
  };

  const generatePageUrl = () => {
    const username = user?.displayName?.toLowerCase().replace(/\s+/g, '') || 'user';
    return `https://kingdomstudios.bio/${username}`;
  };

  const renderModeToggle = () => (
    <View style={styles.modeToggle}>
      <TouchableOpacity
        style={[styles.modeButton, mode === 'faith' && styles.activeModeButton]}
        onPress={() => setMode('faith')}
      >
        <Ionicons 
          name="heart" 
          size={16} 
          color={mode === 'faith' ? KingdomColors.white : KingdomColors.gold.bright} 
        />
        <Text style={[styles.modeButtonText, mode === 'faith' && styles.activeModeText]}>
          Faith Mode
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.modeButton, mode === 'encouragement' && styles.activeModeButton]}
        onPress={() => setMode('encouragement')}
      >
        <Ionicons 
          name="flash" 
          size={16} 
          color={mode === 'encouragement' ? KingdomColors.white : KingdomColors.gold.bright} 
        />
        <Text style={[styles.modeButtonText, mode === 'encouragement' && styles.activeModeText]}>
          Encouragement Mode
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'design' && styles.activeTab]}
        onPress={() => setActiveTab('design')}
      >
        <Ionicons 
          name="color-palette" 
          size={20} 
          color={activeTab === 'design' ? KingdomColors.gold.bright : KingdomColors.text.muted} 
        />
        <Text style={[styles.tabText, activeTab === 'design' && styles.activeTabText]}>
          Design
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'links' && styles.activeTab]}
        onPress={() => setActiveTab('links')}
      >
        <Ionicons 
          name="link" 
          size={20} 
          color={activeTab === 'links' ? KingdomColors.gold.bright : KingdomColors.text.muted} 
        />
        <Text style={[styles.tabText, activeTab === 'links' && styles.activeTabText]}>
          Links
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'preview' && styles.activeTab]}
        onPress={() => setActiveTab('preview')}
      >
        <Ionicons 
          name="eye" 
          size={20} 
          color={activeTab === 'preview' ? KingdomColors.gold.bright : KingdomColors.text.muted} 
        />
        <Text style={[styles.tabText, activeTab === 'preview' && styles.activeTabText]}>
          Preview
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDesignTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        
        <Text style={styles.inputLabel}>Display Name</Text>
        <TextInput
          style={styles.textInput}
          value={bioSettings.displayName}
          onChangeText={(text) => setBioSettings({...bioSettings, displayName: text})}
          placeholder="Your name or brand"
          placeholderTextColor={KingdomColors.text.muted}
        />

        <Text style={styles.inputLabel}>Bio</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={bioSettings.bio}
          onChangeText={(text) => setBioSettings({...bioSettings, bio: text})}
          placeholder="Tell people about yourself..."
          placeholderTextColor={KingdomColors.text.muted}
          multiline
          numberOfLines={3}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Show Mission Statement</Text>
          <Switch
            value={bioSettings.showMissionStatement}
            onValueChange={(value) => setBioSettings({...bioSettings, showMissionStatement: value})}
            trackColor={{ false: KingdomColors.silver.light, true: KingdomColors.gold.bright }}
            thumbColor={bioSettings.showMissionStatement ? KingdomColors.white : KingdomColors.white}
          />
        </View>

        {bioSettings.showMissionStatement && (
          <>
            <Text style={styles.inputLabel}>
              {mode === 'faith' ? 'Scripture/Mission Statement' : 'Mission Statement'}
            </Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={bioSettings.missionStatement}
              onChangeText={(text) => setBioSettings({...bioSettings, missionStatement: text})}
              placeholder={mode === 'faith' ? 'Share your favorite verse or mission...' : 'Share your mission or inspiration...'}
              placeholderTextColor={KingdomColors.text.muted}
              multiline
              numberOfLines={4}
            />
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support Options</Text>
        
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>
            {mode === 'faith' ? 'Show "Support Ministry" Button' : 'Show "Support Me" Button'}
          </Text>
          <Switch
            value={bioSettings.showSponsorButton}
            onValueChange={(value) => setBioSettings({...bioSettings, showSponsorButton: value})}
            trackColor={{ false: KingdomColors.silver.light, true: KingdomColors.gold.bright }}
            thumbColor={bioSettings.showSponsorButton ? KingdomColors.white : KingdomColors.white}
          />
        </View>

        {bioSettings.showSponsorButton && (
          <>
            <Text style={styles.inputLabel}>Button Text</Text>
            <TextInput
              style={styles.textInput}
              value={bioSettings.sponsorButtonText}
              onChangeText={(text) => setBioSettings({...bioSettings, sponsorButtonText: text})}
              placeholder="Support This Ministry"
              placeholderTextColor={KingdomColors.text.muted}
            />

            <Text style={styles.inputLabel}>Support URL</Text>
            <TextInput
              style={styles.textInput}
              value={bioSettings.sponsorButtonUrl}
              onChangeText={(text) => setBioSettings({...bioSettings, sponsorButtonUrl: text})}
              placeholder="https://donate.example.com"
              placeholderTextColor={KingdomColors.text.muted}
            />
          </>
        )}
      </View>
    </ScrollView>
  );

  const renderLinksTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Links</Text>
        <TouchableOpacity style={styles.addButton} onPress={addNewLink}>
          <Ionicons name="add" size={24} color={KingdomColors.gold.bright} />
        </TouchableOpacity>
      </View>

      {links.map((link, index) => (
        <View key={link.id} style={styles.linkCard}>
          <View style={styles.linkHeader}>
            <TextInput
              style={styles.linkTitle}
              value={link.title}
              onChangeText={(text) => updateLink(link.id, { title: text })}
              placeholder="Link title"
              placeholderTextColor={KingdomColors.text.muted}
            />
            <View style={styles.linkActions}>
              <TouchableOpacity
                onPress={() => toggleLinkActive(link.id)}
                style={[styles.toggleButton, link.isActive && styles.toggleButtonActive]}
              >
                <Text style={[styles.toggleText, link.isActive && styles.toggleTextActive]}>
                  {link.isActive ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteLink(link.id)}>
                <Ionicons name="trash" size={20} color={KingdomColors.accent.error} />
              </TouchableOpacity>
            </View>
          </View>
          
          <TextInput
            style={styles.linkUrl}
            value={link.url}
            onChangeText={(text) => updateLink(link.id, { url: text })}
            placeholder="https://example.com"
            placeholderTextColor={KingdomColors.text.muted}
          />
          
          <Text style={styles.linkIcon}>Icon: {link.icon}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderPreviewTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.previewContainer}>
        <View style={styles.phoneFrame}>
          <LinearGradient
            colors={[bioSettings.backgroundColor, bioSettings.backgroundColor + 'CC']}
            style={styles.bioPage}
          >
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.profilePhoto}>
                <Text style={styles.profilePhotoText}>
                  {bioSettings.displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.profileName}>{bioSettings.displayName}</Text>
              <Text style={styles.profileBio}>{bioSettings.bio}</Text>
              
              {bioSettings.showMissionStatement && (
                <View style={styles.missionSection}>
                  <Text style={styles.missionText}>{bioSettings.missionStatement}</Text>
                </View>
              )}
            </View>

            {/* Links Section */}
            <View style={styles.linksSection}>
              {links.filter(link => link.isActive).map((link) => (
                <TouchableOpacity key={link.id} style={styles.bioLink}>
                  <Text style={styles.bioLinkIcon}>{link.icon}</Text>
                  <Text style={styles.bioLinkText}>{link.title}</Text>
                </TouchableOpacity>
              ))}
              
              {bioSettings.showSponsorButton && bioSettings.sponsorButtonText && (
                <TouchableOpacity style={[styles.bioLink, styles.sponsorButton]}>
                  <Text style={styles.bioLinkIcon}>💝</Text>
                  <Text style={[styles.bioLinkText, styles.sponsorButtonText]}>
                    {bioSettings.sponsorButtonText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Footer */}
            <View style={styles.bioFooter}>
              <Text style={styles.footerText}>
                {mode === 'faith' ? '✨ Powered by Kingdom Studios' : '⚡ Built with Kingdom Studios'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.previewActions}>
          <Text style={styles.pageUrl}>{generatePageUrl()}</Text>
          <TouchableOpacity style={styles.saveButton} onPress={saveBioPage}>
            <LinearGradient
              colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Publish Page</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
        style={styles.header}
      >
        <Text style={styles.title}>Link in Bio Builder</Text>
        <Text style={styles.subtitle}>
          {mode === 'faith' 
            ? 'Create a beautiful bio page that reflects your faith' 
            : 'Build a stunning bio page for your brand'
          }
        </Text>
        {renderModeToggle()}
      </LinearGradient>

      {renderTabBar()}

      {activeTab === 'design' && renderDesignTab()}
      {activeTab === 'links' && renderLinksTab()}
      {activeTab === 'preview' && renderPreviewTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.white,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    marginBottom: 20,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeModeButton: {
    backgroundColor: KingdomColors.gold.bright,
  },
  modeButtonText: {
    color: KingdomColors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeModeText: {
    color: KingdomColors.white,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: KingdomColors.gold.bright,
  },
  tabText: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginLeft: 8,
    fontWeight: '500',
  },
  activeTabText: {
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KingdomColors.gold.bright + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: KingdomColors.text.inverse,
    borderWidth: 2,
    borderColor: KingdomColors.silver.light,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: KingdomColors.text.inverse,
    flex: 1,
  },
  linkCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: KingdomColors.silver.light,
  },
  linkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  linkTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    marginRight: 16,
  },
  linkActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: KingdomColors.silver.light,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  toggleButtonActive: {
    backgroundColor: KingdomColors.accent.success,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.muted,
  },
  toggleTextActive: {
    color: KingdomColors.white,
  },
  linkUrl: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginBottom: 8,
  },
  linkIcon: {
    fontSize: 14,
    color: KingdomColors.text.muted,
  },
  previewContainer: {
    alignItems: 'center',
  },
  phoneFrame: {
    width: width * 0.7,
    height: width * 1.4,
    backgroundColor: KingdomColors.black,
    borderRadius: 30,
    padding: 4,
    marginBottom: 24,
  },
  bioPage: {
    flex: 1,
    borderRadius: 26,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: KingdomColors.gold.bright,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profilePhotoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    color: KingdomColors.white,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
  },
  missionSection: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  missionText: {
    fontSize: 12,
    color: KingdomColors.white,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  linksSection: {
    flex: 1,
    paddingTop: 20,
  },
  bioLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sponsorButton: {
    backgroundColor: KingdomColors.gold.bright + '40',
    borderWidth: 1,
    borderColor: KingdomColors.gold.bright,
  },
  bioLinkIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  bioLinkText: {
    fontSize: 16,
    color: KingdomColors.white,
    fontWeight: '500',
  },
  sponsorButtonText: {
    fontWeight: '600',
  },
  bioFooter: {
    paddingTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: KingdomColors.white,
    opacity: 0.6,
  },
  previewActions: {
    alignItems: 'center',
  },
  pageUrl: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginBottom: 16,
  },
  saveButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  saveButtonText: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LinkInBioBuilderScreen;
