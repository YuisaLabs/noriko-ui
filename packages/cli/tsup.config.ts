import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  clean: true,
  outDir: 'dist',
  shims: true,
  banner: {
    js: "#!/usr/bin/env node\n",
  },
  external: [
    "../package.json"
  ]
});