import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PlatformProvider } from './context/PlatformContext.tsx'
import './index.css'
import App from './App.tsx'
import './store/globalPlatformStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const portalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes before background checking
      refetchOnWindowFocus: false, // Prevent aggressive network spam when clicking between browser tabs
    },
  },
});

// @ts-ignore
window.__PORTAL_QUERY_CLIENT__ = portalQueryClient;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={portalQueryClient}>
      <PlatformProvider>
        <App />
      </PlatformProvider>
    </QueryClientProvider>
  </StrictMode>,
)
