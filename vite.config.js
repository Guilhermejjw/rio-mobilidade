import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    sourcemap: false, // Desativa os arquivos de mapeamento no F12
  },
  
  server: {
    proxy: {
      // Tudo que começar com /api-rio será encaminhado
      // para o servidor do Data.Rio.
      '/api-rio': {
        target: 'https://dados.mobilidade.rio',

        // Permite que o Vite altere a origem da requisição.
        changeOrigin: true,

        // Remove "/api-rio" antes de enviar para o Data.Rio.
        //
        // Exemplo:
        // /api-rio/sppo/conecta/gps
        //
        // será enviado como:
        // /sppo/conecta/gps
        rewrite: (path) => path.replace(/^\/api-rio/, ''),

        // Envia informações semelhantes às de um navegador.
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json',
        },
      },
    },
  },
})