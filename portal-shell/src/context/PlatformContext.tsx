import { useState, type ReactNode } from 'react';
import { PlatformContext, type PlatformState } from './PlatformContext';

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlatformState>({
    user: {
      name: "Lee Aaron",
      role: "Administrator"
    },
    firmDetails: {
      businessName: "Lee-Logic Consulting",
      registrationNumber: "2025/CIPC/LLC",
      taxRate: 0.15,
      currency: "ZAR"
    },
    theme: 'dark'
  });

  const updateTheme = (theme: 'dark' | 'light') => {
    setState((prev) => ({ ...prev, theme }));
  };

  const updateBusinessName = (newName: string) => {
    setState((prev) => ({
      ...prev,
      firmDetails: { ...prev.firmDetails, businessName: newName }
    }));
  };

  return (
    <PlatformContext.Provider value={{ state, updateTheme, updateBusinessName }}>
      {children}
    </PlatformContext.Provider>
  );
}