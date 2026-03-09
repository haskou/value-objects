import * as crypto from 'node:crypto';

import {
  EncryptedPrivateKey,
  PrivateKey,
  StringValueObject,
} from '../../../src';
import { NullObject } from '../../../src/value-objects/NullObject';

describe('EncryptedPrivateKey', () => {
  let privatePem: string;
  let publicPem: string;
  const password = 'secure-password-123';

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
        () => new EncryptedPrivateKey(undefined as unknown as string),
      ).not.toThrow();
      expect(
        NullObject.isNullObject(
          new EncryptedPrivateKey(undefined as unknown as string),
        ),
      ).toBeTrue();
      expect(
        NullObject.isNullObject(
          new EncryptedPrivateKey(null as unknown as string),
        ),
      ).toBeTrue();
    });

    it('should store the encrypted string', () => {
      const value = 'encrypted.iv.salt.tag';
      const key = new EncryptedPrivateKey(value);
      expect(key.valueOf()).toBe(value);
    });

    it('should accept another StringValueObject', () => {
      const strValue = new StringValueObject('encrypted.iv.salt.tag');
      const key = new EncryptedPrivateKey(strValue);
      expect(key.valueOf()).toBe('encrypted.iv.salt.tag');
    });
  });

  describe('create', () => {
    it('should encrypt a PrivateKey with a password', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);

      expect(encrypted).toBeInstanceOf(EncryptedPrivateKey);
      expect(encrypted.valueOf()).not.toBe(privatePem);
    });

    it('should produce a 4-part dot-separated string', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);

      const parts = encrypted.valueOf().split('.');
      expect(parts).toHaveLength(4);
    });

    it('should produce different ciphertexts each time due to random salt/iv', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted1 = await EncryptedPrivateKey.create(privateKey, password);
      const encrypted2 = await EncryptedPrivateKey.create(privateKey, password);

      expect(encrypted1.isEqual(encrypted2)).toBeFalse();
    });

    it('should accept a StringValueObject as password', async () => {
      const privateKey = new PrivateKey(privatePem);
      const passwordVO = new StringValueObject(password);
      const encrypted = await EncryptedPrivateKey.create(
        privateKey,
        passwordVO,
      );

      expect(encrypted).toBeInstanceOf(EncryptedPrivateKey);
    });
  });

  describe('decrypt', () => {
    it('should decrypt and recover the original PrivateKey', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);

      const decrypted = encrypted.decrypt(password);

      expect(decrypted).toBeInstanceOf(PrivateKey);
      expect(decrypted.valueOf()).toBe(privatePem);
    });

    it('should fail to decrypt with wrong password', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);

      expect(() => encrypted.decrypt('wrong-password')).toThrow();
    });

    it('should decrypt to a functional PrivateKey that can sign', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);

      const decrypted = encrypted.decrypt(password);
      const sig = decrypted.sign('test payload');

      const valid = crypto.verify(
        null,
        Buffer.from('test payload'),
        publicPem,
        Buffer.from(sig.valueOf(), 'base64'),
      );
      expect(valid).toBeTrue();
    });

    it('should accept a StringValueObject as password', async () => {
      const privateKey = new PrivateKey(privatePem);
      const passwordVO = new StringValueObject(password);
      const encrypted = await EncryptedPrivateKey.create(
        privateKey,
        passwordVO,
      );

      const decrypted = encrypted.decrypt(passwordVO);

      expect(decrypted.valueOf()).toBe(privatePem);
    });
  });

  describe('inheritance and ValueObject behavior', () => {
    it('should inherit from ValueObject', () => {
      const key = new EncryptedPrivateKey('test-encrypted');
      expect(key).toBeInstanceOf(EncryptedPrivateKey);
      expect(key.valueOf).toBeDefined();
      expect(key.isEqual).toBeDefined();
      expect(key.toString).toBeDefined();
    });

    it('should implement isEqual() correctly', () => {
      const value = 'same-encrypted';
      const key1 = new EncryptedPrivateKey(value);
      const key2 = new EncryptedPrivateKey(value);
      const key3 = new EncryptedPrivateKey('different-encrypted');

      expect(key1.isEqual(key2)).toBeTrue();
      expect(key1.isEqual(key3)).toBeFalse();
    });

    it('should clone correctly', () => {
      const originalValue = 'clone-encrypted-key';
      const original = new EncryptedPrivateKey(originalValue);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(EncryptedPrivateKey);
      expect(cloned.valueOf()).toBe(originalValue);
      expect(cloned).not.toBe(original);
    });
  });
});
