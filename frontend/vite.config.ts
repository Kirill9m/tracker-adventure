import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "globalThis",
  },
  server: {
    proxy: {
      "/api": "http://localhost:8080",
      "/oauth2": "http://localhost:8080",
      "/login": "http://localhost:8080",
    },
  },
});
