import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT_FILE = resolve(__dirname, 'server/.port');

function readBackendPort() {
  try {
    return parseInt(readFileSync(PORT_FILE, 'utf8').trim(), 10) || 5001;
  } catch {
    return 5001;
  }
}

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'site-build',
    emptyOutDir: true,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'motion';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) return 'vendor';
          if (id.includes('node_modules/axios')) return 'http';
        },
      },
    },
  },
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: `http://localhost:${readBackendPort()}`,
        changeOrigin: true,
        // Re-read the port file on every proxied request so Vite auto-adapts
        // if the backend restarted on a different port after Vite was already running.
        router: () => `http://localhost:${readBackendPort()}`,
      },
    },
  },
});
