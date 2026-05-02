import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { cspSafeGlobalsPlugin } from "@project/config/vite-plugins";

export default defineConfig({
  plugins: [react(), tailwindcss(), cspSafeGlobalsPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  server: {
    port: 5174,
  },
  optimizeDeps: {
    include: ["lucide-react"],
  },
  build: {
    target: "es2022",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        minify: {
          compress: {
            dropConsole: true,
            dropDebugger: true,
          },
        },
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router/") ||
              id.includes("node_modules/zustand/") ||
              id.includes("node_modules/scheduler/")
            ) {
              return "react-core";
            }

            if (id.includes("recharts") || id.includes("d3-")) {
              return "charts-vendor";
            }

            if (
              id.includes("@radix-ui") ||
              id.includes("lucide-react") ||
              id.includes("cmdk") ||
              id.includes("class-variance-authority") ||
              id.includes("tailwind-merge") ||
              id.includes("clsx") ||
              id.includes("react-day-picker") ||
              id.includes("dompurify")
            ) {
              return "ui-vendor";
            }

            if (id.includes("zod") || id.includes("axios") || id.includes("dayjs")) {
              return "utils-vendor";
            }

            if (id.includes("@tanstack")) {
              return "data-vendor";
            }
          }
        },
      },
    },
  },
});
