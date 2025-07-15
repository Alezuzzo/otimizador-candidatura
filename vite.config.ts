import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Adicionando a configuração do proxy
  server: {
    proxy: {
      // Qualquer requisição no seu código que comece com /api...
      '/api': {
        // ...será redirecionada para o servidor que o `vercel dev` está a rodar.
        target: 'http://localhost:3000',
        // Necessário para o redirecionamento funcionar corretamente.
        changeOrigin: true,
      },
    },
  },
})