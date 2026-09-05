import {
  InvalidHashError,
  NullObject,
  SHA512Hash,
  StringValueObject,
} from '../../../src';

describe('SHA512Hash', () => {
  const value =
    '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043';

  it('returns a null object for nullish input', () => {
    const hash = new SHA512Hash(undefined as unknown as string);

    expect(NullObject.isNullObject(hash)).toBeTrue();
  });

  it('accepts and validates SHA-512 hash values', () => {
    expect(new SHA512Hash(value).valueOf()).toBe(value);
    expect(SHA512Hash.isValid(value)).toBeTrue();
    expect(SHA512Hash.isValid(new StringValueObject(value))).toBeTrue();
  });

  it('rejects invalid SHA-512 hash values', () => {
    expect(SHA512Hash.isValid('invalid')).toBeFalse();
    expect(() => new SHA512Hash('invalid')).toThrow(InvalidHashError);
  });

  it('accepts StringValueObject input', () => {
    expect(new SHA512Hash(new StringValueObject(value)).valueOf()).toBe(value);
  });

  it('converts a hash value to base64', () => {
    expect(new SHA512Hash(value).toBase64().valueOf()).toBe(
      Buffer.from(value, 'hex').toString('base64'),
    );
  });
});
