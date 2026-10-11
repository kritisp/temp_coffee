import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api calls to the Express server, so the browser never sees a different port.
    proxy: { '/api': 'http://localhost:5001' },
  },
});
