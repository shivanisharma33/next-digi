import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Enable HTML5 history API fallback so that all routes serve index.html.
  // This prevents 404 errors on page refresh for client‑side routes.
  server: {
    // Vite's dev server already falls back, but setting it explicitly documents the intent.
    historyApiFallback: true,
  },
  // For production builds served by static file servers, ensure the same behaviour.
  preview: {
    // When using `vite preview`, also enable SPA fallback.
    // Some hosting platforms honour this option.
    historyApiFallback: true,
  },
  // Optional: improve build chunking for smoother navigation.
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          recharts: ['recharts'],
          framer: ['framer-motion'],
        },
      },
    },
  },
});
