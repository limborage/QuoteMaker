import { useMemo, useState } from "react";
import { usePlatform } from "portal_shell/PlatformContext";
import { PlatformEventBus } from "portal_shell/EventBus";
import { useSharedPlatformStore } from "../../hooks/useSharedPlatformStore";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QuoteCalculationPayload {
  baseAmount: number;
  vatAmount: number;
  totalAmount: number;
  calculatedAt: string;
}

interface QuoteFormProps {
  onQuoteCalculated?: (payload: QuoteCalculationPayload) => void;
}

const fetchLiveTaxRates = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    vatMultiplier: 0.15, // 15% South African Standard VAT rate
    complianceStatus: "Operational",
    rulesetVersion: "v2026.2.1",
    schemaVersion: "1.0.4"
  };
};

function QuoteForm({
  onQuoteCalculated,
}: QuoteFormProps) {
  const currentUser = useSharedPlatformStore((state) => state.user);
  const currentCurrency = useSharedPlatformStore((state) => state.currency);
  const setGlobalCurrency = useSharedPlatformStore((state)  => state.setCurrency);

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = usePlatform();
  const { businessName } = state.firmDetails;

  const activeCurrency = currentCurrency || state.firmDetails.currency;

  const { data: serverRates, isLoading: isFetchingMeta } = useQuery({
    queryKey: ["livePlatformRates"],
    queryFn: fetchLiveTaxRates
  });

  const handleCalculate = () => {
    if (!amount) return;
    setLoading(true);

    setTimeout(() => {
      const base = parseFloat(amount);
      const taxRate = serverRates?.vatMultiplier || state.firmDetails.taxRate;
      const vat = base * taxRate;
      const total = base + vat;

      const payload = {
          baseAmount: base,
          vatAmount: vat,
          totalAmount: total,
          calculatedAt: new Date().toLocaleTimeString(),
        };

      if (onQuoteCalculated) {
        onQuoteCalculated(payload);
      }

      PlatformEventBus.emit('QUOTE_CALCULATED', payload);

      setLoading(false);
    }, 1200);
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl border border-blue-500/40 shadow-xl">
      <div className="mb-4 p-2.5 bg-blue-950/40 text-blue-300 rounded-lg text-xs flex justify-between items-center border border-blue-900/30">
        <span>Operator: <strong>{currentUser?.name || "System Base"}</strong> ({currentUser?.role || "Guest"})</span>
        <span className="text-[10px] text-slate-400">
          {isFetchingMeta ? "Refreshing sync pipeline..." : `API Rules Cache: ${serverRates?.complianceStatus || "Local Fallback"}`}
        </span>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setGlobalCurrency('ZAR')}
            className={`px-3 py-1 rounded-md text-sm font-semibold border border-blue-500 cursor-pointer transition-all duration-150 active:scale-95 ${activeCurrency === 'ZAR' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            R
          </button>
          <button 
            type="button"
            onClick={() => setGlobalCurrency('EUR')}
            className={`px-3 py-1 rounded-md text-sm font-semibold border border-blue-500 cursor-pointer transition-all duration-150 active:scale-95 ${activeCurrency === 'EUR' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            €
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="m-0 text0-blue-400 font-semibold tracking-wide">
          Domain Component: Quotes
        </h3>
        <span className="text-xs bg-blue-950 text-blue-300 px-2 py-1 rounded border border-blue-800/50 font-mono">
          Context: {businessName}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm text-slate-400 font-medium">Asset Cover Amount ({activeCurrency})</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2.5 rounded border border-slate-700 bg-slate-950 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-blue-500 transition-all"
          placeholder="e.g. 750000"
        />
        <button
          onClick={handleCalculate}
          disabled={loading || isFetchingMeta}
          className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 select-none
            ${loading || isFetchingMeta
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white cursor-pointer shadow-lg shadow-blue-900/40 hover:shadow-blue-700/30'
            }
            `}
        >
          {loading ? "Evaluating Rules..." : "Calculate Premium"}
        </button>
      </div>

      {serverRates?.lastSyncedAt && (
        <div className="mt-3 text-[10px] text-center text-slate-500 font-mono">
          Tax configurations verified from central registry at {serverRates.lastSyncedAt}
        </div>
      )}
    </div>
  );
}

export default function QuoteFormWithProvider(props: QuoteFormProps) {
  const finalQueryClient = useMemo(() => {
    if ((window as any).__PORTAL_QUERY_CLIENT__) {
      return (window as any).__PORTAL_QUERY_CLIENT__;
    }

    return new QueryClient({
      defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } }
    });
  }, []);

  return (
    <QueryClientProvider client={finalQueryClient}>
      <QuoteForm {...props} />
    </QueryClientProvider>
  );
}
