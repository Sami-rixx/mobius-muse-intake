import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [
    react(),
    glsl(), // For importing GLSL shaders in Three.js
  ],
  resolve: {
    alias: {
      '@': '/src', // Path alias for cleaner imports
    },
  },
  server: {
    port: 3000, // Development server port
    open: true, // Automatically open browser
  },
  build: {
    outDir: 'dist', // Output directory
    sourcemap: true, // Generate source maps
    rollupOptions: {
      // Prevent Three.js from being tree-shaken out
      preserveEntrySignatures: 'exports-only',
    },
  },
});
