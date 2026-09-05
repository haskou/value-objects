const { existsSync, readFileSync } = require('fs');
const { pathToFileURL } = require('url');
const { resolve } = require('path');

const packageRoot = resolve(__dirname, '..');
const packageJson = JSON.parse(
  readFileSync(resolve(packageRoot, 'package.json'), 'utf8'),
);

const resolvePackagePath = (packagePath) =>
  resolve(packageRoot, packagePath.replace(/^\.\//, ''));

const verifyPathExists = (label, packagePath) => {
  const absolutePath = resolvePackagePath(packagePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`${label} points to missing file: ${packagePath}`);
  }
};

const verifyExports = (moduleExports, format) => {
  if (typeof moduleExports.Email !== 'function') {
    throw new Error(`${format} build does not export Email`);
  }

  const email = new moduleExports.Email('user@example.com');
  if (email.valueOf() !== 'user@example.com') {
    throw new Error(`${format} build produced an invalid Email value`);
  }
};

const main = async () => {
  const rootExport = packageJson.exports['.'];
  const importExport = rootExport.import;
  const requireExport = rootExport.require;

  verifyPathExists('main', packageJson.main);
  verifyPathExists('module', packageJson.module);
  verifyPathExists('types', packageJson.types);
  verifyPathExists('exports.import.default', importExport.default);
  verifyPathExists('exports.import.types', importExport.types);
  verifyPathExists('exports.require.default', requireExport.default);
  verifyPathExists('exports.require.types', requireExport.types);

  const cjs = require(resolvePackagePath(requireExport.default));
  verifyExports(cjs, 'CommonJS');

  const esmUrl = pathToFileURL(resolvePackagePath(importExport.default)).href;
  const esm = await import(esmUrl);
  verifyExports(esm, 'ESM');
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
