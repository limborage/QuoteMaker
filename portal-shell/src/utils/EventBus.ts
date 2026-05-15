// Define a strict registry of allowed system events across the enterprise platform
export type PlatformEventType = 
  | 'QUOTE_CALCULATED' 
  | 'THEME_CHANGED' 
  | 'NOTIFY_ALERT';

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

export const PlatformEventBus = {
  emit<K extends PlatformEventType>(eventType: K, detail: PlatformEventDetailMap[K]) {
    const event = new CustomEvent(`platform:${eventType}`, { 
      detail,
      bubbles: true, 
      composed: true
    });
    window.dispatchEvent(event);
  },
  subscribe<K extends PlatformEventType>(
    eventType: K, 
    callback: (detail: PlatformEventDetailMap[K]) => void
  ) {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<PlatformEventDetailMap[K]>;
      callback(customEvent.detail);
    };

    window.addEventListener(`platform:${eventType}`, handler);
    
    return () => window.removeEventListener(`platform:${eventType}`, handler);
  }
};