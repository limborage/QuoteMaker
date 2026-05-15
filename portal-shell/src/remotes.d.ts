// Tells TypeScript that anything imported from your remote module is a valid component
declare module 'quote_mfe/QuoteForm' {
  import React from 'react';

    export interface QuoteCalculationPayload {
        baseAmount: number;
        vatAmount: number;
        totalAmount: number;
        calculatedAt: string;
    }

  interface QuoteFormProps {
    userFirm?: string;
    onQuoteCalculated?: (payload: QuoteCalculationPayload) => void;
  }

  const QuoteForm: React.ComponentType<QuoteFormProps>;
  export default QuoteForm;
}