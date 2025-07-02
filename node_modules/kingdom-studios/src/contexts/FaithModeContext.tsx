import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FaithModeContextType {
  faithMode: boolean;
  setFaithMode: (value: boolean) => Promise<void>;
  isLoading: boolean;
}

const FaithModeContext = createContext<FaithModeContextType | undefined>(undefined);

interface FaithModeProviderProps {
  children: ReactNode;
}

export const FaithModeProvider: React.FC<FaithModeProviderProps> = ({ children }) => {
  const [faithMode, setFaithModeState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load faith mode setting on app start
  useEffect(() => {
    loadFaithModeSetting();
  }, []);

  const loadFaithModeSetting = async () => {
    try {
      const savedFaithMode = await AsyncStorage.getItem('faithMode');
      if (savedFaithMode !== null) {
        setFaithModeState(JSON.parse(savedFaithMode));
      }
    } catch (error) {
      console.error('Error loading faith mode setting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setFaithMode = async (value: boolean): Promise<void> => {
    try {
      await AsyncStorage.setItem('faithMode', JSON.stringify(value));
      setFaithModeState(value);
    } catch (error) {
      console.error('Error saving faith mode setting:', error);
      throw error;
    }
  };

  const value: FaithModeContextType = {
    faithMode,
    setFaithMode,
    isLoading,
  };

  return (
    <FaithModeContext.Provider value={value}>
      {children}
    </FaithModeContext.Provider>
  );
};

export const useFaithMode = (): FaithModeContextType => {
  const context = useContext(FaithModeContext);
  if (context === undefined) {
    throw new Error('useFaithMode must be used within a FaithModeProvider');
  }
  return context;
};

// Helper functions for faith mode content
export const getFaithModeContent = (faithMode: boolean) => {
  return {
    // Welcome messages
    welcomeMessage: faithMode 
      ? "God has blessed you with creative gifts. Let's use them for His glory!" 
      : "Welcome back! Ready to create amazing content?",
    
    // Encouragement messages
    encouragement: faithMode
      ? [
          "Trust in the Lord with all your heart - Proverbs 3:5",
          "God has given you unique talents to share with the world",
          "Your creativity is a gift from the Creator Himself",
          "Let your light shine before others - Matthew 5:16",
          "In all your ways acknowledge Him - Proverbs 3:6"
        ]
      : [
          "You're doing great! Keep creating.",
          "Your content makes a difference.",
          "Consistency is key to growth.",
          "Stay focused on your goals.",
          "Every creator starts somewhere."
        ],
    
    // Button texts
    generateButtonText: faithMode ? "Create with Purpose" : "Generate Content",
    communityButtonText: faithMode ? "Build God's Kingdom" : "Build Community",
    
    // Error messages
    errorMessage: faithMode 
      ? "Trust that God will work this out for good. Please try again." 
      : "Something went wrong. Please try again.",
    
    // Success messages
    successMessage: faithMode 
      ? "Praise God! Your content has been created successfully." 
      : "Success! Your content has been created.",

    // Product examples
    productExamples: faithMode 
      ? [
          { title: 'Faith Over Fear T-Shirt', description: 'Wear your testimony boldly' },
          { title: 'Kingdom Crown Cap', description: 'Royal identity in Christ' },
          { title: 'Blessed Hoodie', description: 'Comfort meets faith' },
          { title: 'Scripture Phone Case', description: 'Daily word reminders' },
          { title: 'Cross Pendant Necklace', description: 'His love close to heart' },
          { title: 'Prayer Journal', description: 'Document your faith journey' }
        ]
      : [
          { title: 'Dream Big T-Shirt', description: 'Inspire bold dreams' },
          { title: 'Purpose-Driven Cap', description: 'Wear your mission' },
          { title: 'Motivation Hoodie', description: 'Comfort meets inspiration' },
          { title: 'Quote Phone Case', description: 'Daily inspiration' },
          { title: 'Compass Pendant Necklace', description: 'Find your direction' },
          { title: 'Goal Planner', description: 'Map your success journey' }
        ],

    // Content generation phrases
    contentPhrases: faithMode
      ? {
          openers: ['🙌 Just dropped:', '✝️ Blessed to share:', '🔥 Walking by faith:', '💎 God\'s creativity through:'],
          descriptions: ['— made for kingdom builders', '— designed with God\'s love', '— built for His glory', '— crafted for believers'],
          closers: ['Shop with purpose ✝️', 'Faith in every stitch 🧵', 'Building His kingdom 👑', 'Wear your faith boldly 💪']
        }
      : {
          openers: ['🌟 Just dropped:', '✨ Excited to share:', '🔥 Fresh and inspiring:', '💎 Quality meets purpose:'],
          descriptions: ['— made for changemakers', '— designed with care and purpose', '— built for your journey', '— crafted for those who inspire'],
          closers: ['Shop with intention ✨', 'Quality in every detail 🌟', 'Building dreams together 💫', 'Wear your purpose proudly 💪']
        }
  };
};
