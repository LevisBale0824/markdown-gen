import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [
    viteStaticCopy({
      targets: [
        { src: '../src/styles.css', dest: '.' }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/ts')
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false
  }
});
