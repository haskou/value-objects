import * as crypto from 'node:crypto';

import {
  InvalidFormatError,
  InvalidLengthError,
  Key,
  PrivateKey,
  Signature,
  StringValueObject,
} from '../../../src';
import { NullObject } from '../../../src/value-objects/NullObject';

describe('PrivateKey', () => {
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
      expect(
        () => new PrivateKey(undefined as unknown as string),
      ).not.toThrow();
      expect(
        NullObject.isNullObject(new PrivateKey(undefined as unknown as string)),
      ).toBeTrue();
      expect(
        NullObject.isNullObject(new PrivateKey(null as unknown as string)),
      ).toBeTrue();
    });

    it('should store a PEM string', () => {
      const key = new PrivateKey(privatePem);
      expect(key.valueOf()).toBe(privatePem);
      expect(key.valueOf()).toContain('BEGIN PRIVATE KEY');
    });

    it('should throw InvalidLengthError for wrong length', () => {
      expect(() => new PrivateKey('short')).toThrow(InvalidLengthError);
    });

    it('should throw InvalidFormatError for wrong PEM format', () => {
      const wrongLength = 'a'.repeat(119);
      expect(() => new PrivateKey(wrongLength)).toThrow(InvalidFormatError);
    });

    it('should throw InvalidFormatError for a public key PEM', () => {
      expect(() => new PrivateKey(publicPem)).toThrow(InvalidLengthError);
    });
  });

  describe('fromPEM', () => {
    it('should create a PrivateKey from a PEM string', () => {
      const key = PrivateKey.fromPEM(privatePem);

      expect(key).toBeInstanceOf(PrivateKey);
      expect(key.valueOf()).toBe(privatePem);
    });

    it('should create a PrivateKey from a StringValueObject wrapping a PEM', () => {
      const pemVO = new StringValueObject(privatePem);
      const key = PrivateKey.fromPEM(pemVO);

      expect(key).toBeInstanceOf(PrivateKey);
      expect(key.valueOf()).toBe(privatePem);
    });
  });

  describe('sign', () => {
    it('should produce a valid Signature from a string payload', () => {
      const key = new PrivateKey(privatePem);
      const sig = key.sign('hello world');

      expect(sig).toBeInstanceOf(Signature);
      expect(sig.valueOf()).toHaveLength(88);
    });

    it('should produce a verifiable signature', () => {
      const key = new PrivateKey(privatePem);
      const payload = 'data to sign';
      const sig = key.sign(payload);

      const valid = crypto.verify(
        null,
        Buffer.from(payload),
        publicPem,
        Buffer.from(sig.valueOf(), 'base64'),
      );

      expect(valid).toBeTrue();
    });

    it('should produce different signatures for different payloads', () => {
      const key = new PrivateKey(privatePem);
      const sig1 = key.sign('payload-1');
      const sig2 = key.sign('payload-2');

      expect(sig1.isEqual(sig2)).toBeFalse();
    });

    it('should accept a StringValueObject as payload', () => {
      const key = new PrivateKey(privatePem);
      const payload = new StringValueObject('hello');
      const sig = key.sign(payload);

      expect(sig).toBeInstanceOf(Signature);

      const valid = crypto.verify(
        null,
        Buffer.from('hello'),
        publicPem,
        Buffer.from(sig.valueOf(), 'base64'),
      );
      expect(valid).toBeTrue();
    });
  });

  describe('inheritance and Key behavior', () => {
    it('should inherit from Key', () => {
      const key = new PrivateKey(privatePem);
      expect(key).toBeInstanceOf(PrivateKey);
      expect(key).toBeInstanceOf(Key);
    });

    it('should implement isEqual() correctly', () => {
      const key1 = new PrivateKey(privatePem);
      const key2 = new PrivateKey(privatePem);

      expect(key1.isEqual(key2)).toBeTrue();
      expect(key1.isEqual(privatePem)).toBeTrue();
    });

    it('should clone correctly', () => {
      const original = new PrivateKey(privatePem);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(PrivateKey);
      expect(cloned.valueOf()).toBe(privatePem);
      expect(cloned).not.toBe(original);
    });

    it('should detect inequality between different keys', () => {
      const otherPair = crypto.generateKeyPairSync('ed25519', {
        privateKeyEncoding: { format: 'pem', type: 'pkcs8' },
        publicKeyEncoding: { format: 'pem', type: 'spki' },
      });
      const key1 = new PrivateKey(privatePem);
      const key2 = new PrivateKey(otherPair.privateKey);

      expect(key1.isEqual(key2)).toBeFalse();
    });
  });
});
