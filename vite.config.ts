import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { // para adicionar novos paths, tem que adicionar no tsconfig.json e no vite.config.ts
      "ApiConsumer": path.resolve(__dirname, "src/ApiConsumer"),
      "Components": path.resolve(__dirname, "src/Components"),
      "Layouts": path.resolve(__dirname, "src/Layouts"),
      "Pages": path.resolve(__dirname, "src/Pages"),
    }
  }
})
