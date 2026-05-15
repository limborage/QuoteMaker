import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // 1. Load environment variables based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  // 2. Set up a fallback variable to keep localhost as the seamless default
  const quoteMfeUrl = env.VITE_QUOTE_MFE_URL || 'http://localhost:3001/remoteEntry.js';

  return {
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: 'shell',
        remotes: {
          quote_mfe: {
            name: 'quote_mfe',
            entry: quoteMfeUrl, // <-- Injected dynamically here
            type: 'module', 
          },
        },
        shared: {
          react: {
            singleton: true,
          },
          'react-dom': {
            singleton: true,
          },
        },
      }),
    ],
    server: {
      port: 3000,
      strictPort: true,
    },
    preview: {
      port: 3000,
      strictPort: true,
    },
  };
});