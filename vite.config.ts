import path from 'path';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';

const plugins: PluginOption[] = [react()];

if (process.env.ROLLUP_CHUNKS) {
  plugins.push(
    visualizer({
      template: 'treemap',
      open: true, // Open browser after generation
      gzipSize: true,
      brotliSize: true,
      filename: 'chunks.html'
    })
  );
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins,
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          redux: ['@reduxjs/toolkit'],
          react: ['react', 'react-dom'],
          form: ['react-hook-form', 'zod'],
          utils: ['tailwind-merge', 'dayjs'],
          common: ['axios', 'react-helmet-async', '@tanstack/react-query'],
          router: ['react-router', 'react-router-dom'],
          radixHeavy: [
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-context-menu'
          ]
        }
      }
    }
  }
});
