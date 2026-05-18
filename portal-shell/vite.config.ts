import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(() => {
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
        remotes: {},
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
