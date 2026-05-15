import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'quote_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './QuoteForm': './src/components/QuoteForm/QuoteForm.tsx',
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
    port: 3001,
  },
  preview: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  base: 'http://localhost:3001/',
});