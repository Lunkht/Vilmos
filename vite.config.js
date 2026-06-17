import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative paths for assets so the site works anywhere (subfolders, etc.)
  base: './',
  build: {
    outDir: 'docs',
  },
});
