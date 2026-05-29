import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Build to dist/ (served by FastAPI). In dev, proxy /api to the backend.
export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist" },
  server: { proxy: { "/api": "http://localhost:8000" } },
});
