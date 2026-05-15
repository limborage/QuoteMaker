import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PlatformProvider } from './context/PlatformContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlatformProvider>
      <App />
    </PlatformProvider>
  </StrictMode>,
)
