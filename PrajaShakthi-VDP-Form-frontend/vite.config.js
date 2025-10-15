import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // string shorthand for simple cases
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
