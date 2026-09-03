// client/vite.config.ts


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: '127.0.0.1',

    port: 5173,

    strictPort: true,

    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',

        changeOrigin: true,

        secure: false,

        ws: true,

        configure(proxy) {
          proxy.on('error', (error, request) => {
            console.error(`[VITE PROXY ERROR] ${request.method ?? 'GET'} ${request.url}`, error);
          });
        },
      },
    },
  },

  preview: {
    host: '127.0.0.1',

    port: 4173,

    strictPort: true,
  },
});