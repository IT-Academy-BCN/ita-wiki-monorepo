/// <reference types="vitest" />
/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTest.ts",
    outputFile: "json",
    globals: true,
    coverage: {
      enabled: true,
      provider: "v8",
      cleanOnRerun: true,
    },
    css: true,
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  server: {
    host: true,
    port: 80,
    proxy: {
      "/api": "http://localhost/api",
    },
  },
});
