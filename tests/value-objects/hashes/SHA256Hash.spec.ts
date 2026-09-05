import {
  InvalidHashError,
  NullObject,
  SHA256Hash,
  StringValueObject,
} from '../../../src';

describe('SHA256Hash', () => {
  const value =
    '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';

  it('returns a null object for nullish input', () => {
    const hash = new SHA256Hash(undefined as unknown as string);

    expect(NullObject.isNullObject(hash)).toBeTrue();
  });

  it('accepts and validates SHA-256 hash values', () => {
    expect(new SHA256Hash(value).valueOf()).toBe(value);
    expect(SHA256Hash.isValid(value)).toBeTrue();
    expect(SHA256Hash.isValid(new StringValueObject(value))).toBeTrue();
  });

  it('rejects invalid SHA-256 hash values', () => {
    expect(SHA256Hash.isValid('invalid')).toBeFalse();
    expect(() => new SHA256Hash('invalid')).toThrow(InvalidHashError);
  });

  it('accepts StringValueObject input', () => {
    expect(new SHA256Hash(new StringValueObject(value)).valueOf()).toBe(value);
  });

  it('converts a hash value to base64', () => {
    expect(new SHA256Hash(value).toBase64().valueOf()).toBe(
      Buffer.from(value, 'hex').toString('base64'),
    );
  });
});
