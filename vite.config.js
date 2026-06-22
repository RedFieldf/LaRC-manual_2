import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// GitHub Pages はサブパス配信のため base が必須
// https://redfieldf.github.io/LaRC-manual_2/
export default defineConfig({
  base: "/LaRC-manual_2/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        reservation: resolve(__dirname, "reservation_app.html"),
        seeding: resolve(__dirname, "seeding_app.html"),
      },
    },
  },
});
