import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from the root of https://ignitestudents.club/ (and https://misc-aseb.github.io/)
  base: "/",
});
