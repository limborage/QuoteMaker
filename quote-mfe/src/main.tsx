import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// @ts-ignore
const sharedQueryClient = window.__PORTAL_QUERY_CLIENT__;

const localQueryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } }
});

const activeQueryClient = sharedQueryClient || localQueryClient;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={activeQueryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
