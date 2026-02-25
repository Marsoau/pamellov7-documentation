import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(), // For processing JSX
    dts({ // For generating .d.ts files
      insertTypesEntry: true,
    }),
  ],
  build: {
    // This is "library mode"
    lib: {
      // We have two entry points, so we specify them here.
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        hooks: resolve(__dirname, 'src/hooks.tsx'),
      },
      name: 'PamelloV7Wrapper',
      formats: ['es', 'cjs'], // Output both ES Module and CommonJS formats
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      // Don't bundle React or React-DOM into your library
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
