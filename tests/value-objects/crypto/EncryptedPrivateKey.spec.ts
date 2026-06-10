import * as crypto from 'node:crypto';

import {
  EncryptedPrivateKey,
  Password,
  PrivateKey,
  StringValueObject,
  SymmetricEncryptedPayload,
  SymmetricKey,
} from '../../../src';
import { CryptoAdapter } from '../../../src/value-objects/crypto/CryptoAdapter';
import { CryptoDerivation } from '../../../src/value-objects/crypto/encrypted-private-key/CryptoDerivation';
import { EncryptedPrivateKeyV2 } from '../../../src/value-objects/crypto/encrypted-private-key/EncryptedPrivateKeyV2';
import { EncryptedPrivateKeyV3 } from '../../../src/value-objects/crypto/encrypted-private-key/EncryptedPrivateKeyV3';
import { NullObject } from '../../../src/value-objects/NullObject';

describe('EncryptedPrivateKey', () => {
  let privatePem: string;
  let publicPem: string;
  const password = new Password('Secure-password-123!');

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

    it('should produce a 9-part dot-separated string', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);

      const parts = encrypted.valueOf().split('.');
      expect(parts).toHaveLength(9);
      expect(parts.slice(0, 5)).toEqual(['v3', 'scrypt', 'N16384', 'r8', 'p5']);
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

      const decrypted = await encrypted.decrypt(password);

      expect(decrypted).toBeInstanceOf(PrivateKey);
      expect(decrypted.valueOf()).toBe(privatePem);
    });

    it('should fail to decrypt with wrong password', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);

      await expect(encrypted.decrypt('wrong-password')).toReject();
    });

    it('should fail to decrypt invalid format', async () => {
      const invalidEncrypted = new EncryptedPrivateKey('invalid.format');

      await expect(invalidEncrypted.decrypt(password)).toReject();
    });

    it('should reject tampered scrypt parameters before deriving a key', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);
      const parts = encrypted.valueOf().split('.');
      parts[2] = 'N1073741824';
      const tampered = new EncryptedPrivateKey(parts.join('.'));
      const scryptSpy = jest.spyOn(CryptoDerivation, 'scryptAsync');

      await expect(tampered.decrypt(password)).rejects.toThrow(
        'Invalid encrypted private key format',
      );

      expect(scryptSpy).not.toHaveBeenCalled();
      scryptSpy.mockRestore();
    });

    it('should reject malformed numeric scrypt parameters', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);
      const parts = encrypted.valueOf().split('.');
      parts[2] = 'N16384junk';
      const tampered = new EncryptedPrivateKey(parts.join('.'));
      const scryptSpy = jest.spyOn(CryptoDerivation, 'scryptAsync');

      await expect(tampered.decrypt(password)).rejects.toThrow(
        'Invalid encrypted private key format',
      );

      expect(scryptSpy).not.toHaveBeenCalled();
      scryptSpy.mockRestore();
    });

    it('should reject unsupported v2 parameters inside the v2 decryptor', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKeyV2.encrypt(privateKey, password);
      const parts = encrypted.split('.');
      parts[4] = 'p2';

      await expect(
        new EncryptedPrivateKeyV2().decrypt(parts, password),
      ).rejects.toThrow('Unsupported encrypted private key parameters');
    });

    it('should keep v2 AES-GCM fields compatible with SymmetricKey', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKeyV2.encrypt(privateKey, password);
      const parts = encrypted.split('.');
      const key = await SymmetricKey.fromPassword(password, {
        N: 16384,
        p: 1,
        r: 8,
        salt: Buffer.from(parts[5], 'base64'),
      });
      const symmetricPayload = new SymmetricEncryptedPayload(
        ['v1', 'aes-256-gcm', parts[6], parts[8], parts[7]].join('.'),
      );

      expect(key.decrypt(symmetricPayload).toString()).toBe(privatePem);
    });

    it('should decrypt v2 encrypted private keys for backward compatibility', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKeyV2.encrypt(privateKey, password);
      const decrypted = await new EncryptedPrivateKey(encrypted).decrypt(
        password,
      );

      expect(decrypted.valueOf()).toBe(privatePem);
    });

    it('should decrypt v2 encrypted private keys created without AAD', async () => {
      const salt = Buffer.alloc(16, 3);
      const iv = Buffer.alloc(12, 4);
      const key = await SymmetricKey.fromPassword(password, {
        N: 16384,
        p: 1,
        r: 8,
        salt,
      });
      const { cipherText, tag } = CryptoAdapter.encryptAes256Gcm(
        key.getBuffer(),
        iv,
        Buffer.from(privatePem),
      );
      const encrypted = [
        'v2',
        'scrypt',
        'N16384',
        'r8',
        'p1',
        salt.toString('base64'),
        iv.toString('base64'),
        Buffer.from(tag).toString('base64'),
        Buffer.from(cipherText).toString('base64'),
      ].join('.');

      const decrypted = await new EncryptedPrivateKey(encrypted).decrypt(
        password,
      );

      expect(decrypted.valueOf()).toBe(privatePem);
    });

    it('should keep v3 AES-GCM fields compatible with SymmetricKey', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);
      const parts = encrypted.valueOf().split('.');
      const key = await SymmetricKey.fromPassword(password, {
        N: 16384,
        p: 5,
        r: 8,
        salt: Buffer.from(parts[5], 'base64'),
      });
      const symmetricPayload = new SymmetricEncryptedPayload(
        ['v1', 'aes-256-gcm', parts[6], parts[8], parts[7]].join('.'),
      );

      expect(
        key
          .decrypt(symmetricPayload, { aad: parts.slice(0, 5).join('.') })
          .toString(),
      ).toBe(privatePem);
    });

    it('should reject unsupported v3 parameters inside the v3 decryptor', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);
      const parts = encrypted.valueOf().split('.');
      parts[4] = 'p1';

      await expect(
        new EncryptedPrivateKeyV3().decrypt(parts, password),
      ).rejects.toThrow('Unsupported encrypted private key parameters');
    });

    it('should authenticate v3 header fields with AAD', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);
      const parts = encrypted.valueOf().split('.');
      parts[1] = 'tampered-kdf';

      await expect(
        new EncryptedPrivateKeyV3().decrypt(parts, password),
      ).toReject();
    });

    it('should decrypt to a functional PrivateKey that can sign', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);

      const decrypted = await encrypted.decrypt(password);
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

      const decrypted = await encrypted.decrypt(passwordVO);

      expect(decrypted.valueOf()).toBe(privatePem);
    });

    it('should indicate if re-encryption is needed', async () => {
      const privateKey = new PrivateKey(privatePem);
      const encrypted = await EncryptedPrivateKey.create(privateKey, password);

      expect(encrypted.needsReEncryption()).toBeFalse();

      // Test with legacy format
      const legacyEncrypted = new EncryptedPrivateKey('ciphertext.iv.salt.tag');
      expect(legacyEncrypted.needsReEncryption()).toBeTrue();

      const v2 = await EncryptedPrivateKeyV2.encrypt(privateKey, password);
      expect(new EncryptedPrivateKey(v2).needsReEncryption()).toBeTrue();
    });

    it('should return false for an invalid format when checking re-encryption', () => {
      const invalidEncrypted = new EncryptedPrivateKey('invalid.format');

      expect(invalidEncrypted.needsReEncryption()).toBeFalse();
    });

    it('should decrypt a legacy legacy encrypted private key format', async () => {
      const privateKey = new PrivateKey(privatePem);
      const salt = crypto.randomBytes(16);
      const iv = crypto.randomBytes(12);
      const key = await new Promise<Buffer>((resolve, reject) => {
        crypto.pbkdf2(
          password.valueOf(),
          salt,
          100000,
          32,
          'sha256',
          (err, derivedKey) => {
            if (err) reject(err);
            else resolve(derivedKey);
          },
        );
      });

      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      const encryptedData = Buffer.concat([
        cipher.update(privateKey.valueOf()),
        cipher.final(),
      ]);
      const tag = cipher.getAuthTag();
      const legacyFormat = [
        encryptedData.toString('base64'),
        iv.toString('base64'),
        salt.toString('base64'),
        tag.toString('base64'),
      ].join('.');

      const decrypted = await new EncryptedPrivateKey(legacyFormat).decrypt(
        password,
      );

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
