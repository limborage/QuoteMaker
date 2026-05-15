import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  const shell = env.VITE_SHELL_URL || 'http://localhost:3000/remoteEntry.js';

  return {
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'quote_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './QuoteForm': './src/components/QuoteForm/QuoteForm.tsx',
      },
      remotes: {
        portal_shell: {
          name: 'portal_shell',
          entry: shell,
          type: 'module',
        }
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
    strictPort: true,
    origin: 'http://localhost:3001',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  preview: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  base: 'http://localhost:3001/',
};
});