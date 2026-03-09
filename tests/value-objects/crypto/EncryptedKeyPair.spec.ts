import {
  EncryptedKeyPair,
  EncryptedPayload,
  EncryptedPrivateKey,
  KeyPair,
  PublicKey,
  Signature,
  StringValueObject,
} from '../../../src';

describe('EncryptedKeyPair', () => {
  let keyPair: KeyPair;
  const password = 'encryption-password';

  beforeAll(async () => {
    keyPair = await KeyPair.generate();
  });

  describe('constructor', () => {
    it('should accept PublicKey and EncryptedPrivateKey instances', () => {
      const primitives = keyPair.toPrimitives();
      const publicKey = new PublicKey(primitives.publicKey);
      const encryptedPrivateKey = new EncryptedPrivateKey('enc.priv.key.tag');

      const pair = new EncryptedKeyPair(publicKey, encryptedPrivateKey);

      expect(pair).toBeInstanceOf(EncryptedKeyPair);
    });
  });

  describe('encryptKeyPair', () => {
    it('should create an EncryptedKeyPair from a PublicKey and PrivateKey', async () => {
      const primitives = keyPair.toPrimitives();
      const encrypted = await keyPair.encryptKeyPair(password);

      expect(encrypted).toBeInstanceOf(EncryptedKeyPair);
      expect(encrypted.toPrimitives().publicKey).toBe(primitives.publicKey);
    });

    it('should accept a StringValueObject as password', async () => {
      const passwordVO = new StringValueObject(password);
      const encrypted = await keyPair.encryptKeyPair(passwordVO);

      expect(encrypted).toBeInstanceOf(EncryptedKeyPair);
    });
  });

  describe('toPrimitives', () => {
    it('should return an object with publicKey and encryptedPrivateKey', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const primitives = encrypted.toPrimitives();

      expect(primitives).toHaveProperty('publicKey');
      expect(primitives).toHaveProperty('encryptedPrivateKey');
      expect(primitives.publicKey).toContain('BEGIN PUBLIC KEY');
      expect(primitives.encryptedPrivateKey.split('.')).toHaveLength(4);
    });
  });

  describe('fromPrimitives', () => {
    it('should recreate an EncryptedKeyPair from primitives', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const primitives = encrypted.toPrimitives();

      const recreated = EncryptedKeyPair.fromPrimitives(primitives);

      expect(recreated).toBeInstanceOf(EncryptedKeyPair);
    });

    it('should preserve values in the round-trip', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const primitives = encrypted.toPrimitives();

      const recreated = EncryptedKeyPair.fromPrimitives(primitives);
      const recreatedPrimitives = recreated.toPrimitives();

      expect(recreatedPrimitives.publicKey).toBe(primitives.publicKey);
      expect(recreatedPrimitives.encryptedPrivateKey).toBe(
        primitives.encryptedPrivateKey,
      );
    });

    it('should produce functional EncryptedKeyPair after round-trip', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const primitives = encrypted.toPrimitives();

      const recreated = EncryptedKeyPair.fromPrimitives(primitives);
      const payload = 'verify after round-trip';
      const sig = await recreated.sign(payload, password);

      expect(recreated.isValidSignature(payload, sig)).toBeTrue();
    });
  });

  describe('sign', () => {
    it('should produce a valid Signature', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const sig = await encrypted.sign('hello world', password);

      expect(sig).toBeInstanceOf(Signature);
      expect(sig.valueOf()).toHaveLength(88);
    });

    it('should accept a StringValueObject as password', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const passwordVO = new StringValueObject(password);
      const sig = await encrypted.sign('data', passwordVO);

      expect(sig).toBeInstanceOf(Signature);
    });

    it('should produce different signatures for different payloads', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const sig1 = await encrypted.sign('msg-a', password);
      const sig2 = await encrypted.sign('msg-b', password);

      expect(sig1.isEqual(sig2)).toBeFalse();
    });
  });

  describe('isValidSignature', () => {
    it('should return true for a valid signature', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const payload = 'signed data';
      const sig = await encrypted.sign(payload, password);

      expect(encrypted.isValidSignature(payload, sig)).toBeTrue();
    });

    it('should return false for a tampered payload', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const sig = await encrypted.sign('original', password);

      expect(encrypted.isValidSignature('tampered', sig)).toBeFalse();
    });

    it('should return false for a wrong signature', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const otherPair = await KeyPair.generate();
      const otherEncrypted = await otherPair.encryptKeyPair(password);
      const sig = await otherEncrypted.sign('message', password);

      expect(encrypted.isValidSignature('message', sig)).toBeFalse();
    });

    it('should verify signatures produced by the original KeyPair', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const payload = 'cross-verify';
      const sig = keyPair.sign(payload);

      expect(encrypted.isValidSignature(payload, sig)).toBeTrue();
    });
  });

  describe('encrypt', () => {
    it('should encrypt a payload and return an EncryptedPayload', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const result = encrypted.encrypt('secret data');

      expect(result).toBeInstanceOf(EncryptedPayload);
      expect(result.valueOf()).not.toBe('secret data');
    });

    it('should accept a StringValueObject as payload', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const payload = new StringValueObject('vo-secret');
      const result = encrypted.encrypt(payload);

      expect(result).toBeInstanceOf(EncryptedPayload);
    });
  });

  describe('decrypt', () => {
    it('should decrypt an EncryptedPayload with the correct password', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const cipherPayload = encrypted.encrypt('round-trip encrypted');
      const decrypted = await encrypted.decrypt(cipherPayload, password);

      expect(decrypted).toBeInstanceOf(Buffer);
      expect(decrypted.toString()).toBe('round-trip encrypted');
    });

    it('should fail to decrypt with the wrong password', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const cipherPayload = encrypted.encrypt('fail test');

      await expect(
        encrypted.decrypt(cipherPayload, 'wrong-password'),
      ).toReject();
    });

    it('should accept a StringValueObject as password', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const cipherPayload = encrypted.encrypt('vo-password');
      const passwordVO = new StringValueObject(password);
      const decrypted = await encrypted.decrypt(cipherPayload, passwordVO);

      expect(decrypted.toString()).toBe('vo-password');
    });

    it('should produce output matching what KeyPair.decrypt returns', async () => {
      const payload = 'cross-decrypt';
      const cipherPayload = keyPair.encrypt(payload);

      const encrypted = await keyPair.encryptKeyPair(password);
      const decrypted = await encrypted.decrypt(cipherPayload, password);

      expect(decrypted.toString()).toBe(payload);
    });
  });
});
