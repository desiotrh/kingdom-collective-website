import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FaithModeContextProps {
    faithMode: boolean;
    encouragementMode: boolean;
    setFaithMode: (on: boolean) => void;
}

const FaithModeContext = createContext<FaithModeContextProps | undefined>(undefined);

export const FaithModeProvider = ({ children }: { children: ReactNode }) => {
    const [faithMode, setFaithMode] = useState(false);
    // Encouragement Mode is ON when Faith Mode is OFF
    const encouragementMode = !faithMode;

    return (
        <FaithModeContext.Provider value= {{ faithMode, encouragementMode, setFaithMode }
}>
    { children }
    </FaithModeContext.Provider>
  );
};

export const useFaithMode = () => {
    const context = useContext(FaithModeContext);
    if (!context) throw new Error('useFaithMode must be used within a FaithModeProvider');
    return context;
}; 