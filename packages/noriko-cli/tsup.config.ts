import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  splitting: false,
  shims: false,
  dts: false,
  clean: true,
  outDir: 'bin',
});
