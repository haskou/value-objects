const assert = require('node:assert/strict');
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

  for (const runtime of [cjs, esm]) {
    const email = new runtime.Email('user@example.com');
    assert.equal(Reflect.set(email, 'value', 'invalid'), false);
    email.value = 'invalid'; // Non-strict JavaScript must leave the value intact.
    assert.throws(() => {
      'use strict';
      email.value = 'invalid';
    }, TypeError);
    assert.equal(Reflect.deleteProperty(email, 'value'), false);
    assert.throws(
      () => Object.defineProperty(email, 'value', { value: 'invalid' }),
      TypeError,
    );
    assert.equal(email.valueOf(), 'user@example.com');

    class LabeledEmail extends runtime.Email {
      label = 'work';
    }
    const labeled = new LabeledEmail('user@example.com');
    assert.equal(labeled.label, 'work');
    assert.equal(labeled.valueOf(), 'user@example.com');

    class Status extends runtime.Enum {
      getValues() {
        return ['active', 'inactive'];
      }
    }
    assert.equal(new Status('active').valueOf(), 'active');
    assert.throws(() => new Status('invalid'), runtime.ValueNotInEnumError);
    assert.ok(runtime.NullObject.isNullObject(new Status(undefined)));
  }

  for (const name of Object.keys(cjs)) {
    assert.strictEqual(
      esm[name],
      cjs[name],
      `${name} must share runtime identity`,
    );
  }
  const email = new esm.Email('user@example.com');
  const requiredEmail = new cjs.Email('user@example.com');
  assert.ok(email.isEqual(requiredEmail));
  assert.ok(requiredEmail.isEqual(email));
  const unique = esm.UniqueObjectArray.fromArray([email]);
  assert.ok(unique.includes(requiredEmail));
  assert.equal(unique.push(requiredEmail), false);
  assert.equal(unique.length(), 1);

  for (const [configure, consume] of [
    [esm, cjs],
    [cjs, esm],
  ]) {
    configure.ValueObject.disableNullObjectCreation();
    try {
      assert.throws(
        () => new consume.Email(undefined),
        configure.NullObjectCreationDisabledError,
      );
    } finally {
      configure.ValueObject.enableNullObjectCreation();
    }
    assert.ok(consume.NullObject.isNullObject(new consume.Email(undefined)));
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
