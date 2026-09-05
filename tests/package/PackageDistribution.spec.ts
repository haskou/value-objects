import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const readJson = (path: string): Record<string, any> =>
  JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf8')) as Record<
    string,
    any
  >;

describe('package distribution', () => {
  it('publishes distinct ESM and CommonJS entry points without Node engine lock-in', () => {
    const packageJson = readJson('package.json');
    const rootExport = packageJson.exports['.'];

    expect(packageJson.types).toBe('./dist/index.d.mts');
    expect(rootExport.import.types).toBe('./dist/index.d.mts');
    expect(rootExport.import.default).toBe('./dist/index.mjs');
    expect(rootExport.require.types).toBe('./dist/index.d.cts');
    expect(rootExport.require.default).toBe('./dist/index.cjs');
    expect(rootExport.import.default).not.toBe(rootExport.require.default);
    expect(rootExport.import.types).not.toBe(rootExport.require.types);
    expect(packageJson.engines).toBeUndefined();
  });

  it('keeps production and test TypeScript concerns separate', () => {
    const buildConfigPath = resolve(process.cwd(), 'tsconfig.build.json');
    const testConfigPath = resolve(process.cwd(), 'tsconfig.test.json');

    expect(existsSync(buildConfigPath)).toBeTrue();
    expect(existsSync(testConfigPath)).toBeTrue();

    const buildConfig = readJson('tsconfig.build.json');
    const testConfig = readJson('tsconfig.test.json');
    const buildOptions = buildConfig.compilerOptions ?? {};
    const testTypes = testConfig.compilerOptions?.types ?? [];

    expect(buildOptions.types ?? []).not.toContain('node');
    expect(buildOptions.types ?? []).not.toContain('jest');
    expect(buildOptions.emitDecoratorMetadata).not.toBeTrue();
    expect(buildOptions.experimentalDecorators).not.toBeTrue();
    expect(testTypes).toEqual(expect.arrayContaining(['node', 'jest']));
  });
});
