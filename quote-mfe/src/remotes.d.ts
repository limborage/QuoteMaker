declare module 'portal_shell/PlatformContext' {
  import React from 'react';

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

  export const PlatformContext: React.Context<PlatformContextType | undefined>;
  export function usePlatform(): PlatformContextType;
}

declare module 'portal_shell/EventBus' {
  export type PlatformEventType = 'QUOTE_CALCULATED' | 'THEME_CHANGED' | 'NOTIFY_ALERT';

  export interface PlatformEventDetailMap {
    'QUOTE_CALCULATED': {
      baseAmount: number;
      vatAmount: number;
      totalAmount: number;
      calculatedAt: string;
    };
    'THEME_CHANGED': { theme: 'dark' | 'light' };
    'NOTIFY_ALERT': { message: string; type: 'success' | 'error' | 'info' };
  }

  export const PlatformEventBus: {
    emit<K extends PlatformEventType>(eventType: K, detail: PlatformEventDetailMap[K]): void;
    subscribe<K extends PlatformEventType>(
      eventType: K, 
      callback: (detail: PlatformEventDetailMap[K]) => void
    ): () => void;
  };
}