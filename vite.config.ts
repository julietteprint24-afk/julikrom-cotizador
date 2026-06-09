import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Julikrom Cotizador",
        short_name: "Julikrom",
        description: "Cotizador inteligente de Juliette Print",
        theme_color: "#2cff05",
        background_color: "#000000",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/logo.ico",
            sizes: "64x64",
            type: "image/x-icon",
          },
        ],
      },
    }),
  ],
});