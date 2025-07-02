import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { useKingdomColors } from '../hooks/useKingdomColors';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  progress: number;
  enabled: boolean;
  rtl: boolean;
}

interface Translation {
  key: string;
  context: string;
  translations: { [langCode: string]: string };
  lastUpdated: string;
  status: 'complete' | 'pending' | 'review';
}

export default function MultiLanguageSupportScreen() {
  const { currentMode } = useDualMode();
  const colors = useKingdomColors();

  const [selectedView, setSelectedView] = useState<'overview' | 'languages' | 'translations' | 'settings'>('overview');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [fallbackLanguage, setFallbackLanguage] = useState('en');

  // Mock data
  const mockLanguages: Language[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      progress: 100,
      enabled: true,
      rtl: false,
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      progress: 95,
      enabled: true,
      rtl: false,
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      progress: 88,
      enabled: true,
      rtl: false,
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      progress: 75,
      enabled: false,
      rtl: false,
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇵🇹',
      progress: 92,
      enabled: true,
      rtl: false,
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      progress: 60,
      enabled: false,
      rtl: true,
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      progress: 45,
      enabled: false,
      rtl: false,
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      progress: 30,
      enabled: false,
      rtl: false,
    },
  ];

  const mockTranslations: Translation[] = [
    {
      key: 'welcome_message',
      context: currentMode === 'faith' ? 'Welcome Screen - Ministry Greeting' : 'Welcome Screen - General Greeting',
      translations: {
        en: currentMode === 'faith' ? 'Welcome to Kingdom Studios' : 'Welcome to our platform',
        es: currentMode === 'faith' ? 'Bienvenido a Kingdom Studios' : 'Bienvenido a nuestra plataforma',
        fr: currentMode === 'faith' ? 'Bienvenue chez Kingdom Studios' : 'Bienvenue sur notre plateforme',
        pt: currentMode === 'faith' ? 'Bem-vindo ao Kingdom Studios' : 'Bem-vindo à nossa plataforma',
      },
      lastUpdated: '2024-01-15',
      status: 'complete',
    },
    {
      key: 'navigation_dashboard',
      context: 'Navigation - Dashboard Tab',
      translations: {
        en: 'Dashboard',
        es: 'Panel de Control',
        fr: 'Tableau de Bord',
        pt: 'Painel',
      },
      lastUpdated: '2024-01-14',
      status: 'complete',
    },
    {
      key: 'action_create_project',
      context: currentMode === 'faith' ? 'Actions - Create Ministry Project' : 'Actions - Create Project',
      translations: {
        en: currentMode === 'faith' ? 'Create Ministry Project' : 'Create Project',
        es: currentMode === 'faith' ? 'Crear Proyecto de Ministerio' : 'Crear Proyecto',
        fr: currentMode === 'faith' ? 'Créer un Projet de Ministère' : 'Créer un Projet',
        pt: currentMode === 'faith' ? 'Criar Projeto de Ministério' : 'Criar Projeto',
      },
      lastUpdated: '2024-01-13',
      status: 'review',
    },
  ];

  const availableLanguages = [
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return colors.success;
      case 'review':
        return colors.warning;
      case 'pending':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return colors.success;
    if (progress >= 70) return colors.info;
    if (progress >= 50) return colors.warning;
    return colors.error;
  };

  const toggleLanguage = (languageCode: string) => {
    Alert.alert(
      'Language Toggle',
      `Language ${languageCode} has been ${mockLanguages.find(l => l.code === languageCode)?.enabled ? 'disabled' : 'enabled'}`
    );
  };

  const addLanguage = (language: any) => {
    Alert.alert('Success', `${language.name} has been added to your project`);
    setShowLanguageModal(false);
  };

  const generateTranslations = () => {
    Alert.alert(
      'Auto-Generate Translations',
      'AI-powered translations will be generated for missing entries. This may take a few minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: () => Alert.alert('Success', 'Translation generation started!') }
      ]
    );
  };

  const renderOverview = () => (
    <ScrollView style={styles.content}>
      {/* Summary Stats */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🌍 Localization Overview
        </Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {mockLanguages.filter(l => l.enabled).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>
              Active Languages
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {Math.round(mockLanguages.reduce((acc, l) => acc + l.progress, 0) / mockLanguages.length)}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>
              Average Completion
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {mockTranslations.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>
              Translation Keys
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {mockTranslations.filter(t => t.status === 'pending').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>
              Pending Review
            </Text>
          </View>
        </View>
      </View>

      {/* Language Progress */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          📊 Language Progress
        </Text>
        {mockLanguages.filter(l => l.enabled).map((language) => (
          <View key={language.code} style={[styles.languageProgress, { backgroundColor: colors.background }]}>
            <View style={styles.languageHeader}>
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <View style={styles.languageInfo}>
                <Text style={[styles.languageName, { color: colors.text }]}>
                  {language.name}
                </Text>
                <Text style={[styles.languageNative, { color: colors.text }]}>
                  {language.nativeName}
                </Text>
              </View>
              <Text style={[styles.progressPercent, { color: getProgressColor(language.progress) }]}>
                {language.progress}%
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: getProgressColor(language.progress), width: `${language.progress}%` }
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Recent Translations */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          📝 Recent Translations
        </Text>
        {mockTranslations.slice(0, 3).map((translation) => (
          <View key={translation.key} style={[styles.translationCard, { backgroundColor: colors.background }]}>
            <View style={styles.translationHeader}>
              <Text style={[styles.translationKey, { color: colors.text }]}>
                {translation.key}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(translation.status) }]}>
                <Text style={[styles.statusText, { color: colors.surface }]}>
                  {translation.status}
                </Text>
              </View>
            </View>
            <Text style={[styles.translationContext, { color: colors.text }]}>
              {translation.context}
            </Text>
            <Text style={[styles.translationDate, { color: colors.text }]}>
              Last updated: {translation.lastUpdated}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderLanguages = () => (
    <ScrollView style={styles.content}>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Supported Languages
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <Ionicons name="add" size={20} color={colors.surface} />
            <Text style={[styles.addButtonText, { color: colors.surface }]}>
              Add Language
            </Text>
          </TouchableOpacity>
        </View>
        
        {mockLanguages.map((language) => (
          <View key={language.code} style={[styles.languageCard, { backgroundColor: colors.background }]}>
            <View style={styles.languageCardHeader}>
              <View style={styles.languageCardInfo}>
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <View style={styles.languageDetails}>
                  <Text style={[styles.languageName, { color: colors.text }]}>
                    {language.name}
                  </Text>
                  <Text style={[styles.languageNative, { color: colors.text }]}>
                    {language.nativeName} • {language.code.toUpperCase()}
                  </Text>
                  {language.rtl && (
                    <Text style={[styles.rtlIndicator, { color: colors.info }]}>
                      RTL Support
                    </Text>
                  )}
                </View>
              </View>
              <Switch
                value={language.enabled}
                onValueChange={() => toggleLanguage(language.code)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>
            
            <View style={styles.languageProgress}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: getProgressColor(language.progress), width: `${language.progress}%` }
                  ]}
                />
              </View>
              <Text style={[styles.progressPercent, { color: getProgressColor(language.progress) }]}>
                {language.progress}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderAddLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Add Language
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.modalContent}>
          <Text style={[styles.modalSubtitle, { color: colors.text }]}>
            Select languages to add to your project
          </Text>
          
          {availableLanguages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[styles.languageOption, { backgroundColor: colors.surface }]}
              onPress={() => addLanguage(language)}
            >
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <View style={styles.languageDetails}>
                <Text style={[styles.languageName, { color: colors.text }]}>
                  {language.name}
                </Text>
                <Text style={[styles.languageNative, { color: colors.text }]}>
                  {language.nativeName}
                </Text>
              </View>
              <Ionicons name="add-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          🌍 Multi-Language Support
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.text }]}>
          {currentMode === 'faith' 
            ? 'Spread the Gospel message to every nation and tongue'
            : 'Reach global audiences with localized content'
          }
        </Text>
      </View>

      {/* Navigation Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {[
          { key: 'overview', label: 'Overview', icon: 'analytics' },
          { key: 'languages', label: 'Languages', icon: 'globe' },
          { key: 'translations', label: 'Translations', icon: 'text' },
          { key: 'settings', label: 'Settings', icon: 'settings' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              {
                backgroundColor: selectedView === tab.key ? colors.primary : colors.surface,
              }
            ]}
            onPress={() => setSelectedView(tab.key as any)}
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
      </ScrollView>

      {/* Content */}
      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'languages' && renderLanguages()}
      {selectedView === 'translations' && (
        <ScrollView style={styles.content}>
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Translation Management
              </Text>
              <TouchableOpacity
                style={[styles.generateButton, { backgroundColor: colors.secondary }]}
                onPress={generateTranslations}
              >
                <Ionicons name="flash" size={16} color={colors.surface} />
                <Text style={[styles.generateButtonText, { color: colors.surface }]}>
                  AI Generate
                </Text>
              </TouchableOpacity>
            </View>
            
            {mockTranslations.map((translation) => (
              <View key={translation.key} style={[styles.translationCard, { backgroundColor: colors.background }]}>
                <View style={styles.translationHeader}>
                  <Text style={[styles.translationKey, { color: colors.text }]}>
                    {translation.key}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(translation.status) }]}>
                    <Text style={[styles.statusText, { color: colors.surface }]}>
                      {translation.status}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.translationContext, { color: colors.text }]}>
                  {translation.context}
                </Text>
                <View style={styles.translationLanguages}>
                  {Object.entries(translation.translations).map(([code, text]) => (
                    <View key={code} style={[styles.translationItem, { backgroundColor: colors.surface }]}>
                      <Text style={[styles.translationLang, { color: colors.accent }]}>
                        {code.toUpperCase()}:
                      </Text>
                      <Text style={[styles.translationText, { color: colors.text }]}>
                        {text}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
      {selectedView === 'settings' && (
        <ScrollView style={styles.content}>
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Localization Settings
            </Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Auto-Translation
                </Text>
                <Text style={[styles.settingDescription, { color: colors.text }]}>
                  Automatically generate translations using AI
                </Text>
              </View>
              <Switch
                value={autoTranslate}
                onValueChange={setAutoTranslate}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor={colors.surface}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Fallback Language
                </Text>
                <Text style={[styles.settingDescription, { color: colors.text }]}>
                  Default language when translation is missing
                </Text>
              </View>
              <TouchableOpacity style={[styles.settingButton, { backgroundColor: colors.background }]}>
                <Text style={[styles.settingButtonText, { color: colors.text }]}>
                  English (EN)
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Modals */}
      {renderAddLanguageModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  tabsContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  generateButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  languageProgress: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageInfo: {
    flex: 1,
  },
  languageDetails: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
  },
  languageNative: {
    fontSize: 14,
    marginTop: 2,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  languageCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  languageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  languageCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rtlIndicator: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  translationCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  translationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  translationKey: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  translationContext: {
    fontSize: 14,
    marginBottom: 10,
  },
  translationDate: {
    fontSize: 12,
  },
  translationLanguages: {
    marginTop: 10,
  },
  translationItem: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  translationLang: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 30,
  },
  translationText: {
    fontSize: 14,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  settingButtonText: {
    fontSize: 14,
    marginRight: 5,
  },
});
