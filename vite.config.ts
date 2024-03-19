import { vitePlugin as remix } from "@remix-run/dev";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite"; 
import { installGlobals } from "@remix-run/node";
import tsconfigPaths from 'vite-tsconfig-paths'
import { flatRoutes } from 'remix-flat-routes'

installGlobals()

export default defineConfig({
  server: {
    port: 3000
  },
  optimizeDeps: {
    include: ["@clerk/remix"]
  },
  plugins: [
    !process.env.VITEST ? remix() : react(),
    tsconfigPaths()
  ],
});
