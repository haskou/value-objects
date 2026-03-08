import { createHash } from 'crypto';
import {
  SHA256Hash,
  NullObject,
  InvalidHashError,
  StringValueObject,
} from '../../../src';

function computeSHA256(input: string | Buffer): string {
  return createHash('sha256').update(input).digest('hex');
}

describe('SHA256Hash', () => {
  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(
        () => new SHA256Hash(undefined as unknown as string),
      ).not.toThrow();
      expect(
        NullObject.isNullObject(new SHA256Hash(undefined as unknown as string)),
      ).toBeTrue();
    });

    const validSHA256Hashes = [
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', // SHA256 of 'hello'
      '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', // SHA256 of 'test'
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // SHA256 of 'password'
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // SHA256 of empty string
      '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // SHA256 of 'admin'
    ];

    it.each(validSHA256Hashes)(
      'should create an SHA256Hash instance for valid SHA256 hash strings',
      (hash) => {
        expect(() => new SHA256Hash(hash)).not.toThrow();
        expect(new SHA256Hash(hash).toString()).toBe(hash);
      },
    );

    const invalidSHA256Hashes = [
      'invalid-hash',
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b982', // 63 chars
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b98245', // 65 chars
      'gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg', // 64 chars but invalid hex
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b982g', // 64 chars with non-hex
      '',
      'a'.repeat(63),
      'a'.repeat(65),
    ];

    it.each(invalidSHA256Hashes)(
      'should throw InvalidHashError for invalid SHA256 hash strings',
      (hash) => {
        expect(() => new SHA256Hash(hash)).toThrow(InvalidHashError);
      },
    );

    it('should accept another StringValueObject', () => {
      const hashString = new StringValueObject(
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      );
      const hash = new SHA256Hash(hashString);
      expect(hash.toString()).toBe(
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      );
    });

    it('should validate hash format when constructed from StringValueObject', () => {
      const invalidHashString = new StringValueObject('invalid-hash');
      expect(() => new SHA256Hash(invalidHashString)).toThrow(InvalidHashError);
    });
  });

  describe('static methods', () => {
    describe('isValid', () => {
      it('should return true for valid SHA256 hashes', () => {
        const validHash =
          '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
        expect(SHA256Hash.isValid(validHash)).toBeTrue();
        expect(SHA256Hash.isValid(new StringValueObject(validHash))).toBeTrue();
      });

      it('should return false for invalid SHA256 hashes', () => {
        expect(SHA256Hash.isValid('invalid')).toBeFalse();
        expect(SHA256Hash.isValid('123')).toBeFalse();
        expect(SHA256Hash.isValid('g'.repeat(64))).toBeFalse();
      });
    });

    describe('from', () => {
      it('should compute SHA256 hash from string', () => {
        const input = 'hello';
        const expected = computeSHA256(input);
        const hash = SHA256Hash.from(input);
        expect(hash.valueOf()).toBe(expected);
      });

      it('should compute SHA256 hash from Buffer', () => {
        const input = Buffer.from('hello');
        const expected = computeSHA256(input);
        const hash = SHA256Hash.from(input);
        expect(hash.valueOf()).toBe(expected);
      });

      it('should compute SHA256 hash from StringValueObject', () => {
        const input = new StringValueObject('hello');
        const expected = computeSHA256(input.valueOf());
        const hash = SHA256Hash.from(input);
        expect(hash.valueOf()).toBe(expected);
      });
    });
  });

  describe('inheritance and ValueObject behavior', () => {
    it('should inherit from ValueObject', () => {
      const hash = new SHA256Hash(
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      );
      expect(hash).toBeInstanceOf(SHA256Hash);
      expect(hash.valueOf).toBeDefined();
      expect(hash.isEqual).toBeDefined();
      expect(hash.toString).toBeDefined();
    });

    it('should implement valueOf() method correctly', () => {
      const hashValue =
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
      const hash = new SHA256Hash(hashValue);
      expect(hash.valueOf()).toBe(hashValue);
    });

    it('should implement toString() method correctly', () => {
      const hashValue =
        '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
      const hash = new SHA256Hash(hashValue);
      expect(hash.toString()).toBe(hashValue);
    });

    it('should implement isEqual() method correctly', () => {
      const hashValue =
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
      const hash1 = new SHA256Hash(hashValue);
      const hash2 = new SHA256Hash(hashValue);
      const hash3 = new SHA256Hash(
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      );

      expect(hash1.isEqual(hash2)).toBeTrue();
      expect(hash1.isEqual(hash3)).toBeFalse();
      expect(hash1.isEqual(hashValue)).toBeTrue();
      expect(
        hash1.isEqual(
          '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        ),
      ).toBeFalse();
    });

    it('should compare with string values using isEqual', () => {
      const hash = new SHA256Hash(
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      );
      expect(
        hash.isEqual(
          '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
        ),
      ).toBeTrue();
      expect(
        hash.isEqual(
          '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        ),
      ).toBeFalse();
    });

    it('should implement clone() method correctly inherited from ValueObject', () => {
      const originalValue =
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
      const original = new SHA256Hash(originalValue);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(SHA256Hash);
      expect(cloned.valueOf()).toBe(originalValue);
      expect(cloned.toString()).toBe(originalValue);
      expect(cloned.isEqual(original)).toBeTrue();
      expect(cloned).not.toBe(original); // Different instances
    });

    it('should maintain hash validation in cloned instances', () => {
      const original = new SHA256Hash(
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      );
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(SHA256Hash);
      expect(cloned.valueOf()).toBe(
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      );

      // Cloned instance should still be a valid hash
      expect(() => cloned.toString()).not.toThrow();
      expect(cloned.toString()).toBe(
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      );
    });
  });

  describe('instance methods', () => {
    describe('toBase64', () => {
      it('should convert hash to base64 correctly', () => {
        const hashValue =
          '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
        const hash = new SHA256Hash(hashValue);
        const base64 = hash.toBase64();
        expect(base64).toBeInstanceOf(StringValueObject);
        expect(base64.valueOf()).toBe(
          Buffer.from(hashValue, 'hex').toString('base64'),
        );
      });
    });
  });
});
