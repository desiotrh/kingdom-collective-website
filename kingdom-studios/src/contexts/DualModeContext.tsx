import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ModeType = 'faith' | 'encouragement';

interface DualModeContextType {
  isDualMode: boolean;
  currentMode: ModeType;
  setCurrentMode: (mode: ModeType) => void;
  toggleMode: () => void;
  setDualMode: (enabled: boolean) => void;
}

export const DualModeContext = createContext<DualModeContextType | undefined>(undefined);

interface DualModeProviderProps {
  children: ReactNode;
}

export const DualModeProvider: React.FC<DualModeProviderProps> = ({ children }) => {
  const [isDualMode, setIsDualMode] = useState(true);
  const [currentMode, setCurrentMode] = useState<ModeType>('faith');

  const toggleMode = () => {
    setCurrentMode(currentMode === 'faith' ? 'encouragement' : 'faith');
  };

  const setDualMode = (enabled: boolean) => {
    setIsDualMode(enabled);
  };

  const value: DualModeContextType = {
    isDualMode,
    currentMode,
    setCurrentMode,
    toggleMode,
    setDualMode,
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
