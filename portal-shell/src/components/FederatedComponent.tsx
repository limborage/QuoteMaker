import React, { Suspense, useRef } from 'react';
import RemoteErrorBoundary from './RemoteErrorBoundary';

interface FederatedComponentProps<T> {
  loader: () => Promise<{ default: React.ComponentType<T> }>;
  componentProps: T;
  fallbackMessage?: string;
}

export default function FederatedComponent<T extends object>({ 
  loader, 
  componentProps,
  fallbackMessage = "Connecting to network service module..."
}: FederatedComponentProps<T>) {

  const lazyRef = useRef<React.LazyExoticComponent<React.ComponentType<T>> | null>(null);
  if (!lazyRef.current) {
    lazyRef.current = React.lazy(() => loader().catch((err) => {
      console.warn("[MFE Loader] Intercepted script load failure:", err);
      
      return {
        default: () => (
          <div className="p-5 bg-amber-950/30 border border-amber-800/50 rounded-xl text-amber-200 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl leading-none">⚠️</span>
              <div>
                <h4 className="font-semibold text-amber-300">Service Block Offline</h4>
                <p className="text-sm mt-1 text-amber-400/80 leading-relaxed">
                  The requested interface could not be streamed over the network. Please confirm that the module provider service is running.
                </p>
              </div>
            </div>
          </div>
        )
      };
    }));
  }
  const SafeLazyComponent = lazyRef.current;

  return (
    <RemoteErrorBoundary>
      <Suspense fallback={
        <div className="p-6 bg-slate-900/40 border border-slate-800/60 rounded-xl flex items-center gap-3 text-slate-400 animate-pulse">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">{fallbackMessage}</span>
        </div>
      }>
        <SafeLazyComponent {...componentProps} />
      </Suspense>
    </RemoteErrorBoundary>
  );
}