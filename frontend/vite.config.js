import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // import resolve from path module

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: 'http://localhost:5000', 
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@daisyui/react': '@daisyui/react/dist/index.esm.js',
      '@': path.resolve(__dirname, './src'),
    },
  },
});
