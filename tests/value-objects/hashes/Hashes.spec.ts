import { createHash } from 'crypto';
import {
  MD5Hash,
  StringValueObject,
  SHA256Hash,
  SHA512Hash,
} from '../../../src';
import { InvalidHashError } from '../../../src/errors/InvalidHashError';

function compute(hashName: string, input: string | Buffer): string {
  return createHash(hashName).update(input).digest('hex');
}

describe('MD5Hash', () => {
  const sample = 'hello';
  const expected = compute('md5', sample);

  describe('isValid', () => {
    it('returns true for a valid 32-character hex string', () => {
      expect(MD5Hash.isValid(expected)).toBeTrue();
      expect(MD5Hash.isValid(new StringValueObject(expected))).toBeTrue();
    });

    it('returns false for malformed values', () => {
      expect(MD5Hash.isValid('not-a-hash')).toBeFalse();
      expect(MD5Hash.isValid(expected.slice(0, 10))).toBeFalse();
    });
  });

  describe('from()', () => {
    it('computes the correct hash from a string', () => {
      const hash = MD5Hash.from(sample);
      expect(hash.valueOf()).toBe(expected);
    });

    it('computes the correct hash from a buffer', () => {
      const buf = Buffer.from(sample);
      const hash = MD5Hash.from(buf);
      expect(hash.valueOf()).toBe(expected);
    });

    it('accepts a StringValueObject as input', () => {
      const hash = MD5Hash.from(new StringValueObject(sample));
      expect(hash.valueOf()).toBe(expected);
    });
  });

  describe('constructor', () => {
    it('creates instance for valid hash', () => {
      expect(() => new MD5Hash(expected)).not.toThrow();
      expect(new MD5Hash(expected)).toBeInstanceOf(MD5Hash);
    });

    it('throws InvalidHashError for invalid values', () => {
      expect(() => new MD5Hash('123')).toThrow(InvalidHashError);
      expect(() => new MD5Hash('g'.repeat(32))).toThrow(InvalidHashError);
    });

    it('returns a NullObject when constructed with nullish', () => {
      expect(() => new MD5Hash(undefined as unknown as string)).not.toThrow();
    });
  });

  describe('toBase64', () => {
    it('produces the expected base64 string', () => {
      const hash = new MD5Hash(expected);
      const base64 = hash.toBase64().valueOf();
      expect(base64).toBe(Buffer.from(expected, 'hex').toString('base64'));
    });
  });
});

// SHA256 and SHA512 share similar behavior
function hashTests(
  Name: typeof SHA256Hash | typeof SHA512Hash,
  algo: string,
  length: number,
) {
  describe(Name.name, () => {
    const sample = 'hello';
    const expected = compute(algo, sample);

    describe('isValid', () => {
      it('returns true for valid string', () => {
        expect(Name.isValid(expected)).toBeTrue();
        expect(Name.isValid(new StringValueObject(expected))).toBeTrue();
      });

      it('returns false for invalid string', () => {
        expect(Name.isValid('short')).toBeFalse();
        expect(Name.isValid('g'.repeat(length))).toBeFalse();
      });
    });

    describe('from()', () => {
      it('computes the correct hash from a string', () => {
        expect(Name.from(sample).valueOf()).toBe(expected);
      });

      it('computes the correct hash from a buffer', () => {
        expect(Name.from(Buffer.from(sample)).valueOf()).toBe(expected);
      });

      it('accepts a StringValueObject as input', () => {
        expect(Name.from(new StringValueObject(sample)).valueOf()).toBe(
          expected,
        );
      });
    });

    describe('constructor', () => {
      it('creates instance for valid hash', () => {
        expect(() => new Name(expected)).not.toThrow();
        expect(new Name(expected)).toBeInstanceOf(Name);
      });

      it('throws InvalidHashError for invalid values', () => {
        expect(() => new Name('123')).toThrow(InvalidHashError);
        expect(() => new Name('g'.repeat(length))).toThrow(InvalidHashError);
      });

      it('handles nullish input gracefully', () => {
        expect(() => new Name(undefined as unknown as string)).not.toThrow();
      });
    });

    describe('toBase64', () => {
      it('produces the expected base64', () => {
        const instance = new Name(expected);
        expect(instance.toBase64().valueOf()).toBe(
          Buffer.from(expected, 'hex').toString('base64'),
        );
      });
    });
  });
}

hashTests(SHA256Hash, 'sha256', 64);
hashTests(SHA512Hash, 'sha512', 128);
