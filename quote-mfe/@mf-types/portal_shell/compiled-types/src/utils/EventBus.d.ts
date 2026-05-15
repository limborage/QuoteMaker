export type PlatformEventType = 'QUOTE_CALCULATED' | 'THEME_CHANGED' | 'NOTIFY_ALERT';
export interface PlatformEventDetailMap {
    'QUOTE_CALCULATED': {
        baseAmount: number;
        vatAmount: number;
        totalAmount: number;
        calculatedAt: string;
    };
    'THEME_CHANGED': {
        theme: 'dark' | 'light';
    };
    'NOTIFY_ALERT': {
        message: string;
        type: 'success' | 'error' | 'info';
    };
}
export declare const PlatformEventBus: {
    emit<K extends PlatformEventType>(eventType: K, detail: PlatformEventDetailMap[K]): void;
    subscribe<K extends PlatformEventType>(eventType: K, callback: (detail: PlatformEventDetailMap[K]) => void): () => void;
};
