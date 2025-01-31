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
      "Assets": path.resolve(__dirname, "frontend/src/Assets"),
      "Classes": path.resolve(__dirname, "frontend/src/Classes"),
      "Componentes": path.resolve(__dirname, "frontend/src/Componentes"),
      "Contextos": path.resolve(__dirname, "frontend/src/Contextos"),
      "Dados": path.resolve(__dirname, "frontend/src/Dados"),
      "Layouts": path.resolve(__dirname, "frontend/src/Layouts"),
      "Paginas": path.resolve(__dirname, "frontend/src/Paginas"),
      "Providers": path.resolve(__dirname, "frontend/src/Providers"),
      "Recursos": path.resolve(__dirname, "frontend/src/Recursos"),
      "Redux": path.resolve(__dirname, "frontend/src/Redux"),
      "Servicos": path.resolve(__dirname, "frontend/src/Servicos"),
      "Uteis": path.resolve(__dirname, "frontend/src/Uteis"),
    }
  }
})
