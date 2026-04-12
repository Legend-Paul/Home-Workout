import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // handles SPA fallback — serves index.html for all unmatched routes
  },
  preview: {},
  plugins: [],
  appType: "spa", // 👈 this is the Vite equivalent
});
