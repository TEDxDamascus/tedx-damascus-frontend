import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react'
    }),
    jsconfigPaths()
  ],
  server: {
    open: true,
    port: 3000
  },
  build: {
    outDir: 'build'
  },
  resolve: {
    alias: {
      '@': '/src',
      'app/store': '/src/app/store',
      'app/shared-components': '/src/app/shared-components',
      'app/configs': '/src/app/configs',
      '@mock-api': '/src/@mock-api'
    }
  }
});
