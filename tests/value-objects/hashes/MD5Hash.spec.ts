import { createHash } from 'crypto';

import {
  InvalidHashError,
  MD5Hash,
  NullObject,
  StringValueObject,
} from '../../../src';

function computeMD5(input: string | Buffer): string {
  return createHash('md5').update(input).digest('hex');
}

describe('MD5Hash', () => {
  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(() => new MD5Hash(undefined as unknown as string)).not.toThrow();
      expect(
        NullObject.isNullObject(new MD5Hash(undefined as unknown as string)),
      ).toBeTrue();
    });

    const validMD5Hashes = [
      '5d41402abc4b2a76b9719d911017c592', // MD5 of 'hello'
      '098f6bcd4621d373cade4e832627b4f6', // MD5 of 'test'
      '9e107d9d372bb6826bd81d3542a419d6', // MD5 of 'password'
      'd41d8cd98f00b204e9800998ecf8427e', // MD5 of empty string
      'a665a45920422f9d417e4867efdc4fb8', // MD5 of 'admin'
    ];

    it.each(validMD5Hashes)(
      'should create an MD5Hash instance for valid MD5 hash strings',
      (hash) => {
        expect(() => new MD5Hash(hash)).not.toThrow();
        expect(new MD5Hash(hash).toString()).toBe(hash);
      },
    );

    const invalidMD5Hashes = [
      'invalid-hash',
      '1234567890123456789012345678901', // 31 chars
      '123456789012345678901234567890123', // 33 chars
      'gggggggggggggggggggggggggggggggg', // 32 chars but invalid hex
      '12345678901234567890123456789012g', // 32 chars with non-hex
      '',
      'a'.repeat(31),
      'a'.repeat(33),
    ];

    it.each(invalidMD5Hashes)(
      'should throw InvalidHashError for invalid MD5 hash strings',
      (hash) => {
        expect(() => new MD5Hash(hash)).toThrow(InvalidHashError);
      },
    );

    it('should accept another StringValueObject', () => {
      const hashString = new StringValueObject(
        '5d41402abc4b2a76b9719d911017c592',
      );
      const hash = new MD5Hash(hashString);
      expect(hash.toString()).toBe('5d41402abc4b2a76b9719d911017c592');
    });

    it('should validate hash format when constructed from StringValueObject', () => {
      const invalidHashString = new StringValueObject('invalid-hash');
      expect(() => new MD5Hash(invalidHashString)).toThrow(InvalidHashError);
    });
  });

  describe('static methods', () => {
    describe('isValid', () => {
      it('should return true for valid MD5 hashes', () => {
        const validHash = '5d41402abc4b2a76b9719d911017c592';
        expect(MD5Hash.isValid(validHash)).toBeTrue();
        expect(MD5Hash.isValid(new StringValueObject(validHash))).toBeTrue();
      });

      it('should return false for invalid MD5 hashes', () => {
        expect(MD5Hash.isValid('invalid')).toBeFalse();
        expect(MD5Hash.isValid('123')).toBeFalse();
        expect(MD5Hash.isValid('gggggggggggggggggggggggggggggggg')).toBeFalse();
      });
    });

    describe('from', () => {
      it('should compute MD5 hash from string', () => {
        const input = 'hello';
        const expected = computeMD5(input);
        const hash = MD5Hash.from(input);
        expect(hash.valueOf()).toBe(expected);
      });

      it('should compute MD5 hash from Buffer', () => {
        const input = Buffer.from('hello');
        const expected = computeMD5(input);
        const hash = MD5Hash.from(input);
        expect(hash.valueOf()).toBe(expected);
      });

      it('should compute MD5 hash from StringValueObject', () => {
        const input = new StringValueObject('hello');
        const expected = computeMD5(input.valueOf());
        const hash = MD5Hash.from(input);
        expect(hash.valueOf()).toBe(expected);
      });
    });
  });

  describe('inheritance and ValueObject behavior', () => {
    it('should inherit from ValueObject', () => {
      const hash = new MD5Hash('5d41402abc4b2a76b9719d911017c592');
      expect(hash).toBeInstanceOf(MD5Hash);
      expect(hash.valueOf).toBeDefined();
      expect(hash.isEqual).toBeDefined();
      expect(hash.toString).toBeDefined();
    });

    it('should implement valueOf() method correctly', () => {
      const hashValue = '098f6bcd4621d373cade4e832627b4f6';
      const hash = new MD5Hash(hashValue);
      expect(hash.valueOf()).toBe(hashValue);
    });

    it('should implement toString() method correctly', () => {
      const hashValue = '9e107d9d372bb6826bd81d3542a419d6';
      const hash = new MD5Hash(hashValue);
      expect(hash.toString()).toBe(hashValue);
    });

    it('should implement isEqual() method correctly', () => {
      const hashValue = '5d41402abc4b2a76b9719d911017c592';
      const hash1 = new MD5Hash(hashValue);
      const hash2 = new MD5Hash(hashValue);
      const hash3 = new MD5Hash('098f6bcd4621d373cade4e832627b4f6');

      expect(hash1.isEqual(hash2)).toBeTrue();
      expect(hash1.isEqual(hash3)).toBeFalse();
      expect(hash1.isEqual(hashValue)).toBeTrue();
      expect(hash1.isEqual('098f6bcd4621d373cade4e832627b4f6')).toBeFalse();
    });

    it('should compare with string values using isEqual', () => {
      const hash = new MD5Hash('5d41402abc4b2a76b9719d911017c592');
      expect(hash.isEqual('5d41402abc4b2a76b9719d911017c592')).toBeTrue();
      expect(hash.isEqual('098f6bcd4621d373cade4e832627b4f6')).toBeFalse();
    });

    it('should implement clone() method correctly inherited from ValueObject', () => {
      const originalValue = '5d41402abc4b2a76b9719d911017c592';
      const original = new MD5Hash(originalValue);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(MD5Hash);
      expect(cloned.valueOf()).toBe(originalValue);
      expect(cloned.toString()).toBe(originalValue);
      expect(cloned.isEqual(original)).toBeTrue();
      expect(cloned).not.toBe(original); // Different instances
    });

    it('should maintain hash validation in cloned instances', () => {
      const original = new MD5Hash('5d41402abc4b2a76b9719d911017c592');
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(MD5Hash);
      expect(cloned.valueOf()).toBe('5d41402abc4b2a76b9719d911017c592');

      // Cloned instance should still be a valid hash
      expect(() => cloned.toString()).not.toThrow();
      expect(cloned.toString()).toBe('5d41402abc4b2a76b9719d911017c592');
    });
  });

  describe('instance methods', () => {
    describe('toBase64', () => {
      it('should convert hash to base64 correctly', () => {
        const hashValue = '5d41402abc4b2a76b9719d911017c592';
        const hash = new MD5Hash(hashValue);
        const base64 = hash.toBase64();
        expect(base64).toBeInstanceOf(StringValueObject);
        expect(base64.valueOf()).toBe(
          Buffer.from(hashValue, 'hex').toString('base64'),
        );
      });
    });
  });
});
