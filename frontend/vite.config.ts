import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // Proxies /api requests to the local backend during development so
    // the frontend can call relative paths without CORS friction.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Splits the framework/animation libraries (which change far
        // less often than app code) into their own chunk, so a browser
        // that already has this cached from a previous visit doesn't
        // re-download it just because app code changed in a new
        // deployment. Purely a caching/build-config change — no
        // behavior difference, same code, just grouped differently.
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
        },
      },
    },
  },
});
