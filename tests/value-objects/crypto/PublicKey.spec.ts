import * as crypto from 'node:crypto';

import {
  InvalidFormatError,
  InvalidLengthError,
  Key,
  PublicKey,
  Signature,
  StringValueObject,
} from '../../../src';
import { NullObject } from '../../../src/value-objects/NullObject';

describe('PublicKey', () => {
  let privatePem: string;
  let publicPem: string;

  beforeAll(() => {
    const pair = crypto.generateKeyPairSync('ed25519', {
      privateKeyEncoding: { format: 'pem', type: 'pkcs8' },
      publicKeyEncoding: { format: 'pem', type: 'spki' },
    });
    privatePem = pair.privateKey;
    publicPem = pair.publicKey;
  });

  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(() => new PublicKey(undefined as unknown as string)).not.toThrow();
      expect(
        NullObject.isNullObject(new PublicKey(undefined as unknown as string)),
      ).toBeTrue();
      expect(
        NullObject.isNullObject(new PublicKey(null as unknown as string)),
      ).toBeTrue();
    });

    it('should store a PEM string', () => {
      const key = new PublicKey(publicPem);
      expect(key.valueOf()).toBe(publicPem);
      expect(key.valueOf()).toContain('BEGIN PUBLIC KEY');
    });

    it('should throw InvalidLengthError for wrong length', () => {
      expect(() => new PublicKey('short')).toThrow(InvalidLengthError);
    });

    it('should throw InvalidFormatError for wrong PEM format', () => {
      const wrongLength = 'a'.repeat(113);
      expect(() => new PublicKey(wrongLength)).toThrow(InvalidFormatError);
    });

    it('should throw InvalidLengthError for a private key PEM', () => {
      expect(() => new PublicKey(privatePem)).toThrow(InvalidLengthError);
    });
  });

  describe('fromPEM', () => {
    it('should create a PublicKey from a PEM string', () => {
      const key = PublicKey.fromPEM(publicPem);

      expect(key).toBeInstanceOf(PublicKey);
      expect(key.valueOf()).toBe(publicPem);
    });

    it('should create a PublicKey from a StringValueObject wrapping a PEM', () => {
      const pemVO = new StringValueObject(publicPem);
      const key = PublicKey.fromPEM(pemVO);

      expect(key).toBeInstanceOf(PublicKey);
      expect(key.valueOf()).toBe(publicPem);
    });
  });

  describe('isValidSignature', () => {
    it('should return true for a valid signature', () => {
      const key = new PublicKey(publicPem);
      const payload = 'message to verify';
      const sigBuf = crypto.sign(null, Buffer.from(payload), privatePem);
      const signature = Signature.fromBuffer(sigBuf);

      expect(key.isValidSignature(payload, signature)).toBeTrue();
    });

    it('should return false for an invalid signature', () => {
      const key = new PublicKey(publicPem);
      const payload = 'message to verify';
      const sigBuf = crypto.sign(
        null,
        Buffer.from('other message'),
        privatePem,
      );
      const signature = Signature.fromBuffer(sigBuf);

      expect(key.isValidSignature(payload, signature)).toBeFalse();
    });

    it('should return false for a tampered payload', () => {
      const key = new PublicKey(publicPem);
      const sigBuf = crypto.sign(null, Buffer.from('original'), privatePem);
      const signature = Signature.fromBuffer(sigBuf);

      expect(key.isValidSignature('tampered', signature)).toBeFalse();
    });

    it('should accept a StringValueObject as payload', () => {
      const key = new PublicKey(publicPem);
      const payloadVO = new StringValueObject('verify this');
      const sigBuf = crypto.sign(null, Buffer.from('verify this'), privatePem);
      const signature = Signature.fromBuffer(sigBuf);

      expect(key.isValidSignature(payloadVO, signature)).toBeTrue();
    });
  });

  describe('inheritance and Key behavior', () => {
    it('should inherit from Key', () => {
      const key = new PublicKey(publicPem);
      expect(key).toBeInstanceOf(PublicKey);
      expect(key).toBeInstanceOf(Key);
    });

    it('should implement isEqual() correctly', () => {
      const key1 = new PublicKey(publicPem);
      const key2 = new PublicKey(publicPem);

      expect(key1.isEqual(key2)).toBeTrue();
      expect(key1.isEqual(publicPem)).toBeTrue();
    });

    it('should clone correctly', () => {
      const original = new PublicKey(publicPem);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(PublicKey);
      expect(cloned.valueOf()).toBe(publicPem);
      expect(cloned).not.toBe(original);
    });

    it('should detect inequality between different keys', () => {
      const otherPair = crypto.generateKeyPairSync('ed25519', {
        privateKeyEncoding: { format: 'pem', type: 'pkcs8' },
        publicKeyEncoding: { format: 'pem', type: 'spki' },
      });
      const key1 = new PublicKey(publicPem);
      const key2 = new PublicKey(otherPair.publicKey);

      expect(key1.isEqual(key2)).toBeFalse();
    });
  });
});
