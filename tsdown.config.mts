import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  platform: 'neutral',
  fixedExtension: true,
  dts: {
    sourcemap: true,
  },
  sourcemap: true,
  clean: true,
  failOnWarn: true,
  publint: 'ci-only',
  attw: 'ci-only',
  tsconfig: 'tsconfig.build.json',
});
