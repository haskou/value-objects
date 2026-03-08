import { createHash } from 'crypto';
import {
  SHA512Hash,
  NullObject,
  InvalidHashError,
  StringValueObject,
} from '../../../src';

function computeSHA512(input: string | Buffer): string {
  return createHash('sha512').update(input).digest('hex');
}

describe('SHA512Hash', () => {
  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(
        () => new SHA512Hash(undefined as unknown as string),
      ).not.toThrow();
      expect(
        NullObject.isNullObject(new SHA512Hash(undefined as unknown as string)),
      ).toBeTrue();
    });

    const validSHA512Hashes = [
      '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043', // SHA512 of 'hello'
      'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff', // SHA512 of 'test'
      'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86', // SHA512 of 'password'
      'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e', // SHA512 of empty string
      'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec', // SHA512 of 'admin'
    ];

    it.each(validSHA512Hashes)(
      'should create an SHA512Hash instance for valid SHA512 hash strings',
      (hash) => {
        expect(() => new SHA512Hash(hash)).not.toThrow();
        expect(new SHA512Hash(hash).toString()).toBe(hash);
      },
    );

    const invalidSHA512Hashes = [
      'invalid-hash',
      '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca7232', // 127 chars
      '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca723234', // 129 chars
      'g'.repeat(128), // 128 chars but invalid hex
      '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca7232g', // 128 chars with non-hex
      '',
      'a'.repeat(127),
      'a'.repeat(129),
    ];

    it.each(invalidSHA512Hashes)(
      'should throw InvalidHashError for invalid SHA512 hash strings',
      (hash) => {
        expect(() => new SHA512Hash(hash)).toThrow(InvalidHashError);
      },
    );

    it('should accept another StringValueObject', () => {
      const hashString = new StringValueObject(
        '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
      );
      const hash = new SHA512Hash(hashString);
      expect(hash.toString()).toBe(
        '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
      );
    });

    it('should validate hash format when constructed from StringValueObject', () => {
      const invalidHashString = new StringValueObject('invalid-hash');
      expect(() => new SHA512Hash(invalidHashString)).toThrow(InvalidHashError);
    });
  });

  describe('static methods', () => {
    describe('isValid', () => {
      it('should return true for valid SHA512 hashes', () => {
        const validHash =
          '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043';
        expect(SHA512Hash.isValid(validHash)).toBeTrue();
        expect(SHA512Hash.isValid(new StringValueObject(validHash))).toBeTrue();
      });

      it('should return false for invalid SHA512 hashes', () => {
        expect(SHA512Hash.isValid('invalid')).toBeFalse();
        expect(SHA512Hash.isValid('123')).toBeFalse();
        expect(SHA512Hash.isValid('g'.repeat(128))).toBeFalse();
      });
    });

    describe('from', () => {
      it('should compute SHA512 hash from string', () => {
        const input = 'hello';
        const expected = computeSHA512(input);
        const hash = SHA512Hash.from(input);
        expect(hash.valueOf()).toBe(expected);
      });

      it('should compute SHA512 hash from Buffer', () => {
        const input = Buffer.from('hello');
        const expected = computeSHA512(input);
        const hash = SHA512Hash.from(input);
        expect(hash.valueOf()).toBe(expected);
      });

      it('should compute SHA512 hash from StringValueObject', () => {
        const input = new StringValueObject('hello');
        const expected = computeSHA512(input.valueOf());
        const hash = SHA512Hash.from(input);
        expect(hash.valueOf()).toBe(expected);
      });
    });
  });

  describe('inheritance and ValueObject behavior', () => {
    it('should inherit from ValueObject', () => {
      const hash = new SHA512Hash(
        '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
      );
      expect(hash).toBeInstanceOf(SHA512Hash);
      expect(hash.valueOf).toBeDefined();
      expect(hash.isEqual).toBeDefined();
      expect(hash.toString).toBeDefined();
    });

    it('should implement valueOf() method correctly', () => {
      const hashValue =
        'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff';
      const hash = new SHA512Hash(hashValue);
      expect(hash.valueOf()).toBe(hashValue);
    });

    it('should implement toString() method correctly', () => {
      const hashValue =
        'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86';
      const hash = new SHA512Hash(hashValue);
      expect(hash.toString()).toBe(hashValue);
    });

    it('should implement isEqual() method correctly', () => {
      const hashValue =
        '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043';
      const hash1 = new SHA512Hash(hashValue);
      const hash2 = new SHA512Hash(hashValue);
      const hash3 = new SHA512Hash(
        'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff',
      );

      expect(hash1.isEqual(hash2)).toBeTrue();
      expect(hash1.isEqual(hash3)).toBeFalse();
      expect(hash1.isEqual(hashValue)).toBeTrue();
      expect(
        hash1.isEqual(
          'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff',
        ),
      ).toBeFalse();
    });

    it('should compare with string values using isEqual', () => {
      const hash = new SHA512Hash(
        '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
      );
      expect(
        hash.isEqual(
          '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
        ),
      ).toBeTrue();
      expect(
        hash.isEqual(
          'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff',
        ),
      ).toBeFalse();
    });

    it('should implement clone() method correctly inherited from ValueObject', () => {
      const originalValue =
        '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043';
      const original = new SHA512Hash(originalValue);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(SHA512Hash);
      expect(cloned.valueOf()).toBe(originalValue);
      expect(cloned.toString()).toBe(originalValue);
      expect(cloned.isEqual(original)).toBeTrue();
      expect(cloned).not.toBe(original); // Different instances
    });

    it('should maintain hash validation in cloned instances', () => {
      const original = new SHA512Hash(
        '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
      );
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(SHA512Hash);
      expect(cloned.valueOf()).toBe(
        '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
      );

      // Cloned instance should still be a valid hash
      expect(() => cloned.toString()).not.toThrow();
      expect(cloned.toString()).toBe(
        '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
      );
    });
  });

  describe('instance methods', () => {
    describe('toBase64', () => {
      it('should convert hash to base64 correctly', () => {
        const hashValue =
          '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043';
        const hash = new SHA512Hash(hashValue);
        const base64 = hash.toBase64();
        expect(base64).toBeInstanceOf(StringValueObject);
        expect(base64.valueOf()).toBe(
          Buffer.from(hashValue, 'hex').toString('base64'),
        );
      });
    });
  });
});
