import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  // Both entry points must expose the same classes and static configuration.
  plugins: [
    {
      name: 'shared-esm-entry',
      generateBundle(_options, bundle) {
        const entry = bundle['index.cjs'];
        if (!entry || entry.type !== 'chunk') return;

        this.emitFile({
          type: 'asset',
          fileName: 'index.mjs',
          source: `import runtime from './index.cjs';\nexport const { ${entry.exports.join(', ')} } = runtime;\n`,
        });
        this.emitFile({
          type: 'asset',
          fileName: 'index.d.mts',
          source: "export * from './index.cjs';\n",
        });
      },
    },
  ],
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
