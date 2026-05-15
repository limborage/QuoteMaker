import { useState } from "react";
import { usePlatform } from "portal_shell/PlatformContext";
import { PlatformEventBus } from "portal_shell/EventBus";

interface QuoteCalculationPayload {
  baseAmount: number;
  vatAmount: number;
  totalAmount: number;
  calculatedAt: string;
}

interface QuoteFormProps {
  onQuoteCalculated?: (payload: QuoteCalculationPayload) => void;
}

export default function QuoteForm({
  onQuoteCalculated,
}: QuoteFormProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = usePlatform();
  const { businessName, taxRate, currency } = state.firmDetails;

  const handleCalculate = () => {
    if (!amount) return;
    setLoading(true);

    setTimeout(() => {
      const base = parseFloat(amount);
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="m-0 text0-blue-400 font-semibold tracking-wide">
          Domain Component: Quotes
        </h3>
        <span className="text-xs bg-blue-950 text-blue-300 px-2 py-1 rounded border border-blue-800/50 font-mono">
          Context: {businessName}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm text-slate-400 font-medium">Asset Cover Amount ({currency})</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2.5 rounded border border-slate-700 bg-slate-950 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-blue-500 transition-all"
          placeholder="e.g. 750000"
        />
        <button
          onClick={handleCalculate}
          disabled={loading}
          className={`p-2.5 rounded font-bold transition-all duration-200 select-none
            ${loading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white cursor-pointer shadow-lg shadow-blue-900/20'
            }
            `}
        >
          {loading ? "Evaluating Rules..." : "Calculate Premium"}
        </button>
      </div>
    </div>
  );
}
