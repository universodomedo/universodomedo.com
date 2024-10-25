import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'dashesOnly',
    }
  },
  resolve: {
    alias: { // para adicionar novos paths, tem que adicionar no tsconfig.json e no vite.config.ts
      "ApiConsumer": path.resolve(__dirname, "frontend/src/ApiConsumer"),
      "Components": path.resolve(__dirname, "frontend/src/Components"),
      "Layouts": path.resolve(__dirname, "frontend/src/Layouts"),
      "Pages": path.resolve(__dirname, "frontend/src/Pages"),
      "Providers": path.resolve(__dirname, "frontend/src/Providers"),
      "Recursos": path.resolve(__dirname, "frontend/src/Recursos"),
      "Redux": path.resolve(__dirname, "frontend/src/Redux"),
      "Servicos": path.resolve(__dirname, "frontend/src/Servicos"),
      "Types": path.resolve(__dirname, "frontend/src/Types"),
      "Utils": path.resolve(__dirname, "frontend/src/Utils"),
    }
  }
})
