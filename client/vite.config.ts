import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // For production builds (Vercel), shared is copied to src/shared by prebuild script
      // For local dev, it points to ../shared
      "@shared": path.resolve(__dirname, process.env.NODE_ENV === 'production' ? 'src/shared' : '..', process.env.NODE_ENV === 'production' ? '' : 'shared'),
      "@assets": path.resolve(__dirname, "..", "attached_assets"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
