import { Buffer } from 'buffer';

import {
  InvalidHashError,
  MD5Hash,
  NullObject,
  StringValueObject,
} from '../../../src';

describe('MD5Hash', () => {
  it('returns a null object for nullish input', () => {
    const hash = new MD5Hash(undefined as unknown as string);

    expect(NullObject.isNullObject(hash)).toBeTrue();
  });

  it('accepts and validates MD5 hash values', () => {
    const value = '5d41402abc4b2a76b9719d911017c592';

    expect(new MD5Hash(value).valueOf()).toBe(value);
    expect(MD5Hash.isValid(value)).toBeTrue();
    expect(MD5Hash.isValid(new StringValueObject(value))).toBeTrue();
  });

  it('rejects invalid MD5 hash values', () => {
    expect(MD5Hash.isValid('invalid')).toBeFalse();
    expect(() => new MD5Hash('invalid')).toThrow(InvalidHashError);
  });

  it('accepts StringValueObject input', () => {
    const value = '5d41402abc4b2a76b9719d911017c592';

    expect(new MD5Hash(new StringValueObject(value)).valueOf()).toBe(value);
  });

  it('converts the hash to base64', () => {
    const value = '5d41402abc4b2a76b9719d911017c592';

    expect(new MD5Hash(value).toBase64().valueOf()).toBe(
      Buffer.from(value, 'hex').toString('base64'),
    );
  });
});
