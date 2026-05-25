import React, { useEffect, useState } from 'react';
import FederatedComponent from './components/FederatedComponent';
import { loadRemoteComponent } from './utils/RuntimeFederation';
import { PlatformEventBus } from './utils/EventBus';
import { usePlatformStore } from './store/usePlatformStore';
import { useQueryClient, useQuery } from '@tanstack/react-query';

// Explicitly define the schema contract mapping to our OPA / Remote sync properties
interface PlatformRatesSchema {
  vatMultiplier: number;
  complianceStatus: string;
  rulesetVersion: string;
  schemaVersion: string;
}

const quoteFormLoader = () => loadRemoteComponent('quote_mfe', './QuoteForm');

export default function App() {
  const [activeQuote, setActiveQuote] = useState<any>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const currency = usePlatformStore((state) => state.currency);
  const currencySymbol = currency == "ZAR" ? "R" : "€";
  const queryClient = useQueryClient();

  

  const { data: serverRates, isFetching } = useQuery<PlatformRatesSchema>({
    queryKey: ["livePlatformRates"],
    queryFn: async () => {
      const activeCache = queryClient.getQueryData<PlatformRatesSchema>(["livePlatformRates"]);

      return activeCache ?? null;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  const handleQuoteIntercept = (payload: any) => {
    console.log("[Portal Shell] Intercepted incoming MFE quote data payload:", payload);
    setActiveQuote(payload);
  };

  useEffect(() => {
    const unsubscribe = PlatformEventBus.subscribe('QUOTE_CALCULATED', (data) => {
      setNotification(
        `System Audit Alert: A new premium calculation of R ${data.totalAmount.toLocaleString()} was successfully evaluated!`
      );

      const timer = setTimeout(() => setNotification(null), 5000);

      return () => clearTimeout(timer);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">

      {notification && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-950/90 backdrop-blur border border-emerald-500/40 text-emerald-300 rounded-xl shadow-2xl max-w-md transition-all duration-300 animate-slide-in">
          <div className="flex gap-3 items-start">
            <div className="bg-emerald-500 text-slate-950 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              ✓
            </div>
            <p className="text-xs m-0 leading-relaxed font-medium">{notification}</p>
          </div>
        </div>
      )}
      
      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 py-8 border-b border-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Lee-Logic Enterprise Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Platform Shell Engine (Tailwind v4 Active)
          </p>
        </div>
      </header>

      {/* Main Grid Workspace Canvas */}
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Shell Tracking Dashboard */}
        <section className="lg:col-span-1 p-6 bg-slate-900/40 border border-slate-800/60 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-200">Shell State Monitor</h2>
            {/* Live Server Network Indicator Badge */}
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              isFetching 
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-400 animate-pulse' 
                : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
            }`}>
              {isFetching ? "Syncing API Cache..." : "Cache Linked"}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Tracking active state records inside host memory and shared network contexts.
          </p>

          {/* Now safe, fully typed, and clean without messy inline casting! */}
          {serverRates && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-400 flex flex-col gap-1.5">
              <div className="text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-0.5">Shared Cache Layers</div>
              <div>Ruleset Version: <span className="text-blue-400 font-semibold">{serverRates.rulesetVersion}</span></div>
              <div>Registry Rules Status: <span className="text-emerald-400 font-semibold">{serverRates.complianceStatus}</span></div>
            </div>
          )}

          {/* Conditional Display showing the data caught from the MFE via Event Bus */}
          {activeQuote ? (
            <div className="p-4 bg-slate-950 rounded-xl border border-blue-900/40 font-mono text-xs text-slate-300 flex flex-col gap-2 shadow-inner animate-fadeIn mt-2">
              <div className="text-blue-400 font-bold border-b border-slate-800 pb-1 text-[10px] tracking-wider uppercase">Captured Live Payload</div>
              <div>Subtotal: <span className="text-white font-semibold">{currencySymbol} {activeQuote.baseAmount.toFixed(2)}</span></div>
              <div>VAT (15%): <span className="text-white font-semibold">{currencySymbol} {activeQuote.vatAmount.toFixed(2)}</span></div>
              <div className="text-sm border-t border-slate-800 pt-1 mt-1 text-emerald-400">
                Total: <span className="font-bold">{currencySymbol} {activeQuote.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 font-mono text-xs text-slate-500 italic text-center">
              Awaiting transmission metrics from active service modules...
            </div>
          )}
        </section>

        {/* Right Columns: Container for incoming Micro-Frontend Blocks */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-slate-200">Live Service Modules</h2>
          
          {/* Passing the event handler down through the spread operator! */}
          <FederatedComponent
            loader={quoteFormLoader}
            componentProps={{ onQuoteCalculated: handleQuoteIntercept }}
            fallbackMessage="Streaming live quotation matrix assets..."
          />
        </section>

      </main>
    </div>
  );
}