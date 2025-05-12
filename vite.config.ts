import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      // Enable polyfilling of global variables
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Enable polyfilling of specific Node.js modules
      include: ['buffer', 'process'],
    }),
    react(),
    tailwindcss(),

  ],
  resolve: {
    alias: {
      // Ensure 'buffer' is correctly resolved
      buffer: 'buffer',
    },
  },
  define: {
    // Define 'global' to align with Node.js global object
    global: 'globalThis',
  },
});
