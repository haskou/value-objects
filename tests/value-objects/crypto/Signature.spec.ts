import * as crypto from 'node:crypto';

import {
  InvalidSignatureError,
  Signature,
  StringValueObject,
} from '../../../src';
import { NullObject } from '../../../src/value-objects/NullObject';

describe('Signature', () => {
  let validSignatureBase64: string;

  beforeAll(() => {
    const { privateKey } = crypto.generateKeyPairSync('ed25519', {
      privateKeyEncoding: { format: 'pem', type: 'pkcs8' },
      publicKeyEncoding: { format: 'pem', type: 'spki' },
    });
    const sig = crypto.sign(null, Buffer.from('test'), privateKey);
    validSignatureBase64 = sig.toString('base64');
  });

  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      const sig = new Signature(undefined as unknown as string);
      expect(NullObject.isNullObject(sig)).toBeTrue();

      const sig2 = new Signature(null as unknown as string);
      expect(NullObject.isNullObject(sig2)).toBeTrue();
    });

    it('should accept a valid ed25519 signature (88 base64 chars)', () => {
      expect(validSignatureBase64).toHaveLength(88);
      expect(() => new Signature(validSignatureBase64)).not.toThrow();

      const sig = new Signature(validSignatureBase64);
      expect(sig.valueOf()).toBe(validSignatureBase64);
    });

    it('should throw InvalidSignatureError for incorrect lengths', () => {
      expect(() => new Signature('short')).toThrow(InvalidSignatureError);
      expect(() => new Signature('a'.repeat(87))).toThrow(
        InvalidSignatureError,
      );
      expect(() => new Signature('a'.repeat(89))).toThrow(
        InvalidSignatureError,
      );
    });

    it('should throw InvalidSignatureError for non-base64 characters', () => {
      const invalidBase64 = '!' + 'A'.repeat(84) + '==';
      expect(() => new Signature(invalidBase64)).toThrow(InvalidSignatureError);
    });

    it('should accept another StringValueObject', () => {
      const sigString = new StringValueObject(validSignatureBase64);
      const sig = new Signature(sigString);
      expect(sig.valueOf()).toBe(validSignatureBase64);
    });

    it('should validate signature length when constructed from StringValueObject', () => {
      const invalidSigString = new StringValueObject('short');
      expect(() => new Signature(invalidSigString)).toThrow(
        InvalidSignatureError,
      );
    });
  });

  describe('fromBuffer', () => {
    it('should create a Signature from a 64-byte ed25519 buffer', () => {
      const { privateKey } = crypto.generateKeyPairSync('ed25519', {
        privateKeyEncoding: { format: 'pem', type: 'pkcs8' },
        publicKeyEncoding: { format: 'pem', type: 'spki' },
      });
      const sigBuffer = crypto.sign(null, Buffer.from('data'), privateKey);

      expect(sigBuffer).toHaveLength(64);

      const sig = Signature.fromBuffer(sigBuffer);

      expect(sig).toBeInstanceOf(Signature);
      expect(sig.valueOf()).toBe(sigBuffer.toString('base64'));
      expect(sig.valueOf()).toHaveLength(88);
    });
  });

  describe('inheritance and ValueObject behavior', () => {
    it('should inherit from ValueObject', () => {
      const sig = new Signature(validSignatureBase64);
      expect(sig).toBeInstanceOf(Signature);
      expect(sig.valueOf).toBeDefined();
      expect(sig.isEqual).toBeDefined();
      expect(sig.toString).toBeDefined();
    });

    it('should implement valueOf() correctly', () => {
      const sig = new Signature(validSignatureBase64);
      expect(sig.valueOf()).toBe(validSignatureBase64);
    });

    it('should implement toString() correctly', () => {
      const sig = new Signature(validSignatureBase64);
      expect(sig.toString()).toBe(validSignatureBase64);
    });

    it('should implement isEqual() correctly', () => {
      const sig1 = new Signature(validSignatureBase64);
      const sig2 = new Signature(validSignatureBase64);

      expect(sig1.isEqual(sig2)).toBeTrue();
      expect(sig1.isEqual(validSignatureBase64)).toBeTrue();
    });

    it('should detect inequality between different signatures', () => {
      const { privateKey } = crypto.generateKeyPairSync('ed25519', {
        privateKeyEncoding: { format: 'pem', type: 'pkcs8' },
        publicKeyEncoding: { format: 'pem', type: 'spki' },
      });
      const otherSig = crypto.sign(null, Buffer.from('other'), privateKey);
      const sig1 = new Signature(validSignatureBase64);
      const sig2 = Signature.fromBuffer(otherSig);

      expect(sig1.isEqual(sig2)).toBeFalse();
    });

    it('should clone correctly preserving validation', () => {
      const original = new Signature(validSignatureBase64);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(Signature);
      expect(cloned.valueOf()).toBe(validSignatureBase64);
      expect(cloned.isEqual(original)).toBeTrue();
      expect(cloned).not.toBe(original);
    });
  });
});
