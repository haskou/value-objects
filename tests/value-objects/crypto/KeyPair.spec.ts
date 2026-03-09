import * as crypto from 'node:crypto';

import {
  EncryptedKeyPair,
  EncryptedPayload,
  KeyPair,
  PrivateKey,
  PublicKey,
  Signature,
  StringValueObject,
} from '../../../src';

describe('KeyPair', () => {
  let keyPair: KeyPair;

  beforeAll(async () => {
    keyPair = await KeyPair.generate();
  });

  describe('generate', () => {
    it('should generate a KeyPair instance', async () => {
      const pair = await KeyPair.generate();
      expect(pair).toBeInstanceOf(KeyPair);
    });

    it('should generate PEM-encoded keys', async () => {
      const pair = await KeyPair.generate();
      const primitives = pair.toPrimitives();

      expect(primitives.publicKey).toContain('BEGIN PUBLIC KEY');
      expect(primitives.privateKey).toContain('BEGIN PRIVATE KEY');
    });

    it('should generate unique key pairs each time', async () => {
      const pair1 = await KeyPair.generate();
      const pair2 = await KeyPair.generate();

      expect(pair1.toPrimitives().publicKey).not.toBe(
        pair2.toPrimitives().publicKey,
      );
    });
  });

  describe('constructor', () => {
    it('should accept PublicKey and PrivateKey instances', () => {
      const primitives = keyPair.toPrimitives();
      const pair = new KeyPair(
        new PublicKey(primitives.publicKey),
        new PrivateKey(primitives.privateKey),
      );

      expect(pair).toBeInstanceOf(KeyPair);
      expect(pair.toPrimitives().publicKey).toBe(primitives.publicKey);
      expect(pair.toPrimitives().privateKey).toBe(primitives.privateKey);
    });
  });

  describe('toPrimitives', () => {
    it('should return an object with publicKey and privateKey', () => {
      const primitives = keyPair.toPrimitives();

      expect(primitives).toHaveProperty('publicKey');
      expect(primitives).toHaveProperty('privateKey');
      expect(typeof primitives.publicKey).toBe('string');
      expect(typeof primitives.privateKey).toBe('string');
    });
  });

  describe('fromPrimitives', () => {
    it('should recreate a KeyPair from primitives', () => {
      const primitives = keyPair.toPrimitives();
      const recreated = KeyPair.fromPrimitives(primitives);

      expect(recreated).toBeInstanceOf(KeyPair);
    });

    it('should preserve values in the round-trip', () => {
      const primitives = keyPair.toPrimitives();
      const recreated = KeyPair.fromPrimitives(primitives);
      const recreatedPrimitives = recreated.toPrimitives();

      expect(recreatedPrimitives.publicKey).toBe(primitives.publicKey);
      expect(recreatedPrimitives.privateKey).toBe(primitives.privateKey);
    });

    it('should produce a functional KeyPair after round-trip', () => {
      const primitives = keyPair.toPrimitives();
      const recreated = KeyPair.fromPrimitives(primitives);

      const payload = 'test payload';
      const sig = recreated.sign(payload);

      expect(recreated.isValidSignature(payload, sig)).toBeTrue();
    });
  });

  describe('sign', () => {
    it('should produce a valid Signature instance', () => {
      const sig = keyPair.sign('hello');

      expect(sig).toBeInstanceOf(Signature);
      expect(sig.valueOf()).toHaveLength(88);
    });

    it('should accept a StringValueObject as payload', () => {
      const payload = new StringValueObject('data');
      const sig = keyPair.sign(payload);

      expect(sig).toBeInstanceOf(Signature);
    });

    it('should produce different signatures for different payloads', () => {
      const sig1 = keyPair.sign('msg-1');
      const sig2 = keyPair.sign('msg-2');

      expect(sig1.isEqual(sig2)).toBeFalse();
    });
  });

  describe('isValidSignature', () => {
    it('should return true for a valid signature', () => {
      const payload = 'verify me';
      const sig = keyPair.sign(payload);

      expect(keyPair.isValidSignature(payload, sig)).toBeTrue();
    });

    it('should return false for a wrong payload', () => {
      const sig = keyPair.sign('original');

      expect(keyPair.isValidSignature('tampered', sig)).toBeFalse();
    });

    it('should return false for a wrong signature', async () => {
      const otherPair = await KeyPair.generate();
      const sig = otherPair.sign('message');

      expect(keyPair.isValidSignature('message', sig)).toBeFalse();
    });
  });

  describe('encrypt', () => {
    it('should encrypt a payload and return an EncryptedPayload', () => {
      const encrypted = keyPair.encrypt('secret data');

      expect(encrypted).toBeInstanceOf(EncryptedPayload);
      expect(encrypted.valueOf()).not.toBe('secret data');
    });

    it('should accept a StringValueObject as payload', () => {
      const payload = new StringValueObject('vo-secret');
      const encrypted = keyPair.encrypt(payload);

      expect(encrypted).toBeInstanceOf(EncryptedPayload);
    });
  });

  describe('decrypt', () => {
    it('should decrypt an EncryptedPayload back to the original data', () => {
      const encrypted = keyPair.encrypt('round-trip');
      const decrypted = keyPair.decrypt(encrypted);

      expect(decrypted).toBeInstanceOf(Buffer);
      expect(decrypted.toString()).toBe('round-trip');
    });

    it('should fail to decrypt with a different KeyPair', async () => {
      const encrypted = keyPair.encrypt('private');
      const otherPair = await KeyPair.generate();

      expect(() => otherPair.decrypt(encrypted)).toThrow();
    });
  });

  describe('encryptKeyPair', () => {
    it('should produce an EncryptedKeyPair', async () => {
      const encrypted = await keyPair.encryptKeyPair('password');

      expect(encrypted).toBeInstanceOf(EncryptedKeyPair);
    });

    it('should accept a StringValueObject as password', async () => {
      const passwordVO = new StringValueObject('password');
      const encrypted = await keyPair.encryptKeyPair(passwordVO);

      expect(encrypted).toBeInstanceOf(EncryptedKeyPair);
    });

    it('should produce functional EncryptedKeyPair that can sign/verify', async () => {
      const encrypted = await keyPair.encryptKeyPair('pwd');
      const payload = 'message';
      const sig = await encrypted.sign(payload, 'pwd');

      expect(encrypted.isValidSignature(payload, sig)).toBeTrue();
    });
  });
});
