import { useEffect, useState } from 'react';
import FederatedComponent from './components/FederatedComponent';
import type { QuoteCalculationPayload } from 'quote_mfe/QuoteForm';
import { PlatformEventBus } from './utils/EventBus';


export default function App() {
  const [activeQuote, setActiveQuote] = useState<QuoteCalculationPayload | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleQuoteIntercept = (payload: QuoteCalculationPayload) => {
    console.log("[Portal Shell] Intercepted incoming MFE quote data payload:", payload);
    setActiveQuote(payload);
  };

  useEffect(() => {
    const unsubscribe = PlatformEventBus.subscribe('QUOTE_CALCULATED', (data) => {
      setNotification(
        `System Audit Alert: A new premium calculation of R ${data.totalAmount.toLocaleString()} was successfylly evaluated!`
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
          <h2 className="text-lg font-bold text-slate-200">Shell State Monitor</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            This module panel tracks state records inside the host container memory space.
          </p>

          {/* Conditional Display showing the data caught from the MFE */}
          {activeQuote ? (
            <div className="p-4 bg-slate-950 rounded-xl border border-blue-900/40 font-mono text-xs text-slate-300 flex flex-col gap-2 shadow-inner animate-fadeIn">
              <div className="text-blue-400 font-bold border-b border-slate-800 pb-1 text-[10px] tracking-wider uppercase">Captured Live Payload</div>
              <div>Subtotal: <span className="text-white font-semibold">R {activeQuote.baseAmount.toFixed(2)}</span></div>
              <div>VAT (15%): <span className="text-white font-semibold">R {activeQuote.vatAmount.toFixed(2)}</span></div>
              <div className="text-sm border-t border-slate-800 pt-1 mt-1 text-emerald-400">
                Total: <span className="font-bold">R {activeQuote.totalAmount.toFixed(2)}</span>
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
            loader={() => import('quote_mfe/QuoteForm')}
            componentProps={{ onQuoteCalculated: handleQuoteIntercept }}
            fallbackMessage="Streaming live quotation matrix assets..."
          />
        </section>

      </main>
    </div>
  );
}