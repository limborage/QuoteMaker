import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const quoteMfeUrl =
    env.VITE_QUOTE_MFE_URL || "http://localhost:3001/remoteEntry.js";

  return {
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: "portal_shell",
        filename: "remoteEntry.js",
        exposes: {
          "./PlatformContext": "./src/context/PlatformContext.ts",
          './EventBus': './src/utils/EventBus.ts'
        },
        remotes: {
          quote_mfe: {
            name: "quote_mfe",
            entry: quoteMfeUrl, // <-- Injected dynamically here
            type: "module",
          },
        },
        shared: {
          react: {
            singleton: true,
          },
          "react-dom": {
            singleton: true,
          },
        },
      }),
    ],
    server: {
      port: 3000,
      strictPort: true,
      origin: "http://localhost:3000",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    preview: {
      port: 3000,
      strictPort: true,
    },
  };
});
