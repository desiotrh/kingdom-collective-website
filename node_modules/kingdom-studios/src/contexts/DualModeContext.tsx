import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ModeType = 'faith' | 'encouragement';
export type UserType = 'individual' | 'business';
export type TierType = 'free' | 'creator' | 'pro' | 'business';

interface ModeConfig {
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  icon: string;
  features: {
    contentTone: 'faith-based' | 'inspirational';
    scriptures: boolean;
    declarations: boolean;
    religiousLanguage: boolean;
    communityFeatures: boolean;
  };
}

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

interface DualModeContextType {
  // Mode Management
  isDualMode: boolean;
  currentMode: ModeType;
  userType: UserType;
  userTier: TierType;
  
  // Mode Configuration
  modeConfig: ModeConfig;
  availableModes: Record<ModeType, ModeConfig>;
  colors: ColorScheme;
  
  // Functions
  setCurrentMode: (mode: ModeType) => Promise<void>;
  toggleMode: () => Promise<void>;
  setDualMode: (enabled: boolean) => Promise<void>;
  setUserType: (type: UserType) => Promise<void>;
  setUserTier: (tier: TierType) => Promise<void>;
  
  // Content Helpers
  getContentTone: () => string;
  shouldShowScriptures: () => boolean;
  shouldShowDeclarations: () => boolean;
  getModeSpecificContent: (faithContent: string, encouragementContent: string) => string;
  
  // Loading State
  isLoading: boolean;
}

export const DualModeContext = createContext<DualModeContextType | undefined>(undefined);

interface DualModeProviderProps {
  children: ReactNode;
}

// Mode Configurations
const AVAILABLE_MODES: Record<ModeType, ModeConfig> = {
  faith: {
    name: 'Faith Mode',
    description: 'Christian creators with bold Kingdom language, scriptures, and declarations',
    primaryColor: '#2D1B69',
    accentColor: '#FFD700',
    backgroundColor: '#0F0F23',
    textColor: '#FFFFFF',
    icon: 'heart',
    features: {
      contentTone: 'faith-based',
      scriptures: true,
      declarations: true,
      religiousLanguage: true,
      communityFeatures: true,
    },
  },
  encouragement: {
    name: 'Encouragement Mode',
    description: 'Universal encouragement with wisdom and clean tone (non-religious)',
    primaryColor: '#4C1D95',
    accentColor: '#FFC107',
    backgroundColor: '#1A1A3A',
    textColor: '#E5E7EB',
    icon: 'star',
    features: {
      contentTone: 'inspirational',
      scriptures: false,
      declarations: false,
      religiousLanguage: false,
      communityFeatures: true,
    },
  },
};

export const DualModeProvider: React.FC<DualModeProviderProps> = ({ children }) => {
  const [isDualMode, setIsDualMode] = useState(true);
  const [currentMode, setCurrentModeState] = useState<ModeType>('faith');
  const [userType, setUserTypeState] = useState<UserType>('individual');
  const [userTier, setUserTierState] = useState<TierType>('free');
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedMode, savedUserType, savedUserTier, savedDualMode] = await Promise.all([
        AsyncStorage.getItem('currentMode'),
        AsyncStorage.getItem('userType'),
        AsyncStorage.getItem('userTier'),
        AsyncStorage.getItem('isDualMode'),
      ]);

      if (savedMode) setCurrentModeState(savedMode as ModeType);
      if (savedUserType) setUserTypeState(savedUserType as UserType);
      if (savedUserTier) setUserTierState(savedUserTier as TierType);
      if (savedDualMode !== null) setIsDualMode(JSON.parse(savedDualMode));
    } catch (error) {
      console.error('Error loading dual mode settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentMode = async (mode: ModeType) => {
    try {
      await AsyncStorage.setItem('currentMode', mode);
      setCurrentModeState(mode);
    } catch (error) {
      console.error('Error saving current mode:', error);
    }
  };

  const toggleMode = async () => {
    const newMode: ModeType = currentMode === 'faith' ? 'encouragement' : 'faith';
    await setCurrentMode(newMode);
  };

  const setDualMode = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('isDualMode', JSON.stringify(enabled));
      setIsDualMode(enabled);
    } catch (error) {
      console.error('Error saving dual mode setting:', error);
    }
  };

  const setUserType = async (type: UserType) => {
    try {
      await AsyncStorage.setItem('userType', type);
      setUserTypeState(type);
    } catch (error) {
      console.error('Error saving user type:', error);
    }
  };

  const setUserTier = async (tier: TierType) => {
    try {
      await AsyncStorage.setItem('userTier', tier);
      setUserTierState(tier);
    } catch (error) {
      console.error('Error saving user tier:', error);
    }
  };

  // Content Helpers
  const getContentTone = (): string => {
    return AVAILABLE_MODES[currentMode].features.contentTone;
  };

  const shouldShowScriptures = (): boolean => {
    return AVAILABLE_MODES[currentMode].features.scriptures;
  };

  const shouldShowDeclarations = (): boolean => {
    return AVAILABLE_MODES[currentMode].features.declarations;
  };

  const getModeSpecificContent = (faithContent: string, encouragementContent: string): string => {
    return currentMode === 'faith' ? faithContent : encouragementContent;
  };

  // Color scheme getter
  const getColors = (): ColorScheme => {
    const config = AVAILABLE_MODES[currentMode];
    return {
      primary: config.primaryColor,
      secondary: config.accentColor,
      accent: config.accentColor,
      background: config.backgroundColor,
      surface: currentMode === 'faith' ? '#1A1A3A' : '#2A2A4A',
      text: config.textColor,
      textSecondary: currentMode === 'faith' ? '#B8BCC8' : '#9CA3AF',
      border: currentMode === 'faith' ? '#374151' : '#4B5563',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    };
  };

  const modeConfig = AVAILABLE_MODES[currentMode];
  const colors = getColors();

  const value: DualModeContextType = {
    // Mode Management
    isDualMode,
    currentMode,
    userType,
    userTier,
    
    // Mode Configuration
    modeConfig,
    availableModes: AVAILABLE_MODES,
    colors,
    
    // Functions
    setCurrentMode,
    toggleMode,
    setDualMode,
    setUserType,
    setUserTier,
    
    // Content Helpers
    getContentTone,
    shouldShowScriptures,
    shouldShowDeclarations,
    getModeSpecificContent,
    
    // Loading State
    isLoading,
  };

  return (
    <DualModeContext.Provider value={value}>
      {children}
    </DualModeContext.Provider>
  );
};

export const useDualMode = (): DualModeContextType => {
  const context = useContext(DualModeContext);
  if (!context) {
    throw new Error('useDualMode must be used within a DualModeProvider');
  }
  return context;
};
