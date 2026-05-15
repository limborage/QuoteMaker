import { createContext, useContext } from 'react';

export interface PlatformState {
  user: {
    name: string;
    role: string;
  };
  firmDetails: {
    businessName: string;
    registrationNumber: string;
    taxRate: number;
    currency: string;
  };
  theme: 'dark' | 'light';
}

export interface PlatformContextType {
  state: PlatformState;
  updateTheme: (theme: 'dark' | 'light') => void;
  updateBusinessName: (newName: string) => void;
}

// 1. Core context token
export const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

// 2. Core consumer hook moved here so Vite views the .tsx file as 100% pure components
export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}