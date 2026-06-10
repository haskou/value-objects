import {
  EncryptedPayload,
  InvalidFormatError,
  InvalidLengthError,
  Media,
  NullObject,
  Password,
  StringValueObject,
  SymmetricEncryptedPayload,
  SymmetricKey,
} from '../../../src';
import { CryptoAdapter } from '../../../src/value-objects/crypto/CryptoAdapter';
import { CryptoDerivation } from '../../../src/value-objects/crypto/encrypted-private-key/CryptoDerivation';

describe('SymmetricKey', () => {
  const keyBytes = Buffer.alloc(32, 7);
  const keyBase64 = keyBytes.toString('base64');

  describe('constructor', () => {
    it('should return a NullValueObject when receiving nullish', () => {
      expect(() => new SymmetricKey(undefined as unknown as string)).not.toThrow();
      expect(
        NullObject.isNullObject(
          new SymmetricKey(undefined as unknown as string),
        ),
      ).toBeTrue();
      expect(
        NullObject.isNullObject(new SymmetricKey(null as unknown as string)),
      ).toBeTrue();
    });

    it('should store a base64-encoded 32-byte key', () => {
      const key = new SymmetricKey(keyBase64);

      expect(key.valueOf()).toBe(keyBase64);
      expect(key.getBuffer()).toEqual(keyBytes);
    });

    it('should throw InvalidFormatError for non-base64 keys', () => {
      expect(() => new SymmetricKey('*'.repeat(44))).toThrow(
        InvalidFormatError,
      );
    });

    it('should throw InvalidLengthError for wrong decoded key length', () => {
      expect(() => new SymmetricKey(Buffer.alloc(31).toString('base64'))).toThrow(
        InvalidLengthError,
      );
    });
  });

  describe('factories', () => {
    it('should create a key from base64', () => {
      const key = SymmetricKey.fromBase64(keyBase64);

      expect(key).toBeInstanceOf(SymmetricKey);
      expect(key.getBuffer()).toEqual(keyBytes);
    });

    it('should create a key from a StringValueObject wrapping base64', () => {
      const key = SymmetricKey.fromBase64(new StringValueObject(keyBase64));

      expect(key.getBuffer()).toEqual(keyBytes);
    });

    it('should create a key from a 32-byte Buffer', () => {
      const key = SymmetricKey.fromBuffer(keyBytes);

      expect(key.valueOf()).toBe(keyBase64);
    });

    it('should throw InvalidLengthError for non-32-byte Buffers', () => {
      expect(() => SymmetricKey.fromBuffer(Buffer.alloc(33))).toThrow(
        InvalidLengthError,
      );
    });

    it('should generate random 32-byte keys', () => {
      const key = SymmetricKey.generate();

      expect(key).toBeInstanceOf(SymmetricKey);
      expect(key.getBuffer()).toHaveLength(32);
    });

    it('should derive deterministic keys from the same password and salt', async () => {
      const first = await SymmetricKey.fromPassword('password', {
        salt: 'stable-salt',
      });
      const second = await SymmetricKey.fromPassword('password', {
        salt: 'stable-salt',
      });

      expect(first.isEqual(second)).toBeTrue();
      expect(first.getBuffer()).toHaveLength(32);
    });

    it('should derive different keys when the salt changes', async () => {
      const first = await SymmetricKey.fromPassword('password', {
        salt: 'first-salt',
      });
      const second = await SymmetricKey.fromPassword('password', {
        salt: 'second-salt',
      });

      expect(first.isEqual(second)).toBeFalse();
    });

    it('should accept custom scrypt options and Buffer salt', async () => {
      const key = await SymmetricKey.fromPassword(
        new StringValueObject('password'),
        {
          N: 16,
          p: 1,
          r: 1,
          salt: Buffer.from('buffer-salt'),
        },
      );

      expect(key.getBuffer()).toHaveLength(32);
    });

    it('should keep legacy scrypt defaults for fromPassword', async () => {
      const derivedKey = Buffer.alloc(32, 9);
      const scryptSpy = jest
        .spyOn(CryptoDerivation, 'scryptAsync')
        .mockResolvedValue(derivedKey);

      const key = await SymmetricKey.fromPassword('password', {
        salt: 'stable-salt',
      });

      expect(scryptSpy).toHaveBeenCalledWith(
        'password',
        Buffer.from('stable-salt'),
        32,
        { N: 16384, p: 1, r: 8 },
      );
      expect(key.getBuffer()).toEqual(derivedKey);

      scryptSpy.mockRestore();
    });

    it('should derive with OWASP scrypt parameters when requested', async () => {
      const derivedKey = Buffer.alloc(32, 10);
      const scryptSpy = jest
        .spyOn(CryptoDerivation, 'scryptAsync')
        .mockResolvedValue(derivedKey);

      const key = await SymmetricKey.fromPasswordUsingOwasp(
        new Password('Secure-password-123!'),
        {
          salt: 'stable-salt',
        },
      );

      expect(scryptSpy).toHaveBeenCalledWith(
        'Secure-password-123!',
        Buffer.from('stable-salt'),
        32,
        { N: 16384, p: 5, r: 8 },
      );
      expect(key.getBuffer()).toEqual(derivedKey);

      scryptSpy.mockRestore();
    });

    it('should reject empty derivation salts', async () => {
      await expect(
        SymmetricKey.fromPassword('password', { salt: '' }),
      ).rejects.toThrow(InvalidLengthError);
    });
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt string payloads', () => {
      const key = new SymmetricKey(keyBase64);
      const encrypted = key.encrypt('secret message');
      const decrypted = key.decrypt(encrypted);

      expect(encrypted).toBeInstanceOf(SymmetricEncryptedPayload);
      expect(encrypted).toBeInstanceOf(EncryptedPayload);
      expect(encrypted.getScheme()).toBe('symmetric');
      expect(decrypted.toString()).toBe('secret message');
    });

    it('should encrypt the same payload differently because the IV is random', () => {
      const key = new SymmetricKey(keyBase64);
      const first = key.encrypt('same payload');
      const second = key.encrypt('same payload');

      expect(first.isEqual(second)).toBeFalse();
      expect(first.valueOf().split('.')[2]).not.toBe(
        second.valueOf().split('.')[2],
      );
      expect(key.decrypt(first).toString()).toBe('same payload');
      expect(key.decrypt(second).toString()).toBe('same payload');
    });

    it('should accept StringValueObject payloads', () => {
      const key = new SymmetricKey(keyBase64);
      const encrypted = key.encrypt(new StringValueObject('vo-payload'));

      expect(key.decrypt(encrypted).toString()).toBe('vo-payload');
    });

    it('should accept Buffer payloads', () => {
      const key = new SymmetricKey(keyBase64);
      const payload = Buffer.from([0, 1, 2, 255]);
      const encrypted = key.encrypt(payload);

      expect(key.decrypt(encrypted)).toEqual(payload);
    });

    it('should accept raw Media bytes', () => {
      const key = new SymmetricKey(keyBase64);
      const payload = Buffer.from([0xff, 0xfe, 0xfd, 0x00, 0x80]);
      const encrypted = key.encrypt(new Media(payload));

      expect(key.decrypt(encrypted)).toEqual(payload);
    });

    it('should encrypt and decrypt empty payloads', () => {
      const key = new SymmetricKey(keyBase64);
      const encrypted = key.encrypt('');

      expect(key.decrypt(encrypted)).toHaveLength(0);
    });

    it('should encrypt and decrypt payloads larger than the asymmetric limit', () => {
      const key = new SymmetricKey(keyBase64);
      const payload = Buffer.alloc(1024 * 1024 + 1, 7);
      const encrypted = key.encrypt(payload);

      expect(key.decrypt(encrypted)).toEqual(payload);
    });

    it('should throw InvalidLengthError for oversized payloads', () => {
      const key = new SymmetricKey(keyBase64);

      expect(() => key.encrypt(Buffer.alloc(8 * 1024 * 1024 + 1))).toThrow(
        InvalidLengthError,
      );
    });

    it('should throw when decrypting with the wrong key', () => {
      const key = new SymmetricKey(keyBase64);
      const wrongKey = SymmetricKey.fromBuffer(Buffer.alloc(32, 8));
      const encrypted = key.encrypt('secret');

      expect(() => wrongKey.decrypt(encrypted)).toThrow();
    });

    it('should throw when the IV is tampered', () => {
      const key = new SymmetricKey(keyBase64);
      const encrypted = key.encrypt('secret');
      const parts = encrypted.valueOf().split('.');
      parts[2] = Buffer.alloc(12, 1).toString('base64');

      expect(() =>
        key.decrypt(new SymmetricEncryptedPayload(parts.join('.'))),
      ).toThrow();
    });

    it('should throw when the ciphertext is tampered', () => {
      const key = new SymmetricKey(keyBase64);
      const encrypted = key.encrypt('secret');
      const parts = encrypted.valueOf().split('.');
      parts[3] = Buffer.from('tampered').toString('base64');

      expect(() =>
        key.decrypt(new SymmetricEncryptedPayload(parts.join('.'))),
      ).toThrow();
    });

    it('should throw when the authentication tag is tampered', () => {
      const key = new SymmetricKey(keyBase64);
      const encrypted = key.encrypt('secret');
      const parts = encrypted.valueOf().split('.');
      parts[4] = Buffer.alloc(16, 1).toString('base64');

      expect(() =>
        key.decrypt(new SymmetricEncryptedPayload(parts.join('.'))),
      ).toThrow();
    });

    it('should authenticate custom AAD', () => {
      const key = new SymmetricKey(keyBase64);
      const encrypted = key.encrypt('secret', { aad: 'domain.header' });

      expect(key.decrypt(encrypted, { aad: 'domain.header' }).toString()).toBe(
        'secret',
      );
      expect(() => key.decrypt(encrypted, { aad: 'other.header' })).toThrow();
    });

    it('should authenticate Buffer AAD', () => {
      const key = new SymmetricKey(keyBase64);
      const aad = Buffer.from('domain.header');
      const encrypted = key.encrypt('secret', { aad });

      expect(key.decrypt(encrypted, { aad }).toString()).toBe('secret');
    });

    it('should decrypt legacy symmetric payloads without AAD', () => {
      const key = new SymmetricKey(keyBase64);
      const iv = Buffer.alloc(12, 2);
      const { cipherText, tag } = CryptoAdapter.encryptAes256Gcm(
        key.getBuffer(),
        iv,
        Buffer.from('legacy secret'),
      );
      const legacyPayload = new SymmetricEncryptedPayload(
        [
          'v1',
          'aes-256-gcm',
          iv.toString('base64'),
          Buffer.from(cipherText).toString('base64'),
          Buffer.from(tag).toString('base64'),
        ].join('.'),
      );

      expect(key.decrypt(legacyPayload).toString()).toBe('legacy secret');
    });
  });

  describe('encrypted payload validation', () => {
    it('should throw InvalidFormatError for malformed payload part count', () => {
      const key = new SymmetricKey(keyBase64);

      expect(() => key.decrypt(new EncryptedPayload('v1.aes-256-gcm.iv'))).toThrow(
        InvalidFormatError,
      );
    });

    it('should throw InvalidFormatError for unsupported payload scheme', () => {
      const key = new SymmetricKey(keyBase64);
      const payload = [
        'v2',
        'aes-256-gcm',
        Buffer.alloc(12).toString('base64'),
        '',
        Buffer.alloc(16).toString('base64'),
      ].join('.');

      expect(() => key.decrypt(new EncryptedPayload(payload))).toThrow(
        InvalidFormatError,
      );
    });

    it('should throw InvalidFormatError for malformed IV base64', () => {
      const key = new SymmetricKey(keyBase64);
      const payload = [
        'v1',
        'aes-256-gcm',
        '*',
        '',
        Buffer.alloc(16).toString('base64'),
      ].join('.');

      expect(() => key.decrypt(new EncryptedPayload(payload))).toThrow(
        InvalidFormatError,
      );
    });

    it('should throw InvalidFormatError for wrong IV length', () => {
      const key = new SymmetricKey(keyBase64);
      const payload = [
        'v1',
        'aes-256-gcm',
        Buffer.alloc(11).toString('base64'),
        '',
        Buffer.alloc(16).toString('base64'),
      ].join('.');

      expect(() => key.decrypt(new EncryptedPayload(payload))).toThrow(
        InvalidFormatError,
      );
    });

    it('should throw InvalidFormatError for malformed ciphertext base64', () => {
      const key = new SymmetricKey(keyBase64);
      const payload = [
        'v1',
        'aes-256-gcm',
        Buffer.alloc(12).toString('base64'),
        '*',
        Buffer.alloc(16).toString('base64'),
      ].join('.');

      expect(() => key.decrypt(new EncryptedPayload(payload))).toThrow(
        InvalidFormatError,
      );
    });

    it('should throw InvalidLengthError for oversized ciphertext', () => {
      const key = new SymmetricKey(keyBase64);
      const oversizedCipher = 'A'.repeat(
        Math.ceil((8 * 1024 * 1024 + 1) / 3) * 4,
      );
      const payload = [
        'v1',
        'aes-256-gcm',
        Buffer.alloc(12).toString('base64'),
        oversizedCipher,
        Buffer.alloc(16).toString('base64'),
      ].join('.');

      expect(() => key.decrypt(new EncryptedPayload(payload))).toThrow(
        InvalidLengthError,
      );
    });

    it('should throw InvalidFormatError for wrong tag length', () => {
      const key = new SymmetricKey(keyBase64);
      const payload = [
        'v1',
        'aes-256-gcm',
        Buffer.alloc(12).toString('base64'),
        '',
        Buffer.alloc(15).toString('base64'),
      ].join('.');

      expect(() => key.decrypt(new EncryptedPayload(payload))).toThrow(
        InvalidFormatError,
      );
    });
  });
});
