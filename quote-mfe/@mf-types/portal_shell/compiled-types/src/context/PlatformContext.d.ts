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
export declare const PlatformContext: import("react").Context<PlatformContextType | undefined>;
export declare function usePlatform(): PlatformContextType;
